// GoxUI 设计令牌层
//
// 组件不硬编码任何颜色 / 间距 / 圆角 —— 一切取自本文件。想换皮只改这里。
//
// 三层结构:
//   1. 色板   palettes.light / palettes.dark —— 语义化颜色 (brand / 功能色 / 中性阶)
//   2. 度量   space / radius / fontSize / control / shadow —— 间距与尺寸节奏
//   3. 内核桥 kernelTokens() —— 把 gfx 内建控件的 32 个 token 对齐到同一套色
//
// 亮暗判定: gfx 的 gx/theme 只导出 setTheme / toggleDark / current,
// **没有 isDark**。所以这里读 current().text 的亮度来判断 —— 比记主题名更稳,
// 因为 setTheme({...}) 自定义主题会把主题名置成 "custom"。

import { current } from "gx/theme";

// ════════════════════════════════════════════════════════════════════════
// 一、色板
// ════════════════════════════════════════════════════════════════════════

const light = {
  // ── 品牌色 (Element Plus 蓝) + Light 色阶 ──
  primary:          "#409effff",
  primaryHover:     "#66b1ffff",
  primaryActive:    "#337eccff",
  primaryLight3:    "#79bbffff",
  primaryLight5:    "#a0cfffff",
  primaryLight7:    "#c6e2ffff",
  primaryLight8:    "#d9ecffff",
  primaryLight9:    "#ecf5ffff",

  // ── 功能色 ──
  success:          "#67c23aff",
  successHover:     "#85ce61ff",
  successLight3:    "#95d475ff",
  successLight8:    "#e1f3d8ff",
  successLight9:    "#f0f9ebff",

  warning:          "#e6a23cff",
  warningHover:     "#ebb563ff",
  warningLight3:    "#eebe77ff",
  warningLight8:    "#f3d19eff",
  warningLight9:    "#fdf6ecff",

  danger:           "#f56c6cff",
  dangerHover:      "#f78989ff",
  dangerLight3:     "#f89898ff",
  dangerLight8:     "#fde2e2ff",
  dangerLight9:     "#fef0f0ff",

  info:             "#909399ff",
  infoHover:        "#a6a9adff",
  infoLight3:       "#b1b3b8ff",
  infoLight8:       "#e9e9ebff",
  infoLight9:       "#f4f4f5ff",

  // ── 文字 (Element Plus 四级文字色) ──
  textPrimary:      "#303133ff",
  textRegular:      "#606266ff",
  textSecondary:    "#909399ff",
  textPlaceholder:  "#a8abb2ff",
  textDisabled:     "#c0c4ccff",
  textOnBrand:      "#ffffffff",

  // ── 描边 ──
  border:           "#dcdfe6ff",  // 基础描边 (输入框/按钮)
  borderLight:      "#e4e7edff",  // 轻描边 (卡片)
  borderLighter:    "#ebeef5ff",  // 更轻 (表格行/分隔线)
  borderExtraLight: "#f2f3f5ff",  // 最轻 (极淡分区)

  // ── 面 (从最深到最浅) ──
  fill:             "#f0f2f5ff",  // 填充块
  fillLight:        "#f5f7faff",  // 更浅填充
  fillBlankest:     "#fafafaff",  // 极浅填充
  surface:          "#ffffffff",  // 卡片 / 弹层正面
  surfaceSubtle:    "#fafbfcff",  // 卡片头部 / 次级面
  surfaceSunken:    "#f5f7faff",  // 凹陷面 (代码块/表头)
  bgPage:           "#f5f7faff",  // 页面底
  bgOverlay:        "#ffffffff",  // 弹层底
  mask:             "#0000004d",  // 遮罩

  // ── 状态面 (hover / active 的通用底色) ──
  hoverBg:          "#f5f7faff",
  activeBg:         "#ecf5ffff",

  // ── 阴影基准色 (alpha 在 shadow() 里叠加) ──
  shadowBase:       "#000000",
};

const dark = {
  primary:          "#409effff",
  primaryHover:     "#66b1ffff",
  primaryActive:    "#337eccff",
  primaryLight3:    "#2b6cb0ff",
  primaryLight5:    "#1d3f5eff",
  primaryLight7:    "#1b2b3fff",
  primaryLight8:    "#17273aff",
  primaryLight9:    "#152233ff",

  success:          "#67c23aff",
  successHover:     "#85ce61ff",
  successLight3:    "#3f7a24ff",
  successLight8:    "#1e2b18ff",
  successLight9:    "#1a2416ff",

  warning:          "#e6a23cff",
  warningHover:     "#ebb563ff",
  warningLight3:    "#8a6224ff",
  warningLight8:    "#2e2514ff",
  warningLight9:    "#262012ff",

  danger:           "#f56c6cff",
  dangerHover:      "#f78989ff",
  dangerLight3:     "#933f3fff",
  dangerLight8:     "#2e1a1aff",
  dangerLight9:     "#261616ff",

  info:             "#909399ff",
  infoHover:        "#a6a9adff",
  infoLight3:       "#56585cff",
  infoLight8:       "#26272aff",
  infoLight9:       "#1f2023ff",

  textPrimary:      "#e5eaf3ff",
  textRegular:      "#cfd3dcff",
  textSecondary:    "#a3a6adff",
  textPlaceholder:  "#8d9095ff",
  textDisabled:     "#6c6e72ff",
  textOnBrand:      "#ffffffff",

  border:           "#4c4d4fff",
  borderLight:      "#414243ff",
  borderLighter:    "#363637ff",
  borderExtraLight: "#2b2c2dff",

  fill:             "#303133ff",
  fillLight:        "#262727ff",
  fillBlankest:     "#1f1f20ff",
  surface:          "#1d1d1fff",
  surfaceSubtle:    "#232324ff",
  surfaceSunken:    "#191919ff",
  bgPage:           "#141414ff",
  bgOverlay:        "#1d1d1fff",
  mask:             "#00000080",

  hoverBg:          "#262727ff",
  activeBg:         "#152233ff",

  shadowBase:       "#000000",
};

