// 公共工具: props 合并、子节点规整、事件合成
// 所有组件共享的三个小约定:
//   1. mergeProps: 后面的覆盖前面的, 事件回调链式合并 (不覆盖)。
//   2. flattenChildren: children 里嵌数组/嵌 JSX → 摊平成元素数组;
//      函数子节点 (响应式 computed) 原样保留, 由渲染层解释。
//   3. cls/px: 微型样式帮手。

// 链式合并 props: 同名事件 (on*) 不覆盖而是都执行; 其余后者胜。
// 这样 <GxButton onClick={...}/> 的用户回调不会被组件内部默认行为吞掉。
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

// 摊平 children: 数组层层展开, null/undefined/false 被丢弃,
// 函数子节点原样保留 (渲染层约定: 函数子节点 = 响应式 computed)。
export function flattenChildren(children) {
  const out = [];
  const walk = (c) => {
    if (c === null || c === undefined || c === false || c === "") return;
    if (Array.isArray(c)) { for (const x of c) walk(x); return; }
    out.push(c);
  };
  // children 是 arguments 对象或数组 (函数组件签名 Comp(props, ...children))
  for (let i = 0; i < children.length; i++) walk(children[i]);
  return out;
}

// 取第一个非空子节点 (单子容器用: card 宿主、dialog 卡片等)
export function firstChild(children) {
  const flat = flattenChildren(children);
  return flat.length > 0 ? flat[0] : null;
}

// px 数值帮手: 传数字按像素, 传字符串原样
export function px(n) { return typeof n === "number" ? n : n; }

// 是否深色模式 (与 theme.js 的 palette() 同一判定)
export function isDarkMode() {
  return typeof isDark === "function" && isDark();
}

// resolveVal: prop 值可能是函数 (响应式写法 value={() => sig()}), 统一解包。
export function resolveVal(v) {
  return typeof v === "function" ? v() : v;
}
