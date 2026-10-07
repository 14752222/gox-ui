// GoxUI 多端自适应层
//
// Gox 是跨端运行时: 桌面 (Windows/macOS/Linux) + 移动 (Android/iOS/鸿蒙)。
// 一套组件要在两端都好用, 差异必须收敛到一个地方处理 —— 就是本文件。
//
// 【可用内核信号】(全部实测过, 见各注释):
//   gx/device    deviceInfo(): platform / isMobile / isDesktop / isTablet / pixelRatio
//   gx/viewport  widthClass(): compact(<600dp) | medium(600-840) | expanded(>840)
//                safeAreaStyle(): 刘海/圆角/手势条的内边距 (可含键盘高)
//                keyboardVisible(), isSplit(), layoutMode()
//   gx/screen    windowInfo(): width / height / scale / platform
//   gx/app       onBackPress(): 安卓返回键
//
// 【内核没有的, 本层的推导口径】:
//   - pointer 类型: 无 API。用 isMobile 近似 —— 手机/平板默认触控档,
//     桌面默认鼠标档 (桌面触屏笔电很少见, 且观感错档的代价小于命中区不足)。
//   - 断点: 内核有 sm/md/lg/xl (dp), 本层再叠加 widthClass 三档语义。
//
// 【触控档的尺寸纪律】(WCAG 2.5.5 / Apple HIG):
//   最小命中区 44×44。触控档控件高度全部 ≥ 44 (button/input/tag/avatar...),
//   字号 +1~2, 间距 ×1.33 (8→12 之类的整数化), 圆角加大一档。
//
// 用法 (组件内部已接好, 应用层一般不用直接碰):
//   import { adaptive, controlFor, isTouch } from "gox-ui";
//   controlFor("default").h  // 桌面 32, 触控 44 —— 组件渲染时自动取

import { deviceInfo, vibrate as kernelVibrate } from "gx/device";
import { widthClass, safeAreaStyle, keyboardVisible } from "gx/viewport";

// ════════════════════════════════════════════════════════════════════════
// 一、设备形态
// ════════════════════════════════════════════════════════════════════════

let cachedDevice = null;

const readDevice = () => {
  if (cachedDevice === null) {
    try {
      const d = deviceInfo();
      cachedDevice = d && typeof d === "object" ? d : {};
    } catch (e) {
      cachedDevice = {};
    }
  }
  return cachedDevice;
};

// invalidateDevice: 宿主形态变化 (如二合一翻转) 后可手动清缓存; 桌面场景
// 平台不会变, 缓存是安全的。导出给需要严格 fresh 的场景。
export const invalidateDevice = () => { cachedDevice = null; };

// platform: "windows" | "darwin" | "linux" | "android" | "ios" | "harmony"
export const platform = () => {
  const p = readDevice().platform;
  return typeof p === "string" ? p : "unknown";
};

// isMobilePlatform: 手机 (不含平板)。折叠屏合上时也是这个形态。
export const isMobilePlatform = () => readDevice().isMobile === true;

// isTabletDevice: 平板 / 大屏移动设备。
export const isTabletDevice = () => readDevice().isTablet === true;

// isTouch: 触控档判定 (指针精度的近似)。
//   手机 → true; 平板 → true; 桌面 → false。
//   应用可用 setPointerOverride 强制 (比如带触屏的桌面设备)。
let pointerOverride = null;
export const setPointerOverride = (v) => { pointerOverride = v; };
export const isTouch = () => {
  if (pointerOverride !== null) return pointerOverride;
  return isMobilePlatform() || isTabletDevice();
};

// ════════════════════════════════════════════════════════════════════════
// 二、视口与断点
// ════════════════════════════════════════════════════════════════════════

// sizeClass: "compact" (<600dp 手机竖屏) | "medium" (600-840 折叠展开/小平板)
//          | "expanded" (>840 平板横屏/桌面)。
// 响应式: 内核 widthClass 内部读了 viewportEnvSignal —— 在 JSX 的函数 prop
// 里调用它, 窗口 resize / 折叠时会自动重算。
export const sizeClass = () => {
  try {
    const c = widthClass();
    return typeof c === "string" ? c : "compact";
  } catch (e) {
    return "compact";
  }
};

// isCompact: 手机竖屏 / 分屏窄窗 —— 「单列布局」信号。
export const isCompact = () => sizeClass() === "compact";

// isMedium: 折叠屏展开 / 小平板 —— 「双列可用」信号。
export const isMedium = () => sizeClass() === "medium";

// isExpanded: 平板横屏 / 桌面 —— 「多列布局」信号。
export const isExpanded = () => {
  const c = sizeClass();
  return c === "expanded" || c === "regular";
};

