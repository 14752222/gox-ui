// GxUpload — 文件上传 (包装内核 upload)

import { h } from "gx/gfx";

export function GxUpload(props) {
  const p = props || {};
  const up = { placeholder: p.placeholder };
  if (p.model !== undefined) up.model = p.model;
  if (p.value !== undefined) up.value = p.value;
  if (p.onChange) up.onChange = p.onChange;
  if (p.multiple !== undefined) up.multiple = p.multiple;
  if (p.accept !== undefined) up.accept = p.accept;
  if (p.filter !== undefined) up.filter = p.filter;
  if (p.disabled !== undefined) up.disabled = p.disabled;
  return h("upload", up);
}
