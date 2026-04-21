import type { Locale, SellerDwrRecord, SellerSupplyListing } from "@fosholhaat/types";
import { getSellerSupplyCopy } from "@fosholhaat/types";

export const SELLER_SUPPLY_LISTINGS: SellerSupplyListing[] = [
  {
    id: "supply-301",
    commodity: "potato",
    commodityLabel: "Potato",
    quantity: 120,
    unit: "bag",
    gradeLabel: "Cold store grade A",
    packageLabel: "Jute bag lot",
    askingPrice: 1480,
    availableFrom: "2026-04-22",
    status: "active",
    stockHint: "Ready for pickup from Bogura this morning.",
    dwrRecordId: "dwr-301",
  },
  {
    id: "supply-302",
    commodity: "onion",
    commodityLabel: "Onion",
    quantity: 38,
    unit: "crate",
    gradeLabel: "Dry medium",
    packageLabel: "Plastic crate lot",
    askingPrice: 620,
    availableFrom: "2026-04-23",
    status: "low-stock",
    stockHint: "Low remaining stock after two confirmed holds.",
    dwrRecordId: "dwr-302",
  },
  {
    id: "supply-303",
    commodity: "vegetables",
    commodityLabel: "Vegetables",
    quantity: 240,
    unit: "kg",
    gradeLabel: "Mixed fresh lot",
    packageLabel: "Loose kg lot",
    askingPrice: 55,
    availableFrom: "2026-04-24",
    status: "scheduled",
    stockHint: "Scheduled for tomorrow dispatch window.",
    dwrRecordId: "dwr-303",
  },
];

export const SELLER_DWR_RECORDS: SellerDwrRecord[] = [
  {
    id: "dwr-301",
    listingId: "supply-301",
    recordCode: "DWR-BOG-301",
    commodityLabel: "Potato",
    gradeLabel: "Cold store grade A",
    packageLabel: "Jute bag lot",
    quantity: 120,
    unit: "bag",
    askingPrice: 1480,
    receivedAt: "2026-04-21 06:40",
    hubLabel: "Bogura consolidation hub",
    inspectorLabel: "Rafi warehouse team",
    notes: [
      "Bag count matched seller declaration.",
      "Moisture check passed for active shipment.",
    ],
  },
  {
    id: "dwr-302",
    listingId: "supply-302",
    recordCode: "DWR-BOG-302",
    commodityLabel: "Onion",
    gradeLabel: "Dry medium",
    packageLabel: "Plastic crate lot",
    quantity: 38,
    unit: "crate",
    askingPrice: 620,
    receivedAt: "2026-04-21 08:10",
    hubLabel: "Bogura consolidation hub",
    inspectorLabel: "Mita hub desk",
    notes: [
      "Two crates moved to exception shelf for count review.",
      "Seller confirmed replacement stock tomorrow.",
    ],
  },
];

export function formatSellerMoney(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getWebSellerSupplyCopy(locale: Locale) {
  return getSellerSupplyCopy(locale);
}

export function getSellerDwrRecord(recordId: string) {
  return SELLER_DWR_RECORDS.find((record) => record.id === recordId) ?? null;
}
