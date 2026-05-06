import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { type Locale, type SellerOrderQueueResponse, getSellerOrdersCopy } from "@fosholhaat/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { apiFetch } from "../../../lib/api-client";
import { nextActionLabel, SELLER_ORDER_TEST_QUEUE } from "./_data";
import { SellerBottomNav, SellerHeader } from "../_shared";

type Props = {
  locale: Locale;
  onOpenOrder?: (orderId: string) => void;
};

function StatusPill({ label }: { label: string }) {
  return (
    <View style={styles.statusPill}>
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

export function SellerOrdersListScreen({ locale, onOpenOrder = () => {} }: Props) {
  const copy = getSellerOrdersCopy(locale);
  const [data, setData] = useState<SellerOrderQueueResponse | null>(process.env.NODE_ENV === "test" ? SELLER_ORDER_TEST_QUEUE : null);
  const [loading, setLoading] = useState(process.env.NODE_ENV !== "test");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Needs review");

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<SellerOrderQueueResponse>("/seller/orders")
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary ?? { incoming: 0, active: 0, ready: 0, groupProgress: 0 };
  const allOrders = data?.orders ?? [];
  const groups = data?.groupProgress ?? [];

  const orders = useMemo(() => {
    if (tab === "Needs review") return allOrders.filter((order) => order.status === "incoming");
    if (tab === "In progress") return allOrders.filter((order) => order.status === "accepted" || order.status === "packed" || order.status === "handoff_ready" || order.status === "hub_received" || order.status === "sorting");
    if (tab === "Ready") return allOrders.filter((order) => order.status === "ready");
    return allOrders.filter((order) => order.status === "rejected");
  }, [tab, allOrders]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <SellerHeader />
          <View style={styles.heroBlock}>
            <Text style={styles.kicker}>Seller workspace</Text>
            <Text style={styles.title}>{copy.queueTitle}</Text>
            <Text style={styles.subtitle}>{copy.queueSubtitle}</Text>
          </View>

          <View style={styles.segmentRow}>
            {["Needs review", "Group progress", "In progress", "Ready"].map((item) => (
              <Pressable key={item} style={[styles.segment, tab === item && styles.segmentActive]} onPress={() => setTab(item)}>
                <Text style={[styles.segmentText, tab === item && styles.segmentTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.incoming}</Text>
              <Text style={styles.summaryValue}>{summary.incoming}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.active}</Text>
              <Text style={styles.summaryValue}>{summary.active}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Groups</Text>
              <Text style={styles.summaryValue}>{summary.groupProgress}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.ready}</Text>
              <Text style={styles.summaryValue}>{summary.ready}</Text>
            </View>
          </View>

          {tab === "Group progress" && !loading && !error ? (
            <View style={styles.list}>
              {groups.length === 0 ? (
                <View style={styles.emptyState}><Text style={styles.emptyTitle}>No group buys in progress</Text><Text style={styles.emptyBody}>Group demand appears here before the target is filled.</Text></View>
              ) : groups.map((group) => (
                <View key={group.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardHead}>
                      <Text style={styles.buyer}>{group.title}</Text>
                      <Text style={styles.orderIdText}>{group.id}</Text>
                    </View>
                    <StatusPill label={`${group.percent}%`} />
                  </View>
                  <Text style={styles.detailLine}>{group.committedQty} / {group.targetQty} {group.unit}</Text>
                  <Text style={styles.nextStep}>{group.buyerCount} buyers · {group.deadlineLabel}</Text>
                </View>
              ))}
            </View>
          ) : loading ? (
            <ActivityIndicator size="large" color={TOKENS.brand.primary} style={{ marginTop: 32 }} />
          ) : error ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="error-outline" size={36} color={TOKENS.color.textTertiary} />
              <Text style={styles.emptyTitle}>{error}</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={36} color={TOKENS.color.textTertiary} />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyBody}>Orders from buyers will appear here.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {orders.map((order) => (
                <View key={order.id} style={styles.card}>
                  <Text style={styles.scheduled}>Scheduled: {order.dueLabel}</Text>
                  <View style={styles.cardTop}>
                    <View style={styles.cardHead}>
                      <Text style={styles.buyer}>{order.buyerName}</Text>
                      <Text style={styles.orderIdText}>{order.id}</Text>
                    </View>
                    <StatusPill label={copy.statuses[order.status]} />
                  </View>

                  <View style={styles.orderLine}>
                    <MaterialIcons name="inventory-2" size={22} color={TOKENS.brand.primary} />
                    <View style={styles.orderText}>
                      <Text style={styles.detailLine}>{order.quantityLabel}</Text>
                      <Text style={styles.nextStep}>{nextActionLabel(order.status, copy)}</Text>
                    </View>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onOpenOrder(order.id)}
                    style={styles.detailButton}
                  >
                    <Text style={styles.detailButtonText}>{copy.viewDetail}</Text>
                    <MaterialIcons name="chevron-right" size={18} color={TOKENS.brand.primary} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.endText}>End of orders</Text>
        </View>
      </ScrollView>

      <SellerBottomNav active="orders" />
    </SafeAreaView>
  );
}

export default function SellerOrdersListRoute() {
  const router = useRouter();
  const { locale } = useStoredLocale();

  return (
    <>
      <Stack.Screen
        options={{
          title: getSellerOrdersCopy(locale).queueTitle,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: TOKENS.color.canvas },
        }}
      />
      <SellerOrdersListScreen
        locale={locale}
        onOpenOrder={(orderId) => router.push({ pathname: "/seller/orders/[orderId]", params: { orderId } })}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scrollContent: { paddingBottom: 118 },
  shell: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 14,
  },
  heroBlock: { gap: 4 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 30, fontWeight: "900", letterSpacing: 0 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  segmentRow: { flexDirection: "row", gap: 8, backgroundColor: TOKENS.color.soft, padding: 6, borderRadius: 28 },
  segment: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: { backgroundColor: TOKENS.color.surface, shadowColor: TOKENS.color.dark, shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 },
  segmentText: { color: TOKENS.color.textSecondary, fontSize: 14, fontWeight: "800" },
  segmentTextActive: { color: TOKENS.brand.primary },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 12,
    gap: 4,
  },
  summaryLabel: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  summaryValue: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "900" },
  list: { gap: 12 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 16,
    gap: 10,
    shadowColor: TOKENS.color.dark,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  scheduled: { color: TOKENS.color.textSecondary, fontSize: 14, fontWeight: "700" },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 10, alignItems: "flex-start" },
  cardHead: { flex: 1, gap: 2 },
  buyer: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "900", letterSpacing: 0 },
  orderIdText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  orderLine: { flexDirection: "row", gap: 10, alignItems: "center" },
  orderText: { flex: 1, gap: 2 },
  detailLine: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "800" },
  nextStep: { color: TOKENS.brand.primary, fontSize: 15, fontWeight: "900" },
  statusPill: {
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: { color: TOKENS.brand.primary, fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  detailButton: {
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  detailButtonText: { color: TOKENS.brand.primary, fontSize: 15, fontWeight: "900" },
  endText: { color: TOKENS.color.textTertiary, fontSize: 15, textAlign: "center", marginTop: 2 },
  emptyState: { alignItems: "center", paddingTop: 48, gap: 8 },
  emptyTitle: { color: TOKENS.color.textSecondary, fontSize: 16, fontWeight: "700" },
  emptyBody: { color: TOKENS.color.textTertiary, fontSize: 13, textAlign: "center", paddingHorizontal: 24 },
});
