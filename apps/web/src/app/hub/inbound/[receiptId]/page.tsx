"use client";

import { useParams } from "next/navigation";
import { useBrowserLocale } from "../../../../lib/locale";
import { HUB_INBOUND_QUEUE } from "../inbound.data";
import { HubInboundView } from "../inbound-view";

export default function HubInboundReceiptPage() {
  const { locale } = useBrowserLocale();
  const params = useParams<{ receiptId?: string | string[] }>();
  const receiptId = Array.isArray(params.receiptId) ? params.receiptId[0] : params.receiptId;

  return (
    <HubInboundView
      locale={locale}
      selectedId={receiptId ?? HUB_INBOUND_QUEUE.featuredReceiptId}
    />
  );
}
