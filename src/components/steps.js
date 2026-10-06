// GxSteps — Element Plus 风格步骤条 (el-steps)
//   steps: [{title, description?}]
//   active: 当前步下标 (0-based)
//   onChange (可选)

import { h } from "gx/gfx";
import { palette } from "../theme.js";

export function GxSteps(props) {
  const p = props || {};
  const c = palette();
  const steps = p.steps || [];
  const active = typeof p.active === "function" ? p.active() : (p.active || 0);

  const kids = [];
  steps.forEach((s, i) => {
    const done = i < active;
    const isCurrent = i === active;
    const tone = done || isCurrent ? c.primary : c.border;

    kids.push(h("column", { gap: 4, alignItems: "center", flexGrow: 1 },
      h("rect", {
        width: 24, height: 24, radius: 12, background: tone,
        onClick: (e) => { if (p.onChange) p.onChange({ step: i }); },
      },
        h("text", { font: 12, color: done ? "#ffffffff" : (isCurrent ? "#ffffffff" : c.textSecondary), fontWeight: 600 },
          done ? "✓" : String(i + 1))),
      h("text", { font: 12, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? c.primary : c.textRegular }, s.title || ""),
      s.description ? h("text", { font: 11, color: c.textSecondary }, s.description) : null,
    ));
    if (i < steps.length - 1) {
      kids.push(h("rect", { height: 2, flexGrow: 1, background: i < active ? c.primary : c.border, marginTop: 11 }));
    }
  });

  return h("row", { gap: 8, alignItems: "start", padding: 4 }, ...kids);
}
