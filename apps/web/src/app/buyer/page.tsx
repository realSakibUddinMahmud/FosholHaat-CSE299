"use client";

import { useBrowserLocale } from "../../lib/locale";
import { BuyerDiscoveryView } from "./discovery-view";

export default function BuyerPage() {
  const { locale } = useBrowserLocale();
  return <BuyerDiscoveryView locale={locale} />;
}
