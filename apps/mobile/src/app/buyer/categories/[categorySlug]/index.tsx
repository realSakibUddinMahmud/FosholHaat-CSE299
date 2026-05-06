import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import { getBuyerDiscoveryCopy, type BuyerCategoryBrowseResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../../lib/api-client";
import {
  BuyerActionButton,
  BuyerDiscoveryShell,
  NoticeCard,
  ProductCard,
  SearchPlate,
  SectionTitle,
} from "../../discovery-shared";

export default function BuyerCategoryBrowseScreen() {
  const router = useRouter();
  const { categorySlug } = useLocalSearchParams<{ categorySlug?: string | string[] }>();
  const { locale } = useStoredLocale();
  const copy = getBuyerDiscoveryCopy(locale);
  const slug = Array.isArray(categorySlug) ? categorySlug[0] : categorySlug;
  const [response, setResponse] = useState<BuyerCategoryBrowseResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    apiFetch<BuyerCategoryBrowseResponse>(`/buyer/catalog/categories/${slug}?locale=${locale}`)
      .then((data) => { setResponse(data); setError(""); })
      .catch((err: Error) => setError(err.message));
  }, [slug, locale]);

  if (!slug || (!response && error)) {
    return (
      <BuyerDiscoveryShell locale={locale} title={copy.categoryMissingTitle} subtitle={copy.categoryMissingBody}>
        <NoticeCard title={copy.categoryMissingTitle} body={error || copy.categoryMissingBody} />
        <BuyerActionButton label={copy.actions.backToBrowse} onPress={() => router.push("/buyer")} />
      </BuyerDiscoveryShell>
    );
  }

  if (!response) {
    return (
      <BuyerDiscoveryShell locale={locale} title={copy.categoryTitlePrefix} subtitle={copy.categoryLead}>
        <NoticeCard title={copy.categoryTitlePrefix} body={copy.categoryLead} />
      </BuyerDiscoveryShell>
    );
  }

  return (
    <BuyerDiscoveryShell
      locale={locale}
      title={`${copy.categoryTitlePrefix}: ${response.category.label}`}
      subtitle={copy.categoryLead}
    >
      <SearchPlate
        text={copy.searchPlaceholder}
        actionLabel={copy.actions.searchNow}
        onPress={() => router.push("/buyer/search")}
      />
      <SectionTitle
        title={response.items.length ? copy.labels.highlights : copy.categoryEmptyTitle}
        body={response.items.length ? response.category.label : copy.categoryEmptyBody}
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
          <NoticeCard title={copy.categoryEmptyTitle} body={copy.categoryEmptyBody} />
          <BuyerActionButton label={copy.actions.backToBrowse} onPress={() => router.push("/buyer")} />
        </>
      )}
    </BuyerDiscoveryShell>
  );
}
