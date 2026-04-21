import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubDispatchQueueScreen from "../src/app/hub/dispatch";
import HubDispatchDetailScreen from "../src/app/hub/dispatch/[loadId]";

describe("Hub dispatch operations screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders the queue screen in English", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubDispatchQueueScreen />);

    await waitFor(() => {
      expect(screen.getByText("Dispatch preparation")).toBeTruthy();
      expect(screen.getByText("Bogura Central Hub")).toBeTruthy();
      expect(screen.getByText("Dhaka North Cluster")).toBeTruthy();
    });
  });

  it("renders the queue screen in Bangla", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<HubDispatchQueueScreen />);

    await waitFor(() => {
      expect(screen.getByText("ডিসপ্যাচ প্রস্তুতি")).toBeTruthy();
      expect(screen.getByText("বগুড়া সেন্ট্রাল হাব")).toBeTruthy();
      expect(screen.getAllByText("স্টেজিং").length).toBeGreaterThan(0);
    });
  });

  it("renders the detail screen", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubDispatchDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Dhaka North Cluster")).toBeTruthy();
      expect(screen.getByText("Load metrics")).toBeTruthy();
      expect(screen.getByText("Manifest summary")).toBeTruthy();
      expect(screen.getByText("Ready for dispatch.")).toBeTruthy();
    });
  });
});
