#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""移动端模拟窗口的截图 + 断言 (在父进程存活期间完成)。

用法: python test/shot_mobile_verify.py [输出png]
断言: 顶部蓝头 / 页面浅底 / 触控按钮高度≥40 / 文字渲染。
"""
import subprocess, time, ctypes, ctypes.wintypes as wt, struct, zlib, sys, os

GOX = os.environ.get("GOX_BIN", "C:/Users/13649/AppData/Local/Temp/gox-bin.exe")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

user32 = ctypes.windll.user32; gdi32 = ctypes.windll.gdi32
user32.SetProcessDPIAware()
PW_RENDERFULLCONTENT = 2
WM_CLOSE = 0x0010


def find_window(substr):
    found = []
    @ctypes.WINFUNCTYPE(ctypes.c_bool, wt.HWND, wt.LPARAM)
    def cb(hwnd, lp):
        if user32.IsWindowVisible(hwnd):
            ln = user32.GetWindowTextLengthW(hwnd)
            if ln:
                b = ctypes.create_unicode_buffer(ln + 1)
                user32.GetWindowTextW(hwnd, b, ln + 1)
                if substr in b.value:
                    found.append(hwnd)
        return True
    user32.EnumWindows(cb, 0)
    return found


def capture(hwnd):
    rect = wt.RECT(); user32.GetWindowRect(hwnd, ctypes.byref(rect))
    w = rect.right - rect.left; h = rect.bottom - rect.top
    dc = user32.GetWindowDC(hwnd); mdc = gdi32.CreateCompatibleDC(dc)
    bmi = (ctypes.c_ubyte * 40).from_buffer_copy(
        struct.pack("<IiiHHIIiiII", 40, w, -h, 1, 32, 0, 0, 0, 0, 0, 0))
    bm = gdi32.CreateDIBSection(mdc, ctypes.byref(bmi), 0,
                                ctypes.byref(ctypes.c_void_p()), None, 0)
    gdi32.SelectObject(mdc, bm)
    user32.PrintWindow(hwnd, mdc, PW_RENDERFULLCONTENT)
    buf = ctypes.create_string_buffer(w * h * 4)
    gdi32.GetDIBits(mdc, bm, 0, h, buf, ctypes.byref(bmi), 0)
    gdi32.DeleteObject(bm); gdi32.DeleteDC(mdc); user32.ReleaseDC(hwnd, dc)
    return w, h, buf.raw


def save_png(path, w, h, raw):
    rows = []
    for y in range(h):
        row = bytearray()
        for x in range(w):
            b = raw[(y * w + x) * 4:(y * w + x) * 4 + 4]
            row += bytes((b[2], b[1], b[0]))
        rows.append(bytes(row))
    rgb = b"".join(rows)
    def chunk(tag, data):
        cc = struct.pack(">I", len(data)) + tag + data
        return cc + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(rgb, 6)) + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "docs", "showcase-mobile.png")
    proc = subprocess.Popen([GOX, os.path.join(ROOT, "demo", "showcase-mobile.js")],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                            cwd=ROOT)
    try:
        for _ in range(20):
            time.sleep(0.5)
            wins = find_window("移动端模拟")
            if wins:
                break
        if not wins:
            print("NO WINDOW")
            return 2
        hwnd = wins[0]
        time.sleep(1.0)  # 首帧渲染
        w, h, raw = capture(hwnd)
        save_png(out, w, h, raw)
        print(f"saved {out} ({w}x{h})")

        def px(x, y):
            b = raw[(y * w + x) * 4:(y * w + x) * 4 + 4]
            return (b[2], b[1], b[0])

        TOP = 40
        checks = []
        blue = lambda p: p[2] > 200 and p[2] > p[0] + 50
        b1 = sum(1 for x in range(30, w - 30, 20) if blue(px(x, TOP + 40)))
        checks.append(("顶部蓝头", b1 > 8, f"hit={b1}"))
        pg = lambda p: abs(p[0] - 245) < 8 and abs(p[1] - 247) < 8 and abs(p[2] - 250) < 8
        b2 = sum(1 for y in range(TOP + 300, h - 80, 10) if pg(px(12, y)))
        checks.append(("页面浅底", b2 > 6, f"hit={b2}"))
        found = 0
        for x in range(50, w - 40, 8):
            y = TOP + 140
            while y < h - 40:
                if blue(px(x, y)):
                    y0 = y
                    while y < h - 40 and blue(px(x, y)):
                        y += 1
                    if y - y0 > found:
                        found = y - y0
                else:
                    y += 1
        checks.append(("触控按钮高≥40", found >= 40, f"maxH={found}"))
        tc = sum(1 for y in range(TOP, h - 40, 2) for x in range(10, w - 10, 3)
                 if (lambda p: p[0] < 0x90 and p[1] < 0x90 and p[2] < 0x95)(px(x, y)))
        checks.append(("文字渲染", tc > 250, f"count={tc}"))

        print("\n===== 断言 =====")
        ok_all = True
        for n, ok, info in checks:
            print(("PASS " if ok else "FAIL ") + n + "  " + info)
            if not ok:
                ok_all = False
        user32.PostMessageW(hwnd, WM_CLOSE, 0, 0)
        return 0 if ok_all else 1
    finally:
        try:
            proc.terminate()
        except Exception:
            pass


if __name__ == "__main__":
    sys.exit(main())
