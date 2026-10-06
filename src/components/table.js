// GxTable — 数据表格 (包装内核 table, 叠加 Element 风格外观)
//   columns / rows / zebra / borderless / onRowClick / width
//   title: 可选表头标题

import { h } from "gx/gfx";
import { palette } from "../theme.js";

export function GxTable(props) {
  const p = props || {};
  const c = palette();
  const tp = {
    columns: p.columns,
    rows: p.rows,
    zebra: p.zebra !== false,
    borderless: p.borderless,
  };
  if (p.width) tp.width = p.width;
  if (p.onRowClick) tp.onRowClick = p.onRowClick;

  // 无标题直接返内核表格
  if (!p.title) return h("table", tp);

  return h("column", { gap: 8 },
    h("text", { font: 14, fontWeight: 600, color: c.textPrimary }, p.title),
    h("table", tp));
}
