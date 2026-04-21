import { fireEvent, render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import BuyerPage from "./page";
import BuyerProductPage from "./products/[productId]/page";
import { BuyerDiscoveryView, BuyerProductDetailView } from "./discovery-view";

describe("buyer discovery web lane", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");
  });

  it("renders the discovery landing page and filters in place", () => {
    render(<BuyerDiscoveryView locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Find stock before the market moves" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details: Potato, white grade" })).toHaveAttribute(
      "href",
      "/buyer/products/potato-kazi-001"
    );

    fireEvent.change(screen.getByLabelText("Search stock"), { target: { value: "onion" } });

    expect(screen.getAllByText("Onion, medium red").length).toBeGreaterThan(0);
    expect(screen.queryByText("Potato, white grade")).toBeNull();
  });

  it("reads Bangla copy from browser locale storage on the landing page", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<BuyerPage />);

    expect(screen.getByRole("heading", { level: 1, name: "বাজার নড়ার আগেই স্টক দেখুন" })).toBeInTheDocument();
    expect(screen.getByLabelText("স্টক খুঁজুন")).toBeInTheDocument();
  });

  it("renders product detail content and the approved back link", () => {
    render(<BuyerProductDetailView locale="en" productId="potato-kazi-001" />);

    expect(screen.getByRole("heading", { level: 1, name: "Potato, white grade" })).toBeInTheDocument();
    expect(screen.getByText("Kazi Traders")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to discovery" })).toHaveAttribute("href", "/buyer");
  });

  it("reads Bangla copy from browser locale storage on product detail", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<BuyerProductPage params={{ productId: "onion-rahman-002" }} />);

    expect(screen.getByRole("heading", { level: 1, name: "পেঁয়াজ, মাঝারি লাল" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ডিসকভারিতে ফিরুন" })).toHaveAttribute("href", "/buyer");
  });
});
