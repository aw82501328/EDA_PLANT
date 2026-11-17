import { cartItems, changeQuantity, placeOrder, readState, removeItem, sampleRecipient, totalOf } from './store.js';
import { MICROS_PER_CENT } from './pricing.js';
import { breadcrumbs, emptyState, escapeHtml as html, icon, linkArrow, money, orderUrl, productUrl, unitMoney } from './ui.js';

const shopLink = '<a class="button button-primary" href="/shop/">浏览商城</a>';
const orderDate = (iso) => new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

function emptyCart(orders, title) {
  const previous = orders.length ? linkArrow('查看我的订单', '/orders/') : '';
  return emptyState(title, '从硬件商城添加需要的商品，即可继续下单。', `<div class="button-row">${shopLink}${previous}</div>`);
}

function pageFrame(main, title, trail, content) {
  main.innerHTML = `<div class="wrap inner-page">
    ${breadcrumbs(trail)}
    <div class="page-heading"><h1>${title}</h1></div>
    ${content}
  </div>`;
}

function lineItem(item, editable = false) {
  const name = html(item.name);
  const image = html(item.image);
  const sku = html(item.sku);
  const unitPrice = item.unitPriceMicros ?? item.price * MICROS_PER_CENT;
  const subtotal = item.lineTotalCents ?? item.quantity * item.price;
  return `<li class="line-item">
    <a class="line-image" href="${productUrl(item.sku)}" aria-label="查看 ${name}"><img src="${image}" alt=""></a>
    <div class="line-description"><a class="line-name" href="${productUrl(item.sku)}">${name}</a><span class="sku">${sku}</span><span class="unit-price">${unitMoney(unitPrice)} / 件</span></div>
    ${editable ? `<div class="line-tools">
      <div class="quantity-stepper" role="group" aria-label="${name}数量">
        <button type="button" data-action="subtract" data-sku="${sku}" aria-label="减少 ${name} 数量" ${item.quantity === 1 ? 'disabled' : ''}>${icon('minus')}</button>
        <span aria-label="数量">${item.quantity}</span>
        <button type="button" data-action="add" data-sku="${sku}" aria-label="增加 ${name} 数量" ${item.quantity >= item.stock ? 'disabled' : ''}>${icon('plus')}</button>
      </div>
      <button type="button" class="text-button" data-action="remove" data-sku="${sku}" aria-label="删除 ${name}">删除</button>
    </div>` : `<span class="line-count">× ${item.quantity}</span>`}
    <span class="line-subtotal">${money(subtotal)}</span>
  </li>`;
}

function summary(items, total, action = '') {
  return `<aside class="summary-card" aria-labelledby="summary-title">
    <h2 id="summary-title">金额明细</h2>
    <dl><div><dt>商品金额（${items.reduce((count, item) => count + item.quantity, 0)} 件）</dt><dd>${money(total)}</dd></div>
    <div><dt>运费</dt><dd>${money(0)}</dd></div>
    <div class="summary-total"><dt>合计</dt><dd class="price">${money(total)}</dd></div></dl>
    ${action}
  </aside>`;
}

export function cart(main, refreshCount) {
  const state = readState();
  const items = cartItems(state.cart);
  pageFrame(main, '购物车', [['购物车']], items.length ? `<div class="commerce-layout">
    <section class="order-lines" aria-label="购物车商品">
      <h2>已选商品</h2><ul>${items.map((item) => lineItem(item, true)).join('')}</ul>
      <p id="cart-feedback" class="feedback" role="status"></p>
    </section>
    ${summary(items, totalOf(items), `<a class="button button-primary button-block" href="/checkout/">去结算 ${icon('arrow')}</a>`)}
  </div>` : emptyCart(state.orders, '购物车还是空的'));

  const lines = main.querySelector('.order-lines');
  if (!lines) return;
  let busy = false;
  lines.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || busy) return;
    const { action, sku } = button.dataset;
    busy = true;
    lines.setAttribute('aria-busy', 'true');
    try {
      const updated = action === 'remove' ? await removeItem(sku) : await changeQuantity(sku, action === 'add' ? 1 : -1);
      refreshCount(updated);
      cart(main, refreshCount);
      const remainingButtons = [...main.querySelectorAll('button[data-action]:enabled')];
      const target = remainingButtons.find((control) => control.dataset.sku === sku && control.dataset.action === action)
        ?? remainingButtons.find((control) => control.dataset.sku === sku)
        ?? remainingButtons[0]
        ?? main.querySelector('.empty-state .button');
      target?.focus({ preventScroll: true });
    } catch (error) {
      const feedback = main.querySelector('#cart-feedback');
      feedback.dataset.state = 'error';
      feedback.textContent = error.message;
    } finally {
      busy = false;
      lines.removeAttribute('aria-busy');
    }
  });
}

