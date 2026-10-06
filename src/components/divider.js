// GxDivider — 分隔线 (Element Plus 的 el-divider)
//   vertical / contentPosition: left | center | right (带文字时)

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxDivider(props, ...children) {
  const p = props || {};
  const c = palette();
  const kids = flattenChildren(children);
  if (p.vertical) {
    return h("separator", { vertical: true, height: p.height || 14, background: c.borderLight });
  }
  if (kids.length === 0 || !p.contentPosition) {
    return h("separator", { background: c.borderLight });
  }
  // 带文字: 线 — 字 — 线
  return h("row", { gap: 10, alignItems: "center", width: "100%" },
    h("rect", { height: 1, flexGrow: 1, background: c.borderLight }),
    h("text", { font: 12, color: c.textSecondary }, ...kids),
    h("rect", { height: 1, flexGrow: 1, background: c.borderLight }));
}
