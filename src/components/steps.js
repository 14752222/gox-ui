// GxSteps —— Element Plus 风格步骤条 (el-steps)
//
//   steps:    [{ title, description? }]
//   active:   当前步下标 (0-based; 可传函数做响应式)
//   onChange({ step })   点步骤圆圈时触发 (可选)
//   direction "horizontal" (缺省) | "vertical" —— compact 断点自动转纵向
//
// 布局: 横向 [圆圈+标题列] [连接线] ...; 纵向 (窄屏) [圆圈] [内容] 逐行下排,
// 连接线变竖线 —— 窄屏里横向步骤的标题会挤成一条, 纵向是移动端标准。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { panel, txt } from "../styles.js";
import { resolveVal } from "../utils.js";
import { isTouch, isCompact } from "../adaptive.js";

export function GxSteps(props) {
  const p = props || {};
  const c = palette();
  const steps = p.steps || [];
  const active = resolveVal(p.active) || 0;
  const touch = isTouch();

  // 窄屏 (手机竖屏) 自动纵向; 显式 direction 优先
  const vertical = p.direction === "vertical" || (p.direction === undefined && isCompact());

  const dotSize = touch ? 30 : 24;
  const titleFont = touch ? 14 : 12;
  const descFont = touch ? 12 : 11;

  const circle = (done, isCurrent, i) => panel(c, {
    direction: "column",
    bg: done || isCurrent ? c.primary : c.fillLight,
    radius: Math.floor(dotSize / 2),
    width: dotSize,
    height: dotSize,
    alignItems: "center",
    justifyContent: "center",
    extra: p.onChange ? { onClick: () => p.onChange({ step: i }) } : undefined,
  }, [
    txt(c, {
      size: touch ? 14 : 12,
      weight: 600,
      color: done || isCurrent ? c.textOnBrand : c.textSecondary,
    }, done ? "✓" : String(i + 1)),
  ]);

  if (vertical) {
    const rows = [];
    steps.forEach((s, i) => {
      const done = i < active;
      const isCurrent = i === active;
      const isLast = i === steps.length - 1;
      rows.push(panel(c, { direction: "row", gap: space.lg, alignItems: "start" }, [
        panel(c, { direction: "column", alignItems: "center" }, [
          circle(done, isCurrent, i),
          isLast ? null : h("column", {
            width: 2, flexGrow: 1, background: i < active ? c.primary : c.borderLight,
            marginTop: 4, minHeight: 24,
          }),
        ]),
        panel(c, {
          direction: "column",
          gap: space.xxs,
          alignItems: "start",
          extra: { paddingBottom: isLast ? 0 : space.xl },
        }, [
          txt(c, {
            size: titleFont,
            weight: isCurrent ? 600 : 400,
            color: isCurrent ? c.primary : (done ? c.textPrimary : c.textRegular),
          }, s.title === undefined ? "" : s.title),
          s.description ? txt(c, { size: descFont, color: c.textSecondary }, s.description) : null,
        ]),
      ]));
    });
    return panel(c, { direction: "column", gap: space.md }, rows);
  }

  // 横向
  const kids = [];
  steps.forEach((s, i) => {
    const done = i < active;
    const isCurrent = i === active;
    kids.push(panel(c, {
      direction: "column",
      gap: space.md,
      alignItems: "center",
      flexGrow: 1,
    }, [
      circle(done, isCurrent, i),
      txt(c, {
        size: titleFont,
        weight: isCurrent ? 600 : 400,
        color: isCurrent ? c.primary : (done ? c.textPrimary : c.textRegular),
      }, s.title === undefined ? "" : s.title),
      s.description ? txt(c, { size: descFont, color: c.textSecondary }, s.description) : null,
    ]));

    if (i < steps.length - 1) {
      kids.push(h("column", {
        width: 0, height: 2, flexGrow: 1,
        background: i < active ? c.primary : c.borderLight,
        marginTop: Math.floor(dotSize / 2) - 1,
        radius: 1,
      }));
    }
  });

  return panel(c, { direction: "row", gap: space.md, alignItems: "start", pad: space.xs }, kids);
}
