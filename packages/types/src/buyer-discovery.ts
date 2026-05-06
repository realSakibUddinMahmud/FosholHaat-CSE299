import type { Locale } from "./auth";

export const BUYER_DISCOVERY_COMMODITIES = [
  "potato",
  "onion",
  "vegetables",
] as const;
export type BuyerDiscoveryCommodity =
  (typeof BUYER_DISCOVERY_COMMODITIES)[number];

export const BUYER_DISCOVERY_SORTS = [
  "relevance",
  "price_asc",
  "price_desc",
  "stock_desc",
] as const;
export type BuyerDiscoverySort = (typeof BUYER_DISCOVERY_SORTS)[number];

export const BUYER_DISCOVERY_CATEGORY_SLUGS = [
  "potato",
  "onion",
  "vegetables",
] as const;
export type BuyerDiscoveryCategorySlug =
  (typeof BUYER_DISCOVERY_CATEGORY_SLUGS)[number];

export type BuyerDiscoveryCorridor = "bogura-dhaka";

export interface BuyerCatalogQuery {
  locale?: Locale;
  categorySlug?: BuyerDiscoveryCategorySlug;
  corridor?: BuyerDiscoveryCorridor;
  sort?: BuyerDiscoverySort;
  page?: number;
}

export interface BuyerCategoryBrowseQuery {
  locale?: Locale;
  sort?: BuyerDiscoverySort;
  page?: number;
}

export interface BuyerSearchQuery {
  q: string;
  locale?: Locale;
  sort?: BuyerDiscoverySort;
  page?: number;
}

export interface BuyerDiscoveryCategorySummary {
  slug: BuyerDiscoveryCategorySlug;
  label: string;
  productCount: number;
}

export interface BuyerCatalogHighlight {
  productId: string;
  title: string;
  commodity: BuyerDiscoveryCommodity;
  packageLabel: string;
  priceLabel: string;
  stockLabel: string;
  sellerLabel: string;
  verificationLabel?: string;
  imageUrl?: string;
  groupBuyId?: string;
  singleMinQty?: number;
  singleMaxQty?: number;
}

export interface BuyerCatalogResponse {
  workspace: {
    role: "buyer";
    corridor: BuyerDiscoveryCorridor;
    locale: Locale;
  };
  categories: BuyerDiscoveryCategorySummary[];
  highlights: BuyerCatalogHighlight[];
  nextPage?: number;
}

export interface BuyerCategoryBrowseResponse {
  category: {
    slug: BuyerDiscoveryCategorySlug;
    label: string;
  };
  locale: Locale;
  items: BuyerCatalogHighlight[];
  nextPage?: number;
}

export interface BuyerSearchResponse {
  query: string;
  locale: Locale;
  totalResults: number;
  items: BuyerCatalogHighlight[];
  nextPage?: number;
}

export interface BuyerProductDetailResponse {
  product: {
    id: string;
    title: string;
    commodity: BuyerDiscoveryCommodity;
    description?: string;
    packageLabel: string;
    priceLabel: string;
    stockLabel: string;
    verificationLabel?: string;
    sellerLabel: string;
    imageUrls?: string[];
    singleMinQty?: number;
    singleMaxQty?: number;
  };
  purchaseOptions: {
    canAddToCart: boolean;
    cartRoute: "/buyer/cart";
    groupBuyRoute?: "/buyer/group-buys";
  };
  locale: Locale;
}

export interface BuyerDiscoveryErrorResponse {
  error: {
    code:
      | "INVALID_LOCALE"
      | "INVALID_CORRIDOR"
      | "INVALID_SORT"
      | "INVALID_PAGE"
      | "CATEGORY_NOT_FOUND"
      | "EMPTY_SEARCH_QUERY"
      | "PRODUCT_NOT_FOUND";
    message: string;
    field?: "locale" | "corridor" | "sort" | "page" | "q" | "categorySlug";
    productId?: string;
    categorySlug?: string;
  };
}

export type BuyerDiscoveryCopy = {
  shellTitle: string;
  shellHint: string;
  searchPlaceholder: string;
  browseTitle: string;
  browseLead: string;
  browseEmptyTitle: string;
  browseEmptyBody: string;
  categoryTitlePrefix: string;
  categoryLead: string;
  categoryEmptyTitle: string;
  categoryEmptyBody: string;
  categoryMissingTitle: string;
  categoryMissingBody: string;
  searchTitle: string;
  searchLead: string;
  searchEmptyTitle: string;
  searchEmptyBody: string;
  invalidQueryTitle: string;
  invalidQueryBody: string;
  productMissingTitle: string;
  productMissingBody: string;
  detailLead: string;
  detailDescriptionTitle: string;
  detailTrustTitle: string;
  detailRouteHint: string;
  labels: {
    categories: string;
    highlights: string;
    stock: string;
    package: string;
    seller: string;
    trust: string;
    searchResults: string;
    totalResults: string;
  };
  actions: {
    browseCategory: string;
    searchNow: string;
    openProduct: string;
    goToCart: string;
    backToBrowse: string;
  };
};

