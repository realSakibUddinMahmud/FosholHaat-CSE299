"use client";

import { useEffect, useState } from "react";
import type { SortingBatchDetail, SortingQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiFetch } from "../../../lib/api-client";
import { HubSortingView } from "./sorting-view";

export default function HubSortingPage() {
  const { locale } = useBrowserLocale();
  const [queue, setQueue] = useState<SortingQueueResponse | null>(null);
  const [details, setDetails] = useState<Record<string, SortingBatchDetail> | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch<SortingQueueResponse>("/api/hub/sorting")
      .then(async (data) => {
        if (!alive) return;
        setQueue(data);
        const entries = await Promise.all(
          data.batches.map(async (item) => {
            const detail = await apiFetch<{ batch: SortingBatchDetail }>(`/api/hub/sorting/${item.batchId}`);
            return [item.batchId, detail.batch] as const;
          }),
        );
        if (alive) setDetails(Object.fromEntries(entries.filter(([, value]) => value)) as Record<string, SortingBatchDetail>);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <HubSortingView
      locale={locale}
      queue={queue ?? undefined}
      details={details ?? undefined}
      selectedId={queue?.featuredBatchId}
    />
  );
}
