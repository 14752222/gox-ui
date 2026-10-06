// GxDivider —— Element Plus 风格分隔线 (el-divider)
//
//   vertical           纵向 (row 里当竖线用)
//   contentPosition    left | center | right (带文字时; 缺省 center)
//   marginY            无文字时的上下留白 (缺省 16)
//   thickness          线宽 (缺省 1)
//
// 带文字的形态是 row [线] [字] [线], 两条线 flexGrow=1 均分剩余宽。

import { h } from "gx/gfx";
import { palette, space } from "../theme.js";
import { txt } from "../styles.js";
import { flattenChildren } from "../utils.js";

export function GxDivider(props, ...children) {
  const p = props || {};
  const c = palette();
  const kids = flattenChildren(children);
  const thickness = p.thickness !== undefined ? p.thickness : 1;

  if (p.vertical) {
    return h("separator", {
      vertical: true,
      height: p.height !== undefined ? p.height : 14,
      width: thickness,
      background: c.borderLight,
    });
  }

  if (kids.length === 0 || !p.contentPosition) {
    return h("separator", {
      background: c.borderLight,
      height: thickness,
      marginTop: p.marginY !== undefined ? p.marginY : space.xl,
      marginBottom: p.marginY !== undefined ? p.marginY : space.xl,
    });
  }

  const line = (props2) => h("column", Object.assign({ height: thickness, flexGrow: 1, background: c.borderLight }, props2 || {}));
  const label = txt(c, { size: "sm", color: c.textSecondary }, kids[0]);

  if (p.contentPosition === "left") {
    return h("row", { gap: space.lg, alignItems: "center", width: "100%" }, [
      h("column", { height: thickness, width: space.xl, background: c.borderLight }),
      label,
      line(),
    ]);
  }
  if (p.contentPosition === "right") {
    return h("row", { gap: space.lg, alignItems: "center", width: "100%" }, [
      line(),
      label,
      h("column", { height: thickness, width: space.xl, background: c.borderLight }),
    ]);
  }
  return h("row", { gap: space.lg, alignItems: "center", width: "100%" }, [
    line(), label, line(),
  ]);
}
