"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { InboundReceiptDetail, InboundReceiptQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiFetch } from "../../../../lib/api-client";
import { HubInboundView } from "../inbound-view";

export default function HubInboundReceiptPage() {
  const { locale } = useBrowserLocale();
  const params = useParams<{ receiptId: string }>();
  const [queue, setQueue] = useState<InboundReceiptQueueResponse | undefined>();
  const [details, setDetails] = useState<Record<string, InboundReceiptDetail> | undefined>();
  useEffect(() => {
    apiFetch<InboundReceiptQueueResponse>("/api/hub/inbound").then(setQueue).catch(() => undefined);
    apiFetch<{ receipt: InboundReceiptDetail }>(`/api/hub/inbound/${params.receiptId}`).then((data) => setDetails({ [params.receiptId]: data.receipt })).catch(() => undefined);
  }, [params.receiptId]);
  return <HubInboundView locale={locale} queue={queue} details={details} selectedId={params.receiptId} />;
}
