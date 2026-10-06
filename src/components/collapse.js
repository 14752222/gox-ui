// GxCollapse —— Element Plus 风格折叠面板 (el-collapse)
//
//   items: [{ title, content: 元素/数组/函数, name? }]
//   accordion   手风琴模式 (同时只开一个)
//   activeNames 受控展开名列表 (数组 / 函数)
//   model       同 activeNames (别名)
//   onChange({ activeNames })
//   width / gap / bordered
//
// 观感: 整组共用一个描边圆角面板, 项与项之间用 1px 分隔线切开 ——
// 这是 Element Plus 的口径, 比"每项各一个圆角卡片"更整齐。
// (每项若是独立圆角卡片, 展开态会在列表里跳出一截, 视觉上很吵。)

import { h } from "gx/gfx";
import { createSignal } from "gx/solid";
import { palette, space, radius as radiusScale } from "../theme.js";
import { panel, hline, txt, normalize, pad } from "../styles.js";
import { flattenChildren, resolveVal } from "../utils.js";

export function GxCollapse(props, ...children) {
  const p = props || {};
  const c = palette();
  const items = p.items || [];

  const controlled = p.activeNames !== undefined ? p.activeNames : p.model;
  const initial = resolveVal(controlled);
  const [openNames, setOpenNames] = createSignal(
    Array.isArray(initial) ? initial.slice()
      : (items.length > 0 ? [items[0].name !== undefined ? items[0].name : items[0].title] : []));

  const current = () => (controlled !== undefined ? (resolveVal(controlled) || []) : openNames());
  const isOpen = (name) => current().indexOf(name) >= 0;

  const toggle = (name) => {
    const cur = current().slice();
    const next = cur.indexOf(name) >= 0
      ? cur.filter((x) => x !== name)
      : (p.accordion ? [name] : cur.concat([name]));
    if (controlled === undefined) setOpenNames(next);
    if (p.onChange) p.onChange({ activeNames: next });
  };

  const blocks = [];
  items.forEach((it, idx) => {
    const name = it.name !== undefined ? it.name : it.title;
    const open = isOpen(name);
    const raw = typeof it.content === "function" ? it.content() : it.content;
    const kids = raw === undefined || raw === null ? flattenChildren(children)
      : (Array.isArray(raw) ? raw : [raw]);
    const disabled = !!it.disabled;

    const header = panel(c, {
      direction: "row",
      gap: space.md,
      alignItems: "center",
      padProps: pad({ t: space.lg, r: space.xl, b: space.lg, l: space.xl }),
      extra: {
        onClick: disabled ? undefined : () => toggle(name),
        background: disabled ? c.fillLight : undefined,
      },
    }, [
      txt(c, {
        size: "base",
        weight: 500,
        color: disabled ? c.textDisabled : (open ? c.primary : c.textPrimary),
      }, it.title === undefined ? "" : it.title),
      h("spacer", { flexGrow: 1 }),
      txt(c, { size: "xs", color: disabled ? c.textDisabled : c.textSecondary }, open ? "▲" : "▼"),
    ]);

    const body = open
      ? panel(c, {
          direction: "column",
          gap: space.md,
          alignItems: "start",
          padProps: pad({ t: 0, r: space.xl, b: space.xl, l: space.xl }),
        }, normalize(kids))
      : null;

    if (idx > 0) blocks.push(hline(c, { color: c.borderLighter }));
    blocks.push(panel(c, { direction: "column", gap: 0 }, [header, body]));
  });

  return panel(c, {
    direction: "column",
    gap: 0,
    bg: p.bordered === false ? null : c.surface,
    border: p.bordered === false ? null : c.borderLight,
    radius: radiusScale.md,
    width: p.width,
  }, blocks);
}
