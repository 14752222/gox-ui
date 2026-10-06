// GxSkeleton — 骨架屏 (包装内核 skeleton, 加 Element 风格圆角)
//   rows / avatar / active / width

import { h } from "gx/gfx";

export function GxSkeleton(props) {
  const p = props || {};
  const sp = {
    rows: p.rows !== undefined ? p.rows : 3,
    avatar: !!p.avatar,
    active: p.active !== false,
  };
  if (p.width) sp.width = p.width;
  return h("skeleton", sp);
}
