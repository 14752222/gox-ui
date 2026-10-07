// GxDialog —— Element Plus 风格对话框 (跨端自适应)
//
//   open        是否显示 (可传函数做响应式)
//   title       标题 / subtitle 次级说明
//   width       卡片宽, 缺省 480 (sheet 形态忽略, 始终满宽贴底)
//   showClose   是否显示右上角关闭 (缺省 true; sheet 形态无此按钮)
//   footer      底部内容 (函数, 返回元素); 缺省无底栏
//   onClose     关闭回调 (点遮罩 / Esc / 关闭按钮 都会触发)
//   bodyPadding 内容区留白 (缺省: 桌面 24 / sheet 16)
//   gap         内容区子节点间距 (缺省 12)
//   behavior    "center" | "sheet" 强制指定形态 (缺省按设备自动)
//
// 【多端形态】(adaptive.dialogBehavior):
//   桌面 / 平板横屏 → "center": 居中卡片 + 遮罩, 经典桌面对话框
//   手机竖屏 (触控 + compact 断点) → "sheet": 底部动作面板 —— 贴底、
//     顶部大圆角、满宽、footer 按钮纵向整行、顶部拖拽指示条。
//     这是移动端 HIG 的标准形态 (iOS ActionSheet / Material BottomSheet)。
//
// 结构: 两种形态都用内核 <dialog> (拿它的遮罩/模态/Esc 语义)。
// sheet 卡片用 position="absolute" + left/right/bottom 贴边脱流 ——
// layoutDialog 会把流内子节点居中, 贴底必须走绝对定位。

import { h } from "gx/gfx";
import { palette, space, radius as radiusScale } from "../theme.js";
import { panel, hline, txt, normalize, pad } from "../styles.js";
import { flattenChildren, resolveVal } from "../utils.js";
import { GxButton } from "./button.js";
import { dialogBehavior } from "../adaptive.js";

export function GxDialog(props, ...children) {
  const p = props || {};
  const c = palette();
  if (!resolveVal(p.open)) return null;

  const behavior = p.behavior || dialogBehavior();
  if (behavior === "sheet") return sheetForm(p, c, children);
  return centerForm(p, c, children);
}

// ────────────────────────────────────────────────────────────────────────
// 桌面形态: 居中卡片
// ────────────────────────────────────────────────────────────────────────
const centerForm = (p, c, children) => {
  const w = p.width || 480;
  const bodyPad = p.bodyPadding !== undefined ? p.bodyPadding : space["2xl"];
  const gap = p.gap !== undefined ? p.gap : space.lg;

  const closeBtn = p.showClose === false ? null
    : GxButton({ text: true, icon: "close", size: "small", padding: 4, radius: radiusScale.base, onClick: (e) => { if (p.onClose) p.onClose(e); } });

  const header = panel(c, {
    direction: "row",
    gap: space.lg,
    alignItems: "center",
    padProps: pad({ t: space.xl, r: space.xl, b: space.xl, l: space["2xl"] }),
  }, [
    panel(c, { direction: "column", gap: space.xxs, flexGrow: 1, alignItems: "start" }, [
      txt(c, { size: "lg", weight: 600, color: c.textPrimary }, p.title || ""),
      p.subtitle ? txt(c, { size: "sm", color: c.textSecondary }, p.subtitle) : null,
    ]),
    closeBtn,
  ]);

  const body = panel(c, {
    direction: "column",
    gap: gap,
    alignItems: "start",
    pad: bodyPad,
  }, normalize(flattenChildren(children)));

  const footerKids = typeof p.footer === "function" ? normalize([p.footer()]) : (p.footer ? normalize([p.footer]) : []);
  const footer = footerKids.length > 0
    ? panel(c, {
        direction: "row",
        gap: space.md,
        justifyContent: "end",
        alignItems: "center",
        padProps: pad({ t: space.lg, r: space["2xl"], b: space.lg, l: space["2xl"] }),
      }, footerKids)
    : null;

  const card = panel(c, {
    bg: c.surface,
    radius: radiusScale.xl,
    shadow: "xl",
    width: w,
    gap: 0,
  },
    header,
    hline(c, { color: c.borderLighter }),
    body,
    footer ? hline(c, { color: c.borderLighter }) : null,
    footer);

  // 内核行为: 点遮罩 / Esc 都会调 dialog 的 onClose (内建语义), 转发即可。
  return h("dialog", {
    open: true,
    onClose: (e) => { if (p.onClose) p.onClose(e); },
  }, card);
};

