import { escapeHtml as html } from './ui.js';

/* 商城参数筛选:URL 状态解析 / 过滤管道 / facet 计数 / 面板渲染与交互。
   筛选状态全部编码在 URL 中(链接跳转,支持前进/后退/分享);
   「更多/收起、组内搜索、多选勾选、区间输入」为客户端临时状态,不进入 URL。 */

const RESERVED_PARAMS = ['q', 'category', 'sub', 'brand', 'pkg', 'sort', 'range'];
const MORE_LIMIT = 8;        // 每组超过 8 个值时折叠
const ATTR_KEY_RATIO = 0.6;  // 规格键覆盖率阈值(未选子分类时只显示通用维度)
export const SORTS = [['default', '综合排序'], ['price-asc', '价格从低到高'], ['price-desc', '价格从高到低'], ['stock', '库存优先']];

/* 客户端临时 UI 状态(页面加载后保持,导航后重置) */
const ui = { expanded: new Set(), search: {}, multi: null, multiDraft: [], rangeDraft: {} };

/* ================= 数值维度识别与单位归一化(区间筛选) ================= */
const UNIT_DIMS = [
  { pF: 1e-12, nF: 1e-9, µF: 1e-6, uF: 1e-6, mF: 1e-3, F: 1 },
  { mΩ: 1e-3, Ω: 1, kΩ: 1e3, KΩ: 1e3, MΩ: 1e6 },
  { mV: 1e-3, V: 1, kV: 1e3 },
  { µA: 1e-6, uA: 1e-6, mA: 1e-3, A: 1 },
  { mW: 1e-3, W: 1, kW: 1e3 },
  { Hz: 1, kHz: 1e3, KHz: 1e3, MHz: 1e6, GHz: 1e9 },
];
/* 解析 "100 nF" / "1/10 W" / "±10%" 这类「数值+单位」;区间或复合文本返回 null */
function parseNumValue(v) {
  let s = String(v).trim();
  if (s.startsWith('±')) s = s.slice(1);
  let m = s.match(/^(-?\d+(?:\.\d+)?)\s*([^\d]+)$/);
  if (m) return { num: parseFloat(m[1]), unit: m[2].trim() };
  m = s.match(/^(\d+)\s*\/\s*(\d+)\s*([^\d]+)$/);
  if (m) return { num: parseFloat(m[1]) / parseFloat(m[2]), unit: m[3].trim() };
  return null;
}
/* 若该组全部值均为同一维度的数值,返回区间元信息,否则 null */
function detectNumeric(values) {
  if (values.length < 2) return null;
  const parsed = values.map(parseNumValue);
  if (parsed.some((x) => !x)) return null;
  for (const dim of UNIT_DIMS) {
    if (parsed.every(({ unit }) => unit in dim)) {
      const freq = new Map();
      for (const { unit } of parsed) freq.set(unit, (freq.get(unit) ?? 0) + 1);
      const units = [...freq.keys()].sort((a, b) => dim[a] - dim[b]);
      const defaultUnit = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return {
        units, defaultUnit,
        toBase: (num, unit) => num * dim[unit],
        norm: (val) => { const pv = parseNumValue(val); return pv ? pv.num * dim[pv.unit] : null; },
      };
    }
  }
  return null;
}

const specVal = (product, key) => product.specs.find(([k]) => k === key)?.[1] ?? '';

/* ================= URL 解析与构建 ================= */
export function parseFilters(searchParams) {
  const filters = { brand: [], pkg: [], attrs: {}, ranges: {} };
  for (const value of searchParams.getAll('brand')) filters.brand.push(value);
  for (const value of searchParams.getAll('pkg')) filters.pkg.push(value);
  for (const [key, value] of searchParams) {
    if (RESERVED_PARAMS.includes(key)) continue;
    (filters.attrs[key] ??= []).push(value);
  }
  for (const entry of searchParams.getAll('range')) {
    const match = entry.match(/^(.+):([^:]*):([^:]*):(.+)$/);
    if (match) filters.ranges[match[1]] = { minRaw: match[2], maxRaw: match[3], unit: match[4] };
  }
  return filters;
}

