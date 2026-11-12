"use client";

import { ProductDetails } from "@/components/ProductDetails";
import { Button } from "@/components/Button";
import { useProduct } from "@/hooks/useProduct";

export function ProductPage() {
  const { status, product, retry } = useProduct();

  return (
    <main className="min-h-full bg-[#F6F4F1] px-4 py-10 text-[#1C1C1C] lg:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-[960px]">
        {status === "loading" ? (
          <p role="status">Loading product…</p>
        ) : null}

        {status === "error" ? (
          <div className="flex flex-col items-start gap-4">
            <p role="alert">Could not load the product</p>
            <Button onClick={() => void retry()}>Try again</Button>
          </div>
        ) : null}

        {status === "success" && product ? (
          <ProductDetails product={product} />
        ) : null}
      </div>
    </main>
  );
}
