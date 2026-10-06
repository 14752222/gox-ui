// GoxUI 样式构造层 —— 把"怎么拼一个盒子"收敛到一处
//
// 为什么需要这一层 (踩过的坑, 记在这里免得再犯):
//
//   gfx 的 layoutNode 只把 column / row / grid / view / slot / form / tab
//   当作**布局容器**。其余标签 (含 rect) 落进 default 分支:
//
//       for _, c := range n.Children {
//           c.Box = Rect{X: area.X, Y: area.Y, ...}   // ← 全部子节点同一坐标
//       }
//
//   也就是说 <rect>...</rect> 里的子节点会**全部叠在左上角**: 高度算 0、
//   兄弟互相压叠 —— 肉眼就是"文字糊成一团、分隔线横穿内容"。
//
//   所以本文件只提供两个出口: box("column"|"row") 与 panel()。
//   两者都保证返回的是真容器, 且装饰 (底/边/圆角/阴影) 一并接好。
//   库内任何组件都**不要**直接写 h("rect", {...}, 子树)。

import { h } from "gx/gfx";
import { radius as radiusScale, shadow as shadowSpec, space as spaceScale } from "./theme.js";

// ────────────────────────────────────────────────────────────────────────
// padding 帮手
// ────────────────────────────────────────────────────────────────────────

// pad({t, r, b, l}) → 四边内边距 props。
//
// 内核语义 (layout.go: paddingOf): `padding` 是基准值, 四边的
// paddingTop/Right/Bottom/Left 在它之上**覆盖** (不是相加)。所以这里
// 先用最小值做基准, 再逐边覆盖, 结果就是"写的什么就是什么"。
export function pad(o) {
  const s = o || {};
  const uniform = s.all !== undefined ? s.all : s.pad;
  if (uniform !== undefined) {
    const p = { padding: uniform };
    if (s.t !== undefined) p.paddingTop = s.t;
    if (s.r !== undefined) p.paddingRight = s.r;
    if (s.b !== undefined) p.paddingBottom = s.b;
    if (s.l !== undefined) p.paddingLeft = s.l;
    return p;
  }
  const sides = [s.t, s.r, s.b, s.l].filter((v) => v !== undefined);
  const base = sides.length ? Math.min.apply(null, sides) : 0;
  const p = { padding: base };
  if (s.t !== undefined) p.paddingTop = s.t;
  if (s.r !== undefined) p.paddingRight = s.r;
  if (s.b !== undefined) p.paddingBottom = s.b;
  if (s.l !== undefined) p.paddingLeft = s.l;
  return p;
}

// ────────────────────────────────────────────────────────────────────────
// 面 (surface)
// ────────────────────────────────────────────────────────────────────────

// surfaceProps(c, spec) → 一个盒子"的长相属性 (底/描边/圆角/阴影)。
//
//   bg        底色 (字符串)
//   border    描边色; 给色即画 1px, 或 {color, width, style}
//   radius    圆角 (数字, 或 radius 表的键名如 "lg")
//   shadow    阴影档位 ("xs"|"sm"|"md"|"lg"|"xl") 或 false
//   pad       内边距: 数字 或 pad() 的入参对象
export function surfaceProps(c, spec) {
  const s = spec || {};
  const p = {};

  if (s.bg) p.background = s.bg;

  const r = s.radius;
  if (r !== undefined) {
    p.radius = typeof r === "number" ? r : (radiusScale[r] !== undefined ? radiusScale[r] : radiusScale.base);
  }

  const b = s.border;
  if (b) {
    if (typeof b === "string") {
      p.border = b;
      p.borderWidth = s.borderWidth || 1;
      if (s.borderStyle) p.borderStyle = s.borderStyle;
    } else if (b.color) {
      p.border = b.color;
      p.borderWidth = b.width || 1;
      if (b.style) p.borderStyle = b.style;
    }
  }

  if (s.shadow) {
    const sh = shadowSpec(c, typeof s.shadow === "string" ? s.shadow : "sm");
    if (sh) p.shadow = sh;
  }

  if (s.pad !== undefined || s.padProps !== undefined) {
    let pp;
    if (s.padProps !== undefined) {
      pp = s.padProps;
    } else if (typeof s.pad === "object") {
      // 已经是 pad() 的产物 (含 padding 键) 就直接用, 否则按 {t,r,b,l} 编译
      pp = s.pad.padding !== undefined ? s.pad : pad(s.pad);
    } else {
      pp = { padding: s.pad };
    }
    for (const k in pp) p[k] = pp[k];
  }

  if (s.width !== undefined) p.width = s.width;
  if (s.height !== undefined) p.height = s.height;

  return p;
}

// ────────────────────────────────────────────────────────────────────────
// 容器出口 (唯一的两个)
// ────────────────────────────────────────────────────────────────────────

// normalize 摊平 children 并丢掉空值 (保留函数形式的响应式子节点)。
//
// 【必须声明在 box/panel 之前】Gox 编译器的函数提升只认裸的
// function 声明; `export function` 被 ExportDeclaration 包裹, **不参与
// 提升** (compileStatements 的 hoist 循环只匹配 *ast.FunctionDeclaration)。
// 所以"先声明的 export function 调用后声明的函数"会 ReferenceError。
// 库内所有文件都遵守: 被调用者先声明。
export function normalize(children) {
  const out = [];
  const push = (c) => {
    if (c === null || c === undefined || c === false || c === true || c === "") return;
    if (Array.isArray(c)) { for (const x of c) push(x); return; }
    out.push(c);
  };
  if (children === undefined || children === null) return out;
  if (Array.isArray(children)) { for (const x of children) push(x); }
  else push(children);
  return out;
}

