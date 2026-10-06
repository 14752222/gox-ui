// GxAvatar —— Element Plus 风格头像 (内核 avatar 的包装)
//
//   name  显示的文字 (取首字符)
//   size  直径 (缺省 40)
//   color 背景色 (缺省主蓝)
//   round true (缺省, 正圆) | false (圆角方形)

import { h } from "gx/gfx";
import { palette } from "../theme.js";

export function GxAvatar(props) {
  const p = props || {};
  const c = palette();
  const sp = {
    name: p.name || "",
    size: p.size || 40,
    color: p.color || c.primary,
    round: p.round !== false,
  };
  return h("avatar", sp);
}
