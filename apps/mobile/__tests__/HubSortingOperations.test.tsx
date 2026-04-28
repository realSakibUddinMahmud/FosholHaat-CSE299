import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubSortingQueueScreen from "../src/app/hub/sorting";
import HubSortingDetailScreen from "../src/app/hub/sorting/[batchId]";

describe("Hub sorting operations screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders the queue screen in English", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubSortingQueueScreen />);

    await waitFor(() => {
      expect(screen.getByText("FosholHaat")).toBeTruthy();
      expect(screen.getAllByText("Onion").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Ready").length).toBeGreaterThan(0);
    });
  });

  it("renders the queue screen in Bangla", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    render(<HubSortingQueueScreen />);

    await waitFor(() => {
      expect(screen.getByText("FosholHaat")).toBeTruthy();
      expect(screen.getAllByText("রেডি").length).toBeGreaterThan(0);
    });
  });

  it("renders the detail screen", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubSortingDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Onion")).toBeTruthy();
      expect(screen.getByText("Operational Progress")).toBeTruthy();
      expect(screen.getByText("QA Checkpoints")).toBeTruthy();
    });
  });

  it("shows action controls", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<HubSortingDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Confirm Sorting Update")).toBeTruthy();
      expect(screen.getByText("Mark Ready for Dispatch")).toBeTruthy();
    });
  });
});
