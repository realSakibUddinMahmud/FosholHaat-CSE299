import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubInboundQueueScreen from "../src/app/hub/inbound";
import HubInboundDetailScreen from "../src/app/hub/inbound/[receiptId]";

describe("Hub inbound operations screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders the queue screen in English", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubInboundQueueScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bogura Fresh Supply")).toBeTruthy();
      expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
    });
  });

  it("renders the queue screen in Bangla", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<HubInboundQueueScreen />);

    await waitFor(() => {
      expect(screen.getByText("FosholHaat")).toBeTruthy();
      expect(screen.getAllByText("অপেক্ষায়").length).toBeGreaterThan(0);
    });
  });

  it("renders the detail screen", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubInboundDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bogura Fresh Supply")).toBeTruthy();
      expect(screen.getByText("Intake Snapshot")).toBeTruthy();
      expect(screen.getByText("Verification Checklist")).toBeTruthy();
    });
  });

  it("shows receive and discrepancy ui", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubInboundDetailScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Confirm receipt").length).toBeGreaterThan(0);
      expect(screen.getByText("Flag Issue")).toBeTruthy();
    });
  });
});