// box(direction, props, ...children) —— 有面的通用容器。
//   direction: "column" | "row" | "grid"
// 强制走真容器; direction 传 "rect" 之类会被纠回 column (防手滑)。
// 【rest 参数】必须 ...children 收全部子节点: 单 children 参数会把
// 逗号多参调用的第 4+ 个参数静默丢掉 (GxCard 曾因此整块内容消失)。
export function box(direction, props, ...children) {
  let tag = direction;
  if (tag !== "row" && tag !== "column" && tag !== "grid") tag = "column";
  return h(tag, props || {}, ...normalize(children));
}

// panel(c, spec, ...children) —— 卡片式面板: 有面 + 内边距 + 纵排。
//   是 GxCard / GxDialog / GxCollapse / GxAlert 底座共用的那块"板"。
export function panel(c, spec, ...children) {
  const s = spec || {};
  const props = surfaceProps(c, s);
  if (s.direction !== "row") {
    if (s.gap !== undefined) props.gap = s.gap;
    if (s.alignItems) props.alignItems = s.alignItems;
  } else {
    props.alignItems = s.alignItems || "center";
    if (s.gap !== undefined) props.gap = s.gap;
  }
  if (s.justifyContent) props.justifyContent = s.justifyContent;
  if (s.flexGrow !== undefined) props.flexGrow = s.flexGrow;
  if (s.flexShrink !== undefined) props.flexShrink = s.flexShrink;
  if (s.onClick) props.onClick = s.onClick;
  if (s.extra) for (const k in s.extra) props[k] = s.extra[k];
  return box(s.direction === "row" ? "row" : "column", props, ...children);
}

// ────────────────────────────────────────────────────────────────────────
// 小零件
// ────────────────────────────────────────────────────────────────────────

// 字号表的本地副本 (与 theme.fontSize 同口径, 这里内联避免循环依赖风险)。
const FONT = { xs: 11, sm: 12, base: 13, md: 14, lg: 16, xl: 18, title: 20, hero: 26 };

// txt(c, spec, content) —— 带层级的文字节点。
//   size   字号: fontSize 表的键名 ("sm"/"base"/...) 或直接数字
//   weight 字重 (400/500/600/700)
//   color  颜色; wrap 换行; width 定宽; align 对齐
//
// 【必须显式给 font】内核 defaultFontSize() 会走 allDisplays() →
// win32 Displays() → syscall.NewCallback, 每次新建一个回调, 堆满
// Windows 回调上限 (~2000) 就 "fatal error: too many callback functions"。
// 所有文字节点都从这里出, 就不会有人漏掉 font。
export function txt(c, spec, content) {
  const s = spec || {};
  const p = { font: FONT[s.size] || (typeof s.size === "number" ? s.size : 13) };
  if (s.weight !== undefined) p.fontWeight = s.weight;
  if (s.color) p.color = s.color;
  if (s.wrap) p.wrap = true;
  if (s.width !== undefined) p.width = s.width;
  if (s.align) p.align = s.align;
  if (s.onClick) p.onClick = s.onClick;
  if (s.flexGrow !== undefined) p.flexGrow = s.flexGrow;
  if (s.lineHeight !== undefined) p.lineHeight = s.lineHeight;
  return h("text", p, content === undefined ? "" : content);
}

// hline(c, opts) —— 水平分隔线 (1px 细线, 在 column 里自动铺满宽)。
export function hline(c, opts) {
  const o = opts || {};
  const p = {
    height: o.thickness || 1,
    background: o.color || (c && c.borderLighter) || "#e4e7edff",
  };
  if (o.marginTop !== undefined) p.marginTop = o.marginTop;
  if (o.marginBottom !== undefined) p.marginBottom = o.marginBottom;
  if (o.flexGrow !== undefined) p.flexGrow = o.flexGrow;
  return h("separator", p);
}

// vline(c, opts) —— 垂直分隔线。
// 【高度】在 row 容器里, 交叉轴=高: 不显式给 height 时 (cross==0) 会被
// stretch 拉满整行高; 一旦给了 height 就变成定值 (hasExplicitCross 为真)。
// 所以想让分隔线随行高变化时**不要**传 height。
export function vline(c, opts) {
  const o = opts || {};
  const p = {
    vertical: true,
    width: o.thickness || 1,
    background: o.color || (c && c.borderLighter) || "#e4e7edff",
  };
  if (o.height !== undefined) p.height = o.height;
  return h("separator", p);
}

// gap(n) —— 固定宽/高的占位。button 内部子节点是"紧挨着排"的 (内核
// layoutInlineRow 不认 gap), 需要间距时插一个它。
export function gap(n, dir) {
  return dir === "column" ? h("spacer", { height: n || 0 }) : h("spacer", { width: n || 0 });
}

// iconPad —— 图标在文字前/后要留的那点空。
export function iconGap(n) { return h("spacer", { width: n === undefined ? 6 : n }); }

export { spaceScale, radiusScale };
