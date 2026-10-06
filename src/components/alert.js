// GxAlert —— Element Plus 风格横幅提示
//
//   type        success | warning | danger | info (缺省 info)
//   title       主标题 (字符串 / 元素 / 函数)
//   description 辅助说明 (自动换行, 无需手写宽度)
//   closable    显示关闭按钮 / onClose
//   showIcon    是否显示左侧图标 (缺省 true), icon 可自定义图标名
//   tone        "light" (浅底, 缺省) | "filled" (实心) | "outline" (白底描边)
//   width       固定宽 (缺省自适应父容器宽度)
//
// 说明: description 用 wrap 文字, 宽度由容器决定 —— 不再像 v0.1 那样硬编码
// width=340 (那个数字在窄弹窗里会溢出, 在宽容器里又留一大块空白)。

import { h } from "gx/gfx";
import { palette, toneOf, space, radius as radiusScale, typeIcon } from "../theme.js";
import { panel, pad, txt } from "../styles.js";
import { GxButton } from "./button.js";

export function GxAlert(props) {
  const p = props || {};
  const c = palette();
  const type = p.type || "info";
  const tone = toneOf(c, type);
  const mode = p.tone || "light";

  let bg, edge, titleColor, descColor;
  if (mode === "filled") {
    bg = tone.fg; edge = tone.fg;
    titleColor = c.textOnBrand; descColor = c.textOnBrand;
  } else if (mode === "outline") {
    bg = c.surface; edge = tone.fg;
    titleColor = tone.fg; descColor = c.textRegular;
  } else {
    bg = tone.tint; edge = tone.mid;
    titleColor = tone.fg; descColor = c.textRegular;
  }

  const iconColor = mode === "filled" ? c.textOnBrand : tone.fg;
  const iconName = p.icon || typeIcon[type] || "chat";

  // 左列: 图标 (paddingTop 1 让图标与标题的视觉中线对齐)
  const lead = p.showIcon === false ? null
    : panel(c, { direction: "column", extra: { paddingTop: 1 } },
        [h("icon", { name: iconName, size: 16, color: iconColor })]);

  // 右列: 标题 + 描述。flexGrow 吃掉剩余宽, 描述因此能按容器宽换行。
  const titleNode = typeof p.title === "function" ? p.title()
    : (p.title === undefined || p.title === null || p.title === "") ? null
    : txt(c, { size: "base", weight: 600, color: titleColor }, p.title);

  const content = panel(c, {
    direction: "column",
    gap: space.xs,
    flexGrow: 1,
    alignItems: "start",
  }, [
    titleNode,
    p.description ? txt(c, { size: "sm", color: descColor, wrap: true }, p.description) : null,
  ]);

  const close = p.closable
    ? GxButton({ text: true, icon: "close", size: "small", padding: 3, radius: radiusScale.base, onClick: (e) => { if (p.onClose) p.onClose(e); } })
    : null;

  return panel(c, {
    direction: "row",
    gap: space.md,
    alignItems: p.description ? "start" : "center",
    bg: bg,
    border: edge,
    radius: radiusScale.base,
    width: p.width,
    padProps: pad({ t: space.md, r: space.lg, b: space.md, l: space.lg }),
  }, [lead, content, close]);
}
