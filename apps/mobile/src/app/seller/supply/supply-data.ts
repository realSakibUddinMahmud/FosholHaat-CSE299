import type { Locale, SellerDwrRecord, SellerSupplyListing } from "@fosholhaat/types";
import { getSellerSupplyCopy } from "@fosholhaat/types";

export const MOBILE_SELLER_SUPPLY_LISTINGS: SellerSupplyListing[] = [
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
];

export const MOBILE_SELLER_DWR_RECORDS: SellerDwrRecord[] = [
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
];

export function getMobileSellerCopy(locale: Locale) {
  return getSellerSupplyCopy(locale);
}

export function formatSellerMoney(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}
