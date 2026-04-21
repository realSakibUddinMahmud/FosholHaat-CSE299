"use client";

import { useBrowserLocale } from "../../../lib/locale";
import { HUB_INBOUND_QUEUE } from "./inbound.data";
import { HubInboundView } from "./inbound-view";

export default function HubInboundPage() {
  const { locale } = useBrowserLocale();
  return <HubInboundView locale={locale} selectedId={HUB_INBOUND_QUEUE.featuredReceiptId} />;
}
