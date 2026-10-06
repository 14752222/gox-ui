// GxResult — Element Plus 风格结果页 (el-result)
//   icon: success | warning | danger | info (缺省 info)
//   title / subTitle

import { h } from "gx/gfx";
import { palette, typeTone } from "../theme.js";

export function GxResult(props) {
  const p = props || {};
  const c = palette();
  const type = p.icon || "info";
  const toneKey = typeTone[type] || "info";

  const glyph = { success: "✓", warning: "!", danger: "✕", info: "i" }[type] || "i";

  return h("column", { gap: 12, alignItems: "center", padding: 24 },
    h("rect", {
      width: 56, height: 56, radius: 28, background: c[toneKey],
    },
      h("text", { font: 28, color: "#ffffffff", fontWeight: 700 }, glyph)),
    h("text", { font: 18, fontWeight: 600, color: c.textPrimary }, p.title || ""),
    p.subTitle ? h("text", { font: 12, color: c.textSecondary }, p.subTitle) : null,
  );
}
