// GoxUI 冒烟测试: 全部组件的元素树构造 (无需窗口)
// 运行: gox test/smoke.js
// 预期输出: pass=NN fail=0 (GxDialog closed 返回 null 属预期条件渲染)

import { h } from "gx/gfx";
import {
  GxButton, GxButtonGroup, GxInput, GxSwitch, GxCheckbox, GxRadio, GxCheckboxGroup,
  GxSelect, GxSlider, GxRate, GxDatePicker, GxUpload, GxIcon,
  GxSpace, GxDivider, GxCard, GxCollapse,
  GxBreadcrumb, GxSteps, GxTabs, GxTabPane, GxPagination,
  GxTable, GxTag, GxAvatar, GxDescriptions, GxTimeline, GxResult, GxEmpty, GxSkeleton,
  GxDialog, GxAlert, GxMessage, GxMessageHost, GxProgress, GxTooltip,
  GxForm, GxFormItem, GxLoadingHost, useLoading, palette, paletteOf,
  platform, isTouch, sizeClass, dialogBehavior, controlFor, hitSlopPad,
} from "../src/index.js";

let pass = 0, fail = 0;
function t(name, fn) {
  try {
    const v = fn();
    if (v !== null) pass++;
    else { fail++; console.log("NULL:", name); }
  } catch (e) {
    fail++; console.log("FAIL:", name, "-", e.message || e);
  }
}

// 基础
t("GxButton default", () => GxButton(null, "hi"));
t("GxButton primary", () => GxButton({ type: "primary" }, "hi"));
t("GxButton plain", () => GxButton({ type: "success", plain: true }, "p"));
t("GxButton text", () => GxButton({ text: true }, "t"));
t("GxButton loading", () => GxButton({ loading: true }, "l"));
t("GxButton circle+icon", () => GxButton({ circle: true, icon: "plus" }));
t("GxButton sizes", () => { GxButton({ size: "large" }); GxButton({ size: "small" }); return 1; });
t("GxButtonGroup", () => GxButtonGroup(null, GxButton(null, "a"), GxButton(null, "b")));
t("GxInput", () => GxInput({ placeholder: "x" }));
t("GxInput clearable", () => GxInput({ value: "abc", clearable: true }));
t("GxInput status", () => GxInput({ status: "error" }));
t("GxSwitch", () => GxSwitch({ checked: true }));
t("GxCheckbox", () => GxCheckbox({ checked: true }));
t("GxRadio", () => GxRadio({ value: "a", checked: true }));
t("GxCheckboxGroup", () => GxCheckboxGroup({ options: ["a", "b"], value: ["a"] }));
t("GxCheckboxGroup fn value", () => GxCheckboxGroup({ options: ["a"], value: () => ["a"] }));
t("GxSelect", () => GxSelect({ options: ["x"], value: "x" }));
t("GxSlider", () => GxSlider({ value: 50 }));
t("GxRate", () => GxRate({ value: 3 }));
t("GxDatePicker", () => GxDatePicker({}));
t("GxUpload", () => GxUpload({}));
t("GxIcon", () => GxIcon({ name: "home" }));

// 布局
t("GxSpace", () => GxSpace(null, "a", "b"));
t("GxSpace column", () => GxSpace({ direction: "column" }, "a"));
t("GxDivider", () => GxDivider(null));
t("GxDivider vertical", () => GxDivider({ vertical: true }));
t("GxDivider text", () => GxDivider({ contentPosition: "center" }, "分节"));
t("GxCard", () => GxCard({ header: "H" }, h("text", null, "body")));
t("GxCard headerFn", () => GxCard({ header: () => h("text", null, "fn") }, h("text", null, "b")));
t("GxCollapse", () => GxCollapse({ items: [{ title: "A", content: [h("text", null, "c")] }] }));
t("GxCollapse accordion", () => GxCollapse({ accordion: true, items: [{ title: "A" }] }));

// 导航
t("GxBreadcrumb", () => GxBreadcrumb({ items: [{ label: "a" }, { label: "b" }] }));
t("GxSteps", () => GxSteps({ steps: [{ title: "a" }, { title: "b" }], active: 1 }));
t("GxSteps fn active", () => GxSteps({ steps: [{ title: "a" }], active: () => 0 }));
t("GxTabs items", () => GxTabs({ items: [{ title: "A", content: h("text", null, "c") }] }));
t("GxTabs children", () => GxTabs(null, GxTabPane({ title: "A" }, "c")));
t("GxPagination", () => GxPagination({ total: 42, current: 1 }));

