// GxButtonGroup — 按钮组 (Element Plus 的 el-button-group)
// 子节点直接堆放, 组只负责贴合成一排 + 整体外框。
// (内核 GuiNode 不向 JS 暴露子树结构, 因此不做"改写子节点圆角"的
//  深度加工 —— 子按钮用 GxButton 且不自设 radius 即可。)

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxButtonGroup(props, ...children) {
  const p = props || {};
  const kids = flattenChildren(children);

  return h("row", {
    gap: p.gap !== undefined ? p.gap : 6,
    alignItems: "center",
  }, ...kids);
}
