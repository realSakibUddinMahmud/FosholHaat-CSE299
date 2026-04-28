import type { Locale } from "./auth";

export const SELLER_SUPPLY_COMMODITIES = [
  "potato",
  "onion",
  "vegetables",
] as const;
export type SellerSupplyCommodity =
  (typeof SELLER_SUPPLY_COMMODITIES)[number];

export const SELLER_SUPPLY_UNITS = ["kg", "bag", "crate"] as const;
export type SellerSupplyUnit = (typeof SELLER_SUPPLY_UNITS)[number];

export const SELLER_SUPPLY_STATUSES = [
  "active",
  "scheduled",
  "low-stock",
  "paused",
] as const;
export type SellerSupplyStatus = (typeof SELLER_SUPPLY_STATUSES)[number];

export interface SellerWorkspaceMetric {
  key: "active" | "readyToday" | "dwrOpen";
  label: string;
  value: number;
}

export interface SellerSupplyListing {
  id: string;
  commodity: SellerSupplyCommodity;
  commodityLabel: string;
  quantity: number;
  unit: SellerSupplyUnit;
  gradeLabel: string;
  packageLabel: string;
  askingPrice: number;
  availableFrom?: string;
  status: SellerSupplyStatus;
  stockHint: string;
  dwrRecordId: string;
}

export interface SellerSupplyWorkspace {
  sellerName: string;
  marketLabel: string;
  metrics: SellerWorkspaceMetric[];
  primaryActionRoute: string;
}

export interface SellerSupplyListResponse {
  workspace: SellerSupplyWorkspace;
  listings: SellerSupplyListing[];
}

export interface CreateSellerSupplyInput {
  commodity: SellerSupplyCommodity;
  quantity: number;
  unit: SellerSupplyUnit;
  gradeLabel: string;
  askingPrice: number;
  availableFrom?: string;
}

export interface UpdateSellerSupplyInput {
  quantity?: number;
  gradeLabel?: string;
  askingPrice?: number;
  availableFrom?: string;
  status?: SellerSupplyStatus;
}

export interface SellerSupplyMutationResponse {
  listing: SellerSupplyListing;
  message: string;
}

export interface SellerDwrRecord {
  id: string;
  listingId: string;
  recordCode: string;
  commodityLabel: string;
  gradeLabel: string;
  packageLabel: string;
  quantity: number;
  unit: SellerSupplyUnit;
  askingPrice: number;
  receivedAt: string;
  hubLabel: string;
  inspectorLabel: string;
  notes: string[];
}

export interface SellerDwrDetailResponse {
  record: SellerDwrRecord;
}

export interface SellerSupplyErrorResponse {
  message: string;
  listingId?: string;
  recordId?: string;
}

export type SellerSupplyCopy = {
  workspaceTitle: string;
  workspaceSubtitle: string;
  supplyTitle: string;
  supplySubtitle: string;
  newSupplyTitle: string;
  newSupplySubtitle: string;
  dwrTitle: string;
  dwrSubtitle: string;
  addSupply: string;
  saveSupply: string;
  viewDwr: string;
  noSupplyTitle: string;
  noSupplyBody: string;
  notFoundTitle: string;
  notFoundBody: string;
  fields: {
    commodity: string;
    quantity: string;
    unit: string;
    grade: string;
    price: string;
    availableFrom: string;
    package: string;
    stock: string;
    status: string;
  };
  metrics: {
    active: string;
    readyToday: string;
    dwrOpen: string;
  };
  commodities: Record<SellerSupplyCommodity, string>;
  units: Record<SellerSupplyUnit, string>;
  statuses: Record<SellerSupplyStatus, string>;
  errors: {
    commodity: string;
    quantity: string;
    unit: string;
    grade: string;
    price: string;
  };
  success: string;
};

