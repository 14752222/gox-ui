// GxTabs — 选项卡 (包装内核 tabs/tab, 支持 items 数组写法)
//   items: [{title, content: 元素或函数}]
//   model / value / onChange

import { h } from "gx/gfx";
import { flattenChildren } from "../utils.js";

export function GxTabs(props, ...children) {
  const p = props || {};

  // items 写法: 声明式数组
  if (Array.isArray(p.items)) {
    return h("tabs", { value: p.value, onChange: p.onChange },
      ...p.items.map((it) =>
        h("tab", { title: it.title || "" },
          typeof it.content === "function" ? it.content() : (it.content || null))));
  }

  // 子节点写法: <GxTabs><GxTabPane title=...>...</GxTabPane></GxTabs>
  return h("tabs", { value: p.value, onChange: p.onChange },
    ...flattenChildren(children));
}

export function GxTabPane(props, ...children) {
  const p = props || {};
  return h("tab", { title: p.title }, ...flattenChildren(children));
}
