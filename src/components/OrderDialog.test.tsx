import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrderDialog } from "./OrderDialog";
import { product } from "@/lib/products";

function renderDialog(onClose = vi.fn()) {
  return {
    onClose,
    ...render(
      <OrderDialog product={product} open onClose={onClose} />,
    ),
  };
}

function DialogHarness() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Reopen order
      </button>
      <OrderDialog
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

describe("OrderDialog", () => {
  it("shows $180 total before a fulfillment choice", () => {
    renderDialog();

    expect(screen.getByText("Total $180")).toBeInTheDocument();
  });

  it("shows $205 total for Delivery only", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("radio", { name: /Delivery/ }));

    expect(screen.getByText("Total $205")).toBeInTheDocument();
  });

  it("shows $275 total for Delivery+Assembly+Hardware", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("radio", { name: /Delivery/ }));
    await user.click(screen.getByRole("checkbox", { name: /Assembly/ }));
    await user.click(screen.getByRole("checkbox", { name: /Hardware kit/ }));

    expect(screen.getByText("Total $275")).toBeInTheDocument();
  });

  it("shows a fulfillment error and keeps the form open", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("button", { name: "Add to order" }));

    expect(screen.getByText("Choose pickup or delivery")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText("Added to your order")).not.toBeInTheDocument();
  });

  it("disables assembly for pickup and unchecks it", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("radio", { name: /Delivery/ }));
    await user.click(screen.getByRole("checkbox", { name: /Assembly/ }));
    expect(screen.getByRole("checkbox", { name: /Assembly/ })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: /Pickup/ }));

    expect(screen.getByRole("checkbox", { name: /Assembly/ })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /Assembly/ })).not.toBeChecked();
    expect(screen.getByText("Total $180")).toBeInTheDocument();
  });

  it("confirms pickup and hardware without mentioning assembly", async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole("radio", { name: /Pickup/ }));
    await user.click(screen.getByRole("checkbox", { name: /Hardware kit/ }));
    await user.click(screen.getByRole("button", { name: "Add to order" }));

    expect(screen.getByRole("heading", { name: "Added to your order" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Added to your order" })).toHaveFocus();
    expect(screen.getByText("Pickup")).toBeInTheDocument();
    expect(screen.getByText("Hardware kit")).toBeInTheDocument();
    expect(screen.queryByText("Assembly")).not.toBeInTheDocument();
    expect(screen.getByText("Total $210")).toBeInTheDocument();
  });

  it("closes on Escape without submitting", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDialog();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Added to your order")).not.toBeInTheDocument();
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { onClose, container } = renderDialog();
    const backdrop = container.firstElementChild?.firstElementChild;

    expect(backdrop).toBeTruthy();
    await user.click(backdrop!);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Added to your order")).not.toBeInTheDocument();
  });

  it("resets after Back to product", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    await user.click(screen.getByRole("radio", { name: /Pickup/ }));
    await user.click(screen.getByRole("checkbox", { name: /Hardware kit/ }));
    await user.click(screen.getByRole("button", { name: "Add to order" }));
    await user.click(screen.getByRole("button", { name: "Back to product" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reopen order" }));

    expect(screen.getByRole("heading", { name: "Add to your order" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Pickup/ })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: /Delivery/ })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Hardware kit/ })).not.toBeChecked();
    expect(screen.getByText("Total $180")).toBeInTheDocument();
  });
});
