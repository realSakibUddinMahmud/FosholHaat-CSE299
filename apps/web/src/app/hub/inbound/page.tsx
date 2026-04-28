"use client";

import { useEffect, useState } from "react";
import type { InboundReceiptDetail, InboundReceiptQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { HUB_INBOUND_QUEUE } from "./inbound.data";
import { HubInboundView } from "./inbound-view";

export default function HubInboundPage() {
  const { locale } = useBrowserLocale();
  const [queue, setQueue] = useState<InboundReceiptQueueResponse | null>(null);
  const [details, setDetails] = useState<Record<string, InboundReceiptDetail> | null>(null);

  useEffect(() => {
    if (typeof fetch !== "function") return;
    let alive = true;
    fetch("/api/hub/inbound", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then(async (data: InboundReceiptQueueResponse | null) => {
        if (!alive || !data) return;
        setQueue(data);
        const entries = await Promise.all(
          data.receipts.map(async (item) => {
            const response = await fetch(`/api/hub/inbound/${item.id}`, { cache: "no-store" });
            const detail = response.ok ? ((await response.json()) as { receipt: InboundReceiptDetail }).receipt : null;
            return [item.id, detail] as const;
          }),
        );
        if (alive) setDetails(Object.fromEntries(entries.filter(([, value]) => value)) as Record<string, InboundReceiptDetail>);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <HubInboundView
      locale={locale}
      queue={queue ?? HUB_INBOUND_QUEUE}
      details={details ?? undefined}
      selectedId={queue?.featuredReceiptId ?? HUB_INBOUND_QUEUE.featuredReceiptId}
    />
  );
}
