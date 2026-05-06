import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TOKENS } from "../../styles/tokens";
import { SellerBottomNav, SellerHeader } from "./_shared";

const ITEMS = [
  { title: "Order queue needs review", body: "Incoming seller orders are waiting for the next action." },
  { title: "DWR records active", body: "Verified warehouse receipts are available from the supply lane." },
  { title: "Payouts updated", body: "Settlement records are synced from live payout data." },
];

export default function SellerNotificationsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SellerHeader title="Notifications" />
        <View style={styles.hero}>
          <Text style={styles.kicker}>Seller workspace</Text>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Operational alerts from orders, DWR, and payout lanes.</Text>
        </View>
        {ITEMS.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}
      </ScrollView>
      <SellerBottomNav active="dashboard" />
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
  card: { borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, borderRadius: 18, padding: 14, gap: 5 },
  cardTitle: { color: TOKENS.color.textStrong, fontSize: 17, fontWeight: "900" },
  cardBody: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "700" },
});
