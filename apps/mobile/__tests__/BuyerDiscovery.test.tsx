import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import BuyerDiscoveryHomeScreen from "../src/app/buyer";
import BuyerCategoryBrowseScreen from "../src/app/buyer/categories/[categorySlug]";
import BuyerSearchScreen from "../src/app/buyer/search";
import BuyerProductDetailScreen from "../src/app/buyer/products/[productId]";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: jest.fn(),
}));

const { useLocalSearchParams } = jest.requireMock("expo-router") as {
  useLocalSearchParams: jest.Mock;
};

describe("Buyer discovery mobile screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockPush.mockClear();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders buyer browse home in English", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<BuyerDiscoveryHomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Group-Buy Savings")).toBeTruthy();
      expect(screen.getByText("All Items")).toBeTruthy();
      expect(screen.getByText("Join Group")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Join Group"));
    expect(mockPush).toHaveBeenCalledWith("/buyer/group-buys");
  });

  it("renders category browse in Bangla", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    useLocalSearchParams.mockReturnValue({ categorySlug: "potato" });
    render(<BuyerCategoryBrowseScreen />);

    await waitFor(() => {
      expect(screen.getByText("ক্যাটাগরি: আলু")).toBeTruthy();
      expect(screen.getAllByText("সক্রিয় লট").length).toBeGreaterThan(0);
    });
  });

  it("renders search results and product detail", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    useLocalSearchParams.mockReturnValue({ q: "onion" });
    const search = render(<BuyerSearchScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Search results").length).toBeGreaterThan(0);
      expect(screen.getByText("Dhaka onion line")).toBeTruthy();
    });

    search.unmount();
    useLocalSearchParams.mockReturnValue({ productId: "PR-BD-101" });
    render(<BuyerProductDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bogura potato lot")).toBeTruthy();
      expect(screen.getByText("Continue to cart")).toBeTruthy();
      expect(screen.getByText("Back to browse")).toBeTruthy();
    });
  });

  it("renders invalid search and missing product states", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    useLocalSearchParams.mockReturnValue({ q: "   " });
    const invalidSearch = render(<BuyerSearchScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("আগে সার্চ শব্দ দিন").length).toBeGreaterThan(0);
      expect(screen.getByText("ব্রাউজে ফিরুন")).toBeTruthy();
    });

    invalidSearch.unmount();
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    useLocalSearchParams.mockReturnValue({ productId: "missing" });
    render(<BuyerProductDetailScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Product not found").length).toBeGreaterThan(0);
      expect(screen.getByText("Back to browse")).toBeTruthy();
    });
  });
});
