// GxButtonGroup —— 按钮组 (Element Plus 的 el-button-group)
//
// 只负责一排 + 间距: 内核 GuiNode 不向 JS 暴露子树 (GetProperty 恒
// undefined), 做不了"改写子按钮圆角"的深度加工。要贴合式组, 子按钮
// 自己控制 radius 即可。

import { h } from "gx/gfx";
import { flattenChildren } from "../utils.js";

export function GxButtonGroup(props, ...children) {
  const p = props || {};
  const cp = {
    gap: p.gap !== undefined ? p.gap : 8,
    alignItems: "center",
  };
  if (p.wrap !== undefined) cp.wrap = p.wrap;
  return h("row", cp, ...flattenChildren(children));
}
