// GxSlider — 滑块 (包装内核 slider)
//   model / value / onInput / min / max / step / disabled

import { h } from "gx/gfx";

export function GxSlider(props) {
  const p = props || {};
  const sp = {};
  if (p.model !== undefined) sp.model = p.model;
  if (p.value !== undefined) sp.value = p.value;
  if (p.onInput) sp.onInput = p.onInput;
  if (p.min !== undefined) sp.min = p.min;
  if (p.max !== undefined) sp.max = p.max;
  if (p.step !== undefined) sp.step = p.step;
  if (p.disabled !== undefined) sp.disabled = p.disabled;
  return h("slider", sp);
}
