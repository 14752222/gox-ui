// GxResult —— Element Plus 风格结果反馈页 (el-result)
//
//   icon      success | warning | danger | error | info (缺省 info)
//   title     主标题
//   subTitle  辅助说明 (自动换行)
//   extra     底部操作区 (函数, 返回元素)
//   size      "normal" (缺省, 56px 徽标) | "large" (72px)
//   padding / width
//
// 【为什么徽标是 column 不是 rect】
// rect 落进 layoutNode 的 default 分支 (子节点一律摆在内容区左上角),
// 而且不参与 intrinsicSize 的子节点测量 —— 用 rect 装字形的话, 字会贴在
// 圆左上角而不是居中。所有"容器"都必须是 column/row。

import { palette, toneOf, space, typeGlyph } from "../theme.js";
import { panel, txt } from "../styles.js";

export function GxResult(props) {
  const p = props || {};
  const c = palette();
  const type = p.icon || "info";
  const tone = toneOf(c, type);
  const big = p.size === "large";
  const box = big ? 72 : 56;

  const badge = panel(c, {
    direction: "column",
    bg: tone.tint,
    border: tone.mid,
    radius: Math.round(box / 2),
    width: box,
    height: box,
    alignItems: "center",
    justifyContent: "center",
  }, [
    txt(c, { size: big ? 32 : 26, weight: 700, color: tone.fg }, typeGlyph[type] || "i"),
  ]);

  return panel(c, {
    direction: "column",
    gap: space.lg,
    alignItems: "center",
    pad: p.padding !== undefined ? p.padding : space["3xl"],
    width: p.width,
  }, [
    badge,
    p.title ? txt(c, { size: "xl", weight: 600, color: c.textPrimary }, p.title) : null,
    p.subTitle ? txt(c, { size: "base", color: c.textSecondary, wrap: true, align: "center" }, p.subTitle) : null,
    typeof p.extra === "function" ? p.extra() : null,
  ]);
}
