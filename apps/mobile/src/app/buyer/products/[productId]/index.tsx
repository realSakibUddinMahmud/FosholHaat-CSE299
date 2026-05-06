import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import { getBuyerDiscoveryCopy, type BuyerProductDetailResponse } from "@fosholhaat/types";
import { TOKENS } from "../../../../styles/tokens";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import {
  BuyerActionButton,
  BuyerDiscoveryShell,
  NoticeCard,
  SearchPlate,
  SectionTitle,
} from "../../discovery-shared";

export default function BuyerProductDetailScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string | string[] }>();
  const { locale } = useStoredLocale();
  const copy = getBuyerDiscoveryCopy(locale);
  const id = Array.isArray(productId) ? productId[0] : productId;
  const [response, setResponse] = useState<BuyerProductDetailResponse | null>(null);
  const [qty, setQty] = useState("1");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiFetch<BuyerProductDetailResponse>(`/buyer/catalog/products/${id}?locale=${locale}`)
      .then((data) => {
        setResponse(data);
        setQty(String(data.product.singleMinQty ?? 1));
        setError("");
      })
      .catch((err: Error) => setError(err.message));
  }, [id, locale]);

  async function addToCart() {
    if (!id || !response) return;
    const quantity = Number(qty);
    const min = response.product.singleMinQty ?? 1;
    const max = response.product.singleMaxQty ?? quantity;
    if (!Number.isFinite(quantity) || quantity < min || quantity > max) {
      setError(`Quantity must be between ${min} and ${max}.`);
      return;
    }
    try {
      await apiPost("/buyer/cart/items", { supplyLotId: id, quantity, mode: "SINGLE" });
      router.push("/buyer/cart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add to cart");
    }
  }

  if (!response) {
    return (
      <BuyerDiscoveryShell locale={locale} title={copy.productMissingTitle} subtitle={copy.productMissingBody}>
        <NoticeCard title={copy.productMissingTitle} body={error || copy.productMissingBody} />
        <BuyerActionButton label={copy.actions.backToBrowse} onPress={() => router.push("/buyer")} />
      </BuyerDiscoveryShell>
    );
  }

  return (
    <BuyerDiscoveryShell locale={locale} title={response.product.title} subtitle={copy.detailLead}>
      {response.product.imageUrls?.[0] ? (
        <Image source={{ uri: response.product.imageUrls[0] }} style={styles.heroImage} />
      ) : (
        <SearchPlate text={response.product.title} />
      )}
      <View style={styles.panel}>
        <Text style={styles.price}>{response.product.priceLabel}</Text>
        <Text style={styles.meta}>{response.product.packageLabel}</Text>
        <Text style={styles.meta}>{response.product.stockLabel}</Text>
        <Text style={styles.meta}>{response.product.sellerLabel}</Text>
        <Text style={styles.meta}>Min {response.product.singleMinQty ?? 1} · Max {response.product.singleMaxQty ?? "available"}</Text>
        {response.product.verificationLabel ? <Text style={styles.trust}>{response.product.verificationLabel}</Text> : null}
      </View>
      <View style={styles.panel}>
        <Text style={styles.meta}>Quantity</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={qty} onChangeText={setQty} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <SectionTitle title={copy.detailDescriptionTitle} body={response.product.description} />
      <NoticeCard title={copy.detailTrustTitle} body={copy.detailRouteHint} />
      <View style={styles.actions}>
        <Pressable style={styles.cta} onPress={addToCart}>
          <Text style={styles.ctaText}>{copy.actions.goToCart}</Text>
        </Pressable>
        <BuyerActionButton
          label={copy.actions.backToBrowse}
          variant="secondary"
          onPress={() => router.push("/buyer")}
        />
      </View>
    </BuyerDiscoveryShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  heroImage: { width: "100%", height: 240, borderRadius: 20, backgroundColor: TOKENS.color.surfaceMuted },
  input: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: TOKENS.color.borderSoft, paddingHorizontal: 12, color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "800" },
  error: { color: TOKENS.color.alertLive, fontSize: 13, fontWeight: "800" },
  price: { color: TOKENS.brand.primary, fontSize: 18, fontWeight: "900" },
  meta: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  trust: { color: TOKENS.color.successText, fontSize: 13, fontWeight: "800" },
  cta: {
    minHeight: 50,
    borderRadius: 25,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  ctaText: { color: TOKENS.color.surface, fontSize: 14, fontWeight: "900" },
  actions: { gap: 10 },
});
