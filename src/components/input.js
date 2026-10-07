// GxInput —— Element Plus 风格输入框
//
// 在内核 input 之上叠加:
//   size        large | default | small (触控档自动升至 ≥44 命中高)
//   clearable   有值时尾部出现清空叉 (触控档命中区自动补足 44)
//   prefixIcon / suffixIcon   图标名 (内置 icon 集)
//   status      error | warning (校验态边框色)
//   model       model 指令 (signal 或 [get, set] 二元组)
//   block       撑满父容器宽 (缺省 240 固定宽; compact 断点强制 100%)
//   touch       显式指定触控/鼠标档 (缺省按设备判定)
//
// 多端: 手机竖屏 (compact 断点) 输入框强制 100% 宽 —— 窄屏里 240 定宽
// 输入框跟相邻标签挤在一行是典型的桌面思维残留。
// 内核 input 自带: 白底、灰边、获焦转强调色、光标、键盘弹出。

import { h } from "gx/gfx";
import { palette, space, sizeOf } from "../theme.js";
import { flattenChildren, resolveVal } from "../utils.js";
import { isTouch, controlFor, isCompact, hitSlopPad } from "../adaptive.js";

const sizeFor = (p) => {
  const forceTouch = p && p.touch !== undefined ? !!p.touch : undefined;
  return controlFor(p && p.size, { forceTouch }) || sizeOf(p && p.size);
};

export function GxInput(props) {
  const p = props || {};
  const c = palette();
  const size = sizeFor(p);
  // compact 断点 (手机竖屏/分屏窄窗) 强制满宽
  const width = p.width !== undefined ? p.width
    : (p.block || isCompact() ? "100%" : 240);

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
      // 触控档: 清空叉视觉 18, 命中补足到 44 (透明 padding)
      const iconSz = isTouch() ? 18 : size.icon - 2;
      const slop = hitSlopPad(44, iconSz + 8);
      kids.push(h("row", {
        alignItems: "center", justifyContent: "center",
        padding: slop, radius: slop > 0 ? 22 : 0,
        onClick: () => {
          if (p.onInput) p.onInput({ value: "" });
          else if (Array.isArray(p.model)) p.model[1]("");
        },
      }, h("icon", { name: "close", size: iconSz, color: c.textPlaceholder })));
    }
  }
  if (p.suffixIcon) kids.push(h("icon", { name: p.suffixIcon, size: size.icon, color: c.textPlaceholder }));

  return h("row", { gap: space.sm, alignItems: "center", width: width }, ...kids);
}
