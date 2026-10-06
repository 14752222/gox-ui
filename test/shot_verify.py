#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""截图 GoxUI showcase 窗口并做几何/颜色断言。

用法: python shot_verify.py <输出png>
"""
import ctypes
import ctypes.wintypes as wt
import struct
import sys
import zlib

user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32
kernel32 = ctypes.windll.kernel32

PW_RENDERFULLCONTENT = 2
WM_CLOSE = 0x0010

user32.SetProcessDPIAware()

def find_goxui_window():
    result = []
    @ctypes.WINFUNCTYPE(ctypes.c_bool, wt.HWND, wt.LPARAM)
    def cb(hwnd, lparam):
        if not user32.IsWindowVisible(hwnd):
            return True
        length = user32.GetWindowTextLengthW(hwnd)
        if length == 0:
            return True
        buf = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buf, length + 1)
        title = buf.value
        if "GoxUI" in title or "Showcase" in title:
            result.append(hwnd)
        return True
    user32.EnumWindows(cb, 0)
    return result[0] if result else None

def capture(hwnd, out_path):
    rect = wt.RECT()
    user32.GetWindowRect(hwnd, ctypes.byref(rect))
    w = rect.right - rect.left
    h = rect.bottom - rect.top
    print(f"window rect: {w}x{h} at ({rect.left},{rect.top})")

    hwnd_dc = user32.GetWindowDC(hwnd)
    mem_dc = gdi32.CreateCompatibleDC(hwnd_dc)
    bmi = (ctypes.c_ubyte * 40).from_buffer_copy(
        struct.pack("<IiiHHIIiiII", 40, w, -h, 1, 32, 0, 0, 0, 0, 0, 0))
    bitmap = gdi32.CreateDIBSection(mem_dc, ctypes.byref(bmi), 0, ctypes.byref(ctypes.c_void_p()), None, 0)
    gdi32.SelectObject(mem_dc, bitmap)
    ok = user32.PrintWindow(hwnd, mem_dc, PW_RENDERFULLCONTENT)
    if not ok:
        print("PrintWindow failed")
        return None

    # 取 DIB 位图位指针 (CreateDIBSection 的第 3 参数返回的指针)
    bits = ctypes.c_void_p()
    gdi32.GetDIBits(mem_dc, bitmap, 0, h, None, ctypes.byref(bmi), 0)  # 填充 bmi (仅确认尺寸)
    ptr = ctypes.cast(bitmap, ctypes.POINTER(ctypes.c_ubyte))
    # CreateDIBSection 返回 HBITMAP; 位数据指针要这样拿:
    raw_ptr = ctypes.c_void_p()
    gdi32.CreateDIBSection  # noqa
    # 直接用 GetDIBits 拷贝出来更可靠
    buf = ctypes.create_string_buffer(w * h * 4)
    bmi2 = (ctypes.c_ubyte * 40).from_buffer_copy(
        struct.pack("<IiiHHIIiiII", 40, w, -h, 1, 32, 0, 0, 0, 0, 0, 0))
    got = gdi32.GetDIBits(mem_dc, bitmap, 0, h, buf, ctypes.byref(bmi2), 0)
    if got == 0:
        print("GetDIBits failed")
        return None
    raw = buf.raw
    gdi32.DeleteObject(bitmap)
    gdi32.DeleteDC(mem_dc)
    user32.ReleaseDC(hwnd, hwnd_dc)

    # BGRA -> RGB 行序 (bmi 高度负 = 自上而下)
    rows = []
    for y in range(h):
        row = bytearray()
        base = y * w * 4
        for x in range(w):
            b = raw[base + x*4]
            g = raw[base + x*4 + 1]
            r = raw[base + x*4 + 2]
            row += bytes((r, g, b))
        rows.append(bytes(row))
    rgb = b"".join(rows)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(rgb, 6)) + chunk(b"IEND", b"")
    with open(out_path, "wb") as f:
        f.write(png)
    print(f"saved {out_path} ({w}x{h})")
    return w, h, rgb

def pixel(rgb, w, x, y):
    base = (y * w + x) * 3
    return rgb[base], rgb[base+1], rgb[base+2]

def close(hex_color):
    r = int(hex_color[1:3], 16); g = int(hex_color[3:5], 16); b = int(hex_color[5:7], 16)
    def f(px):
        return abs(px[0]-r) <= 12 and abs(px[1]-g) <= 12 and abs(px[2]-b) <= 12
    return f

def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "showcase.png"
    hwnd = find_goxui_window()
    if not hwnd:
        print("NO WINDOW FOUND")
        sys.exit(2)
    cap = capture(hwnd, out)
    if not cap:
        sys.exit(3)
    w, h, rgb = cap
    import time; time.sleep(0.2)

    checks = []

    # 客户区偏移: 窗口含标题栏, 客户区内容从 y≈40 开始 (980x820 窗口实测)
    TOP = 40

    # 1. Hero 渐变区: 顶部客户区应是主蓝系 (409eff → a0cfff 渐变的前段)
    #    渐变是过度的, 放宽容差找"蓝色调" (b > r+40 且 b > 200)
    def is_blueish(p):
        return p[2] > 200 and p[2] > p[0] + 40
    hero_hit = sum(1 for x in range(60, w-60, 30) for y in range(TOP+20, TOP+120, 10) if is_blueish(pixel(rgb, w, x, y)))
    checks.append(("hero 渐变蓝", hero_hit > 40, f"hit={hero_hit}"))

    # 2. 页面底色: 内容区边缘应是浅底 f5f7fa (x=12, 窗口黑边约 0-8px)
    def is_pagebg(p):
        return abs(p[0]-245) < 8 and abs(p[1]-247) < 8 and abs(p[2]-250) < 8
    edge_hit = sum(1 for y in range(h//2, h-60, 10) if is_pagebg(pixel(rgb, w, 12, y)))
    checks.append(("页面浅底", edge_hit > 10, f"hit={edge_hit}"))

    # 3. 卡片白底: 中部扫一列找白色段
    white = close("#ffffff")
    white_rows = sum(1 for y in range(TOP+180, h-60, 4) if white(pixel(rgb, w, w//2, y)))
    checks.append(("卡片白底存在", white_rows > 25, f"white_rows={white_rows}"))

    # 4. 主蓝按钮: 全屏找蓝色调实块 (Primary 按钮)
    blue_btn = sum(1 for y in range(TOP+200, h-40, 3) for x in range(60, min(700, w-40), 15) if is_blueish(pixel(rgb, w, x, y)))
    checks.append(("主蓝按钮", blue_btn > 60, f"count={blue_btn}"))

    # 5. 文字存在: 深灰文字 (0x20 < r < 0x62, 各通道足够暗且非纯黑) 足够多
    def is_darktext(p):
        return 0x20 < p[0] < 0x62 and p[1] < 0x68 and p[2] < 0x70
    text_ct = 0
    for y in range(TOP+210, h-40):
        for x in range(35, min(w-40, 940), 3):
            if is_darktext(pixel(rgb, w, x, y)):
                text_ct += 1
    checks.append(("正文文字", text_ct > 400, f"count={text_ct}"))

    # 6. 几何完整性: 卡片区一条横线上白/非白交替 (卡片描边应产生成组过渡)
    ym = 500
    transitions = 0
    prev_w = None
    for x in range(12, w-12, 2):
        p = pixel(rgb, w, x, ym)
        is_w = p[0] > 250 and p[1] > 250 and p[2] > 250
        if prev_w is not None and is_w != prev_w:
            transitions += 1
        prev_w = is_w
    checks.append(("边界交替", transitions >= 6, f"transitions={transitions}"))

    print("\n===== 断言 =====")
    all_ok = True
    for name, ok, info in checks:
        print(("PASS " if ok else "FAIL ") + name + "  " + info)
        if not ok:
            all_ok = False

    user32.PostMessageW(hwnd, WM_CLOSE, 0, 0)
    sys.exit(0 if all_ok else 1)

main()
