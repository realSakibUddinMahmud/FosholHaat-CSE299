import { render, screen } from "@testing-library/react";
import { getOrderCopy } from "./order-data";
import { BuyerOrderDetailView } from "./[orderId]/page";
import { BuyerOrderTrackingView } from "./[orderId]/tracking/page";

describe("buyer orders web lane", () => {
  it("keeps shared copy keys available for the web screens", () => {
    const copy = getOrderCopy("en");

    expect(copy.quantity).toBe("Quantity");
    expect(copy.notFoundTitle).toBe("Order not found");
    expect(copy.viewOrderDetails).toBe("View order");
  });

  it("shows a not-found state for an unknown order id", () => {
    render(<BuyerOrderDetailView orderId="missing" locale="en" />);

    expect(screen.getByRole("heading", { name: "Order not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to orders" })).toHaveAttribute("href", "/buyer/orders");
  });

  it("shows a not-found state on tracking for an unknown order id", () => {
    render(<BuyerOrderTrackingView orderId="missing" locale="en" />);

    expect(screen.getByRole("heading", { name: "Order not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to orders" })).toHaveAttribute("href", "/buyer/orders");
  });

  it("renders a valid order without falling back to a different one", () => {
    render(<BuyerOrderDetailView orderId="FH-8510" locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Order ID: #FH-8510" })).toBeInTheDocument();
    expect(screen.getByText(/Green Lentils \(Grade A\)/)).toBeInTheDocument();
    expect(screen.queryByText(/Red Onions, Premium Rice/)).toBeNull();
  });
});
