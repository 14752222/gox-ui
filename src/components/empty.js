// GxEmpty — 空状态 (Element Plus 的 el-empty)
//   description / image (元素, 可选)

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxEmpty(props, ...children) {
  const p = props || {};
  const c = palette();
  const kids = flattenChildren(children);

  return h("column", { gap: 10, alignItems: "center", padding: 24 },
    kids.length > 0 ? kids[0] : h("empty", { desc: "" }),
    h("text", { font: 13, color: c.textSecondary }, p.description || p.desc || "暂无数据"),
  );
}
