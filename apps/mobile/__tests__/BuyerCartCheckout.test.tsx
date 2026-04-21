import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import BuyerCartScreen from "../src/app/buyer/cart";
import BuyerCheckoutScreen from "../src/app/buyer/checkout";
import BuyerFulfillmentScreen from "../src/app/buyer/checkout/fulfillment";
import BuyerPaymentScreen from "../src/app/buyer/checkout/payment";
import BuyerConfirmationScreen from "../src/app/buyer/checkout/confirmation";
import BuyerOrderSuccessScreen from "../src/app/buyer/orders/success";

describe("Buyer cart and checkout screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders cart totals in English", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<BuyerCartScreen />);

    await waitFor(() => {
      expect(screen.getByText("Your cart")).toBeTruthy();
      expect(screen.getByText("Order summary")).toBeTruthy();
      expect(screen.getByText("Continue to fulfillment")).toBeTruthy();
    });
  });

  it("renders checkout Bangla copy", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<BuyerCheckoutScreen />);

    await waitFor(() => {
      expect(screen.getByText("চেকআউট")).toBeTruthy();
      expect(screen.getByText("ডেলিভারির তথ্য")).toBeTruthy();
    });
  });

  it("renders fulfillment and payment steps", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    const fulfillment = render(<BuyerFulfillmentScreen />);

    await waitFor(() => {
      expect(screen.getByText("Fulfillment details")).toBeTruthy();
      expect(screen.getByText("Pickup from the hub handoff desk.")).toBeTruthy();
    });

    fulfillment.unmount();
    render(<BuyerPaymentScreen />);

    await waitFor(() => {
      expect(screen.getByText("Payment details")).toBeTruthy();
      expect(screen.getByText("Mobile banking")).toBeTruthy();
    });
  });

  it("renders confirmation and success handoff", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    const confirmation = render(<BuyerConfirmationScreen />);

    await waitFor(() => {
      expect(screen.getByText("Confirm order")).toBeTruthy();
      expect(screen.getByText("Place order")).toBeTruthy();
    });

    confirmation.unmount();
    render(<BuyerOrderSuccessScreen />);

    await waitFor(() => {
      expect(screen.getByText("Order placed")).toBeTruthy();
      expect(screen.getByText("ORD-2404")).toBeTruthy();
    });
  });
});
