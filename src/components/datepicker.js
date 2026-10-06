// GxDatePicker — 日期选择 (包装内核 datepicker)

import { h } from "gx/gfx";

export function GxDatePicker(props) {
  const p = props || {};
  const dp = { placeholder: p.placeholder };
  if (p.model !== undefined) dp.model = p.model;
  if (p.value !== undefined) dp.value = p.value;
  if (p.onChange) dp.onChange = p.onChange;
  if (p.min !== undefined) dp.min = p.min;
  if (p.max !== undefined) dp.max = p.max;
  if (p.disabled !== undefined) dp.disabled = p.disabled;
  return h("datepicker", dp);
}