// safeArea: 安全区内边距 (刘海/圆角/手势条)。withKeyboard 时把弹出的键盘
// 高度也算进底部 —— 聊天输入条这类贴底元素必开。
// 返回可直接展开进容器的 props 对象: <column {...safeArea()}>。
export const safeArea = (withKeyboard) => {
  try {
    const s = safeAreaStyle(withKeyboard === true);
    return s && typeof s === "object" ? s : {};
  } catch (e) {
    return {};
  }
};

// keyboardUp: 软键盘是否弹出 (响应式, 配合 safeArea(true) 使用)。
export const keyboardUp = () => {
  try { return keyboardVisible() === true; } catch (e) { return false; }
};

// ════════════════════════════════════════════════════════════════════════
// 三、触控档尺寸表
// ════════════════════════════════════════════════════════════════════════

// touchControl: 触控档控件尺寸 (对照 theme.js control 的桌面档)。
// 最小命中 44 —— 不是「平均」, 是「下限」: small 档也 ≥ 44 高。
const touchControl = {
  large:   { h: 52, font: 17, padX: 26, radius: 8,  icon: 20, gap: 10 },
  default: { h: 44, font: 16, padX: 18, radius: 8,  icon: 18, gap: 8  },
  small:   { h: 44, font: 14, padX: 14, radius: 6,  icon: 16, gap: 6  },
};

// controlFor(sizeName, opts) → 当前设备应使用的控件尺寸。
//   opts.forceTouch: 显式指定触控/鼠标档 (覆盖 isTouch 判定)
// 这是所有组件取尺寸的唯一入口 —— theme.js 的 control 表只在
// 这里被引用, 组件永远不直接读它。
export const controlFor = (sizeName, opts) => {
  const touch = opts && opts.forceTouch !== undefined ? opts.forceTouch : isTouch();
  if (touch) return touchControl[sizeName] || touchControl.default;
  return null; // 非触控档由调用方用桌面表 (见 sizeOf 的组合)
};

// 触控档间距放大系数 (整数化: 8→12, 12→16, 16→20, 20→28)。
export const touchSpace = (n) => {
  const table = { 2: 4, 4: 6, 6: 10, 8: 12, 12: 16, 16: 20, 20: 28, 24: 32, 32: 40, 40: 48 };
  return table[n] !== undefined ? table[n] : Math.round(n * 1.33);
};

// minTouchTarget: 命中区下限。给「视觉小但命中要够」的元素用
// (如图标按钮: 视觉 32, 命中 44 —— 用透明 padding 补)。
export const minTouchTarget = 44;

// hitSlopPad(target, visual) → 把 visual 尺寸的元素撑到 target 命中区的
// 透明 padding props {padding, ...}。触控档才有意义, 鼠标档返回 0。
export const hitSlopPad = (target, visual) => {
  if (!isTouch()) return 0;
  const need = Math.max(0, ((target || minTouchTarget) - (visual || 0)) / 2);
  return Math.ceil(need);
};

// ════════════════════════════════════════════════════════════════════════
// 四、交互差异开关
// ════════════════════════════════════════════════════════════════════════

// adaptive: 汇总对象 —— 组件里一行读完所有端差异。
//   { touch, compact, expanded, platform, touchSpace, hitSlop }
// 注意 compact/expanded 是**响应式**读数 (内核 signal), 在函数 prop /
// 渲染函数里调用才有自动更新。
export const adaptive = () => ({
  touch: isTouch(),
  compact: isCompact(),
  medium: isMedium(),
  expanded: isExpanded(),
  platform: platform(),
  isMobile: isMobilePlatform(),
  isTablet: isTabletDevice(),
});

// dialogBehavior: 弹层形态策略。
//   桌面/横屏 → "center" (居中卡片)
//   窄屏触控 → "sheet" (底部动作面板 —— 内核 drawer 只有左右贴边,
//              用 side="bottom" 不存在, 所以 GxDialog 的 sheet 形态
//              是自己实现的贴底面板, 见 dialog.js)
export const dialogBehavior = () => (isTouch() && isCompact()) ? "sheet" : "center";

// tooltipBehavior: 提示策略。触屏没有 hover —— 返回 "none" 让
// GxTooltip 在触控档不渲染 (信息改走 label/描述文本)。
export const tooltipBehavior = () => (isTouch() ? "none" : "hover");

// listDensity: 列表/表格行距策略。触控档行高 ≥ 48 (好按),
// 鼠标档 40 (信息密度优先)。
export const listRowHeight = () => (isTouch() ? 52 : 40);

// vibrateTap: 触控档轻震动反馈 (点击成功时)。内核 vibrate 是软降级的
// (不支持则无操作), 只在触控档启用 —— 鼠标点击震动会很怪。
export const vibrateTap = () => {
  if (!isTouch()) return;
  try { kernelVibrate({ duration: 10 }); } catch (e) { /* 震动失败不影响业务 */ }
};
