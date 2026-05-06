import React from "react";
import { useStoredLocale } from "../../../lib/locale";
import { SellerWorkspaceScreen } from "../index";

export default function SellerSupplyRoute() {
  const { locale } = useStoredLocale();
  return <SellerWorkspaceScreen locale={locale} mode="supply" />;
}

export { SellerWorkspaceScreen as SellerSupplyListScreen };