export const SELLER_SUPPLY_COPY: Record<Locale, SellerSupplyCopy> = {
  en: {
    workspaceTitle: "Supply workspace",
    workspaceSubtitle:
      "Check stock, add fresh supply, and keep the DWR record close.",
    supplyTitle: "Supply list",
    supplySubtitle:
      "Keep quantity, grade, package, and asking price visible at a glance.",
    newSupplyTitle: "Add new supply",
    newSupplySubtitle:
      "Enter the next supply lot with simple stock and price details.",
    dwrTitle: "DWR record",
    dwrSubtitle: "Review the warehouse record linked to this supply lot.",
    addSupply: "Add supply",
    saveSupply: "Save supply",
    viewDwr: "View DWR",
    noSupplyTitle: "No supply added yet",
    noSupplyBody: "New supply lots will appear here after you save one.",
    notFoundTitle: "Record not found",
    notFoundBody: "This DWR record is missing or the link is wrong.",
    fields: {
      commodity: "Commodity",
      quantity: "Quantity",
      unit: "Unit",
      grade: "Grade",
      price: "Asking price",
      availableFrom: "Available from",
      package: "Package",
      stock: "Stock note",
      status: "Status",
    },
    metrics: {
      active: "Active lots",
      readyToday: "Ready today",
      dwrOpen: "DWR open",
    },
    commodities: {
      potato: "Potato",
      onion: "Onion",
      vegetables: "Vegetables",
    },
    units: {
      kg: "Kg",
      bag: "Bag",
      crate: "Crate",
    },
    statuses: {
      active: "Active",
      scheduled: "Scheduled",
      "low-stock": "Low stock",
      paused: "Paused",
    },
    errors: {
      commodity: "Choose a valid commodity.",
      quantity: "Enter a quantity above zero.",
      unit: "Choose a valid unit.",
      grade: "Add a short grade label.",
      price: "Enter a price above zero.",
    },
    success: "Supply saved.",
  },
  bn: {
    workspaceTitle: "সরবরাহ কাজের ঘর",
    workspaceSubtitle:
      "স্টক দেখুন, নতুন সরবরাহ দিন, আর DWR রেকর্ড হাতের কাছে রাখুন।",
    supplyTitle: "সরবরাহ তালিকা",
    supplySubtitle:
      "পরিমাণ, গ্রেড, প্যাকেজ আর দর যেন এক নজরে দেখা যায়।",
    newSupplyTitle: "নতুন সরবরাহ দিন",
    newSupplySubtitle:
      "সহজভাবে পণ্য, পরিমাণ আর দামের তথ্য দিন।",
    dwrTitle: "DWR রেকর্ড",
    dwrSubtitle: "এই সরবরাহের সাথে যুক্ত গুদাম রেকর্ড দেখুন।",
    addSupply: "সরবরাহ দিন",
    saveSupply: "সংরক্ষণ করুন",
    viewDwr: "DWR দেখুন",
    noSupplyTitle: "এখনও কোনো সরবরাহ নেই",
    noSupplyBody: "নতুন সরবরাহ দিলে এখানে দেখা যাবে।",
    notFoundTitle: "রেকর্ড পাওয়া যায়নি",
    notFoundBody: "এই DWR রেকর্ডটি নেই বা লিংকটি ভুল।",
    fields: {
      commodity: "পণ্য",
      quantity: "পরিমাণ",
      unit: "একক",
      grade: "গ্রেড",
      price: "চাহিদামূল্য",
      availableFrom: "কখন থেকে",
      package: "প্যাকেজ",
      stock: "স্টক নোট",
      status: "অবস্থা",
    },
    metrics: {
      active: "চলমান লট",
      readyToday: "আজ প্রস্তুত",
      dwrOpen: "খোলা DWR",
    },
    commodities: {
      potato: "আলু",
      onion: "পেঁয়াজ",
      vegetables: "সবজি",
    },
    units: {
      kg: "কেজি",
      bag: "বস্তা",
      crate: "ক্রেট",
    },
    statuses: {
      active: "চলমান",
      scheduled: "তালিকাভুক্ত",
      "low-stock": "স্টক কম",
      paused: "থামানো",
    },
    errors: {
      commodity: "সঠিক পণ্য বাছুন।",
      quantity: "শূন্যের বেশি পরিমাণ দিন।",
      unit: "সঠিক একক বাছুন।",
      grade: "ছোট একটি গ্রেড লিখুন।",
      price: "শূন্যের বেশি দাম দিন।",
    },
    success: "সরবরাহ সংরক্ষণ হয়েছে।",
  },
};

export function getSellerSupplyCopy(locale: Locale): SellerSupplyCopy {
  return SELLER_SUPPLY_COPY[locale] ?? SELLER_SUPPLY_COPY.bn;
}
