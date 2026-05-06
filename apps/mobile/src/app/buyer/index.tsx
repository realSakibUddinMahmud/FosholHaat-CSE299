import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../lib/locale";
import { getBuyerDiscoveryCopy, type BuyerCatalogResponse } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import {
  BuyerDiscoveryShell,
  ProductCard,
  SearchPlate,
  SectionTitle,
} from "./discovery-shared";
import { TOKENS } from "../../styles/tokens";
import { BuyerBottomNav } from "./bottom-nav";

export default function BuyerDiscoveryHomeScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerDiscoveryCopy(locale);
  const [catalog, setCatalog] = useState<BuyerCatalogResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<BuyerCatalogResponse>(`/buyer/catalog?locale=${locale}`)
      .then((data) => {
        setCatalog({ ...data, highlights: data.highlights.filter((item) => !item.groupBuyId) });
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, [locale]);
  const highlights = catalog?.highlights ?? [];

  return (
      <BuyerDiscoveryShell locale={locale} title={copy.browseTitle} subtitle={copy.browseLead}>
      <SearchPlate
        text={copy.searchPlaceholder}
        actionLabel={copy.searchPlaceholder}
        onPress={() => router.push("/buyer/search")}
      />
      <View style={styles.chipRow}>
        <View style={styles.chipActive}><Text style={styles.chipTextActive}>All Items</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Potatoes</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Onions</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Vegetables</Text></View>
      </View>

      <SectionTitle title="Single-buy lots" body="Buy seller-approved quantities immediately." />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!error && highlights.length === 0 ? <Text style={styles.errorText}>No single-buy lots available right now.</Text> : null}
      {highlights.map((item) => (
        <ProductCard
          key={item.productId}
          item={item}
          actionLabel={copy.actions.openProduct}
          onPress={() => router.push(`/buyer/products/${item.productId}`)}
        />
      ))}

      <View style={styles.footerGap} />
      <BuyerBottomNav active="home" />
    </BuyerDiscoveryShell>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "800" },
  chipTextActive: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  errorText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "800" },
  footerGap: { height: 8 },
});