export function shopUrl({ query = '', category = '', sub = '', filters = null, sort = 'default' } = {}) {
  const search = new URLSearchParams();
  if (query) search.set('q', query);
  if (category) search.set('category', category);
  if (sub) search.set('sub', sub);
  if (filters) {
    for (const value of filters.brand) search.append('brand', value);
    for (const value of filters.pkg) search.append('pkg', value);
    for (const [key, values] of Object.entries(filters.attrs)) for (const value of values) search.append(key, value);
    for (const [key, range] of Object.entries(filters.ranges)) search.append('range', `${key}:${range.minRaw}:${range.maxRaw}:${range.unit}`);
  }
  if (sort !== 'default') search.set('sort', sort);
  const qs = search.toString();
  return qs ? `/shop/?${qs}` : '/shop/';   // 原始 URL:既用于 href(调用处转义),也用于 location.assign
}

const cloneFilters = (f) => ({
  brand: [...f.brand],
  pkg: [...f.pkg],
  attrs: Object.fromEntries(Object.entries(f.attrs).map(([key, values]) => [key, [...values]])),
  ranges: Object.fromEntries(Object.entries(f.ranges).map(([key, range]) => [key, { ...range }])),
});
const listOf = (filters, groupId) => groupId === 'brand' ? filters.brand : groupId === 'pkg' ? filters.pkg : (filters.attrs[groupId.slice(5)] ??= []);

/* 累积多选:点击已选值移除,点击新值追加;数值组离散选择与区间互斥 */
export function toggleValue(filters, groupId, value) {
  const next = cloneFilters(filters);
  const list = listOf(next, groupId);
  const at = list.indexOf(value);
  if (at >= 0) list.splice(at, 1); else list.push(value);
  if (groupId.startsWith('attr:') && list.length) delete next.ranges[groupId.slice(5)];
  return next;
}
export function setValues(filters, groupId, values) {
  const next = cloneFilters(filters);
  const key = groupId === 'brand' ? 'brand' : groupId === 'pkg' ? 'pkg' : groupId.slice(5);
  if (key === 'brand') next.brand = [...values];
  else if (key === 'pkg') next.pkg = [...values];
  else {
    next.attrs[key] = [...values];
    if (values.length) delete next.ranges[key];
  }
  return next;
}
export function withRange(filters, label, range) {
  const next = cloneFilters(filters);
  next.attrs[label] = [];
  next.ranges[label] = range;
  return next;
}
export function dropRange(filters, label) {
  const next = cloneFilters(filters);
  delete next.ranges[label];
  return next;
}
export const clearFacets = () => ({ brand: [], pkg: [], attrs: {}, ranges: {} });

/* ================= 过滤管道 ================= */
function buildGroups(base) {
  const withNumeric = (group) => {
    group.numeric = detectNumeric([...new Set(base.map(group.pick).filter(Boolean))]);
    return group;
  };
  const groups = [
    withNumeric({ id: 'brand', label: '品牌', pick: (p) => p.brand ?? '' }),
    withNumeric({ id: 'pkg', label: '封装', pick: (p) => p.package ?? '' }),
  ];
  const keyStats = new Map();
  for (const p of base) for (const [k] of p.specs) {
    if (k === '品牌' || k === '封装') continue;
    const s = keyStats.get(k) ?? { n: 0, vals: new Set() };
    s.n++; s.vals.add(specVal(p, k)); keyStats.set(k, s);
  }
  for (const [k, s] of keyStats) {
    if (base.length && s.n / base.length < ATTR_KEY_RATIO) continue;  // 覆盖率不足 → 与立创一致,选子分类后才出现参数行
    if (s.vals.size < 2) continue;
    groups.push(withNumeric({ id: 'attr:' + k, label: k, pick: (p) => specVal(p, k) }));
  }
  return groups;
}

export const selectedOf = (filters, g) =>
  g.id === 'brand' ? filters.brand : g.id === 'pkg' ? filters.pkg : (filters.attrs[g.label] ?? []);

function groupActiveFilter(product, g, filters) {
  const range = filters.ranges[g.label];
  if (range) {  // 区间筛选生效时按归一化数值比较
    const n = g.numeric ? g.numeric.norm(g.pick(product)) : null;
    return n !== null && n >= range.min && n <= range.max;
  }
  const sel = selectedOf(filters, g);
  return !sel.length || sel.includes(g.pick(product));
}

