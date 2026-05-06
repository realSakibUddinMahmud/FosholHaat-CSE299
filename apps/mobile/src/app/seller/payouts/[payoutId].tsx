import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SellerPayoutListResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
import { TOKENS } from "../../../styles/tokens";
import { SellerBottomNav, SellerHeader } from "../_shared";

export default function SellerPayoutDetailRoute() {
  const params = useLocalSearchParams<{ payoutId?: string }>();
  const payoutId = params.payoutId ? decodeURIComponent(params.payoutId) : "";
  const [data, setData] = useState<SellerPayoutListResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<SellerPayoutListResponse>("/seller/payouts").then(setData).catch((err: Error) => setError(err.message));
  }, []);

  const payout = useMemo(() => data?.records.find((row) => row.referenceCode === payoutId), [data, payoutId]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SellerHeader title="Payout detail" />
        <View style={styles.hero}>
          <Text style={styles.kicker}>Seller workspace · finance</Text>
          <Text style={styles.title}>{payout?.referenceCode ?? "Payout detail"}</Text>
          <Text style={styles.subtitle}>{payout?.orderRef ?? (error || "Loading live payout record.")}</Text>
        </View>
        {payout ? (
          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{payout.status.toUpperCase()}</Text>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>BDT {payout.amount.toLocaleString("en-BD")}</Text>
            <Text style={styles.label}>Method</Text>
            <Text style={styles.value}>{payout.method}</Text>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>{new Date(payout.createdAt).toLocaleDateString("en-BD")}</Text>
          </View>
        ) : null}
      </ScrollView>
      <SellerBottomNav active="payouts" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 112, gap: 14 },
  hero: { gap: 6 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 0, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 30, lineHeight: 34, fontWeight: "900", letterSpacing: 0 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  card: { borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, borderRadius: 18, padding: 16, gap: 8 },
  label: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  value: { color: TOKENS.color.textStrong, fontSize: 17, fontWeight: "900" },
});
