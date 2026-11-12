"use client";

import type { Extra, FulfillmentOption } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "./Button";

type OrderConfirmationProps = {
  fulfillment: FulfillmentOption;
  extras: Extra[];
  totalCents: number;
  onClose: () => void;
};

export function OrderConfirmation({
  fulfillment,
  extras,
  totalCents,
  onClose,
}: OrderConfirmationProps) {
  return (
    <div>
      <ul className="mt-4 space-y-2 text-sm">
        <li>{fulfillment.label}</li>
        {extras.map((extra) => (
          <li key={extra.code}>{extra.label}</li>
        ))}
      </ul>
      <p className="mt-4 text-lg font-medium">
        Total {formatPrice(totalCents)}
      </p>
      <Button onClick={onClose} fullWidth className="mt-6">
        Back to product
      </Button>
    </div>
  );
}