// ────────────────────────────────────────────────────────────────────────
// 移动形态: 底部动作面板 (BottomSheet)
// ────────────────────────────────────────────────────────────────────────
// 【贴底原理】内核绝对定位只认 left/top (无 right/bottom), 而 sheet 面板的
// 高度内容决定、事先未知 —— 直接 absolute 贴不了底。做法:
//   absolute 包装层: left=0 top=0 width=100% height=100% (满窗),
//   justifyContent="end" 把面板推到窗口底。
// 这样无需知道窗口/面板高度, resize/旋转也自动跟随。
const sheetForm = (p, c, children) => {
  const bodyPad = p.bodyPadding !== undefined ? p.bodyPadding : space.xl;
  const gap = p.gap !== undefined ? p.gap : space.lg;

  // 拖拽指示条: 36×4 圆角灰条, 顶部居中 —— 暗示"可下滑关闭"
  // (实际关闭仍由点遮罩/Esc/footer 按钮触发, 指示条是视觉惯例)
  const grabber = panel(c, {
    direction: "row",
    justifyContent: "center",
    padProps: pad({ t: space.md, b: space.sm, l: 0, r: 0 }),
  }, [
    h("column", { width: 36, height: 4, radius: 2, background: c.border }),
  ]);

  const header = (p.title !== undefined || p.subtitle !== undefined)
    ? panel(c, {
        direction: "row",
        gap: space.lg,
        alignItems: "center",
        padProps: pad({ t: 0, r: space.xl, b: space.lg, l: space.xl }),
      }, [
        panel(c, { direction: "column", gap: space.xxs, flexGrow: 1, alignItems: "start" }, [
          txt(c, { size: "lg", weight: 600, color: c.textPrimary }, p.title || ""),
          p.subtitle ? txt(c, { size: "sm", color: c.textSecondary }, p.subtitle) : null,
        ]),
      ])
    : null;

  const body = panel(c, {
    direction: "column",
    gap: gap,
    alignItems: "start",
    padProps: pad({ t: 0, r: space.xl, b: bodyPad, l: space.xl }),
  }, normalize(flattenChildren(children)));

  // footer: sheet 的按钮组**纵向整行** (移动端标准: 主操作满宽在底,
  // 次操作在其上)。要满宽主按钮, footer 里的 GxButton 传 block 即可。
  const footerKids = typeof p.footer === "function" ? normalize([p.footer()]) : (p.footer ? normalize([p.footer]) : []);
  const footer = footerKids.length > 0
    ? panel(c, {
        direction: "column",
        gap: space.md,
        padProps: pad({ t: space.md, r: space.xl, b: space.xl, l: space.xl }),
      }, footerKids)
    : null;

  // 面板本体: 满宽 + 顶部圆角。内核 radius 是单值 (不支持四角分别设) ——
  // 顶部 16 底部方角贴屏幕底缘, 视觉上自然。
  const sheet = h("column", {
    width: "100%",
    background: c.surface,
    radius: 16,
    shadow: { x: 0, y: -8, blur: 32, color: "#00000038" },
  },
    grabber,
    header,
    body,
    footer);

  // 满窗包装层把面板推到底部
  const host = h("column", {
    position: "absolute", left: 0, top: 0,
    width: "100%", height: "100%",
    justifyContent: "end",
    escapeClipping: true,
  }, sheet);

  return h("dialog", {
    open: true,
    onClose: (e) => { if (p.onClose) p.onClose(e); },
  }, host);
};
