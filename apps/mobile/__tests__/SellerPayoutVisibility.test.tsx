import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import SellerPayoutVisibilityScreen from "../src/app/seller/payouts";

describe("Seller payout visibility screen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders the payout summary and activity list in English by default", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<SellerPayoutVisibilityScreen />);

    await waitFor(() => {
      expect(screen.getByText("Next Disbursement")).toBeTruthy();
      expect(screen.getByText("Pending Settlement")).toBeTruthy();
      expect(screen.getByText("Recent Activity")).toBeTruthy();
      expect(screen.getByText("#TR-10492")).toBeTruthy();
      expect(screen.getAllByText("Settled").length).toBeGreaterThan(0);
      expect(screen.getByText("Load More History")).toBeTruthy();
    });
  });

  it("switches to Bangla copy when the stored locale is bn", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<SellerPayoutVisibilityScreen />);

    await waitFor(() => {
      expect(screen.getAllByText(/#TR-/).length).toBeGreaterThan(0);
      expect(screen.getByText("Settlements and payouts")).toBeTruthy();
    });
  });

  it("toggles the detail panel from the breakdown button", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<SellerPayoutVisibilityScreen />);

    await waitFor(() => {
      expect(screen.queryByText("Payout detail")).toBeNull();
    });

    fireEvent.press(screen.getByText("Breakdown"));

    await waitFor(() => {
      expect(screen.getByText("Payout detail")).toBeTruthy();
    });
  });
});