export const BUYER_DISCOVERY_COPY: Record<Locale, BuyerDiscoveryCopy> = {
  en: {
    shellTitle: "Buyer workspace",
    shellHint:
      "Browse produce fast, compare trust cues, then continue only when the lot looks right.",
    searchPlaceholder: "Search potato, onion, or vegetables",
    browseTitle: "Browse produce",
    browseLead:
      "Start from the corridor-safe lots and keep price, stock, and seller cues in view.",
    browseEmptyTitle: "No products match these filters",
    browseEmptyBody:
      "Clear the filters and check the active produce list again.",
    categoryTitlePrefix: "Category",
    categoryLead:
      "Compare similar lots first so the next product step stays simple.",
    categoryEmptyTitle: "No lots in this category right now",
    categoryEmptyBody: "Return to browse and check another produce line.",
    categoryMissingTitle: "Category not found",
    categoryMissingBody:
      "This produce line is not available in the current corridor list.",
    searchTitle: "Search results",
    searchLead:
      "Keep the active query visible so buyers know why each result appears.",
    searchEmptyTitle: "No results found",
    searchEmptyBody:
      "Try a shorter produce name or return to the main browse list.",
    invalidQueryTitle: "Add a search term first",
    invalidQueryBody:
      "Type a produce name before opening the search results page.",
    productMissingTitle: "Product not found",
    productMissingBody: "This lot is not in the current buyer discovery list.",
    detailLead:
      "Review the lot before you move toward cart or group-buy handoff.",
    detailDescriptionTitle: "Lot details",
    detailTrustTitle: "Trust and handoff",
    detailRouteHint:
      "Cart continues in the checkout slice. Group-buy stays downstream.",
    labels: {
      categories: "Categories",
      highlights: "Active lots",
      stock: "Stock",
      package: "Package",
      seller: "Seller",
      trust: "Trust",
      searchResults: "Search results",
      totalResults: "Total results",
    },
    actions: {
      browseCategory: "Browse category",
      searchNow: "Search now",
      openProduct: "Open product",
      goToCart: "Continue to cart",
      backToBrowse: "Back to browse",
    },
  },
  bn: {
    shellTitle: "বায়ার কর্মক্ষেত্র",
    shellHint:
      "দ্রুত পণ্য দেখুন, ভরসার সংকেত মিলিয়ে নিন, তারপর ঠিক হলে পরের ধাপে যান।",
    searchPlaceholder: "আলু, পেঁয়াজ, বা সবজি খুঁজুন",
    browseTitle: "পণ্য দেখুন",
    browseLead:
      "করিডরের তালিকা থেকে শুরু করুন, আর দাম, স্টক, আর বিক্রেতার সংকেত চোখে রাখুন।",
    browseEmptyTitle: "এই ফিল্টারে কোনো পণ্য নেই",
    browseEmptyBody: "ফিল্টার সরিয়ে আবার সক্রিয় পণ্যের তালিকা দেখুন।",
    categoryTitlePrefix: "ক্যাটাগরি",
    categoryLead: "একই ধরনের লট আগে মিলিয়ে নিলে পরের ধাপ সহজ থাকে।",
    categoryEmptyTitle: "এই ক্যাটাগরিতে এখন কোনো লট নেই",
    categoryEmptyBody: "ব্রাউজে ফিরে অন্য পণ্যের লাইন দেখুন।",
    categoryMissingTitle: "ক্যাটাগরি পাওয়া যায়নি",
    categoryMissingBody: "এই পণ্যের লাইন এখনকার করিডর তালিকায় নেই।",
    searchTitle: "সার্চ ফলাফল",
    searchLead: "সক্রিয় সার্চ শব্দ দেখান, যাতে কেন ফলাফল এসেছে তা বোঝা যায়।",
    searchEmptyTitle: "কোনো ফল পাওয়া যায়নি",
    searchEmptyBody: "ছোট নামে খুঁজুন বা মূল ব্রাউজ তালিকায় ফিরে যান।",
    invalidQueryTitle: "আগে সার্চ শব্দ দিন",
    invalidQueryBody: "সার্চ ফলাফল খোলার আগে পণ্যের নাম লিখুন।",
    productMissingTitle: "পণ্য পাওয়া যায়নি",
    productMissingBody: "এই লট এখনকার বায়ার তালিকায় নেই।",
    detailLead: "কার্ট বা গ্রুপ-বাইয়ের আগে লটটি মিলিয়ে নিন।",
    detailDescriptionTitle: "লটের তথ্য",
    detailTrustTitle: "ভরসা আর হ্যান্ডঅফ",
    detailRouteHint: "কার্ট পরের checkout slice-এ যাবে। group-buy নিচের ধাপ।",
    labels: {
      categories: "ক্যাটাগরি",
      highlights: "সক্রিয় লট",
      stock: "স্টক",
      package: "প্যাকেজ",
      seller: "বিক্রেতা",
      trust: "ভরসা",
      searchResults: "সার্চ ফলাফল",
      totalResults: "মোট ফল",
    },
    actions: {
      browseCategory: "ক্যাটাগরি দেখুন",
      searchNow: "সার্চ করুন",
      openProduct: "পণ্য খুলুন",
      goToCart: "কার্টে যান",
      backToBrowse: "ব্রাউজে ফিরুন",
    },
  },
};

export function getBuyerDiscoveryCopy(locale: Locale): BuyerDiscoveryCopy {
  return BUYER_DISCOVERY_COPY[locale] ?? BUYER_DISCOVERY_COPY.bn;
}
