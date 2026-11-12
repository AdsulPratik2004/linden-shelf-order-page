import { describe, expect, it } from "vitest";
import { product } from "./products";
import { orderSchema, productSchema } from "./schemas";

describe("productSchema", () => {
  it("accepts the catalog product", () => {
    expect(productSchema.safeParse(product).success).toBe(true);
  });

  it("rejects an incomplete payload", () => {
    expect(productSchema.safeParse({ name: "Linden shelf" }).success).toBe(
      false,
    );
  });
});

describe("orderSchema", () => {
  it("requires pickup or delivery", () => {
    const result = orderSchema.safeParse({
      fulfillment: "",
      assembly: false,
      hardware: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Choose pickup or delivery");
    }
  });

  it("rejects pickup with assembly", () => {
    const result = orderSchema.safeParse({
      fulfillment: "pickup",
      assembly: true,
      hardware: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "assembly")).toBe(
        true,
      );
    }
  });

  it("accepts pickup with hardware only", () => {
    const result = orderSchema.safeParse({
      fulfillment: "pickup",
      assembly: false,
      hardware: true,
    });

    expect(result.success).toBe(true);
  });
});
