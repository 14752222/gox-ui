// GxAvatar — Element Plus 风格头像 (复用内核 avatar)
//   name / size / color / round / icon

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
