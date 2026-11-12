import type { Product } from "@/lib/types";

export const product: Product = {
  name: "Linden shelf",
  description: "A solid linden wall shelf with hidden brackets.",
  priceCents: 18000,
  fulfillment: [
    {
      code: "pickup",
      label: "Pickup",
      priceCents: 0,
    },
    {
      code: "delivery",
      label: "Delivery",
      priceCents: 2500,
    },
  ],
  extras: [
    {
      code: "assembly",
      label: "Assembly",
      priceCents: 4000,
      requires: "delivery",
    },
    {
      code: "hardware",
      label: "Hardware kit",
      priceCents: 3000,
      requires: null,
    },
  ],
};
