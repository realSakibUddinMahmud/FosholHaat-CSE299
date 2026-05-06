import type { Locale } from "@fosholhaat/types";
import { getSellerSupplyCopy } from "@fosholhaat/types";

/**
 * Pure display helpers – no static demo data.
 */

export function getMobileSellerCopy(locale: Locale) {
  return getSellerSupplyCopy(locale);
}

export function formatSellerMoney(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}
