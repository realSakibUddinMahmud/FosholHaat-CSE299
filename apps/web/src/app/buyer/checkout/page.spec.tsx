import { render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import BuyerCartPage from "../cart/page";
import BuyerCheckoutPage from "./page";
import BuyerCheckoutPaymentPage from "./payment/page";
import BuyerCheckoutConfirmationPage from "./confirmation/page";
import BuyerOrderSuccessPage from "../orders/success/page";

describe("buyer cart and checkout web lane", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");
  });

  it("renders the cart route", () => {
    render(<BuyerCartPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Your cart" })).toBeInTheDocument();
    expect(screen.getByText("Continue to checkout")).toBeInTheDocument();
    expect(screen.getAllByText("Potato").length).toBeGreaterThan(0);
  });

  it("renders checkout without a separate web fulfillment route", () => {
    render(<BuyerCheckoutPage />);

    expect(screen.getByRole("heading", { name: "Checkout" })).toBeInTheDocument();
    expect(screen.getByText("No separate web fulfillment route is exposed.")).toBeInTheDocument();
  });

  it("renders payment, confirmation, and success surfaces", () => {
    render(
      <>
        <BuyerCheckoutPaymentPage />
        <BuyerCheckoutConfirmationPage />
        <BuyerOrderSuccessPage />
      </>
    );

    expect(screen.getByRole("heading", { name: "Payment details" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Confirm order" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Order placed" })).toBeInTheDocument();
    expect(screen.getByText("Order pending")).toBeInTheDocument();
  });
});
