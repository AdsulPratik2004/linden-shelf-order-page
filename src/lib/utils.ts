import type { ExtraCode, Product } from "@/lib/types";

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function calculateOrderTotal(
  product: Product,
  fulfillmentCode: string,
  selectedExtraCodes: ExtraCode[],
) {
  const fulfillmentPrice =
    product.fulfillment.find((option) => option.code === fulfillmentCode)
      ?.priceCents ?? 0;

  const extrasPrice = product.extras
    .filter((extra) => selectedExtraCodes.includes(extra.code))
    .reduce((sum, extra) => sum + extra.priceCents, 0);

  return product.priceCents + fulfillmentPrice + extrasPrice;
}
