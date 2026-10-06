// GxDialog — Element Plus 风格对话框
//   title / open / onClose
//   width (缺省 420)
//   showClose (缺省 true)

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxDialog(props, ...children) {
  const p = props || {};
  const c = palette();
  const open = typeof p.open === "function" ? p.open() : p.open;

  if (!open) return null;

  const w = p.width || 420;

  return h("dialog", {
    open: true,
    onClose: (e) => { if (p.onClose) p.onClose(e); },
  },
    h("rect", {
      width: w, background: c.bgOverlay, radius: 8,
      shadow: { x: 0, y: 8, blur: 16, color: c.shadowPopup },
    },
      h("column", { width: "100%" },
        // 头部
        h("row", { padding: 14, paddingLeft: 18, paddingRight: 18, alignItems: "center" },
          h("text", { font: 15, fontWeight: 600, color: c.textPrimary }, p.title || ""),
          h("spacer", { flexGrow: 1 }),
          p.showClose === false ? null : h("rect", {
            width: 22, height: 22, radius: 11,
            onClick: (e) => { if (p.onClose) p.onClose(e); },
          }, h("icon", { name: "close", size: 10, color: c.textSecondary })),
        ),
        h("separator", {}),
        // 内容
        h("column", { padding: 18, gap: 10, width: "100%" },
          ...flattenChildren(children)),
        // footer (可选)
        p.footer ? h("column", { width: "100%" },
          h("separator", {}),
          h("row", { padding: 12, paddingLeft: 18, paddingRight: 18, justifyContent: "end", gap: 8 },
            typeof p.footer === "function" ? p.footer() : p.footer)) : null,
      )));
}
