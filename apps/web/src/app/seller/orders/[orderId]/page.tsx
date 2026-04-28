"use client";

import { useParams } from "next/navigation";
import { useBrowserLocale } from "../../../../lib/locale";
import { SellerOrderDetailView } from "../orders-view";

export default function SellerOrderDetailPage() {
  const { locale } = useBrowserLocale();
  const params = useParams<{ orderId: string }>();
  return <SellerOrderDetailView locale={locale} orderId={params.orderId ?? ""} />;
}
