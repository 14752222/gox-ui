// GxTimeline — Element Plus 风格时间线 (el-timeline)
//   items: [{content, timestamp, type?, hollow?}]

import { h } from "gx/gfx";
import { palette, typeTone } from "../theme.js";

export function GxTimeline(props) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];

  const rows = items.map((it, i) => {
    const toneKey = typeTone[it.type || "primary"] || "primary";
    const dotColor = it.hollow ? c.fillBlankest : c[toneKey];
    const isLast = i === items.length - 1;

    return h("row", { gap: 10 },
      // 左: 点 + 竖线
      h("column", { alignItems: "center", width: 14 },
        h("rect", {
          width: 10, height: 10, radius: 5,
          background: dotColor, border: it.hollow ? c[toneKey] : "#00000000",
        }),
        isLast ? null : h("rect", { width: 2, flexGrow: 1, background: c.borderLight })),
      // 右: 内容
      h("column", { gap: 2, flexGrow: 1 },
        h("text", { font: 13, color: c.textPrimary }, it.content || ""),
        it.timestamp ? h("text", { font: 11, color: c.textSecondary }, it.timestamp) : null,
      ));
  });

  return h("column", { gap: 12 }, ...rows);
}
