// GxLoading —— 全屏加载 (Element Plus 的 v-loading)
//
//   GxLoadingHost 挂应用根部; useLoading() 返回 [isLoading, setLoading]
//
// 遮罩用 column 而不是 rect: 内核 layoutStack 会给它分配内容布局,
// rect 只把子节点摆在左上角 (styles.js 顶部有完整说明)。

import { h } from "gx/gfx";
import { createSignal } from "gx/solid";
import { palette, space } from "../theme.js";

const [loading, setLoading] = createSignal(false);

export function useLoading() {
  return [() => loading(), setLoading];
}

export function GxLoadingHost() {
  const c = palette();
  return h("view", null, () => {
    if (!loading()) return null;
    return h("column", {
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
      background: c.mask, zIndex: 999, escapeClipping: true,
      alignItems: "center", justifyContent: "center",
    },
      h("column", {
        bg: c.surface, radius: 10, padding: space["2xl"],
        alignItems: "center", justifyContent: "center", gap: space.lg,
      },
        h("spinner", { size: 28, color: c.primary }),
        h("text", { font: 13, color: c.textRegular }, "加载中...")));
  });
}
