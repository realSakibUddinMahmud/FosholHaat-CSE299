"use client";

import { useBrowserLocale } from "../../../lib/locale";
import { SellerSupplyListView } from "./supply-view";

export default function SellerSupplyPage() {
  const { locale } = useBrowserLocale();
  return <SellerSupplyListView locale={locale} />;
}
