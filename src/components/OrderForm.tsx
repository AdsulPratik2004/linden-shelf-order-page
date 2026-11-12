"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtraCode, Product } from "@/lib/types";
import { orderSchema, type OrderFormValues } from "@/lib/schemas";
import { calculateOrderTotal, formatPrice } from "@/lib/utils";
import { Button } from "./Button";

type OrderFormProps = {
  product: Product;
  onSubmit: (values: OrderFormValues) => void;
};

export function OrderForm({ product, onSubmit }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      fulfillment: "",
      assembly: false,
      hardware: false,
    },
  });

  const fulfillment = useWatch({ control, name: "fulfillment" });
  const assembly = useWatch({ control, name: "assembly" });
  const hardware = useWatch({ control, name: "hardware" });
  const extraSelection = { assembly, hardware } as Record<ExtraCode, boolean>;

  const selectedExtraCodes = product.extras
    .filter((extra) => extraSelection[extra.code])
    .map((extra) => extra.code);

  const totalCents = calculateOrderTotal(
    product,
    fulfillment,
    selectedExtraCodes,
  );

  useEffect(() => {
    if (fulfillment === "pickup" && assembly) {
      setValue("assembly", false);
    }
  }, [assembly, fulfillment, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className="mt-6"
        aria-invalid={Boolean(errors.fulfillment)}
        aria-describedby={errors.fulfillment ? "fulfillment-error" : undefined}
      >
        <legend className="text-sm font-medium">Fulfillment</legend>
        <div className="mt-2 divide-y divide-neutral-200 border-y border-neutral-200">
          {product.fulfillment.map((option) => (
            <label
              key={option.code}
              className="flex min-h-11 cursor-pointer items-center gap-3 py-2"
            >
              <input
                type="radio"
                value={option.code}
                className="size-4 accent-[#1F4D3A]"
                {...register("fulfillment")}
              />
              <span>{option.label}</span>
              <span className="ml-auto">{formatPrice(option.priceCents)}</span>
            </label>
          ))}
        </div>
        {errors.fulfillment ? (
          <p
            id="fulfillment-error"
            role="alert"
            className="mt-2 text-sm text-[#B42318]"
          >
            {errors.fulfillment.message}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium">Extras</legend>
        <div className="mt-2 divide-y divide-neutral-200 border-y border-neutral-200">
          {product.extras.map((extra) => {
            const isDisabled =
              extra.requires !== null && fulfillment !== extra.requires;

            return (
              <label
                key={extra.code}
                className={`flex min-h-11 items-center gap-3 py-2 ${
                  isDisabled
                    ? "cursor-not-allowed text-neutral-400"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  disabled={isDisabled}
                  className="size-4 accent-[#1F4D3A]"
                  {...register(extra.code)}
                />
                <span>{extra.label}</span>
                <span className="ml-auto">{formatPrice(extra.priceCents)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-6 text-lg font-medium">Total {formatPrice(totalCents)}</p>

      <Button type="submit" fullWidth className="mt-6">
        Add to order
      </Button>
    </form>
  );
}
