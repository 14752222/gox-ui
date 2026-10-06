// GxProgress —— Element Plus 风格进度条
//
//   percentage   0~100 (可传函数做响应式)
//   status       success | warning | danger | "" (缺省按主色)
//   strokeWidth  轨道高 (缺省 6)
//   showText     是否显示百分比 (缺省 true)
//   width        轨道宽 (缺省撑满父容器)
//
// 轨道是 row (父 column stretch 下吃满宽), 前景 column 按百分比宽摆在
// 主轴起点 —— 两层同圆角, 溢出方向由 pct 钳位 (0~100) 天然约束。

import { h } from "gx/gfx";
import { palette, toneOf, space } from "../theme.js";
import { panel, txt } from "../styles.js";
import { resolveVal } from "../utils.js";

export function GxProgress(props) {
  const p = props || {};
  const c = palette();
  const pct = Math.max(0, Math.min(100, Number(resolveVal(p.percentage)) || 0));
  const stroke = p.strokeWidth !== undefined ? p.strokeWidth : 6;

  const toneKey = p.status === "success" ? "success"
    : p.status === "warning" ? "warning"
    : (p.status === "danger" || p.status === "error") ? "danger"
    : "primary";
  const tone = toneOf(c, toneKey);

  const bar = h("column", {
    width: (pct + "%"),
    height: stroke,
    background: tone.fg,
    radius: Math.floor(stroke / 2),
    transition: { width: 200 },
  });

  const track = h("row", {
    width: p.width !== undefined ? p.width : "100%",
    height: stroke,
    background: c.fillLight,
    radius: Math.floor(stroke / 2),
  }, bar);

  if (p.showText === false) return track;

  return panel(c, { direction: "row", gap: space.md, alignItems: "center", flexGrow: 1 }, [
    track,
    txt(c, { size: "sm", color: tone.fg }, pct + "%"),
  ]);
}
