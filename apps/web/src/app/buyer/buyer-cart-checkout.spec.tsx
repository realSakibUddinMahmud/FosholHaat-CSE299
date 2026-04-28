import { render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import BuyerCartPage from "./cart/page";
import BuyerCheckoutConfirmationPage from "./checkout/confirmation/page";
import BuyerCheckoutPage from "./checkout/page";
import BuyerCheckoutPaymentPage from "./checkout/payment/page";
import BuyerOrdersSuccessPage from "./orders/success/page";
import {
  BuyerCartView,
  BuyerCheckoutView,
  BuyerConfirmationView,
  BuyerPaymentView,
  BuyerSuccessView,
} from "./_view";

describe("buyer cart and checkout web lane", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the cart and the checkout handoff in English", () => {
    render(<BuyerCartView locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Your cart" })).toBeInTheDocument();
    expect(screen.getAllByText("Potato").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Continue to checkout" })).toHaveAttribute(
      "href",
      "/buyer/checkout"
    );
    expect(screen.getAllByText("Total payable").length).toBeGreaterThan(0);
  });

  it("reads Bangla copy from browser locale storage on cart", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<BuyerCartPage />);

    expect(screen.getByRole("heading", { level: 1, name: "আপনার কার্ট" })).toBeInTheDocument();
    expect(screen.getAllByText("মোট পরিশোধ").length).toBeGreaterThan(0);
  });

  it("keeps the checkout shell side by side and omits a web fulfillment route", () => {
    const { container } = render(<BuyerCheckoutView locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Checkout" })).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Fulfillment stays in the mobile handoff. Web keeps the summary visible while you move to payment."
      ).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Continue to payment" })).toHaveAttribute(
      "href",
      "/buyer/checkout/payment"
    );
    expect(container.querySelector('a[href="/buyer/checkout/fulfillment"]')).toBeNull();
  });

  it("renders the payment step and advances to confirmation", () => {
    render(<BuyerPaymentView locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Payment details" })).toBeInTheDocument();
    expect(screen.getAllByText("Mobile banking").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Continue to confirmation" })).toHaveAttribute(
      "href",
      "/buyer/checkout/confirmation"
    );
  });

  it("renders the confirmation step before submission", () => {
    render(<BuyerConfirmationView locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Confirm order" })).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "Review delivery details, payment method, and final payable amount one last time."
      ).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Place order" })).toHaveAttribute(
      "href",
      "/buyer/orders/success"
    );
  });

  it("renders the success receipt and keeps tracking downstream", () => {
    render(<BuyerSuccessView locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Order placed" })).toBeInTheDocument();
    expect(screen.getAllByText("FH-8492").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Tracking will appear in the buyer-orders slice next.").length
    ).toBeGreaterThan(0);
  });

  it("reads Bangla copy from browser locale storage on payment, confirmation, and success", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<BuyerCheckoutPaymentPage />);
    expect(
      screen.getAllByText("একটি পেমেন্ট পদ্ধতি বেছে নিয়ে নির্দিষ্ট মোট পরিশোধ যাচাই করুন।").length
    ).toBeGreaterThan(0);

    render(<BuyerCheckoutConfirmationPage />);
    expect(
      screen.getAllByText("ডেলিভারি, পেমেন্ট, আর মোট পরিশোধ শেষবারের মতো মিলিয়ে নিন।").length
    ).toBeGreaterThan(0);

    render(<BuyerOrdersSuccessPage />);
    expect(
      screen.getAllByText("অর্ডার সম্পন্ন হয়েছে। পরের buyer-orders ফ্লোয়ের জন্য রসিদ রাখুন।").length
    ).toBeGreaterThan(0);
  });

  it("reads Bangla copy from browser locale storage on checkout", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<BuyerCheckoutPage />);
    expect(
      screen.getAllByText("ফুলফিলমেন্ট মোবাইল হ্যান্ডঅফে থাকে। ওয়েবে শুধু সারসংক্ষেপ দেখিয়ে পেমেন্টে নেওয়া হয়।").length
    ).toBeGreaterThan(0);
  });
});
