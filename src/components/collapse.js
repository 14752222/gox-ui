// GxCollapse — Element Plus 风格折叠面板 (el-collapse)
//   items: [{title, content: 元素或数组, name?}]
//   accordion: 手风琴模式 (同时只开一个)
//   model / activeNames: 受控展开列表

import { h } from "gx/gfx";
import { createSignal } from "gx/solid";
import { palette } from "../theme.js";
import { flattenChildren } from "../utils.js";

export function GxCollapse(props, ...children) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];

  // 内部展开状态: 受控优先, 否则自管 signal (首个默认展开)
  const [openNames, setOpenNames] = createSignal(
    p.activeNames ? [...p.activeNames] : (items.length > 0 ? [items[0].name || items[0].title] : []));

  const isOpen = (name) => openNames().indexOf(name) >= 0;

  const toggle = (name) => {
    const cur = openNames();
    let next;
    if (cur.indexOf(name) >= 0) {
      next = cur.filter((x) => x !== name);
    } else {
      next = p.accordion ? [name] : cur.concat([name]);
    }
    setOpenNames(next);
    if (p.onChange) p.onChange({ activeNames: next });
  };

  const panels = items.map((it, idx) => {
    const name = it.name || it.title;
    const open = isOpen(name);
    const content = typeof it.content === "function" ? it.content() : it.content;
    const contentKids = content === undefined || content === null ? flattenChildren(children) : (Array.isArray(content) ? content : [content]);

    return h("rect", { border: c.borderLighter, radius: 4, width: p.width },
      h("column", { width: "100%" },
        h("row", {
          padding: 10, paddingLeft: 12, alignItems: "center",
          onClick: () => toggle(name),
        },
          h("text", { font: 13, fontWeight: 600, color: c.textPrimary }, it.title || ""),
          h("spacer", { flexGrow: 1 }),
          h("text", { font: 10, color: c.textSecondary }, open ? "▲" : "▼")),
        open ? h("column", { padding: 12, paddingTop: 0, gap: 6, width: "100%" },
          ...contentKids) : null,
      ));
  });

  return h("column", { gap: 10 }, ...panels);
}
