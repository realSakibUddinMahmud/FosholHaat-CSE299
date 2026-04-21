"use client";

import { useBrowserLocale } from "../../lib/locale";
import { SellerSupplyListView } from "./supply/supply-view";

export default function SellerWorkspacePage() {
  const { locale } = useBrowserLocale();
  return <SellerSupplyListView locale={locale} mode="workspace" />;
}
