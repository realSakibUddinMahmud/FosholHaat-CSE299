"use client";

import { useParams } from "next/navigation";
import { useBrowserLocale } from "../../../../lib/locale";
import { HUB_SORTING_QUEUE } from "../sorting.data";
import { HubSortingView } from "../sorting-view";

export default function HubSortingBatchPage() {
  const { locale } = useBrowserLocale();
  const params = useParams<{ batchId?: string | string[] }>();
  const batchId = Array.isArray(params.batchId) ? params.batchId[0] : params.batchId;

  return <HubSortingView locale={locale} selectedId={batchId ?? HUB_SORTING_QUEUE.featuredBatchId} />;
}
