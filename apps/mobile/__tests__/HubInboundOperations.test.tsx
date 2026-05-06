import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubInboundQueueScreen from "../src/app/hub/inbound";
import HubInboundDetailScreen from "../src/app/hub/inbound/[receiptId]";
import { HUB_INBOUND_DETAILS, HUB_INBOUND_QUEUE } from "../src/app/hub/inbound/_data";

const mockReplace = jest.fn();
const mockApiFetch = jest.fn();
const mockApiPost = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  useLocalSearchParams: () => ({ receiptId: "RC-7801" }),
}));

jest.mock("../src/lib/api-client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
  apiPost: (...args: unknown[]) => mockApiPost(...args),
}));

describe("Hub inbound operations screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiFetch.mockImplementation((path: string) => {
      if (path === "/hub/inbound") return Promise.resolve(HUB_INBOUND_QUEUE);
      if (path === "/hub/inbound/RC-7801") return Promise.resolve({ receipt: HUB_INBOUND_DETAILS["RC-7801"] });
      return Promise.reject(new Error("Receipt not found"));
    });
    mockApiPost.mockResolvedValue({ receipt: HUB_INBOUND_DETAILS["RC-7802"] });
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
