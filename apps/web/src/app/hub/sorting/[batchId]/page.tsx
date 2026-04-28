"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { SortingBatchDetail, SortingQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiFetch } from "../../../../lib/api-client";
import { HubSortingView } from "../sorting-view";

export default function HubSortingBatchPage() {
  const { locale } = useBrowserLocale();
  const params = useParams<{ batchId: string }>();
  const [queue, setQueue] = useState<SortingQueueResponse | undefined>();
  const [details, setDetails] = useState<Record<string, SortingBatchDetail> | undefined>();
  useEffect(() => {
    apiFetch<SortingQueueResponse>("/api/hub/sorting").then(setQueue).catch(() => undefined);
    apiFetch<{ batch: SortingBatchDetail }>(`/api/hub/sorting/${params.batchId}`).then((data) => setDetails({ [params.batchId]: data.batch })).catch(() => undefined);
  }, [params.batchId]);
  return <HubSortingView locale={locale} queue={queue} details={details} selectedId={params.batchId} />;
}
