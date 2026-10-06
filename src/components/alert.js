// GxAlert — Element Plus 风格横幅提示
//   type: success | warning | danger | info (缺省 info)
//   title: 标题文字
//   description: 辅助文字 (可选)
//   closable / onClose
//   showIcon

import { h } from "gx/gfx";
import { palette, typeTone, typeTint } from "../theme.js";

export function GxAlert(props) {
  const p = props || {};
  const c = palette();
  const type = p.type || "info";
  const toneKey = typeTone[type] || "info";
  const tintKey = typeTint[type] || "infoLight9";

  const iconNames = { success: "check", warning: "bell", danger: "close", info: "chat" };
  const iconName = iconNames[type] || "chat";

  const right = [];
  if (p.description) {
    right.push(h("text", { font: 12, color: c.textRegular, wrap: true, width: 340 }, p.description));
  }
  if (p.closable) {
    right.push(h("spacer", { flexGrow: 1 }));
    right.push(h("rect", { width: 18, height: 18, radius: 9, onClick: (e) => { if (p.onClose) p.onClose(e); } },
      h("icon", { name: "close", size: 9, color: c.textSecondary })));
  }

  return h("rect", {
    background: c[tintKey], border: c[toneKey], radius: 4,
    padding: 10, width: p.width || 380,
  },
    h("row", { gap: 8, alignItems: "center" },
      h("icon", { name: iconName, size: 16, color: c[toneKey] }),
      h("column", { gap: 4 },
        h("text", { font: 13, fontWeight: 600, color: c[toneKey] }, p.title || ""),
        ...right),
    ));
}
