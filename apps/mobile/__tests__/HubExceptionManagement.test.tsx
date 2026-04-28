import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubExceptionManagementScreen from "../src/app/hub/exceptions";

describe("Hub exception management screen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders English exception cards", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubExceptionManagementScreen />);

    await waitFor(() => {
      expect(screen.getByText("Exceptions & Alerts")).toBeTruthy();
      expect(screen.getAllByText("Grade Variance: Onions").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Weight Discrepancy: Potatoes").length).toBeGreaterThan(0);
    });
  });

  it("renders Bangla tab labels", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<HubExceptionManagementScreen />);

    await waitFor(() => {
      expect(screen.getByText("ব্যতিক্রম ও সতর্কতা")).toBeTruthy();
      expect(screen.getByText("সক্রিয়")).toBeTruthy();
      expect(screen.getByText("রিভিউ অপেক্ষায়")).toBeTruthy();
    });
  });

  it("opens detail sheet from a card", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubExceptionManagementScreen />);

    fireEvent.press(await screen.findByTestId("exception-action-EX-4101"));

    await waitFor(() => {
      expect(screen.getByText("Recheck grade and update buyer visibility.")).toBeTruthy();
      expect(screen.getByText("Resolve")).toBeTruthy();
      expect(screen.getByText("Escalate")).toBeTruthy();
    });
  });

  it("confirms the action lane opens the sheet", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubExceptionManagementScreen />);

    fireEvent.press(await screen.findByTestId("exception-action-EX-4101"));

    await waitFor(() => {
      expect(screen.getByText("Recheck grade and update buyer visibility.")).toBeTruthy();
    });
  });
});