/* URL 中的区间原始值 → 归一化数值(仅保留有对应数值分组的键) */
function normalizeRanges(filters, groups) {
  const norm = {};
  for (const g of groups) {
    if (!g.numeric) continue;
    const raw = filters.ranges[g.label];
    if (!raw) continue;
    const minNum = parseFloat(raw.minRaw), maxNum = parseFloat(raw.maxRaw);
    if (Number.isNaN(minNum) && Number.isNaN(maxNum)) continue;
    const unit = g.numeric.units.includes(raw.unit) ? raw.unit : g.numeric.defaultUnit;
    norm[g.label] = {
      min: Number.isNaN(minNum) ? -Infinity : g.numeric.toBase(minNum, unit),
      max: Number.isNaN(maxNum) ? Infinity : g.numeric.toBase(maxNum, unit),
      minRaw: Number.isNaN(minNum) ? '' : String(raw.minRaw).trim(),
      maxRaw: Number.isNaN(maxNum) ? '' : String(raw.maxRaw).trim(),
      unit,
    };
  }
  return norm;
}

const priceOf = (p) => p.priceTiers[0].unitPriceMicros;
function sortItems(items, sort) {
  const list = [...items];
  if (sort === 'price-asc') list.sort((a, b) => priceOf(a) - priceOf(b));
  if (sort === 'price-desc') list.sort((a, b) => priceOf(b) - priceOf(a));
  if (sort === 'stock') list.sort((a, b) => b.stock - a.stock);
  return list;
}

export function computeShopView(products, { query = '', category = '', sub = '', searchParams }) {
  const parsed = parseFilters(searchParams);
  const sortId = searchParams.get('sort') ?? 'default';
  const sort = SORTS.some(([id]) => id === sortId) ? sortId : 'default';
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const base = products.filter((item) => {
    if (category && item.category !== category) return false;
    if (sub && item.subcategory !== sub) return false;
    const searchable = [item.sku, item.name, item.model].join(' ').toLowerCase();
    return terms.every((t) => searchable.includes(t));
  });
  const groups = buildGroups(base);
  const ranges = normalizeRanges(parsed, groups);
  const filters = { ...cloneFilters(parsed), ranges };
  /* facet 计数:各组在「其余筛选生效」的商品集内统计 */
  const facets = groups.map((g) => {
    const others = groups.filter((o) => o !== g);
    const candidates = base.filter((p) => others.every((o) => groupActiveFilter(p, o, filters)));
    const counts = new Map();
    for (const p of candidates) { const v = g.pick(p); if (v) counts.set(v, (counts.get(v) ?? 0) + 1); }
    const values = [...counts.entries()].map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, 'zh'));
    /* 已选值即使在交叉筛选后计数为 0,也保留在列表中(可单独移除) */
    for (const v of selectedOf(filters, g)) {
      if (!values.some((entry) => entry.value === v)) values.unshift({ value: v, count: counts.get(v) ?? 0 });
    }
    return { group: g, values };
  }).filter((f) => f.values.length >= 2 || selectedOf(filters, f.group).length || filters.ranges[f.group.label]);
  const matched = base.filter((p) => facets.every((f) => groupActiveFilter(p, f.group, filters)));
  return { query, category, sub, filters, sort, base, groups, facets, result: sortItems(matched, sort) };
}

/* ================= 渲染 ================= */
const facetHref = (view, groupId, value) =>
  shopUrl({ query: view.query, category: view.category, sub: view.sub, filters: toggleValue(view.filters, groupId, value), sort: view.sort });

function rangeFormHtml(view, g) {
  const active = view.filters.ranges[g.label];
  const draft = ui.rangeDraft[g.label] ?? (active ? { min: active.minRaw, max: active.maxRaw, unit: active.unit } : { min: '', max: '', unit: g.numeric.defaultUnit });
  return `<span class="facet-range">
    <span class="facet-range-label">自定义</span>
    <input type="text" inputmode="decimal" data-range-min placeholder="最小" value="${html(draft.min)}" aria-label="${html(g.label)}区间最小值">
    <span aria-hidden="true">–</span>
    <input type="text" inputmode="decimal" data-range-max placeholder="最大" value="${html(draft.max)}" aria-label="${html(g.label)}区间最大值">
    ${g.numeric.units.length > 1
      ? `<select data-range-unit aria-label="${html(g.label)}单位">${g.numeric.units.map((u) => `<option value="${html(u)}"${u === draft.unit ? ' selected' : ''}>${html(u)}</option>`).join('')}</select>`
      : `<span class="facet-range-unit">${html(draft.unit)}</span>`}
    <button type="button" class="facet-op" data-range-ok>确定</button>
    ${active ? `<a class="facet-op" href="${html(shopUrl({ query: view.query, category: view.category, sub: view.sub, filters: dropRange(view.filters, g.label), sort: view.sort }))}">清除</a>` : ''}
  </span>`;
}

