// GxDialog —— Element Plus 风格对话框
//
//   open        是否显示 (可传函数做响应式)
//   title       标题
//   width       卡片宽, 缺省 480
//   showClose   是否显示右上角关闭 (缺省 true)
//   footer      底部内容 (函数, 返回元素); 缺省无底栏
//   onClose     关闭回调 (点遮罩 / Esc / 关闭按钮 都会触发)
//   bodyPadding 内容区留白 (缺省 24)
//   gap         内容区子节点间距 (缺省 12)
//
// 结构: 内核 <dialog> 负责遮罩 + 居中 + Esc; 卡片本体是一块 column 面板
// (不能是 rect —— rect 不参与子节点布局, 见 styles.js 顶部说明)。

import { h } from "gx/gfx";
import { palette, space, radius as radiusScale } from "../theme.js";
import { panel, hline, txt, normalize, pad } from "../styles.js";
import { flattenChildren, resolveVal } from "../utils.js";
import { GxButton } from "./button.js";

export function GxDialog(props, ...children) {
  const p = props || {};
  const c = palette();
  if (!resolveVal(p.open)) return null;

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

  // 内核行为: 点遮罩 / Esc 都会调 dialog 的 onClose (没有 closeOnMask 开关,
  // 这是内核内建语义), 这里转发给用户的 onClose。
  return h("dialog", {
    open: true,
    onClose: (e) => { if (p.onClose) p.onClose(e); },
  }, card);
}
