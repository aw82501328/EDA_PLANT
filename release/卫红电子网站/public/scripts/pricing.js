export const MICROS_PER_YUAN = 1_000_000;
export const MICROS_PER_CENT = 10_000;

export function priceTiers(product) {
  return product.priceTiers ?? [{ minQty: 1, unitPriceMicros: product.price * MICROS_PER_CENT }];
}

export function quoteProduct(product, quantity) {
  const { minQty, unitPriceMicros } = priceTiers(product).findLast((tier) => quantity >= tier.minQty);
  const lineTotalCents = Math.floor((unitPriceMicros * quantity + MICROS_PER_CENT / 2) / MICROS_PER_CENT);
  return { minQty, unitPriceMicros, lineTotalCents };
}
