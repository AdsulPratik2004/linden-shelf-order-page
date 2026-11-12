import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductPage } from "./ProductPage";
import { product } from "@/lib/products";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProductPage", () => {
  it("shows the loading message", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );

    render(<ProductPage />);

    expect(screen.getByText("Loading product…")).toBeInTheDocument();
  });

  it("shows product details from the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(product),
        }),
      ),
    );

    render(<ProductPage />);

    expect(await screen.findByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText("$180")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Linden shelf" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to order" })).toBeInTheDocument();
  });

  it("shows an error and retries the request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "unavailable" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(product),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(<ProductPage />);

    expect(
      await screen.findByText("Could not load the product"),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shows an error when the API payload is invalid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: "Broken" }),
        }),
      ),
    );

    render(<ProductPage />);

    expect(
      await screen.findByText("Could not load the product"),
    ).toBeInTheDocument();
  });
});

