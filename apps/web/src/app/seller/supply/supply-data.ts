import type { Locale, SellerSupplyListing } from "@fosholhaat/types";
import { getSellerSupplyCopy } from "@fosholhaat/types";

/**
 * Static listings only used for tests (NODE_ENV === "test").
 * Not displayed in production or dev mode.
 */
export const SELLER_SUPPLY_LISTINGS: SellerSupplyListing[] = [];

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

/**
 * @deprecated — DWR records now come from the API.
 * Kept for backward compatibility with old test references.
 */
export function getSellerDwrRecord(_recordId: string) {
  return null;
}
