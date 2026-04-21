import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { type Locale, getSellerOrdersCopy } from "@fosholhaat/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { SELLER_ORDERS_QUEUE, getSellerOrders, nextActionLabel } from "./_data";

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
  const orders = getSellerOrders();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>Seller workspace</Text>
              <Text style={styles.title}>{copy.queueTitle}</Text>
              <Text style={styles.subtitle}>{copy.queueSubtitle}</Text>
            </View>
            <View style={styles.iconButton}>
              <MaterialIcons name="notifications-none" size={20} color={TOKENS.color.textSecondary} />
            </View>
          </View>

          <View style={styles.segmentRow}>
            {["New", "Preparing", "Dispatched", "Completed"].map((tab, index) => (
              <View key={tab} style={[styles.segment, index === 0 && styles.segmentActive]}>
                <Text style={[styles.segmentText, index === 0 && styles.segmentTextActive]}>{tab}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.incoming}</Text>
              <Text style={styles.summaryValue}>{SELLER_ORDERS_QUEUE.summary.incoming}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.active}</Text>
              <Text style={styles.summaryValue}>{SELLER_ORDERS_QUEUE.summary.active}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.ready}</Text>
              <Text style={styles.summaryValue}>{SELLER_ORDERS_QUEUE.summary.ready}</Text>
            </View>
          </View>

          <View style={styles.list}>
            {orders.map((order) => (
              <View key={order.id} style={styles.card}>
                <Text style={styles.scheduled}>Scheduled: {order.dueLabel}</Text>
                <View style={styles.cardTop}>
                  <View style={styles.cardHead}>
                    <Text style={styles.buyer}>{order.buyerName}</Text>
                    <Text style={styles.orderId}>{order.id}</Text>
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

          <Text style={styles.endText}>End of new orders</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: "dashboard", label: "Dashboard", active: false },
          { icon: "inventory", label: "Inventory", active: false },
          { icon: "receipt-long", label: "Orders", active: true },
          { icon: "account-circle", label: "Profile", active: false },
        ].map((item) => (
          <View key={item.label} style={styles.navItem}>
            <MaterialIcons
              name={item.icon as never}
              size={24}
              color={item.active ? TOKENS.brand.primary : TOKENS.color.textTertiary}
            />
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>{item.label}</Text>
          </View>
        ))}
      </View>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
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
  buyer: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "900", letterSpacing: -0.6 },
  orderId: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
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
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 12,
    backgroundColor: TOKENS.color.surfaceOverlayStrong,
    borderTopWidth: 1,
    borderTopColor: TOKENS.color.borderSoft,
  },
  navItem: { alignItems: "center", gap: 3, minWidth: 52 },
  navLabel: { color: TOKENS.color.textTertiary, fontSize: 9, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  navLabelActive: { color: TOKENS.brand.primary },
});
