// GxSpace —— 间距布局容器 (Element Plus 的 el-space)
//
//   direction: row | column (缺省 row)
//   gap (缺省 8) / wrap / alignItems

import { h } from "gx/gfx";
import { flattenChildren } from "../utils.js";

export function GxSpace(props, ...children) {
  const p = props || {};
  const tag = p.direction === "column" ? "column" : "row";
  const cp = { gap: p.gap !== undefined ? p.gap : 8, alignItems: p.alignItems };
  if (p.wrap !== undefined) cp.wrap = p.wrap;
  if (p.flexGrow !== undefined) cp.flexGrow = p.flexGrow;
  return h(tag, cp, ...flattenChildren(children));
}
