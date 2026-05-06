import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SellerDwrListResponse } from "@fosholhaat/types";
import { TOKENS } from "../../../styles/tokens";
import { SellerBottomNav, SellerHeader } from "../_shared";
import { apiFetch } from "../../../lib/api-client";
import { formatSellerMoney } from "../supply/supply-data";

export default function SellerDwrListScreen() {
  const router = useRouter();
  const [data, setData] = useState<SellerDwrListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<SellerDwrListResponse>("/seller/dwr")
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const records = data?.records ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SellerHeader title="DWR records" />
        <View style={styles.hero}>
          <Text style={styles.kicker}>Digital warehouse receipts</Text>
          <Text style={styles.title}>DWR records</Text>
          <Text style={styles.subtitle}>Verified receipt records linked to seller supply.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={TOKENS.brand.primary} style={{ marginTop: 32 }} />
        ) : error ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="error-outline" size={36} color={TOKENS.color.textTertiary} />
            <Text style={styles.emptyTitle}>{error}</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={36} color={TOKENS.color.textTertiary} />
            <Text style={styles.emptyTitle}>No DWR records yet</Text>
            <Text style={styles.emptyBody}>DWR records will appear after your supply is received at the hub.</Text>
          </View>
        ) : (
          records.map((record) => (
            <Pressable
              key={record.id}
              style={styles.card}
              onPress={() => router.push({ pathname: "/seller/dwr/[recordId]", params: { recordId: record.id } })}
            >
              <View style={styles.row}>
                <MaterialIcons name="description" size={22} color={TOKENS.brand.primary} />
                <View style={styles.body}>
                  <Text style={styles.cardTitle}>{record.recordCode}</Text>
                  <Text style={styles.meta}>
                    {record.commodityLabel} · {record.quantity} {record.unit} · {record.status}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={TOKENS.color.textTertiary} />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
      <SellerBottomNav active="supply" />
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
  card: { borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, borderRadius: 18, padding: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  body: { flex: 1, gap: 3 },
  cardTitle: { color: TOKENS.color.textStrong, fontSize: 17, fontWeight: "900" },
  meta: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingTop: 48, gap: 8 },
  emptyTitle: { color: TOKENS.color.textSecondary, fontSize: 16, fontWeight: "700" },
  emptyBody: { color: TOKENS.color.textTertiary, fontSize: 13, textAlign: "center", paddingHorizontal: 24 },
});
