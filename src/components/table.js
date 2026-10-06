// GxTable —— 数据表格 (内核 table 的包装)
//
//   columns: ["k", ...] 或 [{ key, label, width? }]
//   rows:    对象数组 (row[key] 取单元格)
//   zebra (缺省 true) / borderless / width / onRowClick
//   title:  表头标题 (可选; 有 title 时标题与表格留 12px)

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { txt } from "../styles.js";

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

  if (!p.title) return h("table", tp);

  return h("column", { gap: space.lg, width: p.width },
    txt(c, { size: "md", weight: 600, color: c.textPrimary }, p.title),
    h("table", tp));
}
