// GxBreadcrumb — Element Plus 风格面包屑 (el-breadcrumb)
//   items: [{label, onClick?}] — 最后一项是当前页 (不可点)

import { h } from "gx/gfx";
import { palette } from "../theme.js";

export function GxBreadcrumb(props) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];
  const sep = p.separator || "/";

  const kids = [];
  items.forEach((it, i) => {
    const last = i === items.length - 1;
    kids.push(h("text", {
      font: 12,
      color: last ? c.textPrimary : c.primary,
      onClick: (!last && it.onClick) ? (e) => it.onClick(e) : undefined,
    }, it.label || ""));
    if (!last) {
      kids.push(h("text", { font: 12, color: c.textPlaceholder }, sep));
    }
  });

  return h("row", { gap: 6, alignItems: "center" }, ...kids);
}