function facetGroupHtml(view, f) {
  const g = f.group;
  const sel = selectedOf(view.filters, g);
  const isMulti = ui.multi === g.id;
  const q = (ui.search[g.id] ?? '').trim().toLowerCase();
  const expandable = !isMulti && f.values.length > MORE_LIMIT;
  const expanded = ui.expanded.has(g.id);
  const searchable = !isMulti && !g.numeric && f.values.length > 5;   // 离散长列表提供组内搜索
  const valuesHtml = isMulti
    ? f.values.map(({ value, count }) => `<label class="facet-check"><input type="checkbox" value="${html(value)}"${ui.multiDraft.includes(value) ? ' checked' : ''}><span>${html(value)}</span><span class="count">${count}</span></label>`).join('')
    : f.values.map(({ value, count }, i) => {
        const on = sel.includes(value);
        const hiddenBySearch = q && !value.toLowerCase().includes(q);
        const hiddenByMore = i >= MORE_LIMIT && !expanded;
        return `<a class="facet-value" href="${html(facetHref(view, g.id, value))}"${on ? ' aria-current="true"' : ''}${hiddenBySearch || hiddenByMore ? ' data-hidden="true"' : ''}>${html(value)}<span class="count">${count}</span></a>`;
      }).join('') + (g.numeric ? rangeFormHtml(view, g) : '');
  const ops = isMulti ? '' : `
    ${searchable ? `<input type="search" class="facet-search" data-search="${html(g.id)}" placeholder="搜索${html(g.label)}" value="${html(ui.search[g.id] ?? '')}" aria-label="在${html(g.label)}筛选值中搜索">` : ''}
    ${expandable ? `<button type="button" class="facet-op" data-more="${html(g.id)}">${expanded ? '收起' : '更多'}</button>` : ''}
    <button type="button" class="facet-op${sel.length > 1 || view.filters.ranges[g.label] ? ' is-on' : ''}" data-multi="${html(g.id)}">多选</button>`;
  const confirm = isMulti ? `
    <div class="facet-confirm">
      <button type="button" class="button button-primary" data-ok>确定</button>
      <button type="button" class="cancel" data-cancel>取消</button>
    </div>` : '';
  return `<div class="facet-group${isMulti ? ' is-multi' : ''}" data-group="${html(g.id)}">
    <span class="facet-label">${html(g.label)}</span>
    <div class="facet-values">${valuesHtml}</div>
    <div class="facet-ops">${ops}</div>
    ${confirm}
  </div>`;
}

export function facetPanelHTML(view) {
  const visible = view.facets.filter((f) => f.values.length >= 2 || selectedOf(view.filters, f.group).length || view.filters.ranges[f.group.label]);
  if (!visible.length) return '';
  return `<section class="facet-panel" aria-label="参数筛选">${visible.map((f) => facetGroupHtml(view, f)).join('')}</section>`;
}

export function chipsBarHTML(view) {
  const chips = [];
  for (const f of view.facets) {
    for (const v of selectedOf(view.filters, f.group)) {
      chips.push(`<span class="chip"><span>${html(f.group.label)}：${html(v)}</span><a class="chip-x" href="${html(facetHref(view, f.group.id, v))}" aria-label="移除筛选 ${html(f.group.label)} ${html(v)}">×</a></span>`);
    }
    const range = view.filters.ranges[f.group.label];
    if (range) {
      const text = `${range.minRaw || '≥'} – ${range.maxRaw || '≤'} ${range.unit}`;
      chips.push(`<span class="chip"><span>${html(f.group.label)}：${html(text)}</span><a class="chip-x" href="${html(shopUrl({ query: view.query, category: view.category, sub: view.sub, filters: dropRange(view.filters, f.group.label), sort: view.sort }))}" aria-label="移除筛选 ${html(f.group.label)} ${html(text)}">×</a></span>`);
    }
  }
  if (!chips.length) return '';
  const clearHref = shopUrl({ category: view.category, sub: view.sub, sort: view.sort });
  return `<div class="active-chips"><span class="active-chips-label">已选条件</span>${chips.join('')}
    <a class="chips-clear" href="${html(clearHref)}">清空筛选</a></div>`;
}

export function sortBarHTML(view) {
  return `<nav class="sort-bar" aria-label="排序方式">${SORTS.map(([id, name]) =>
    `<a href="${html(shopUrl({ query: view.query, category: view.category, sub: view.sub, filters: view.filters, sort: id }))}"${view.sort === id ? ' aria-current="page"' : ''}>${name}</a>`).join('')}</nav>`;
}

