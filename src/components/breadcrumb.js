// GxBreadcrumb —— Element Plus 风格面包屑 (el-breadcrumb)
//
//   items: [{ label, onClick? }] 最后一项是当前页 (不可点)
//   separator: 分隔符 (缺省 "/")
//
// 可点项主色、当前项文字主色, 分隔符浅灰。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { txt } from "../styles.js";

export function GxBreadcrumb(props) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];
  const sep = p.separator || "/";

  const kids = [];
  items.forEach((it, i) => {
    const last = i === items.length - 1;
    kids.push(txt(c, {
      size: "base",
      color: last ? c.textPrimary : c.primary,
      onClick: (!last && it.onClick) ? (e) => it.onClick(e) : undefined,
    }, it.label === undefined ? "" : it.label));
    if (!last) {
      kids.push(txt(c, { size: "sm", color: c.textPlaceholder }, sep));
    }
  });

  return h("row", { gap: space.sm, alignItems: "center" }, ...kids);
}
