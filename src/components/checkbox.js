// GxCheckbox / GxRadio / GxCheckboxGroup —— 复选 / 单选
//
//   GxCheckbox(model | checked, disabled)
//   GxRadio(model | checked, value, disabled)
//   GxCheckboxGroup(options, value: 数组/函数, onChange, gap)
//
// 选项行 = row [checkbox] [label], 点整行切换 (命中区大一点更好点)。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { txt } from "../styles.js";
import { resolveVal } from "../utils.js";

export function GxCheckbox(props) {
  const p = props || {};
  const cp = {};
  if (p.model !== undefined) cp.model = p.model;
  else if (p.checked !== undefined) cp.checked = p.checked;
  if (p.onClick) cp.onClick = p.onClick;
  if (p.disabled !== undefined) cp.disabled = p.disabled;
  if (p.background !== undefined) cp.background = p.background;
  return h("checkbox", cp);
}

export function GxRadio(props) {
  const p = props || {};
  const rp = {};
  if (p.model !== undefined) rp.model = p.model;
  if (p.value !== undefined) rp.value = p.value;
  if (p.checked !== undefined) rp.checked = p.checked;
  if (p.onClick) rp.onClick = p.onClick;
  if (p.disabled !== undefined) rp.disabled = p.disabled;
  return h("radio", rp);
}

export function GxCheckboxGroup(props) {
  const p = props || {};
  const c = palette();
  const options = p.options || [];
  const selected = resolveVal(p.value) || [];

  return h("row", {
    gap: p.gap !== undefined ? p.gap : space.xl,
    alignItems: "center",
    wrap: p.wrap !== undefined ? p.wrap : true,
  },
    ...options.map((opt) => {
      const val = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      const on = selected.indexOf(val) >= 0;
      return h("row", {
        gap: space.sm,
        alignItems: "center",
        onClick: p.disabled ? undefined : () => {
          if (!p.onChange) return;
          const next = on ? selected.filter((x) => x !== val) : selected.concat([val]);
          p.onChange({ value: next });
        },
      },
        h("checkbox", { checked: on, disabled: p.disabled }),
        txt(c, { size: "base", color: p.disabled ? c.textDisabled : c.textRegular }, label));
    }));
}