/* ================= 交互(多选 / 更多 / 组内搜索 / 区间输入) ================= */
function applyHiddenState(groupEl, gid) {
  const expanded = ui.expanded.has(gid);
  const q = (ui.search[gid] ?? '').trim().toLowerCase();
  groupEl.querySelectorAll('.facet-value').forEach((el, i) => {
    const miss = q && !(el.textContent || '').toLowerCase().includes(q);
    if (miss || (i >= MORE_LIMIT && !expanded && !q)) el.setAttribute('data-hidden', 'true');
    else el.removeAttribute('data-hidden');
  });
}

export function bindFacetPanel(panel, view, rerender) {
  if (!panel) return;
  panel.addEventListener('click', (e) => {
    const more = e.target.closest('[data-more]');
    if (more) {
      const gid = more.dataset.more;
      ui.expanded.has(gid) ? ui.expanded.delete(gid) : ui.expanded.add(gid);
      more.textContent = ui.expanded.has(gid) ? '收起' : '更多';
      applyHiddenState(more.closest('.facet-group'), gid);
      return;
    }
    const multi = e.target.closest('[data-multi]');
    if (multi) {
      ui.multi = multi.dataset.multi;
      ui.multiDraft = [...selectedOf(view.filters, view.groups.find((g) => g.id === ui.multi))];
      rerender();
      return;
    }
    if (e.target.closest('[data-cancel]')) { ui.multi = null; ui.multiDraft = []; rerender(); return; }
    if (e.target.closest('[data-ok]')) {
      const filters = setValues(view.filters, ui.multi, ui.multiDraft);
      window.location.assign(shopUrl({ query: view.query, category: view.category, sub: view.sub, filters, sort: view.sort }));
      return;
    }
    const rangeOk = e.target.closest('[data-range-ok]');
    if (rangeOk) {
      const groupEl = rangeOk.closest('.facet-group');
      const g = view.groups.find((x) => x.id === groupEl.dataset.group);
      const draft = ui.rangeDraft[g.label] ?? { min: '', max: '', unit: g.numeric.defaultUnit };
      const minNum = parseFloat(draft.min), maxNum = parseFloat(draft.max);
      if (Number.isNaN(minNum) && Number.isNaN(maxNum)) return;   // 至少填一端
      const range = { minRaw: Number.isNaN(minNum) ? '' : draft.min.trim(), maxRaw: Number.isNaN(maxNum) ? '' : draft.max.trim(), unit: draft.unit };
      window.location.assign(shopUrl({ query: view.query, category: view.category, sub: view.sub, filters: withRange(view.filters, g.label, range), sort: view.sort }));
    }
  });
  panel.addEventListener('input', (e) => {
    const searchBox = e.target.closest('.facet-search');
    if (searchBox) {
      ui.search[searchBox.dataset.search] = searchBox.value;
      applyHiddenState(searchBox.closest('.facet-group'), searchBox.dataset.search);
      return;
    }
    const rangeInput = e.target.closest('[data-range-min], [data-range-max]');
    if (rangeInput) {
      const g = view.groups.find((x) => x.id === rangeInput.closest('.facet-group').dataset.group);
      const draft = ui.rangeDraft[g.label] ?? { min: '', max: '', unit: g.numeric.defaultUnit };
      if (rangeInput.hasAttribute('data-range-min')) draft.min = rangeInput.value;
      else draft.max = rangeInput.value;
      ui.rangeDraft[g.label] = draft;
    }
  });
  panel.addEventListener('change', (e) => {
    const check = e.target.closest('.facet-check input');
    if (check && ui.multi) {
      ui.multiDraft = check.checked ? [...ui.multiDraft, check.value] : ui.multiDraft.filter((x) => x !== check.value);
      return;
    }
    const unitSel = e.target.closest('[data-range-unit]');
    if (unitSel) {
      const g = view.groups.find((x) => x.id === unitSel.closest('.facet-group').dataset.group);
      const draft = ui.rangeDraft[g.label] ?? { min: '', max: '', unit: unitSel.value };
      draft.unit = unitSel.value;
      ui.rangeDraft[g.label] = draft;
    }
  });
  panel.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const rangeInput = e.target.closest('[data-range-min], [data-range-max]');
    if (!rangeInput) return;
    e.preventDefault();
    rangeInput.closest('.facet-group').querySelector('[data-range-ok]')?.click();
  });
}
