// GxTag —— Element Plus 风格标签
//
//   type    primary | success | warning | danger | info | "" (缺省)
//   effect  light (缺省) | dark | plain
//   size    large | default | small
//   closable / onClose    右侧关闭叉
//   round   胶囊圆角 (缺省 true)
//
// 高度: large 28 / default 24 / small 20。tag 是 row 容器 (不是内核 tag ——
// 内核 tag 的绘制我们接管不了圆角与字色), 文字直接作为 row 的子节点,
// 这样 tag 的 padding 由 row 的 paddingLeft/Right 控制, 不依赖内核
// buttonPadding 的单值限制。

import { h } from "gx/gfx";
import { palette, toneOf, space, radius as radiusScale } from "../theme.js";
import { panel, pad } from "../styles.js";
import { flattenChildren } from "../utils.js";

export function GxTag(props, ...children) {
  const p = props || {};
  const c = palette();
  const type = p.type || "";
  const tone = toneOf(c, type);
  const hasTone = type !== "" && type !== undefined;

  const font = { large: 13, default: 12, small: 11 }[p.size || "default"];
  const padX = { large: 10, default: 9, small: 7 }[p.size || "default"];
  const hgt = { large: 28, default: 24, small: 20 }[p.size || "default"];

  let background, border, color;
  if (p.effect === "dark") {
    background = hasTone ? tone.fg : c.fill;
    border = hasTone ? tone.fg : c.fill;
    color = hasTone ? c.textOnBrand : c.textPrimary;
  } else if (p.effect === "plain") {
    background = "#00000000";
    border = hasTone ? tone.fg : c.border;
    color = hasTone ? tone.fg : c.textRegular;
  } else {
    // light (缺省)
    background = hasTone ? tone.tint : c.fill;
    border = hasTone ? tone.mid : c.borderLight;
    color = hasTone ? tone.fg : c.textRegular;
  }

  const kids = [];
  const flat = flattenChildren(children);
  for (const ch of flat) {
    kids.push(typeof ch === "string" || typeof ch === "number"
      ? h("text", { font: font, color: color }, String(ch))
      : ch);
  }
  if (p.closable) {
    kids.push(h("icon", {
      name: "close", size: 10, color: color,
      onClick: (e) => { if (p.onClose) p.onClose(e); },
    }));
  }

  return panel(c, {
    direction: "row",
    gap: space.xs,
    alignItems: "center",
    bg: background,
    border: border,
    radius: p.round === false ? radiusScale.sm : radiusScale.pill,
    height: hgt,
    padProps: pad({ l: padX, r: padX, t: 0, b: 0 }),
    extra: p.onClick ? { onClick: p.onClick } : undefined,
  }, kids);
}
