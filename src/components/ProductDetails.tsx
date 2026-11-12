"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { OrderDialog } from "@/components/OrderDialog";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const [orderOpen, setOrderOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <article className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
        <div
          className="aspect-[4/3] w-full bg-gray-200 rounded-lg"
          role="img"
          aria-label="Linden shelf"
        />

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight lg:text-[32px] lg:leading-tight">
            {product.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-neutral-600">
            {product.description}
          </p>
          <p className="mt-4 text-xl lg:text-2xl">
            {formatPrice(product.priceCents)}
          </p>
          <Button
            ref={addButtonRef}
            onClick={() => setOrderOpen(true)}
            className="mt-8 w-full lg:w-fit"
          >
            Add to order
          </Button>
        </div>
      </article>
      <OrderDialog
        product={product}
        open={orderOpen}
        onClose={() => {
          setOrderOpen(false);
          addButtonRef.current?.focus();
        }}
      />
    </>
  );
}
