// GxRate — 评分 (包装内核 rating)

import { h } from "gx/gfx";

export function GxRate(props) {
  const p = props || {};
  const rp = { max: p.max };
  if (p.value !== undefined) rp.value = p.value;
  if (p.onChange) rp.onChange = p.onChange;
  if (p.disabled !== undefined) rp.disabled = p.disabled;
  if (p.color !== undefined) rp.color = p.color;
  if (p.model !== undefined) rp.model = p.model;
  return h("rating", rp);
}
