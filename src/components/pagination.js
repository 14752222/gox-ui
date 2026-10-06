// GxPagination — 分页器 (包装内核 pagination)
//   total / pageSize / current / onChange

import { h } from "gx/gfx";

export function GxPagination(props) {
  const p = props || {};
  const pp = {
    total: p.total || 0,
    pageSize: p.pageSize || 10,
    current: p.current,
  };
  if (p.onChange) pp.onChange = p.onChange;
  return h("pagination", pp);
}
