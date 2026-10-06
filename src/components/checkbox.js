// GxCheckbox / GxRadio / GxCheckboxGroup — 复选/单选
// GxCheckboxGroup: options 数组 + value (数组) + onChange, 内部用 row 排一组 checkbox。

import { h } from "gx/gfx";
import { palette } from "../theme.js";
import { resolveVal } from "../utils.js";

export function GxCheckbox(props) {
  const p = props || {};
  const cp = {};
  if (p.model !== undefined) cp.model = p.model;
  if (p.checked !== undefined) cp.checked = p.checked;
  if (p.onClick) cp.onClick = p.onClick;
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
  return h("radio", rp);
}

export function GxCheckboxGroup(props) {
  const p = props || {};
  const c = palette();
  const options = p.options || [];
  const selected = resolveVal(p.value) || [];

  return h("row", { gap: p.gap !== undefined ? p.gap : 12, alignItems: "center" },
    ...options.map((opt) => {
      const val = typeof opt === "string" ? opt : opt.value;
      const label = typeof opt === "string" ? opt : opt.label;
      const on = selected.indexOf(val) >= 0;
      return h("row", { gap: 6, alignItems: "center" },
        h("checkbox", {
          checked: on,
          onClick: () => {
            if (!p.onChange) return;
            const next = on ? selected.filter((x) => x !== val) : selected.concat([val]);
            p.onChange({ value: next });
          },
        }),
        h("text", { font: 13, color: c.textRegular }, label));
    }));
}
