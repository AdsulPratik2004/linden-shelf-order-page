export type FulfillmentCode = "pickup" | "delivery";
export type ExtraCode = "assembly" | "hardware";

export type FulfillmentOption = {
  code: FulfillmentCode;
  label: string;
  priceCents: number;
};

export type Extra = {
  code: ExtraCode;
  label: string;
  priceCents: number;
  requires: FulfillmentCode | null;
};

export type Product = {
  name: string;
  description: string;
  priceCents: number;
  fulfillment: FulfillmentOption[];
  extras: Extra[];
};

export type ProductError = {
  error: "unavailable";
};
