// GxSwitch — Element Plus 风格开关
// 复用内核 switch (36x20), 外面包一层语义与尺寸控制。

import { h } from "gx/gfx";

export function GxSwitch(props) {
  const p = props || {};
  const sp = { onClick: p.onClick };
  if (p.model !== undefined) sp.model = p.model;
  else if (p.checked !== undefined) sp.checked = p.checked;
  if (p.disabled !== undefined) sp.disabled = p.disabled;
  if (p.background !== undefined) sp.background = p.background;
  return h("switch", sp);
}
