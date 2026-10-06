// GxMessage —— 命令式消息提示 (Element Plus 的 ElMessage)
//
//   GxMessage("已保存")                       → info
//   GxMessage.success("保存成功")
//   GxMessage.warning(...) / .error(...) / .info(...)
//   返回 close 函数, close() 提前手动关
//   { duration: 0 } 不自动消失
//
// 实现: 模块级 signal 管消息列表, GxMessageHost 渲染在应用根 (顶部居中、
// 可堆叠)。没挂 Host 时静默退化为 console.log。
//
// 【注意】这里的内部函数必须是 `const fn = () => {}` 形式 —— Gox 内核
// 非 export 的 function 声明访问不到 import 绑定 (createSignal 会
// ReferenceError), 箭头函数没这个 bug。

import { h } from "gx/gfx";
import { createSignal } from "gx/solid";
import { palette, toneOf, typeIcon, space, radius as radiusScale, shadow as shadowSpec } from "../theme.js";
import { panel, txt } from "../styles.js";

let _messages = null, _setMessages = null;
let nextId = 1;

const ensureState = () => {
  if (_messages === null) {
    const [m, s] = createSignal([]);
    _messages = m; _setMessages = s;
  }
};

const dismiss = (id) => {
  if (_messages === null) return;
  _setMessages(_messages().filter((m) => m.id !== id));
};

const push = (text, opts) => {
  ensureState();
  if (typeof console === "undefined" || !console) return () => {};
  const id = nextId++;
  const o = opts || {};
  const msg = {
    id,
    text,
    type: o.type || "info",
    duration: o.duration !== undefined ? o.duration : 3000,
  };
  _setMessages(_messages().concat([msg]));
  if (msg.duration > 0) {
    setTimeout(() => dismiss(id), msg.duration);
  }
  return () => dismiss(id);
};

export function GxMessage(text, opts) { return push(text, opts); }
GxMessage.success = (t, o) => push(t, Object.assign({}, o, { type: "success" }));
GxMessage.warning = (t, o) => push(t, Object.assign({}, o, { type: "warning" }));
GxMessage.error   = (t, o) => push(t, Object.assign({}, o, { type: "danger" }));
GxMessage.info    = (t, o) => push(t, Object.assign({}, o, { type: "info" }));

// GxMessageHost —— 挂应用根部的消息渲染器 (顶部居中, 响应式)。
export function GxMessageHost() {
  const c = palette();
  ensureState();

  const render = () => {
    const list = _messages();
    if (!list || list.length === 0) return null;
    return h("column", {
      position: "absolute", left: 0, right: 0, top: 16,
      alignItems: "center", gap: space.md, escapeClipping: true, zIndex: 900,
    },
      ...list.map((m) => {
        const tone = toneOf(c, m.type);
        const iconName = typeIcon[m.type] || "chat";
        return panel(c, {
          direction: "row",
          gap: space.md,
          alignItems: "center",
          bg: c.surface,
          border: c.borderLight,
          radius: radiusScale.base,
          shadow: shadowSpec(c, "lg"),
          padProps: { padding: space.lg, paddingLeft: space.xl, paddingRight: space.xl },
          extra: { onClick: () => dismiss(m.id) },
        }, [
          h("icon", { name: iconName, size: 15, color: tone.fg }),
          txt(c, { size: "base", color: c.textPrimary }, m.text),
        ]);
      }));
  };

  return h("view", null, render);
}