const palettes = { light, dark };

// ════════════════════════════════════════════════════════════════════════
// 二、亮暗判定
// ════════════════════════════════════════════════════════════════════════

// 显式指定模式 ("light" | "dark" | "auto"); auto 时读内核主题。
let forcedMode = "auto";
let cachedTokens = null;

// kernelTokens 读内核当前 token 表 (失败时退化为空表)。
// 用 try 包住: current 若不存在 (旧内核) 或被替换, 不该让整个库崩掉。
const kernelTokens = () => {
  if (cachedTokens === null) {
    try {
      const t = current();
      cachedTokens = t && typeof t === "object" ? t : {};
    } catch (e) {
      cachedTokens = {};
    }
  }
  return cachedTokens;
};

// 内核主题切换后调用一次, 清掉 token 缓存 (可选; 不调也只是慢一拍)。
export const invalidateTheme = () => { cachedTokens = null; };

// mode 返回当前生效的模式: "light" | "dark"。
export const mode = () => {
  if (forcedMode === "light" || forcedMode === "dark") return forcedMode;
  const t = kernelTokens();
  const hex = t.text;
  if (typeof hex !== "string" || hex.length < 7) return "light";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "light";
  // Rec.601 亮度: 深色文字 → 亮色主题
  return (0.299 * r + 0.587 * g + 0.114 * b) > 140 ? "dark" : "light";
};

// setMode 覆盖模式判定 (不改变内核主题, 只影响 GoxUI 自己的取色)。
export const setMode = (m) => { forcedMode = m || "auto"; };

// palette 返回当前生效的色板。
export const palette = () => palettes[mode()];

// paletteOf 直读某一预设 (不随内核主题切换), 适合固定外观的场景。
export const paletteOf = (m) => palettes[m] || palettes.light;

// isDarkMode 对外暴露的亮暗查询。
export const isDarkMode = () => mode() === "dark";

// ════════════════════════════════════════════════════════════════════════
// 三、色彩工具
// ════════════════════════════════════════════════════════════════════════

// withAlpha 给 "#rrggbb" / "#rrggbbaa" 叠一个 0~1 的透明度。
export const withAlpha = (hex, a) => {
  const h = String(hex || "#000000").replace("#", "").slice(0, 6);
  const v = Math.max(0, Math.min(255, Math.round((a === undefined ? 1 : a) * 255)));
  return "#" + h + v.toString(16).padStart(2, "0");
};

// mix 在两个色之间线性插值 (t=0 → 取 a, t=1 → 取 b)。
export const mix = (a, b, t) => {
  const pa = parseRgb(a), pb = parseRgb(b);
  if (!pa || !pb) return a;
  const lerp = (x, y) => Math.round(x + (y - x) * t);
  return "#" + [lerp(pa[0], pb[0]), lerp(pa[1], pb[1]), lerp(pa[2], pb[2])]
    .map((n) => n.toString(16).padStart(2, "0")).join("") + "ff";
};

// lighten / darken: 朝白/朝黑混色, amount 0~1。
export const lighten = (hex, amount) => mix(hex, "#ffffffff", amount);
export const darken = (hex, amount) => mix(hex, "#000000ff", amount);

