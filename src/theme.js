// GoxUI 设计令牌与主题层
//
// Gox 内核已有 gx/theme 的 32 个 token (accent/btnFace/text/...)。
// 本模块在其之上叠加一层「设计系统」令牌: Element Plus 风格的品牌色板、
// 功能色、中性色阶 —— 组件的缺省外观全部引用这里, 换主题 = 换一张表。
//
// 亮暗判定复用内核主题: isDark() 读当前主题名。组件不硬编码颜色,
// 一切取自 palette() —— setTheme("dark") 后下一帧整套换肤。

const palettes = {
  light: {
    // 品牌色与功能色 (Element Plus 蓝系)
    primary:         "#409effff",
    primaryLight3:   "#79bbffff",
    primaryLight5:   "#a0cfffff",
    primaryLight7:   "#c6e2ffff",
    primaryLight8:   "#d9ecffff",
    primaryLight9:   "#ecf5ffff",
    primaryDark2:    "#337eccff",
    success:         "#67c23aff",
    successLight3:   "#95d475ff",
    successLight8:   "#e1f3d8ff",
    successLight9:   "#f0f9ebff",
    warning:         "#e6a23cff",
    warningLight3:   "#eebe77ff",
    warningLight8:   "#f3d19eff",
    warningLight9:   "#fdf6ecff",
    danger:          "#f56c6cff",
    dangerLight3:    "#f89898ff",
    dangerLight8:    "#fde2e2ff",
    dangerLight9:    "#fef0f0ff",
    info:            "#909399ff",
    infoLight3:      "#b1b3b8ff",
    infoLight8:      "#e9e9ebff",
    infoLight9:      "#f4f4f5ff",
    // 中性色阶
    textPrimary:     "#303133ff",
    textRegular:     "#606266ff",
    textSecondary:   "#909399ff",
    textPlaceholder: "#a8abb2ff",
    textDisabled:    "#c0c4ccff",
    border:          "#dcdfe6ff",
    borderLight:     "#e4e7edff",
    borderLighter:   "#ebeef5ff",
    borderExtraLight:"#f2f6fcff",
    fill:            "#f0f2f5ff",
    fillLight:       "#f5f7faff",
    fillBlankest:    "#fafafcff",
    bgPage:          "#f2f3f5ff",
    bgOverlay:       "#ffffffff",
    maskColor:       "#0000004d",
    // 阴影
    shadowCard:      "#0000001a",
    shadowPopup:     "#00000033",
  },
  dark: {
    primary:         "#79bbffff",
    primaryLight3:   "#409effff",
    primaryLight5:   "#1d3f5eff",
    primaryLight7:   "#2b6cb0ff",
    primaryLight8:   "#1d3f5eff",
    primaryLight9:   "#1b2534ff",
    primaryDark2:    "#337eccff",
    success:         "#67c23aff",
    successLight3:   "#95d475ff",
    successLight8:   "#1f2d1f66",
    successLight9:   "#1b2118ff",
    warning:         "#e6a23cff",
    warningLight3:   "#eebe77ff",
    warningLight8:   "#33290f66",
    warningLight9:   "#292316ff",
    danger:          "#f56c6cff",
    dangerLight3:    "#f89898ff",
    dangerLight8:    "#331a1566",
    dangerLight9:    "#2b1a17ff",
    info:            "#909399ff",
    infoLight3:      "#b1b3b8ff",
    infoLight8:      "#37383aff",
    infoLight9:      "#262727ff",
    // 中性色阶
    textPrimary:     "#e5eaf3ff",
    textRegular:     "#cfd3dcff",
    textSecondary:   "#a3a6adff",
    textPlaceholder: "#a3a6adff",
    textDisabled:    "#8d9095ff",
    border:          "#4c4d4fff",
    borderLight:     "#414243ff",
    borderLighter:   "#363637ff",
    borderExtraLight:"#313233ff",
    fill:            "#303133ff",
    fillLight:       "#262727ff",
    fillBlankest:    "#1f1f20ff",
    bgPage:          "#141414ff",
    bgOverlay:       "#1d1d1fff",
    maskColor:       "#00000080",
    // 阴影
    shadowCard:      "#00000059",
    shadowPopup:     "#00000066",
  },
};

// 亮/暗自动切换: 读内核主题名。setTheme("dark") 下一帧整套换肤。
export function palette() {
  const mode = (typeof isDark === "function" && isDark()) ? "dark" : "light";
  return palettes[mode];
}

// 直读某一预设 (不随内核主题切换), 适合固定场景。
export function paletteOf(mode) {
  return palettes[mode] || palettes.light;
}

// type → 主色 token 名 (边框/图标/强调文字)
export const typeTone = {
  primary: "primary",
  success: "success",
  warning: "warning",
  danger:  "danger",
  error:   "danger",
  info:    "info",
};

// type → 浅底 token 名 (填充类组件: Alert/Tag/Notification 底色)
export const typeTint = {
  primary: "primaryLight9",
  success: "successLight9",
  warning: "warningLight9",
  danger:  "dangerLight9",
  error:   "dangerLight9",
  info:    "infoLight9",
};

// type → 中间阶 token 名 (hover 提亮/active 加深的过渡色)
export const typeMid = {
  primary: "primaryLight7",
  success: "successLight3",
  warning: "warningLight3",
  danger:  "dangerLight3",
  error:   "dangerLight3",
  info:    "infoLight3",
};

// 尺寸规范 (与 Element Plus 同口径的控件高度/字号)
export const sizeTable = {
  large:  { h: 40, font: 14, pad: 14 },
  default:{ h: 32, font: 14, pad: 10 },
  small:  { h: 24, font: 12, pad: 6  },
};

// 圆角规范
export const radiusTable = { small: 2, default: 4, large: 8, round: 999 };
