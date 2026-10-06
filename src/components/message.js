// GxMessage — 命令式消息提示 (Element Plus 的 ElMessage)
//
// 内核的 <toast> 固定右上角且只吃 message/level。GxMessage 提供:
//   - 居顶居中显示、可堆叠、自动消失 (缺省 3000ms)
//   - type: success | warning | danger | info
//   - 用法: const close = GxMessage("已保存", {type: "success"})
//           close() 可提前手动关
//
// 实现是用户态 overlay: 一个模块级 signal 管消息列表, GxMessageHost
// 渲染在应用根; 没挂 Host 时静默退化为 console.log。

import { h } from "gx/gfx";
import { createSignal } from "gx/solid";
import { palette, typeTone, typeTint } from "../theme.js";

// 用工厂封装: 避免模块加载顺序问题 (createSignal 在顶层立即执行,
// 若 solid 模块尚初始化会抛错 —— 延迟到首次调用时再建 signal)。
let _messages = null, _setMessages = null;
let nextId = 1;

const ensureState = () => {
  if (_messages === null) {
    const [m, s] = createSignal([]);
    _messages = m; _setMessages = s;
  }
}
;
const push = (text, opts) => {
  ensureState();
  const id = nextId++;
  const msg = { id, text, type: (opts && opts.type) || "info", duration: (opts && opts.duration !== undefined) ? opts.duration : 3000 };
  _setMessages(_messages().concat([msg]));
  if (msg.duration > 0) {
    setTimeout(() => dismiss(id), msg.duration);
  }
  return () => dismiss(id);
}
;
const dismiss = (id) => {
  if (_messages === null) return;
  _setMessages(_messages().filter((m) => m.id !== id));
}
;
export function GxMessage(text, opts) { return push(text, opts); }
GxMessage.success = (t, o) => push(t, { ...o, type: "success" });
GxMessage.warning = (t, o) => push(t, { ...o, type: "warning" });
GxMessage.error   = (t, o) => push(t, { ...o, type: "danger" });
GxMessage.info    = (t, o) => push(t, { ...o, type: "info" });

// GxMessageHost — 挂在应用根部的消息渲染器
export function GxMessageHost() {
  const c = palette();
  ensureState();

  const render = () => {
    const list = _messages();
    if (!list || list.length === 0) return null;
    return h("column", {
      position: "absolute", left: 0, right: 0, top: 12,
      alignItems: "center", gap: 8, escapeClipping: true, zIndex: 900,
    },
      ...list.map((m) => {
        const toneKey = typeTone[m.type] || "info";
        const tintKey = typeTint[m.type] || "infoLight9";
        return h("rect", {
          background: c.bgOverlay, radius: 4,
          border: c[toneKey], padding: 9, paddingLeft: 14, paddingRight: 14,
          shadow: { x: 0, y: 4, blur: 12, color: c.shadowPopup },
          onClick: () => dismiss(m.id),
        },
          h("row", { gap: 8, alignItems: "center" },
            h("rect", { width: 6, height: 6, radius: 3, background: c[toneKey] }),
            h("text", { font: 13, color: c[toneKey] }, m.text)));
      }));
  };

  // 函数子节点 = 响应式: messages 变化自动重渲染
  return h("view", null, render);
}
