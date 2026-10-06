// GoxUI — Element Plus 风格的 Gox 桌面 GUI 组件库
//
// 聚合入口: 应用代码 `import { GxButton } from "gox-ui"` 一行拿全。
// 细分模块按需导入 (库代码推荐):
//   import { GxButton } from "gox-ui/src/components/button.js"
//
// 运行时要求: Gox >= 当前 main (gx/gfx, gx/solid, gx/theme)。

// ---- 主题与工具 ----
export { palette, paletteOf, typeTone, typeTint, typeMid, sizeTable, radiusTable } from "./theme.js";
export { mergeProps, flattenChildren, firstChild, isDarkMode } from "./utils.js";

// ---- 基础组件 ----
export { GxButton } from "./components/button.js";
export { GxButtonGroup } from "./components/button-group.js";
export { GxInput } from "./components/input.js";
export { GxSwitch } from "./components/switch.js";
export { GxCheckbox, GxRadio, GxCheckboxGroup } from "./components/checkbox.js";
export { GxSelect } from "./components/select.js";
export { GxSlider } from "./components/slider.js";
export { GxRate } from "./components/rate.js";
export { GxDatePicker } from "./components/datepicker.js";
export { GxUpload } from "./components/upload.js";
export { GxIcon } from "./components/icon.js";

// ---- 布局 ----
export { GxSpace } from "./components/space.js";
export { GxDivider } from "./components/divider.js";
export { GxCard } from "./components/card.js";
export { GxCollapse } from "./components/collapse.js";

// ---- 导航 ----
export { GxBreadcrumb } from "./components/breadcrumb.js";
export { GxSteps } from "./components/steps.js";
export { GxTabs, GxTabPane } from "./components/tabs.js";
export { GxPagination } from "./components/pagination.js";

// ---- 数据展示 ----
export { GxTable } from "./components/table.js";
export { GxTag } from "./components/tag.js";
export { GxAvatar } from "./components/avatar.js";
export { GxDescriptions } from "./components/descriptions.js";
export { GxTimeline } from "./components/timeline.js";
export { GxResult } from "./components/result.js";
export { GxEmpty } from "./components/empty.js";
export { GxSkeleton } from "./components/skeleton.js";

// ---- 反馈 ----
export { GxDialog } from "./components/dialog.js";
export { GxAlert } from "./components/alert.js";
export { GxMessage, GxMessageHost } from "./components/message.js";
export { GxProgress } from "./components/progress.js";
export { GxTooltip } from "./components/tooltip.js";
export { GxLoadingHost, useLoading } from "./components/loading.js";

// ---- 表单 ----
export { GxForm, GxFormItem } from "./components/form.js";
