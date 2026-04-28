import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import { getBuyerDiscoveryCopy } from "@fosholhaat/types";
import { TOKENS } from "../../../../styles/tokens";
import { getBuyerProductFixture, getFirstDiscoveryParam } from "../../discovery-data";
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
  const response = getBuyerProductFixture(getFirstDiscoveryParam(productId) ?? "", locale);

  if (!response) {
    return (
      <BuyerDiscoveryShell locale={locale} title={copy.productMissingTitle} subtitle={copy.productMissingBody}>
        <NoticeCard title={copy.productMissingTitle} body={copy.productMissingBody} />
        <BuyerActionButton label={copy.actions.backToBrowse} onPress={() => router.push("/buyer")} />
      </BuyerDiscoveryShell>
    );
  }

  return (
    <BuyerDiscoveryShell locale={locale} title={response.product.title} subtitle={copy.detailLead}>
      <SearchPlate text={response.product.imageUrls?.[0] ?? response.product.title} />
      <View style={styles.panel}>
        <Text style={styles.price}>{response.product.priceLabel}</Text>
        <Text style={styles.meta}>{response.product.packageLabel}</Text>
        <Text style={styles.meta}>{response.product.stockLabel}</Text>
        <Text style={styles.meta}>{response.product.sellerLabel}</Text>
        {response.product.verificationLabel ? <Text style={styles.trust}>{response.product.verificationLabel}</Text> : null}
      </View>
      <SectionTitle title={copy.detailDescriptionTitle} body={response.product.description} />
      <NoticeCard title={copy.detailTrustTitle} body={copy.detailRouteHint} />
      <View style={styles.actions}>
        <Pressable style={styles.cta} onPress={() => router.push(response.purchaseOptions.cartRoute)}>
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
