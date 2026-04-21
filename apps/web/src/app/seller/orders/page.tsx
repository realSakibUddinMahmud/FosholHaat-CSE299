"use client";

import { useBrowserLocale } from "../../../lib/locale";
import { SellerOrdersListView } from "./orders-view";

export default function SellerOrdersPage() {
  const { locale } = useBrowserLocale();
  return <SellerOrdersListView locale={locale} />;
}

