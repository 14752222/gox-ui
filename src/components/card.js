// GxCard — 卡片容器 (Element Plus 的 el-card)
//
//   header:  字符串头标题 (或用 header 子插槽 — 传函数返回元素)
//   shadow:  always | hover | never
//   bodyPadding: 数字, 缺省 16

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxCard(props, ...children) {
  const p = props || {};
  const c = palette();
  const shadowOn = p.shadow !== "never" && p.shadow !== false;

  const headerKids = [];
  if (typeof p.header === "function") {
    headerKids.push(p.header());
  } else if (typeof p.header === "string") {
    headerKids.push(h("text", { font: 15, fontWeight: 600, color: c.textPrimary }, p.header));
  }

  const body = h("column", { gap: p.gap !== undefined ? p.gap : 8, padding: p.bodyPadding !== undefined ? p.bodyPadding : 16 },
    ...flattenChildren(children));

  if (headerKids.length === 0) {
    return h("rect", {
      width: p.width, background: c.bgOverlay, radius: 8,
      shadow: shadowOn ? { x: 0, y: 2, blur: 8, color: c.shadowCard } : undefined,
      border: c.borderLighter,
    }, body);
  }

  return h("rect", {
    width: p.width, background: c.bgOverlay, radius: 8,
    shadow: shadowOn ? { x: 0, y: 2, blur: 8, color: c.shadowCard } : undefined,
    border: c.borderLighter,
  },
    h("column", { width: "100%" },
      h("rect", { background: c.fillBlankest, padding: 12, width: "100%" }, ...headerKids),
      h("separator", {}),
      body,
    ));
}
