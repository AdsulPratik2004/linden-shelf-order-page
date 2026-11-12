"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Extra, FulfillmentOption, Product } from "@/lib/types";
import type { OrderFormValues } from "@/lib/schemas";
import { calculateOrderTotal } from "@/lib/utils";
import { OrderForm } from "./OrderForm";
import { OrderConfirmation } from "./OrderConfirmation";

type OrderDialogProps = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

type ConfirmedOrder = {
  fulfillment: FulfillmentOption;
  extras: Extra[];
  totalCents: number;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => !element.hasAttribute("disabled"));
}

export function OrderDialog({ product, open, onClose }: OrderDialogProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null,
  );

  const closeAndReset = useCallback(() => {
    setConfirmedOrder(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    headingRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndReset();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, confirmedOrder, closeAndReset]);

  if (!open) {
    return null;
  }

  function onSubmit(values: OrderFormValues) {
    const selectedFulfillment = product.fulfillment.find(
      (option) => option.code === values.fulfillment,
    );

    if (!selectedFulfillment) {
      return;
    }

    const selectedExtras = product.extras.filter(
      (extra) => values[extra.code],
    );

    setConfirmedOrder({
      fulfillment: selectedFulfillment,
      extras: selectedExtras,
      totalCents: calculateOrderTotal(
        product,
        selectedFulfillment.code,
        selectedExtras.map((extra) => extra.code),
      ),
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeAndReset} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
    className="dialog-mobile absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 text-[#1C1C1C] shadow-xl md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-[480px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl" >
        <button
          type="button"
          onClick={closeAndReset}
          aria-label="Close dialog"
          className="absolute right-4 top-4 flex size-11 cursor-pointer items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D3A] text-2xl"
        >
          ×
        </button>
        {confirmedOrder ? (
          <>
            <h2
              id="order-dialog-title"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold outline-none"
            >
              Added to your order
            </h2>
            <OrderConfirmation
              fulfillment={confirmedOrder.fulfillment}
              extras={confirmedOrder.extras}
              totalCents={confirmedOrder.totalCents}
              onClose={closeAndReset}
            />
          </>
        ) : (
          <>
            <h2
              id="order-dialog-title"
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold outline-none"
            >
              Add to your order
            </h2>
            <OrderForm product={product} onSubmit={onSubmit} />
          </>
        )}
      </div>
    </div>
  );
}
