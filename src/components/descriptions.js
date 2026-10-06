// GxDescriptions — Element Plus 风格描述列表 (el-descriptions)
//   items: [{label, content, span?}]
//   column: 列数 (缺省 2)
//   border: 是否带边框网格 (缺省 false)
//   title: 标题

import { h } from "gx/gfx";
import { palette } from "../theme.js";

export function GxDescriptions(props) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];
  const cols = p.column || 2;

  const header = p.title
    ? [h("text", { font: 15, fontWeight: 600, color: c.textPrimary, padding: 0 }, p.title)]
    : [];

  // 按 column 列分组成行
  const rows = [];
  let row = [];
  for (const it of items) {
    row.push(it);
    if (row.length >= cols) { rows.push(row); row = []; }
  }
  if (row.length > 0) rows.push(row);

  const bodyRows = rows.map((r) =>
    h("row", { gap: 0 },
      ...r.map((it) =>
        h("row", { gap: 8, alignItems: "center", flexGrow: 1, padding: 8, paddingLeft: 12, background: c.fillBlankest },
          h("text", { font: 12, color: c.textSecondary }, `${it.label}:`),
          h("text", { font: 12, fontWeight: 600, color: c.textPrimary }, String(it.content ?? "")),
        ))));

  return h("column", { gap: 0 },
    ...header,
    h("rect", { border: p.border ? c.border : c.borderLighter, radius: 4, width: p.width },
      h("column", { width: "100%" },
        ...bodyRows.map((r, i) => h("column", { width: "100%" },
          r,
          i < bodyRows.length - 1 ? h("separator", {}) : null,
        )))));
}
