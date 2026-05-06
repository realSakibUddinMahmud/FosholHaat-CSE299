import { render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import SellerOrdersPage from "./page";
import { SellerOrderDetailView, SellerOrdersListView } from "./orders-view";

describe("seller orders web lane", () => {
  it("renders the seller orders queue", () => {
    render(<SellerOrdersListView locale="en" />);

    expect(screen.getByRole("heading", { name: "Seller orders", level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "View order" })).toBeNull();
  });

  it("renders the seller order detail view", () => {
    render(<SellerOrderDetailView locale="en" orderId="so-20260421-001" />);

    expect(screen.getByRole("heading", { name: "Order not found" })).toBeInTheDocument();
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
