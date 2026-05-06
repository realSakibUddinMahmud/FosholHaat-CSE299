import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStoredLocale } from "../../../lib/locale";
import { getBuyerDiscoveryCopy, type BuyerSearchResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
import {
  BuyerActionButton,
  BuyerDiscoveryShell,
  NoticeCard,
  ProductCard,
  SearchPlate,
  SectionTitle,
} from "../discovery-shared";

export default function BuyerSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const { locale } = useStoredLocale();
  const copy = getBuyerDiscoveryCopy(locale);
  const activeQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const [response, setResponse] = useState<BuyerSearchResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeQuery?.trim()) return;
    apiFetch<BuyerSearchResponse>(`/buyer/catalog/search?q=${encodeURIComponent(activeQuery)}&locale=${locale}`)
      .then((data) => { setResponse(data); setError(""); })
      .catch((err: Error) => setError(err.message));
  }, [activeQuery, locale]);

  if (!activeQuery?.trim()) {
    return (
      <BuyerDiscoveryShell locale={locale} title={copy.invalidQueryTitle} subtitle={copy.invalidQueryBody}>
        <NoticeCard title={copy.invalidQueryTitle} body={copy.invalidQueryBody} />
        <BuyerActionButton label={copy.actions.backToBrowse} onPress={() => router.push("/buyer")} />
      </BuyerDiscoveryShell>
    );
  }

  if (!response) {
    return (
      <BuyerDiscoveryShell locale={locale} title={copy.searchTitle} subtitle={copy.searchLead}>
        <SearchPlate text={activeQuery} />
        <NoticeCard title={copy.searchTitle} body={error || copy.searchLead} />
      </BuyerDiscoveryShell>
    );
  }

  return (
    <BuyerDiscoveryShell locale={locale} title={copy.searchTitle} subtitle={copy.searchLead}>
      <SearchPlate text={response.query} />
      {error ? <NoticeCard title={copy.searchEmptyTitle} body={error} /> : null}
      <SectionTitle
        title={`${copy.labels.totalResults}: ${response.totalResults}`}
        body={response.items.length ? copy.labels.searchResults : copy.searchEmptyBody}
      />
      {response.items.length ? (
        response.items.map((item) => (
          <ProductCard
            key={item.productId}
            item={item}
            actionLabel={copy.actions.openProduct}
            onPress={() => router.push(`/buyer/products/${item.productId}`)}
          />
        ))
      ) : (
        <>
          <NoticeCard title={copy.searchEmptyTitle} body={copy.searchEmptyBody} />
          <BuyerActionButton label={copy.actions.backToBrowse} onPress={() => router.push("/buyer")} />
        </>
      )}
    </BuyerDiscoveryShell>
  );
}