function recipientDetails(recipient) {
  return `<dl class="recipient"><div><dt>收货人</dt><dd>${html(recipient.name)}</dd></div>
    <div><dt>联系电话</dt><dd>${html(recipient.phone)}</dd></div>
    <div><dt>收货地址</dt><dd>${html(recipient.address)}</dd></div></dl>`;
}

export function checkout(main, refreshCount) {
  const state = readState();
  const items = cartItems(state.cart);
  pageFrame(main, '确认订单', [['购物车', '/cart/'], ['确认订单']], items.length ? `<div class="commerce-layout">
    <div class="commerce-stack">
      <section class="info-card">
        <h2>收货信息</h2><p>请核对收货信息，确认无误后提交订单。</p>
        ${recipientDetails(sampleRecipient)}
      </section>
      <section class="order-lines"><h2>订单商品</h2><ul>${items.map((item) => lineItem(item)).join('')}</ul></section>
    </div>
    ${summary(items, totalOf(items), `<form id="place-order">
      <button class="button button-primary button-block" type="submit">提交订单 ${icon('arrow')}</button>
      <p id="checkout-feedback" class="feedback" role="status"></p>
    </form>`)}
  </div>` : emptyCart(state.orders, '购物车已空'));

  const form = main.querySelector('#place-order');
  if (!form) return;
  const submit = form.querySelector('button');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    try {
      const updated = await placeOrder();
      refreshCount(updated);
      location.assign(orderUrl(updated.orders[0].id));
    } catch (error) {
      const feedback = main.querySelector('#checkout-feedback');
      feedback.dataset.state = 'error';
      feedback.textContent = error.message;
      submit.disabled = false;
    }
  });
}

export function order(main) {
  const { orders } = readState();
  const saved = orders.find(({ id }) => id === new URLSearchParams(location.search).get('id'));
  if (!saved) {
    pageFrame(main, '订单详情', [['我的订单', '/orders/'], ['订单详情']], emptyState('找不到这笔订单', '订单记录保存在提交订单时使用的浏览器中。', shopLink));
    return;
  }
  pageFrame(main, '订单详情', [['我的订单', '/orders/'], ['订单详情']], `<section class="order-success">
    <span class="success-icon">${icon('check')}</span>
    <div><h2>下单成功</h2><p>订单号 <strong>${html(saved.id)}</strong><span class="order-date">${orderDate(saved.createdAt)}</span></p></div>
    <div class="button-row">
      <a class="button button-secondary" href="/orders/">我的订单</a>
      <a class="button button-secondary" href="/shop/">继续浏览商城 ${icon('arrow')}</a>
    </div>
  </section>
  <div class="commerce-layout">
    <div class="commerce-stack">
      <section class="order-lines"><h2>订单商品</h2><ul>${saved.items.map((item) => lineItem(item)).join('')}</ul></section>
      <section class="info-card"><h2>收货信息</h2>${recipientDetails(saved.recipient)}</section>
    </div>
    ${summary(saved.items, saved.total)}
  </div>`);
}

export function orders(main) {
  const { orders: history } = readState();
  if (!history.length) {
    pageFrame(main, '我的订单', [['我的订单']], emptyState('还没有订单', '在商城提交订单后，可以在这里查看全部订单记录。', shopLink));
    return;
  }
  const entries = history.map((entry) => {
    const count = entry.items.reduce((total, item) => total + item.quantity, 0);
    const kinds = entry.items.length;
    const lead = html(entry.items[0]?.name ?? '');
    return `<li><a class="order-entry" href="${orderUrl(entry.id)}">
      <span class="order-entry-id"><strong>${html(entry.id)}</strong><time>${orderDate(entry.createdAt)}</time></span>
      <span class="order-entry-items">${lead}${kinds > 1 ? ` 等 ${kinds} 种商品` : ''}<small>共 ${count} 件</small></span>
      <span class="order-entry-total">${money(entry.total)}</span>
      ${icon('chevron')}
    </a></li>`;
  }).join('');
  pageFrame(main, '我的订单', [['我的订单']], `<section class="orders-card" aria-label="订单列表">
    <h2>全部订单 · ${history.length} 笔</h2>
    <ul>${entries}</ul>
  </section>`);
}
