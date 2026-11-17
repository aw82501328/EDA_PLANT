import { company } from '../data/company.js';
import { categories } from '../data/catalog.js';
import { MICROS_PER_YUAN, quoteProduct } from './pricing.js';

const glyphs = {
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4" rx="0.6"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5"/>',
  circuit: '<path d="M6 7h9l3 3v4m-12 3h6l3-3h3"/><circle cx="4" cy="7" r="2"/><circle cx="4" cy="17" r="2"/><circle cx="19" cy="16" r="2"/>',
  tool: '<path d="M14.7 6.3a4.5 4.5 0 0 0-5.5 5.5l-5.8 5.8a2.1 2.1 0 0 0 3 3l5.8-5.8a4.5 4.5 0 0 0 5.5-5.5L15 12l-3-3 2.7-2.7Z"/><path d="m15 4 5 5"/>',
  search: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5"/>',
  cart: '<path d="M2.5 4h2l2.4 10.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H5.3"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M6 12h12m-6-6v12"/>',
  file: '<path d="M13 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9l-6-6Z"/><path d="M13 3v6h6M8 13h8m-8 4h6"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  restart: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
};

export function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[name]}</svg>`;
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

const yuan = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' });
const yuanPerUnit = new Intl.NumberFormat('zh-CN', {
  style: 'currency', currency: 'CNY', minimumFractionDigits: 2, maximumFractionDigits: 6,
});
export const money = (price) => yuan.format(price / 100);
export const unitMoney = (micros) => yuanPerUnit.format(micros / MICROS_PER_YUAN);
export const productUrl = (sku) => `/shop/product/?sku=${encodeURIComponent(sku)}`;
export const articleUrl = (slug) => `/learn/article/?slug=${encodeURIComponent(slug)}`;
export const categoryUrl = (id) => `/shop/?category=${encodeURIComponent(id)}`;
export const orderUrl = (id) => `/order/?id=${encodeURIComponent(id)}`;
export const categoryName = (id) => categories.find((entry) => entry.id === id)?.name ?? '';

const navigation = [
  ['home', '/', '首页'], ['services', '/services/', 'EDA 工程服务'], ['training', '/training/', '培训服务'],
  ['shop', '/shop/', '硬件商城'], ['learn', '/learn/', '技术分享'], ['about', '/about/', '关于我们'],
];

function brand() {
  return `<a class="brand" href="/" aria-label="${escapeHtml(company.name)} 首页">
    <span class="brand-mark">${icon('chip')}</span>
    <span>${escapeHtml(company.brandName)}</span>
  </a>`;
}

export function searchForm({ query = '', category = '', compact = false } = {}) {
  const label = compact ? '全站商品搜索' : '商城商品搜索';
  return `<form class="search-form ${compact ? 'search-compact' : ''}" action="/shop/" method="get" role="search" aria-label="${label}">
    ${category ? `<input type="hidden" name="category" value="${escapeHtml(category)}">` : ''}
    <input type="search" name="q" value="${escapeHtml(query)}" placeholder="搜索名称、型号或编号" aria-label="搜索商品名称、型号或编号">
    <button type="submit" aria-label="搜索商品">${icon('search')}${compact ? '' : '<span>搜索</span>'}</button>
  </form>`;
}

export function header(page) {
  const section = ({ article: 'learn', product: 'shop' })[page] ?? page;
  return `<div class="wrap header-inner">
    ${brand()}
    <nav class="top-nav" aria-label="主导航">
      ${navigation.map(([key, url, label]) => `<a href="${url}"${key === section ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <div class="header-actions">
      ${searchForm({ compact: true })}
      <a class="header-orders" href="/orders/" aria-label="我的订单"><span class="icon-wrap">${icon('file')}</span><span class="orders-label">我的订单</span></a>
      <a class="header-cart" href="/cart/" aria-label="购物车"><span class="icon-wrap">${icon('cart')}</span><span class="cart-label">购物车</span><span id="cart-count" class="cart-count">0</span></a>
      <button id="restart-service" class="header-restart" type="button" aria-label="重启服务" title="重启服务">${icon('restart')}</button>
    </div>
  </div>`;
}

export function footer() {
  return `<div class="wrap footer-inner">
    <div>${brand()}<p>PCB 设计、EDA 培训与硬件商城一站式服务。</p></div>
    <nav aria-label="页脚导航">
      ${navigation.slice(1).map(([, url, label]) => `<a href="${url}">${label}</a>`).join('')}
      <a href="/cart/">购物车</a>
      <a href="/orders/">我的订单</a>
    </nav>
  </div>`;
}

export function breadcrumbs(trail) {
  return `<nav class="breadcrumbs" aria-label="当前位置"><ol>
    <li><a href="/">首页</a></li>
    ${trail.map(([label, url]) => `<li>${icon('chevron')}${url ? `<a href="${url}">${escapeHtml(label)}</a>` : `<span aria-current="page">${escapeHtml(label)}</span>`}</li>`).join('')}
  </ol></nav>`;
}

export function linkArrow(label, url) {
  return `<a class="link-arrow" href="${url}">${label}${icon('arrow')}</a>`;
}

export function sectionHeading(title, action = '') {
  return `<div class="section-heading"><h2>${title}</h2>${action}</div>`;
}

export function articleCard(article) {
  return `<article class="article-card">
    <a href="${articleUrl(article.slug)}">
      <div class="article-image${article.imageType === 'product' ? ' article-image-product' : ''}"><img src="${article.image}" alt="${escapeHtml(article.imageAlt)}" loading="lazy"></div>
      <div class="article-card-body">
        <div class="article-meta"><span>${article.category}</span><span>${article.minutes} 分钟阅读</span></div>
        <h3>${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.summary)}</p>
        <span class="card-action">阅读文章 ${icon('arrow')}</span>
      </div>
    </a>
  </article>`;
}

export function productCard(product) {
  return `<article class="product-card">
    <a href="${productUrl(product.sku)}">
      <div class="product-image"><img src="${product.image}" alt="${escapeHtml(product.name)}示意图" loading="lazy"></div>
      <div class="product-card-body">
        <span class="sku">${product.sku}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <div class="product-card-bottom"><span class="price">${unitMoney(quoteProduct(product, 1).unitPriceMicros)}</span><span class="product-arrow">${icon('arrow')}</span></div>
      </div>
    </a>
  </article>`;
}

export function emptyState(title, message, action) {
  return `<section class="empty-state"><h2>${title}</h2><p>${message}</p>${action}</section>`;
}
