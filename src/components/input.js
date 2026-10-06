// GxInput —— Element Plus 风格输入框
//
// 在内核 input 之上叠加:
//   size        large | default | small (高度 40 / 32 / 24)
//   clearable   有值时尾部出现清空叉
//   prefixIcon / suffixIcon   图标名 (内置 icon 集)
//   status      error | warning (校验态边框色)
//   model       model 指令 (signal 或 [get, set] 二元组)
//   block       撑满父容器宽 (缺省 240 固定宽)
//
// 内核 input 自带: 白底、1px 灰边、获焦转强调色边、光标、悬停底色。
// 我们只叠图标与清空叉, 不动字段本体 (它的 hover/focus 反馈是内核画的)。

import { h } from "gx/gfx";
import { palette, space, sizeOf } from "../theme.js";
import { flattenChildren, resolveVal } from "../utils.js";

export function GxInput(props) {
  const p = props || {};
  const c = palette();
  const size = sizeOf(p.size);
  const width = p.width !== undefined ? p.width : (p.block ? "100%" : 240);

  const inputProps = {
    height: size.h,
    width: "100%",
    font: size.font,
    placeholder: p.placeholder,
    disabled: p.disabled,
    flexGrow: 1,
  };
  if (p.model !== undefined) inputProps.model = p.model;
  else if (p.value !== undefined) inputProps.value = p.value;
  if (p.onInput) inputProps.onInput = p.onInput;
  if (p.password) inputProps.password = p.password;
  if (p.name) inputProps.name = p.name;

  const field = h("input", inputProps);

  // 无图标无清空: 直接字段本体 (让内核画边框)
  if (!p.prefixIcon && !p.suffixIcon && !p.clearable) return field;

  // 有附属物: row [前图标] [字段] [清空叉] [后图标]
  const kids = [];
  if (p.prefixIcon) kids.push(h("icon", { name: p.prefixIcon, size: size.icon, color: c.textPlaceholder }));
  kids.push(field);

  if (p.clearable) {
    const current = resolveVal(p.value !== undefined ? p.value : (Array.isArray(p.model) ? p.model[0] : p.model));
    if (current) {
      kids.push(h("icon", {
        name: "close", size: size.icon - 2, color: c.textPlaceholder,
        onClick: () => {
          if (p.onInput) p.onInput({ value: "" });
          else if (Array.isArray(p.model)) p.model[1]("");
        },
      }));
    }
  }
  if (p.suffixIcon) kids.push(h("icon", { name: p.suffixIcon, size: size.icon, color: c.textPlaceholder }));

  return h("row", { gap: space.sm, alignItems: "center", width: width }, ...kids);
}
