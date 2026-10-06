// GxSteps —— Element Plus 风格步骤条 (el-steps)
//
//   steps:    [{ title, description? }]
//   active:   当前步下标 (0-based; 可传函数做响应式)
//   onChange({ step })   点步骤圆圈时触发 (可选)
//
// 布局: [圆圈+标题列] [连接线] [圆圈+标题列] [连接线] ...
// 连接线 flexGrow=1 吃掉剩余宽; 圆圈列 alignItems=center 居中。
// 圆圈是 column (rect 装字会让字贴左上角 —— 见 styles.js 顶部说明)。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { panel, txt } from "../styles.js";
import { resolveVal } from "../utils.js";

export function GxSteps(props) {
  const p = props || {};
  const c = palette();
  const steps = p.steps || [];
  const active = resolveVal(p.active) || 0;

  const kids = [];
  steps.forEach((s, i) => {
    const done = i < active;
    const isCurrent = i === active;
    const tone = done || isCurrent ? c.primary : c.border;
    const dot = isCurrent ? c.primary : (done ? c.primary : c.borderLight);

    // 圆圈: column 居中承载序号/对勾
    const circle = panel(c, {
      direction: "column",
      bg: done || isCurrent ? tone : c.fillLight,
      radius: 12,
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      extra: p.onChange ? { onClick: () => p.onChange({ step: i }) } : undefined,
    }, [
      txt(c, {
        size: "sm",
        weight: 600,
        color: done || isCurrent ? c.textOnBrand : c.textSecondary,
      }, done ? "✓" : String(i + 1)),
    ]);

    kids.push(panel(c, {
      direction: "column",
      gap: space.md,
      alignItems: "center",
      flexGrow: 1,
    }, [
      circle,
      txt(c, {
        size: "sm",
        weight: isCurrent ? 600 : 400,
        color: isCurrent ? c.primary : (done ? c.textPrimary : c.textRegular),
      }, s.title === undefined ? "" : s.title),
      s.description ? txt(c, { size: "xs", color: c.textSecondary }, s.description) : null,
    ]));

    // 连接线
    if (i < steps.length - 1) {
      kids.push(h("column", {
        width: 0, height: 2, flexGrow: 1,
        background: i < active ? c.primary : c.borderLight,
        marginTop: 11,
        radius: 1,
      }));
    }
  });

  return panel(c, { direction: "row", gap: space.md, alignItems: "start", pad: space.xs }, kids);
}
