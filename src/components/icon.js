// GxIcon — 图标 (包装内核 icon)

import { h } from "gx/gfx";

export function GxIcon(props) {
  const p = props || {};
  const ip = { name: p.name || "", size: p.size || 16 };
  if (p.color !== undefined) ip.color = p.color;
  return h("icon", ip);
}
