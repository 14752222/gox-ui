// GxSelect — 下拉选择 (包装内核 select)
//   model / value / options / onChange / placeholder / disabled

import { h } from "gx/gfx";

export function GxSelect(props) {
  const p = props || {};
  const sp = {
    options: p.options || [],
    placeholder: p.placeholder,
  };
  if (p.model !== undefined) sp.model = p.model;
  if (p.value !== undefined) sp.value = p.value;
  if (p.onChange) sp.onChange = p.onChange;
  if (p.disabled !== undefined) sp.disabled = p.disabled;
  return h("select", sp);
}
