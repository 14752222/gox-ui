// GxCard —— 卡片容器 (Element Plus 的 el-card)
//
//   header      头部标题 (字符串 / 函数 / 元素); title 是同义别名
//   subtitle    头部次级说明 (小字灰)
//   extra       头部右侧内容 (函数, 返回元素)
//   direction   "column" (缺省) | "row"
//   bodyPadding 内容区留白 (缺省 20)
//   gap         内容区子节点间距 (缺省 12)
//   shadow      true | "always" | "md" → 淡阴影; 缺省无阴影 (描边更干净)
//   border      false 去掉描边
//   radius      圆角, 缺省 10
//   width / compact
//
// 结构 (每一层都是真容器 —— 见 styles.js 顶部关于 rect 的说明):
//   column[卡片面]
//     ├─ row[头部留白]     ← **无底色**: 方形头部底色会盖住卡片圆角
//     ├─ separator          ← 1px 分隔线
//     └─ column[内容留白]

import { palette, space, radius as radiusScale, control } from "../theme.js";
import { panel, hline, txt, normalize, pad } from "../styles.js";
import { flattenChildren } from "../utils.js";

export function GxCard(props, ...children) {
  const p = props || {};
  const c = palette();

  const bodyPad = p.bodyPadding !== undefined ? p.bodyPadding : (p.compact ? space.lg : space.xxl);
  const rad = p.radius !== undefined ? p.radius : radiusScale.lg;
  const gap = p.gap !== undefined ? p.gap : space.lg;

  // ---- 头部 ----
  const title = p.header !== undefined ? p.header : p.title;
  const headKids = [];
  if (typeof title === "function") headKids.push(title());
  else if (typeof title === "string" && title !== "") {
    headKids.push(txt(c, { size: "lg", weight: 600, color: c.textPrimary }, title));
  } else if (title) headKids.push(title);
  if (p.$header) headKids.push(p.$header);
  if (p.subtitle) headKids.push(txt(c, { size: "sm", color: c.textSecondary }, p.subtitle));

  const hasHeader = headKids.length > 0 || typeof p.extra === "function";
  const headPad = pad({ t: space.xl, r: space.xxl, b: space.xl, l: space.xxl });

  const head = hasHeader
    ? panel(c, {
        direction: "row",
        gap: space.lg,
        alignItems: "center",
        padProps: headPad,
      }, [
        panel(c, {
          direction: "column",
          gap: space.xxs,
          alignItems: "start",
          flexGrow: 1,
        }, headKids),
        typeof p.extra === "function" ? p.extra() : null,
      ])
    : null;

  // ---- 内容 ----
  const body = panel(c, {
    direction: p.direction === "row" ? "row" : "column",
    gap: gap,
    alignItems: p.direction === "row" ? "center" : (p.alignItems || "start"),
    pad: bodyPad,
    flexGrow: 1,
  }, flattenChildren(children));

  return panel(c, {
    bg: c.surface,
    border: p.border === false ? null : c.borderLight,
    radius: rad,
    shadow: p.shadow === true || p.shadow === "always" ? "sm" : p.shadow,
    width: p.width,
    gap: 0,
  },
    head,
    hasHeader ? hline(c, { color: c.borderLighter }) : null,
    body);
}

// cardSize 是给内部/外部复用的尺寸口径 (头部与内容区留白一致)。
export const cardMetrics = {
  headerPad: { t: space.xl, r: space.xxl, b: space.xl, l: space.xxl },
  bodyPad: space.xxl,
  gap: space.lg,
  minControl: control.default.h,
};
