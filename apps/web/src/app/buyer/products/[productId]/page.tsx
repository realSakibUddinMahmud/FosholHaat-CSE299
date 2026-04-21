"use client";

import { useBrowserLocale } from "../../../../lib/locale";
import { BuyerProductDetailView } from "../../discovery-view";

export default function BuyerProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const { locale } = useBrowserLocale();
  return <BuyerProductDetailView locale={locale} productId={params.productId} />;
}
