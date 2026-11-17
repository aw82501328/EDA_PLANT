import { priceTiers, quoteProduct } from './pricing.js';
import { changeQuantity } from './store.js';
import { datasheetButton } from './datasheet.js';
import { categoryName, escapeHtml as html, icon, money, productUrl, unitMoney } from './ui.js';

const quantityLabel = new Intl.NumberFormat('zh-CN');

export function productFacts(product, className) {
  const identification = [
    ['型号', product.model], ['品牌', product.brand], ['封装', product.package],
    ['类目', product.subcategory ?? categoryName(product.category)], ['商品编号', product.sku],
  ].filter(([, value]) => value);
  const labels = new Set(identification.map(([label]) => label));
  const facts = [...identification, ...product.specs.filter(([label]) => !labels.has(label))];
  return `<dl class="${className}">${facts.map(([label, value]) => `
    <div><dt>${html(label)}</dt><dd>${html(value)}</dd></div>`).join('')}</dl>`;
}

export function buyPanel(product) {
  const tiers = priceTiers(product);
  const quote = quoteProduct(product, 1);
  const tiered = tiers.length > 1;
  return `<div class="purchase-panel">
    <div class="purchase-pricing">
      <p class="purchase-label">${tiered ? '阶梯单价（元 / 件）' : '单价（元 / 件）'}</p>
      ${tiered ? `<dl class="price-tiers">${tiers.map(({ minQty, unitPriceMicros }) => `
        <div data-tier="${minQty}"${minQty === quote.minQty ? ' aria-current="true"' : ''}>
          <dt>${quantityLabel.format(minQty)}+</dt><dd>${unitMoney(unitPriceMicros)}</dd>
        </div>`).join('')}</dl>` : `<strong class="price fixed-price">${unitMoney(quote.unitPriceMicros)}</strong>`}
    </div>
    <form class="purchase-form" data-purchase="${html(product.sku)}">
      <p class="purchase-stock">库存 <strong>${quantityLabel.format(product.stock)}</strong> 件</p>
      <label class="purchase-quantity">数量 <input name="quantity" type="number" min="1" step="1" max="${product.stock}" value="1" required></label>
      <p class="purchase-total"><span>小计</span> <output class="price" name="subtotal">${money(quote.lineTotalCents)}</output></p>
      <button class="button button-primary button-block" type="submit">${icon('cart')} 加入购物车</button>
      ${tiered ? '<p class="purchase-note">购物车按合并数量计价。</p>' : ''}
      <p class="feedback" role="status"></p>
    </form>
  </div>`;
}

export function productRow(product) {
  const url = productUrl(product.sku);
  return `<article class="catalog-row">
    <a class="catalog-photo" href="${url}" aria-label="查看 ${html(product.name)}">
      <img src="${product.image}" alt="" loading="lazy">
    </a>
    <div class="catalog-info">
      <h2><a href="${url}">${html(product.name)}</a></h2>
      ${productFacts(product, 'catalog-facts')}
      ${datasheetButton(product)}
    </div>
    ${buyPanel(product)}
  </article>`;
}

export function bindPurchaseForms(main, products, refreshCount) {
  for (const form of main.querySelectorAll('[data-purchase]')) {
    const product = products.get(form.dataset.purchase);
    const { quantity, subtotal } = form.elements;
    const feedback = form.querySelector('.feedback');
    const submit = form.querySelector('button');
    const tiers = form.closest('.purchase-panel').querySelectorAll('[data-tier]');

    quantity.addEventListener('input', () => {
      const quote = quantity.validity.valid ? quoteProduct(product, quantity.valueAsNumber) : null;
      subtotal.value = quote ? money(quote.lineTotalCents) : '—';
      for (const row of tiers) {
        if (Number(row.dataset.tier) === quote?.minQty) row.setAttribute('aria-current', 'true');
        else row.removeAttribute('aria-current');
      }
      feedback.textContent = '';
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submit.disabled || !quantity.validity.valid) return;
      const units = quantity.valueAsNumber;
      submit.disabled = true;
      try {
        const state = await changeQuantity(product.sku, units);
        refreshCount(state);
        feedback.dataset.state = 'success';
        feedback.textContent = `已加入 ${units} 件，购物车共 ${state.cart[product.sku]} 件。`;
      } catch (error) {
        feedback.dataset.state = 'error';
        feedback.textContent = error.message;
      } finally {
        submit.disabled = false;
      }
    });
  }
}
