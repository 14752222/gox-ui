// GxLoading — 加载指令 (Element Plus 的 v-loading)
//   GxLoadingHost: 挂根部, 配合 loadingState signal
//   useLoading(): 返回 [isLoading, setLoading]

import { h } from "gx/gfx";
import { createSignal } from "gx/solid";
import { palette } from "../theme.js";

const [loading, setLoading] = createSignal(false);

export function useLoading() {
  return [() => loading(), setLoading];
}

export function GxLoadingHost() {
  const c = palette();
  return h("view", null, () => {
    if (!loading()) return null;
    return h("rect", {
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
      background: c.maskColor, zIndex: 999, escapeClipping: true,
    },
      h("column", { alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
        h("spinner", { size: 28, color: c.primary }),
        h("text", { font: 13, color: "#ffffffff" }, "加载中...")));
  });
}
