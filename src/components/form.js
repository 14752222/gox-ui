// GxForm / GxFormItem — Element Plus 风格表单
//   GxForm:   model (对象 signal 的 getter), onSubmit, labelWidth, gap
//   GxFormItem: label, required, children
// 回车提交由内核 form 的 onSubmit({values}) 承接 (只收带 name 的字段)。

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxForm(props, ...children) {
  const p = props || {};
  const fp = { gap: p.gap !== undefined ? p.gap : 18 };
  if (p.onSubmit) fp.onSubmit = p.onSubmit;
  return h("form", fp, ...flattenChildren(children));
}

export function GxFormItem(props, ...children) {
  const p = props || {};
  const c = palette();
  const labelProps = { font: 13, color: c.textRegular };
  if (p.labelWidth) labelProps.width = p.labelWidth;
  if (p.align) labelProps.align = p.align;

  return h("row", { gap: 10, alignItems: "center" },
    h("label", { required: p.required, ...labelProps }, p.label || ""),
    h("row", { gap: 8, alignItems: "center" }, ...flattenChildren(children)));
}
