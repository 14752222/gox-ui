// GxTimeline —— Element Plus 风格时间线 (el-timeline)
//
//   items: [{ content, timestamp?, type?, hollow?, color? }]
//
// 布局: 每项是 row [左列: 点+线] [右列: 内容]。左列 width 固定 16;
// 点后的竖线 flexGrow=1 吃掉左列剩余高。右列内容底 padding 拉开项间距。

import { h } from "gx/gfx";
import { palette, toneOf, space } from "../theme.js";
import { panel, txt } from "../styles.js";

export function GxTimeline(props) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];

  const rows = items.map((it, i) => {
    const tone = toneOf(c, it.type || "primary");
    const dotColor = it.color || tone.fg;
    const isLast = i === items.length - 1;

    const left = panel(c, { direction: "column", alignItems: "center", width: 16 }, [
      h("column", {
        width: 10, height: 10, radius: 5,
        background: it.hollow ? c.surface : dotColor,
        border: it.hollow ? dotColor : "#00000000",
        borderWidth: 2,
        marginTop: 3,
      }),
      isLast ? null : h("column", {
        width: 2, flexGrow: 1, background: c.borderLighter, marginTop: 4,
      }),
    ]);

    const right = panel(c, {
      direction: "column",
      gap: space.xxs,
      flexGrow: 1,
      alignItems: "start",
      extra: { paddingBottom: isLast ? 0 : space.lg },
    }, [
      it.timestamp ? txt(c, { size: "xs", color: c.textSecondary }, it.timestamp) : null,
      txt(c, { size: "base", color: c.textPrimary }, it.content === undefined ? "" : it.content),
    ]);

    return panel(c, { direction: "row", gap: space.md, alignItems: "start" }, [left, right]);
  });

  return panel(c, { direction: "column", gap: space.lg }, rows);
}
