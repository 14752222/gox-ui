// GxButton —— Element Plus 风格按钮
//
// 内核 <button> 提供点击 / 悬停提亮 / 按压压暗 / 禁用降饱和, GoxUI 在其上
// 叠 Element 同款语义:
//
//   type      primary | success | warning | danger | info | "" (缺省中性)
//   size      large | default | small        (高度 40 / 32 / 24, 圆角 6)
//   plain     朴素按钮 (浅底 + 主色文字与描边)
//   round     胶囊圆角
//   circle    正圆 (配合 icon, 宽高相等)
//   text      文字按钮 (无底无边)
//   link      链接按钮 (无底无边无内边距, 主色文字)
//   loading   加载中 (禁用 + 左侧 spinner)
//   icon      图标名 (内置 15 个), iconRight 放右侧
//   block     撑满父容器宽
//   nativeProps 里的键透传给内核 button (onMouseMove 等)
//
// 【为什么显式给 height + padding】
// 内核 buttonPadding() 只认单值 `padding` (X=Y), 不能分别给水平/垂直。
// 但 layoutInlineRow 把内容**垂直居中于盒子中心** (推导:
//   y = Box.Y + padY + (Box.H - 2·padY - ch)/2 = Box.Y + (Box.H - ch)/2),
// 与 padY 无关。于是"显式 height 定死高度 + padding 定水平留白"两件事
// 可以同时成立, 互不干扰。

import { h } from "gx/gfx";
import { palette, toneOf, sizeOf, radius as radiusScale } from "../theme.js";
import { mergeProps, flattenChildren } from "../utils.js";
import { gap } from "../styles.js";

export function GxButton(props, ...children) {
  const p = props || {};
  const c = palette();
  const size = sizeOf(p.size);
  const type = p.type || "";
  const tone = toneOf(c, type);
  const hasTone = !!type && type !== "";

  const disabled = !!p.disabled || !!p.loading;

  // ---- 取色 ----
  let background, border, color;
  if (p.link) {
    background = "#00000000"; border = "#00000000";
    color = hasTone ? tone.fg : c.primary;
  } else if (p.text) {
    background = "#00000000"; border = "#00000000";
    color = hasTone ? tone.fg : c.textRegular;
  } else if (p.plain) {
    background = hasTone ? tone.tint : c.surface;
    border = hasTone ? tone.fg : c.border;
    color = hasTone ? tone.fg : c.textRegular;
  } else if (hasTone) {
    background = tone.fg; border = tone.fg; color = c.textOnBrand;
  } else {
    background = c.surface; border = c.border; color = c.textRegular;
  }

  // ---- 几何 ----
  const height = p.height !== undefined ? p.height : size.h;
  const padX = p.link ? 0 : (p.padding !== undefined ? p.padding : size.padX);
  const rad = p.circle ? Math.floor(height / 2)
    : p.round ? radiusScale.pill
    : (p.radius !== undefined ? p.radius : size.radius);

  // ---- 内容: [spinner] [icon] [gap] text [gap] [iconRight] ----
  const inner = [];
  const iconSize = size.icon;
  if (p.loading) inner.push(h("spinner", { size: Math.max(12, size.font), color: color }));
  else if (p.icon) inner.push(h("icon", { name: p.icon, size: iconSize, color: color }));

  const flat = flattenChildren(children);
  if ((p.loading || p.icon) && flat.length > 0) inner.push(gap(size.gap));
  for (const ch of flat) inner.push(ch);
  if (p.iconRight && flat.length > 0) inner.push(gap(size.gap));
  if (p.iconRight) inner.push(h("icon", { name: p.iconRight, size: iconSize, color: color }));

  const bp = {
    background: background,
    border: border,
    color: color,
    font: size.font,
    radius: rad,
    disabled: disabled,
    padding: padX,
  };
  if (p.circle) { bp.height = height; bp.width = p.width !== undefined ? p.width : height; }
  else {
    bp.height = height;
    if (p.width !== undefined) bp.width = p.width;
    else if (p.block) bp.width = "100%";
  }
  if (p.onClick) bp.onClick = p.onClick;
  if (p.title) bp.title = p.title;

  return h("button", mergeProps(bp, p.nativeProps || {}), ...inner);
}
