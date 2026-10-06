// GxTag — Element Plus 风格标签
//   type: primary | success | warning | danger | info | "" (缺省)
//   effect: light | dark | plain
//   closable / onClose
//   size: large | default | small

import { h } from "gx/gfx";
import { palette, typeTone, typeTint } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxTag(props, ...children) {
  const p = props || {};
  const c = palette();
  const type = p.type || "";
  const toneKey = typeTone[type] || null;
  const tintKey = typeTint[type] || null;

  const font = { large: 13, default: 12, small: 11 }[p.size || "default"];
  const pad  = { large: 10, default: 8,  small: 6  }[p.size || "default"];
  const hgt  = { large: 28, default: 24, small: 20 }[p.size || "default"];

  let background, border, color;
  if (p.effect === "dark") {
    background = toneKey ? c[toneKey] : c.fill;
    border = toneKey ? c[toneKey] : c.fill;
    color = "#ffffffff";
  } else if (p.effect === "plain") {
    background = "#00000000";
    border = toneKey ? c[toneKey] : c.border;
    color = toneKey ? c[toneKey] : c.textRegular;
  } else {
    // light (缺省)
    background = tintKey ? c[tintKey] : c.fill;
    border = toneKey ? c[toneKey] : c.border;
    color = toneKey ? c[toneKey] : c.textRegular;
  }

  const kids = [...flattenChildren(children)];
  if (p.closable) {
    kids.push(h("rect", {
      width: 14, height: 14, radius: 7,
      onClick: (e) => { if (p.onClose) p.onClose(e); },
    }, h("icon", { name: "close", size: 8, color: color })));
  }

  return h("row", {
    gap: 4, alignItems: "center",
    background: background, border: border, radius: 4,
    padding: 0, paddingLeft: pad, paddingRight: pad,
    height: hgt,
  },
    h("text", { font: font, color: color }, ...kids));
}
