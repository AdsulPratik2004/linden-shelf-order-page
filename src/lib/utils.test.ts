import { describe, expect, it } from "vitest";
import { product } from "./products";
import { calculateOrderTotal, formatPrice } from "./utils";

describe("formatPrice", () => {
  it("formats cents as USD with no cents", () => {
    expect(formatPrice(18000)).toBe("$180");
    expect(formatPrice(27500)).toBe("$275");
  });
});

describe("calculateOrderTotal", () => {
  it("adds fulfillment and extras from product data", () => {
    expect(calculateOrderTotal(product, "pickup", ["hardware"])).toBe(21000);
    expect(
      calculateOrderTotal(product, "delivery", ["assembly", "hardware"]),
    ).toBe(27500);
  });
});
