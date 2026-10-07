// GxTooltip —— 提示 (内核 tooltip 的包装)
//
//   text / placement / delay
//   force     true 可强制显示 (触屏设备调试用)
//
// 【多端】触屏没有 hover —— 内核 tooltip 依赖悬停, 在触控档整棵不渲染
// (宿主元素原样返回)。信息改放到 label / description 里, 这是移动端
// 的标准做法; 调试期可用 force 强制看效果。

import { h } from "gx/gfx";
import { flattenChildren } from "../utils.js";
import { isTouch } from "../adaptive.js";

export function GxTooltip(props, ...children) {
  const p = props || {};
  const kids = flattenChildren(children);

  // 触控档: 直接透传宿主 (提示语义在触屏上不成立)
  if (isTouch() && p.force !== true) {
    return kids.length === 1 ? kids[0] : h("view", null, ...kids);
  }

  const tp = { text: p.text || "", placement: p.placement || "top" };
  if (p.delay !== undefined) tp.delay = p.delay;
  return h("tooltip", tp, ...kids);
}
