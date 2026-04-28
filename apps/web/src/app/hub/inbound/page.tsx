"use client";

import { useEffect, useState } from "react";
import type { InboundReceiptDetail, InboundReceiptQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiFetch } from "../../../lib/api-client";
import { HubInboundView } from "./inbound-view";

export default function HubInboundPage() {
  const { locale } = useBrowserLocale();
  const [queue, setQueue] = useState<InboundReceiptQueueResponse | null>(null);
  const [details, setDetails] = useState<Record<string, InboundReceiptDetail> | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch<InboundReceiptQueueResponse>("/api/hub/inbound")
      .then(async (data) => {
        if (!alive) return;
        setQueue(data);
        const entries = await Promise.all(
          data.receipts.map(async (item) => {
            const detail = await apiFetch<{ receipt: InboundReceiptDetail }>(`/api/hub/inbound/${item.id}`);
            return [item.id, detail.receipt] as const;
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
      queue={queue ?? undefined}
      details={details ?? undefined}
      selectedId={queue?.featuredReceiptId}
    />
  );
}
