import { company } from '../data/company.js';
import * as pages from './pages.js';
import { cart, checkout, order, orders } from './checkout.js';
import { readState, storageKey } from './store.js';
import { emptyState, footer, header } from './ui.js';

const page = document.body.dataset.page;
const main = document.querySelector('#main');
document.title = `${document.title} · ${company.name}`;
document.querySelector('#site-header').innerHTML = header(page);
document.querySelector('#site-footer').innerHTML = footer();

const count = document.querySelector('#cart-count');
function refreshCount(state) {
  try {
    const quantity = Object.values((state ?? readState()).cart).reduce((total, units) => total + units, 0);
    count.textContent = quantity;
    count.closest('a').setAttribute('aria-label', `购物车，共 ${quantity} 件`);
  } catch {
    count.textContent = '–';
  }
}

const restartButton = document.querySelector('#restart-service');
restartButton?.addEventListener('click', async () => {
  restartButton.disabled = true;
  restartButton.classList.add('is-busy');
  try { await fetch('/__restart', { method: 'POST' }); } catch { /* 服务器即将退出，连接中断属预期 */ }
  const deadline = Date.now() + 20000;
  const poll = async () => {
    if (Date.now() > deadline) {
      restartButton.disabled = false;
      restartButton.classList.remove('is-busy');
      return;
    }
    try {
      if ((await fetch('/', { cache: 'no-store' })).ok) { location.reload(); return; }
    } catch { /* 服务尚未恢复 */ }
    setTimeout(poll, 500);
  };
  setTimeout(poll, 600);
});

const commercePages = { cart, checkout, order, orders };
function render() {
  refreshCount();
  if (commercePages[page]) {
    try {
      commercePages[page](main, refreshCount);
    } catch (error) {
      console.error(error);
      main.innerHTML = `<div class="wrap inner-page">${emptyState('暂时无法读取本地购物记录', '请检查浏览器站点存储设置，然后刷新页面。', '<a class="button button-secondary" href="/shop/">返回商城</a>')}</div>`;
    }
    return;
  }
  pages[page](main, refreshCount);
}

render();
window.addEventListener('storage', (event) => {
  if (event.key !== storageKey && event.key !== null) return;
  if (commercePages[page]) render();
  else refreshCount();
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted && commercePages[page]) render();
  else if (event.persisted) refreshCount();
});
