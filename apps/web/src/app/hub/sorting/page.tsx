"use client";

import { useEffect, useState } from "react";
import type { SortingBatchDetail, SortingQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { HUB_SORTING_QUEUE } from "./sorting.data";
import { HubSortingView } from "./sorting-view";

export default function HubSortingPage() {
  const { locale } = useBrowserLocale();
  const [queue, setQueue] = useState<SortingQueueResponse | null>(null);
  const [details, setDetails] = useState<Record<string, SortingBatchDetail> | null>(null);

  useEffect(() => {
    if (typeof fetch !== "function") return;
    let alive = true;
    fetch("/api/hub/sorting", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then(async (data: SortingQueueResponse | null) => {
        if (!alive || !data) return;
        setQueue(data);
        const entries = await Promise.all(
          data.batches.map(async (item) => {
            const response = await fetch(`/api/hub/sorting/${item.batchId}`, { cache: "no-store" });
            const detail = response.ok ? ((await response.json()) as { batch: SortingBatchDetail }).batch : null;
            return [item.batchId, detail] as const;
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
      queue={queue ?? HUB_SORTING_QUEUE}
      details={details ?? undefined}
      selectedId={queue?.featuredBatchId ?? HUB_SORTING_QUEUE.featuredBatchId}
    />
  );
}
