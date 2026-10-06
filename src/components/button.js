// GxButton — Element Plus 风格按钮
//
// 内核的 <button> 已提供点击/hover/disabled 基础能力, GoxUI 在其之上
// 叠加 Element 同款语义:
//   type:    primary | success | warning | danger | info | "" (缺省中性)
//   size:    large | default | small
//   plain:   朴素按钮 (浅底 + 主色文字)
//   round:   胶囊圆角
//   circle:  圆形 (配合 icon 子节点)
//   loading: 加载中 (禁用 + 左侧 spinner)
//   text:    文字按钮 (无底无边)
//   icon:    图标名 (渲染在文字左侧, 取内置 icon 集)
//
// 事件: onClick 保持内核语义。nativeProps 里的键透传给内核 button。

import { h } from "gx/gfx";
import { palette, typeTone, typeTint, sizeTable } from "../theme.js";
import { mergeProps, flattenChildren } from "../utils.js";

export function GxButton(props, ...children) {
  const p = props || {};
  const c = palette();
  const type = p.type || "";
  const size = sizeTable[p.size || "default"] || sizeTable.default;
  const toneKey = typeTone[type] || null;
  const tintKey = typeTint[type] || null;

  let background, border, color;
  if (p.text) {
    // 文字按钮: 透明底 + 主题文字色
    background = "#00000000";
    border = "#00000000";
    color = toneKey ? c[toneKey] : c.textRegular;
  } else if (p.plain) {
    // 朴素: 浅色底 + 主色边框与文字
    background = tintKey ? c[tintKey] : c.fillLight;
    border = toneKey ? c[toneKey] : c.border;
    color = toneKey ? c[toneKey] : c.textRegular;
  } else if (toneKey) {
    // 实心: 主色底 + 白字
    background = c[toneKey];
    border = c[toneKey];
    color = "#ffffffff";
  } else {
    // 缺省中性按钮
    background = "#ffffffff";
    border = c.border;
    color = c.textRegular;
  }

  const disabled = !!p.disabled || !!p.loading;
  const radius = p.circle ? Math.floor(size.h / 2) : (p.round ? 999 : 4);

  const inner = [];
  if (p.loading) {
    inner.push(h("spinner", { size: Math.max(12, size.font), color: color }));
  }
  if (p.icon && !p.loading) {
    inner.push(h("icon", { name: p.icon, size: size.font, color: color }));
  }
  const flat = flattenChildren(children);
  for (const ch of flat) inner.push(ch);

  // 内核 padding 是单数值 (X=Y), circle 模式下由内容自撑
  const buttonProps = {
    background: background,
    border: border,
    color: color,
    font: size.font,
    radius: radius,
    disabled: disabled,
    padding: p.circle ? 6 : size.pad,
  };
  if (p.height) buttonProps.height = p.height;
  if (p.width) buttonProps.width = p.width;
  if (p.onClick) buttonProps.onClick = p.onClick;

  return h("button", mergeProps(buttonProps, p.nativeProps || {}), ...inner);
}
