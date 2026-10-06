// GxProgress — Element Plus 风格进度条
//   percentage: 0~100
//   status: success | warning | danger | "" (缺省按主色)
//   strokeWidth: 数字 (缺省 6)
//   showText: 显示百分比文字 (缺省 true)
//   width

import { h } from "gx/gfx";
import { palette } from "../theme.js";

export function GxProgress(props) {
  const p = props || {};
  const c = palette();
  const pct = Math.max(0, Math.min(100, Number(p.percentage) || 0));
  const stroke = p.strokeWidth || 6;
  const w = p.width || 280;

  const toneKey = p.status === "success" ? "success"
    : p.status === "warning" ? "warning"
    : p.status === "danger" || p.status === "error" ? "danger"
    : "primary";

  const bar = h("rect", {
    width: Math.round(w * pct / 100), height: stroke,
    background: c[toneKey], radius: stroke / 2,
    transition: { width: 200 },
  });

  const track = h("rect", {
    width: w, height: stroke, radius: stroke / 2,
    background: c.fill, overflow: "hidden",
  }, bar);

  // overflow 裁剪暂未在 rect 上提供 —— 改用轨道与前景同圆角, 超出部分
  // 由宽度百分比自然约束 (pct 已钳 0~100)。文字放右侧。
  if (p.showText === false) return track;

  return h("row", { gap: 8, alignItems: "center" },
    track,
    h("text", { font: 12, color: c[toneKey] }, `${pct}%`));
}
