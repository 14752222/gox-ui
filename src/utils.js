// 公共工具 —— 所有组件共享的几个小约定
//
//   1. mergeProps      后者胜, 但事件回调**链式合并** (用户回调不被组件默认行为吞掉)
//   2. flattenChildren children 摊平, 丢掉空值, 函数子节点 (响应式) 原样保留
//   3. resolveVal      prop 可能是函数 (响应式写法), 统一解包
//   4. pickValue       受控组件的"读当前值"一行搞定 (value / model 两种写法都认)

import { isDarkMode as themeIsDark } from "./theme.js";

// mergeProps 链式合并: 同名事件 (on*) 两个都是函数时都执行, 其余后者胜。
export function mergeProps(...sources) {
  const out = {};
  for (const src of sources) {
    if (!src) continue;
    for (const k in src) {
      const v = src[k];
      if (v === undefined) continue;
      if (k.startsWith("on") && typeof v === "function" && typeof out[k] === "function") {
        const prev = out[k];
        out[k] = (...a) => { prev(...a); v(...a); };
      } else {
        out[k] = v;
      }
    }
  }
  return out;
}

// flattenChildren 摊平 children: 数组层层展开, null/undefined/false 丢弃,
// 函数子节点原样保留 (渲染层约定: 函数子节点 = 响应式 computed)。
export function flattenChildren(children) {
  const out = [];
  const walk = (c) => {
    if (c === null || c === undefined || c === false || c === true || c === "") return;
    if (Array.isArray(c)) { for (const x of c) walk(x); return; }
    out.push(c);
  };
  const list = (children === null || children === undefined) ? [] : children;
  for (let i = 0; i < list.length; i++) walk(list[i]);
  return out;
}

// firstChild 取第一个非空子节点 (单子容器用)。
export function firstChild(children) {
  const flat = flattenChildren(children);
  return flat.length > 0 ? flat[0] : null;
}

// resolveVal 解包: prop 可能是函数 (响应式), 统一取当前值。
export function resolveVal(v) { return typeof v === "function" ? v() : v; }

// pickValue 读受控值: 支持 [get, set] 二元组 (内核 model 指令的形式)、
// signal (getter 函数)、或裸值。返回 { has, value }。
export function pickValue(p, key) {
  const k = key || "value";
  const raw = p[k];
  if (raw === undefined) return { has: false, value: undefined };
  if (Array.isArray(raw) && raw.length === 2) return { has: true, value: resolveVal(raw[0]) };
  return { has: true, value: resolveVal(raw) };
}

// px 恒等函数 (保留 v0.1 的导出, 组件里用于表意)。
export function px(n) { return n; }

// isDarkMode 是否深色模式 —— 转发到 theme 的判定 (读内核 current().text 亮度)。
export function isDarkMode() { return themeIsDark(); }