const parseRgb = (hex) => {
  const h = String(hex || "").replace("#", "");
  if (h.length < 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
};

// ════════════════════════════════════════════════════════════════════════
// 四、度量 (spacing / radius / font / control / shadow)
// ════════════════════════════════════════════════════════════════════════

// space —— 4px 基准的间距阶梯。名字比数字好读: space.lg 比 12 少一次猜。
export const space = {
  none: 0,
  xxs:  2,
  xs:   4,
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
};

// radius —— 圆角阶梯。base=6 是 GoxUI 的"品牌圆角"(元素默认取它)。
export const radius = {
  none:  0,
  sm:    3,
  base:  6,
  md:    8,
  lg:    10,
  xl:    12,
  "2xl": 16,
  pill:  999,
};

// fontSize —— 字号阶梯。
export const fontSize = {
  xs:    11,
  sm:    12,
  base:  13,
  md:    14,
  lg:    16,
  xl:    18,
  title: 20,
  hero:  26,
};

// fontWeight —— 字重阶梯 (内核只认数值)。
export const fontWeight = { regular: 400, medium: 500, semibold: 600, bold: 700 };

// control —— 控件尺寸表。padX 是**水平**内边距; 高度一律显式给,
// 内核 button 的 padding 是单值 (X=Y), 但 layoutInlineRow 会把内容
// 垂直居中于盒子中心, 所以显式 height + padding 恰好得到"水平宽留白 +
// 精确高度"两个都要的效果 (推导见 docs/design-notes.md)。
export const control = {
  large:   { h: 40, font: 14, padX: 20, radius: 6, icon: 16, gap: 8 },
  default: { h: 32, font: 14, padX: 15, radius: 6, icon: 14, gap: 6 },
  small:   { h: 24, font: 12, padX: 10, radius: 4, icon: 12, gap: 4 },
};

// sizeOf 取尺寸表 (带 default 兜底)。
export const sizeOf = (name) => control[name] || control.default;

// sizeTable 是 control 的历史别名 (v0.1 的组件引用它), 保留兼容。
export const sizeTable = control;

// radiusTable 同理 (v0.1 别名)。
export const radiusTable = radius;

// shadow —— 阴影阶梯。内核的 shadow prop 形如 {x, y, blur, color},
// 这里把"偏移/模糊/透明度"三件套收敛成 6 档, 由 shadow() 展开。
const shadowScale = {
  xs: { x: 0, y: 1, blur: 2,  alpha: 0.04 },
  sm: { x: 0, y: 1, blur: 4,  alpha: 0.06 },
  md: { x: 0, y: 4, blur: 10, alpha: 0.08 },
  lg: { x: 0, y: 8, blur: 20, alpha: 0.10 },
  xl: { x: 0, y: 12, blur: 32, alpha: 0.14 },
};

// shadow(c, level) → 内核 shadow prop 对象 (level 为 "none"/null 时返回 undefined,
// 让 h() 里的 undefined 被 mergeProps 丢掉, 即"无阴影")。
export const shadow = (c, level) => {
  const s = shadowScale[level];
  if (!s) return undefined;
  return { x: s.x, y: s.y, blur: s.blur, color: withAlpha(c.shadowBase, s.alpha) };
};

// ════════════════════════════════════════════════════════════════════════
// 五、语义映射 (type → 颜色 / 图标)
// ════════════════════════════════════════════════════════════════════════

// toneOf 把语义 type 解析成一组具体颜色。所有"有类型的组件"
// (Button / Tag / Alert / Message / Result / Progress / Timeline) 共用它,
// 保证 danger 在七个组件里是同一个红。
export const toneOf = (c, type, opts) => {
  const o = opts || {};
  switch (type) {
    case "primary":
      return { fg: c.primary, hover: c.primaryHover, active: c.primaryActive, tint: c.primaryLight9, soft: c.primaryLight8, mid: c.primaryLight3 };
    case "success":
      return { fg: c.success, hover: c.successHover, active: c.success, tint: c.successLight9, soft: c.successLight8, mid: c.successLight3 };
    case "warning":
      return { fg: c.warning, hover: c.warningHover, active: c.warning, tint: c.warningLight9, soft: c.warningLight8, mid: c.warningLight3 };
    case "danger":
    case "error":
      return { fg: c.danger, hover: c.dangerHover, active: c.danger, tint: c.dangerLight9, soft: c.dangerLight8, mid: c.dangerLight3 };
    case "info":
      return { fg: c.info, hover: c.infoHover, active: c.info, tint: c.infoLight9, soft: c.infoLight8, mid: c.infoLight3 };
    default:
      return { fg: o.neutralFg || c.textRegular, hover: c.textPrimary, active: c.textPrimary, tint: c.fillLight, soft: c.fill, mid: c.border };
  }
};

// typeTone / typeTint / typeMid —— v0.1 的 token 名映射表, 保留兼容。
export const typeTone = {
  primary: "primary", success: "success", warning: "warning",
  danger: "danger", error: "danger", info: "info",
};

export const typeTint = {
  primary: "primaryLight9", success: "successLight9", warning: "warningLight9",
  danger: "dangerLight9", error: "dangerLight9", info: "infoLight9",
};

export const typeMid = {
  primary: "primaryLight7", success: "successLight3", warning: "warningLight3",
  danger: "dangerLight3", error: "dangerLight3", info: "infoLight3",
};

// 语义 type → 内置图标名 (内置图标集只有 15 个, 见 icon.js)。
export const typeIcon = {
  primary: "bell",
  success: "check",
  warning: "bell",
  danger:  "close",
  error:   "close",
  info:    "chat",
};

// 语义 type → Result 用的字形 (内核图标集里没有叉/感叹号的实心圆版本)。
export const typeGlyph = {
  success: "✓", warning: "!", danger: "✕", error: "✕", info: "i", primary: "i",
};

export { palettes };
