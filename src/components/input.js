// GxInput — Element Plus 风格输入框
//
// 在内核 input 之上叠加:
//   size:    large | default | small
//   clearable: 有值时尾部出现清空叉
//   prefixIcon / suffixIcon: 图标名 (内置 icon 集)
//   status:  error | warning (校验态红/橙边框)
//   model:   兼容 model 指令 (受控读写一行接好)

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { mergeProps } from "../utils.js";

export function GxInput(props) {
  const p = props || {};
  const c = palette();
  const size = { large: 40, default: 32, small: 24 }[p.size || "default"];

  const border = p.status === "error" ? c.danger
    : p.status === "warning" ? c.warning
    : c.border;

  // 受控 clearable: 尾部叉
  const kids = [];
  if (p.prefixIcon) kids.push(h("icon", { name: p.prefixIcon, size: 14, color: c.textPlaceholder }));

  // wrap: row 容器装图标 + input 主体 (内核 input 是独立的字段控件)
  const inputProps = {
    height: size,
    placeholder: p.placeholder,
    disabled: p.disabled,
    border: border,
    font: p.size === "large" ? 14 : 13,
    flexGrow: 1,
  };
  if (p.model !== undefined) inputProps.model = p.model;
  else if (p.value !== undefined) inputProps.value = p.value;
  if (p.onInput) inputProps.onInput = p.onInput;

  const suffix = [];
  if (p.clearable) {
    // 清空叉: 一个小 rect + click 事件 (需要拿当前值判断显隐, 函数 prop 保响应)
    suffix.push(h("rect", {
      width: 16, height: 16, radius: 8,
      background: () => {
        const v = typeof p.value === "function" ? p.value() : p.value;
        return v ? c.fill : "#00000000";
      },
      onClick: () => {
        if (p.onInput) p.onInput({ value: "" });
      },
    }, h("icon", { name: "close", size: 8, color: c.textPlaceholder })));
  }
  if (p.suffixIcon) suffix.push(h("icon", { name: p.suffixIcon, size: 14, color: c.textPlaceholder }));

  if (kids.length === 0 && suffix.length === 0) {
    return h("input", inputProps);
  }
  return h("row", { gap: 4, alignItems: "center" },
    ...kids,
    h("input", inputProps),
    ...suffix,
  );
}
