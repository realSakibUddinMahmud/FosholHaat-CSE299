import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import SellerPayoutVisibilityScreen from "../src/app/seller/payouts";

const payoutResponse = {
  summary: {
    pending: 8920,
    completed: 12450,
    total: 21370,
    nextDisbursementAmount: 8920,
    nextDisbursementDate: "2026-11-05",
  },
  featuredDetailId: "line-1",
  records: [
    {
      id: "line-1",
      referenceCode: "TR-FH-8492-line1",
      orderRef: "FH-8492",
      method: "manual",
      status: "settled",
      amount: 12450,
      createdAt: "2026-10-28T00:00:00.000Z",
      periodLabel: "28 Oct 2026",
    },
  ],
};

describe("Seller payout visibility screen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => payoutResponse,
    } as Response);
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders the payout summary and activity list in English by default", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<SellerPayoutVisibilityScreen />);

    await waitFor(() => {
      expect(screen.getByText("Next Disbursement")).toBeTruthy();
      expect(screen.getByText("Pending Settlement")).toBeTruthy();
      expect(screen.getByText("Recent Activity")).toBeTruthy();
      expect(screen.getByText("TR-FH-8492-line1")).toBeTruthy();
      expect(screen.getAllByText("Settled").length).toBeGreaterThan(0);
    });
  });

  it("switches to Bangla copy when the stored locale is bn", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<SellerPayoutVisibilityScreen />);

    await waitFor(() => {
      expect(screen.getAllByText(/TR-/).length).toBeGreaterThan(0);
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
