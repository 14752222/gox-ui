// GxForm / GxFormItem —— Element Plus 风格表单
//
//   GxForm     gap (缺省 18) / onSubmit({ values })
//   GxFormItem label / required (红星) / labelWidth (缺省 72)
//
// 标签用内核 <label>: 星号、右对齐都是内核画的 (paintLabel)。
// 回车提交由内核 form 的 onSubmit 承接 (只收带 name 的字段)。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxForm(props, ...children) {
  const p = props || {};
  const fp = { gap: p.gap !== undefined ? p.gap : space.xxl };
  if (p.onSubmit) fp.onSubmit = p.onSubmit;
  return h("form", fp, ...flattenChildren(children));
}

export function GxFormItem(props, ...children) {
  const p = props || {};
  const c = palette();

  return h("row", { gap: space.lg, alignItems: "center" },
    h("label", {
      required: p.required,
      font: 13,
      color: c.textRegular,
      width: p.labelWidth !== undefined ? p.labelWidth : 72,
      align: "right",
    }, p.label || ""),
    h("row", { gap: space.md, alignItems: "center", flexGrow: 1 }, ...flattenChildren(children)));
}
