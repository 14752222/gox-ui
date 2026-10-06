// GxDescriptions —— Element Plus 风格描述列表 (el-descriptions)
//
//   items      [{ label, content, span? }]
//   column     列数 (缺省 2)
//   title      标题 / extra 右上角内容 (函数)
//   border     true → 描边网格 (缺省 false 时用行分隔线)
//   labelWidth 标签列宽 (缺省 76, 让多行标签左缘对齐)
//   width
//
// 单元格不给底色: 方形底色会盖住外层圆角 (gfx 没有 overflow 裁剪,
// 子节点画在父级之后), 所以"表格感"靠描边 + 分隔线表达。

import { h } from "gx/gfx";
import { palette, space, radius as radiusScale } from "../theme.js";
import { panel, hline, vline, txt, pad } from "../styles.js";

export function GxDescriptions(props) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];
  const cols = Math.max(1, p.column || 2);
  const labelW = p.labelWidth !== undefined ? p.labelWidth : 76;

  // 按列数切行
  const rows = [];
  let row = [];
  for (const it of items) {
    row.push(it);
    if (row.length >= cols) { rows.push(row); row = []; }
  }
  if (row.length > 0) rows.push(row);

  const cell = (it) => panel(c, {
    direction: "row",
    gap: space.sm,
    alignItems: "start",
    flexGrow: 1,
    padProps: pad({ t: space.md, r: space.lg, b: space.md, l: space.lg }),
  }, [
    txt(c, { size: "sm", color: c.textSecondary, width: labelW }, it.label === undefined ? "" : String(it.label)),
    txt(c, { size: "sm", weight: 500, color: c.textPrimary, flexGrow: 1 }, it.content === undefined ? "" : String(it.content)),
  ]);

  const bodyRows = rows.map((r, i) => {
    const cells = [];
    for (let k = 0; k < r.length; k++) {
      if (k > 0) cells.push(vline(c, { color: c.borderLighter }));
      cells.push(cell(r[k]));
    }
    // 补齐空列, 保持网格对齐
    for (let k = r.length; k < cols; k++) {
      cells.push(vline(c, { color: c.borderLighter }));
      cells.push(panel(c, { direction: "row", flexGrow: 1 }, []));
    }
    return panel(c, { direction: "column", gap: 0 }, [
      panel(c, { direction: "row", gap: 0, alignItems: "stretch" }, cells),
      i < rows.length - 1 ? hline(c, { color: c.borderLighter }) : null,
    ]);
  });

  const titleRow = (p.title || typeof p.extra === "function")
    ? panel(c, {
        direction: "row",
        gap: space.md,
        alignItems: "center",
        extra: { paddingBottom: space.md },
      }, [
        p.title ? txt(c, { size: "md", weight: 600, color: c.textPrimary }, p.title) : null,
        h("spacer", { flexGrow: 1 }),
        typeof p.extra === "function" ? p.extra() : null,
      ])
    : null;

  return panel(c, { direction: "column", gap: space.md, width: p.width }, [
    titleRow,
    panel(c, {
      direction: "column",
      gap: 0,
      bg: p.border ? c.surface : null,
      border: p.border ? c.borderLight : null,
      radius: p.border ? radiusScale.md : null,
    }, bodyRows),
  ]);
}
