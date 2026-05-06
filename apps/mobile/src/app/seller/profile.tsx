import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SellerPayoutListResponse, SellerSupplyListResponse } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import { clearSession } from "../../lib/session";
import { TOKENS } from "../../styles/tokens";
import { SellerBottomNav, SellerHeader } from "./_shared";

export default function SellerProfileScreen() {
  const router = useRouter();
  const [me, setMe] = useState<{ fullName: string; email: string; phone?: string; businessName?: string; district?: string } | null>(null);
  const [supply, setSupply] = useState<SellerSupplyListResponse | null>(null);
  const [payouts, setPayouts] = useState<SellerPayoutListResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch<any>("/auth/me"), apiFetch<SellerSupplyListResponse>("/seller/supply"), apiFetch<SellerPayoutListResponse>("/seller/payouts")])
      .then(([meData, supplyData, payoutData]) => {
        setMe(meData);
        setSupply(supplyData);
        setPayouts(payoutData);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SellerHeader title="Seller profile" />
        <View style={styles.hero}>
          <Text style={styles.kicker}>Seller account</Text>
          <Text style={styles.title}>{me?.businessName ?? supply?.workspace.sellerName ?? "Seller profile"}</Text>
          <Text style={styles.subtitle}>{me?.fullName ?? supply?.workspace.marketLabel ?? "Live seller workspace"}</Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.valueSmall}>{me?.phone ?? "Not saved"}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.valueSmall}>{me?.email ?? "Not loaded"}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Business district</Text>
            <Text style={styles.valueSmall}>{me?.district ?? "Not loaded"}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Supply lots</Text>
            <Text style={styles.value}>{supply?.listings.length ?? 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Payout records</Text>
            <Text style={styles.value}>{payouts?.records.length ?? 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Pending payout</Text>
            <Text style={styles.value}>{payouts?.summary.pending ?? 0}</Text>
          </View>
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={async () => {
            await clearSession();
            router.replace("/login");
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
      <SellerBottomNav active="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 112, gap: 14 },
  hero: { gap: 7 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 0, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 30, lineHeight: 34, fontWeight: "900", letterSpacing: 0 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  error: { color: TOKENS.color.alertLive, fontSize: 12, fontWeight: "700" },
  grid: { gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  label: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  value: { color: TOKENS.color.textStrong, fontSize: 26, fontWeight: "900" },
  valueSmall: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  logoutButton: { minHeight: 54, borderRadius: 18, backgroundColor: TOKENS.color.alertLive, alignItems: "center", justifyContent: "center" },
  logoutText: { color: TOKENS.color.surface, fontSize: 16, fontWeight: "900" },
});
