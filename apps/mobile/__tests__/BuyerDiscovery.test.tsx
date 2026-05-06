import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import BuyerDiscoveryHomeScreen from "../src/app/buyer";
import BuyerCategoryBrowseScreen from "../src/app/buyer/categories/[categorySlug]";
import BuyerSearchScreen from "../src/app/buyer/search";
import BuyerProductDetailScreen from "../src/app/buyer/products/[productId]";
import type { BuyerCatalogResponse, BuyerProductDetailResponse, BuyerSearchResponse, BuyerCategoryBrowseResponse, Locale } from "@fosholhaat/types";

function catalog(locale: Locale): BuyerCatalogResponse {
  const item = {
    productId: "PR-BD-101",
    title: locale === "bn" ? "বগুড়া আলু" : "Bogura potato lot",
    commodity: "potato" as const,
    packageLabel: "50 kg bag",
    priceLabel: "BDT 45 per kg",
    stockLabel: "100 kg ready",
    sellerLabel: "Database Seller",
    verificationLabel: "Verified seller",
    imageUrl: "https://example.com/potato.jpg",
    singleMinQty: 10,
    singleMaxQty: 100,
  };
  return { workspace: { role: "buyer", corridor: "bogura-dhaka", locale }, categories: [{ slug: "potato", label: locale === "bn" ? "আলু" : "Potato", productCount: 1 }], highlights: [item] };
}

function product(locale: Locale): BuyerProductDetailResponse {
  return {
    product: {
      id: "PR-BD-101",
      title: locale === "bn" ? "বগুড়া আলু" : "Bogura potato lot",
      commodity: "potato",
      description: "DB product",
      packageLabel: "50 kg bag",
      priceLabel: "BDT 45 per kg",
      stockLabel: "100 kg ready",
      verificationLabel: "Verified seller",
      sellerLabel: "Database Seller",
      imageUrls: ["https://example.com/potato.jpg"],
      singleMinQty: 10,
      singleMaxQty: 100,
    },
    purchaseOptions: { canAddToCart: true, cartRoute: "/buyer/cart" },
    locale,
  };
}

const mockPush = jest.fn();
const mockApiFetch = jest.fn();
const mockApiPost = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: jest.fn(),
}));

jest.mock("../src/lib/api-client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
  apiPost: (...args: unknown[]) => mockApiPost(...args),
}));

const { useLocalSearchParams } = jest.requireMock("expo-router") as {
  useLocalSearchParams: jest.Mock;
};

describe("Buyer discovery mobile screens", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockApiFetch.mockImplementation((path: string) => {
      if (path.startsWith("/buyer/catalog/products/PR-BD-101")) return Promise.resolve(product("en"));
      if (path.startsWith("/buyer/catalog/products/")) return Promise.reject(new Error("Product not found"));
      if (path.startsWith("/buyer/catalog/search")) return Promise.resolve({ query: "onion", locale: "en", totalResults: 1, items: catalog("en").highlights } satisfies BuyerSearchResponse);
      if (path.startsWith("/buyer/catalog/categories/potato")) return Promise.resolve({ category: { slug: "potato", label: "আলু" }, locale: "bn", items: catalog("bn").highlights } satisfies BuyerCategoryBrowseResponse);
      if (path.startsWith("/buyer/catalog")) return Promise.resolve(catalog("en"));
      return Promise.reject(new Error("Product not found"));
    });
    mockApiPost.mockResolvedValue({ success: true });
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders buyer browse home in English", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    render(<BuyerDiscoveryHomeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Single-buy lots")).toBeTruthy();
      expect(screen.getByText("All Items")).toBeTruthy();
      expect(screen.getAllByText("Open product").length).toBeGreaterThan(0);
    });
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
      expect(screen.getByText("Bogura potato lot")).toBeTruthy();
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

  it("renders invalid search state", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    useLocalSearchParams.mockReturnValue({ q: "   " });
    render(<BuyerSearchScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("আগে সার্চ শব্দ দিন").length).toBeGreaterThan(0);
      expect(screen.getByText("ব্রাউজে ফিরুন")).toBeTruthy();
    });
  });

  it("renders missing product state", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "en");
    useLocalSearchParams.mockReturnValue({ productId: "missing" });
    const missingProduct = render(<BuyerProductDetailScreen />);

    await waitFor(() => {
      expect(missingProduct.getAllByText("Product not found").length).toBeGreaterThan(0);
      expect(missingProduct.getByText("Back to browse")).toBeTruthy();
    });
  });
});
