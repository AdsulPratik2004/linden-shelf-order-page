"use client";

import { useEffect, useState } from "react";
import { productSchema } from "@/lib/schemas";
import type { Product } from "@/lib/types";

type Status = "loading" | "error" | "success";

export function useProduct() {
  const [status, setStatus] = useState<Status>("loading");
  const [product, setProduct] = useState<Product | null>(null);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setStatus("loading");
      setProduct(null);

      try {
        const response = await fetch(
          `${window.location.origin}/api/product`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("unavailable");
        }

        const parsed = productSchema.safeParse(await response.json());

        if (!parsed.success) {
          throw new Error("invalid");
        }

        setProduct(parsed.data);
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load product:", error);
        setStatus("error");
      }
    }

    void fetchProduct();

    return () => {
      controller.abort();
    };
  }, [requestId]);

  return {
    status,
    product,
    retry: () => setRequestId((id) => id + 1),
  };
}
