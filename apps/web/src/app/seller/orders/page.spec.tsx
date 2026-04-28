import { render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import SellerOrdersPage from "./page";
import { SellerOrderDetailView, SellerOrdersListView } from "./orders-view";

describe("seller orders web lane", () => {
  it("renders the seller orders queue", () => {
    render(<SellerOrdersListView locale="en" />);

    expect(screen.getByRole("heading", { name: "Seller orders", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Green Mart Dhaka")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View order" })[0]).toHaveAttribute(
      "href",
      "/seller/orders/so-20260421-001",
    );
  });

  it("renders the seller order detail view", () => {
    render(<SellerOrderDetailView locale="en" orderId="so-20260421-001" />);

    expect(screen.getByRole("heading", { name: "Order detail" })).toBeInTheDocument();
    expect(screen.getByText("Today, 5:00 PM to 6:00 PM")).toBeInTheDocument();
    expect(screen.getAllByText("Potato").length).toBeGreaterThan(0);
  });

  it("shows a not found state for an unknown order", () => {
    render(<SellerOrderDetailView locale="en" orderId="missing" />);

    expect(screen.getByRole("heading", { name: "Order not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Seller orders" })).toHaveAttribute(
      "href",
      "/seller/orders",
    );
  });

  it("renders from the browser locale page entrypoint", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");

    render(<SellerOrdersPage />);

    expect(screen.getByRole("heading", { name: "Seller orders", level: 1 })).toBeInTheDocument();
  });
});
