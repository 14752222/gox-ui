// GxEmpty —— 空状态 (Element Plus 的 el-empty)
//
//   description / desc   说明文字 (缺省 "暂无数据")
//   image                自定义图形元素 (第一个子节点)
//   size                 "normal" (缺省) | "compact"
//
// 内核 <empty> 自带灰点图形 + desc 文字; 包装层负责居中与留白。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { panel, txt } from "../styles.js";
import { flattenChildren } from "../utils.js";

export function GxEmpty(props, ...children) {
  const p = props || {};
  const c = palette();
  const kids = flattenChildren(children);
  const compact = p.size === "compact";

  const body = panel(c, {
    direction: "column",
    gap: space.md,
    alignItems: "center",
    pad: compact ? space.lg : space["2xl"],
    width: p.width,
  }, [
    kids.length > 0 ? kids[0]
      : h("empty", { desc: "" }),
    txt(c, { size: "base", color: c.textSecondary },
      p.description || p.desc || "暂无数据"),
    kids.length > 1 ? kids[1] : null,
  ]);
  return body;
}
