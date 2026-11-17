import { productsBySku } from '../data/catalog.js';
import { quoteProduct } from './pricing.js';

export const storageKey = 'eda-plant:v1';
const maxOrders = 50;

export const sampleRecipient = {
  name: '张伟民',
  phone: '138-0000-0000',
  address: '上海市松江区新格路 500 号 3 幢 201 室',
};

function validOrder(entry) {
  return entry && typeof entry === 'object' && typeof entry.id === 'string'
    && typeof entry.createdAt === 'string' && Array.isArray(entry.items) && entry.items.length
    ? { recipient: sampleRecipient, ...entry } : null;
}

export function readState() {
  const raw = localStorage.getItem(storageKey);
  let saved;
  try {
    saved = raw ? JSON.parse(raw) : null;
  } catch {
    saved = null;
  }
  const cart = Object.fromEntries(
    Object.entries(saved?.cart ?? {}).flatMap(([sku, quantity]) => {
      const product = productsBySku.get(sku);
      return product && Number.isSafeInteger(quantity) && quantity > 0 && product.stock > 0
        ? [[sku, Math.min(quantity, product.stock)]] : [];
    }),
  );
  const orders = [];
  for (const entry of [...(saved?.orders ?? []), saved?.order ?? null]) {
    const order = validOrder(entry);
    if (order && !orders.some(({ id }) => id === order.id)) orders.push(order);
  }
  return { cart, orders };
}

export function cartItems(cart) {
  return Object.entries(cart).map(([sku, quantity]) => {
    const product = productsBySku.get(sku);
    return { ...product, quantity, ...quoteProduct(product, quantity) };
  });
}

export function totalOf(items) {
  return items.reduce((total, { lineTotalCents }) => total + lineTotalCents, 0);
}

async function updateState(update) {
  const commit = () => {
    const state = readState();
    update(state);
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      throw new Error('无法保存到浏览器，请检查站点存储设置后重试。');
    }
    return state;
  };
  return navigator.locks ? navigator.locks.request(storageKey, commit) : commit();
}

export function changeQuantity(sku, delta) {
  return updateState(({ cart }) => {
    const product = productsBySku.get(sku);
    const quantity = (cart[sku] ?? 0) + delta;
    if (!product || !Number.isSafeInteger(quantity) || quantity < 0) {
      throw new Error('请输入有效的商品数量。');
    }
    if (quantity > product.stock) {
      throw new Error(`购物车中该商品最多可放入 ${product.stock} 件。`);
    }
    if (quantity === 0) delete cart[sku];
    else cart[sku] = quantity;
  });
}

export function removeItem(sku) {
  return updateState(({ cart }) => { delete cart[sku]; });
}

export function placeOrder() {
  return updateState((state) => {
    const items = cartItems(state.cart).map(({ sku, name, image, quantity, unitPriceMicros, lineTotalCents }) => ({
      sku, name, image, quantity, unitPriceMicros, lineTotalCents,
    }));
    if (!items.length) throw new Error('购物车已空，请先添加商品。');
    const createdAt = new Date().toISOString();
    const date = createdAt.slice(0, 10).replaceAll('-', '');
    const suffix = crypto.randomUUID().slice(0, 8).toUpperCase();
    state.orders = [{
      id: `EP-${date}-${suffix}`,
      createdAt,
      recipient: sampleRecipient,
      items,
      total: totalOf(items),
    }, ...state.orders].slice(0, maxOrders);
    state.cart = {};
  });
}
