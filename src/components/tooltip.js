// GxTooltip — 提示 (包装内核 tooltip)
//   text / placement / delay

import { h } from "gx/gfx";

export function GxTooltip(props, ...children) {
  const p = props || {};
  const tp = { text: p.text || "", placement: p.placement || "top" };
  if (p.delay !== undefined) tp.delay = p.delay;
  return h("tooltip", tp, ...children);
}