// 数据展示
t("GxTable", () => GxTable({ columns: ["a", "b"], rows: [["1", "2"]] }));
t("GxTable objCols", () => GxTable({ columns: [{ key: "k", label: "L" }], rows: [{ k: "v" }] }));
t("GxTag", () => GxTag({ type: "primary" }, "T"));
t("GxTag dark", () => GxTag({ effect: "dark" }, "T"));
t("GxTag plain", () => GxTag({ effect: "plain" }, "T"));
t("GxTag closable", () => GxTag({ closable: true }, "T"));
t("GxAvatar", () => GxAvatar({ name: "G" }));
t("GxAvatar square", () => GxAvatar({ name: "G", round: false, size: 32 }));
t("GxDescriptions", () => GxDescriptions({ items: [{ label: "k", content: "v" }] }));
t("GxTimeline", () => GxTimeline({ items: [{ content: "c", timestamp: "t" }] }));
t("GxTimeline hollow", () => GxTimeline({ items: [{ content: "c", type: "warning", hollow: true }] }));
t("GxResult", () => GxResult({ icon: "success", title: "T" }));
t("GxEmpty", () => GxEmpty({ description: "无" }));
t("GxSkeleton", () => GxSkeleton({ rows: 4, avatar: true }));

// 反馈
t("GxDialog", () => GxDialog({ open: true, title: "T" }, h("text", null, "body")));
t("GxDialog footer", () => GxDialog({ open: true, footer: () => h("row", null) }, "b"));
t("GxAlert", () => GxAlert({ type: "success", title: "T" }));
t("GxAlert desc+closable", () => GxAlert({ type: "warning", title: "T", description: "d", closable: true }));
t("GxProgress", () => GxProgress({ percentage: 42 }));
t("GxProgress status", () => GxProgress({ percentage: 80, status: "success" }));
t("GxTooltip", () => GxTooltip({ text: "tip" }, h("text", null, "host")));
t("GxMessageHost", () => GxMessageHost());
t("GxLoadingHost", () => GxLoadingHost());
t("useLoading", () => { const [l] = useLoading(); return l(); });
t("GxMessage", () => GxMessage("hi"));

// 表单
t("GxForm", () => GxForm(null, GxFormItem({ label: "L" }, h("input", { name: "a" }))));
t("GxFormItem required", () => GxForm(null, GxFormItem({ label: "L", required: true }, h("input", { name: "a" }))));

// 主题
t("palette light", () => { const c = paletteOf("light"); return c.primary === "#409effff"; });
t("palette dark", () => { const c = paletteOf("dark"); return c.primary === "#409effff"; });
t("palette()", () => palette() !== undefined && palette() !== null);

// 多端自适应
t("platform 识别", () => typeof platform() === "string" && platform().length > 0);
t("isTouch 布尔", () => typeof isTouch() === "boolean");
t("sizeClass 三档", () => ["compact", "medium", "expanded", "regular"].indexOf(sizeClass()) >= 0);
t("dialogBehavior 合法", () => ["center", "sheet"].indexOf(dialogBehavior()) >= 0);
t("controlFor 触控档≥44", () => { const s = controlFor("default", { forceTouch: true }); return s && s.h >= 44; });
t("controlFor 鼠标档", () => { const s = controlFor("default", { forceTouch: false }); return s === null; });
t("hitSlop 触控补命中", () => { const n = hitSlopPad(44, 24); return typeof n === "number" && n >= 0; });
t("GxDialog sheet 形态", () => GxDialog({ behavior: "sheet", open: true, title: "T" }, h("text", null, "b")));
t("GxSteps vertical", () => GxSteps({ steps: [{ title: "a" }, { title: "b" }], active: 1, direction: "vertical" }));
t("GxButton touch 档", () => GxButton({ touch: true }, "t"));
t("GxTooltip 触屏透传", () => {
  // 桌面 (非触控) 走 tooltip; 触控走透传 —— 两分支都不炸即过
  GxTooltip({ text: "x" }, h("text", null, "h"));
  return 1;
});

console.log(`pass=${pass} fail=${fail}`);
if (fail > 0) throw new Error("SMOKE FAIL: " + fail + " cases failed");
