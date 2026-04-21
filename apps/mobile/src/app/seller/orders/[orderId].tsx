import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type Locale, getSellerOrdersCopy } from "@fosholhaat/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { getSellerOrderById, nextActionLabel } from "./_data";

type Props = {
  locale: Locale;
  orderId?: string;
  onBack?: () => void;
};

export function SellerOrderDetailScreen({ locale, orderId, onBack = () => {} }: Props) {
  const copy = getSellerOrdersCopy(locale);
  const order = getSellerOrderById(orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.shell, styles.notFoundShell]}>
          <Text style={styles.notFoundTitle}>{copy.notFoundTitle}</Text>
          <Text style={styles.notFoundBody}>{copy.notFoundBody}</Text>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{copy.queueTitle}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{copy.viewDetail}</Text>
          </Pressable>

          <View style={styles.heroCard}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.title}>{order.buyerName}</Text>
            <Text style={styles.subtitle}>{copy.queueSubtitle}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaPill}>{copy.statuses[order.status]}</Text>
              <Text style={styles.metaPill}>{order.dueLabel}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.detailTitle}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{copy.quantity}</Text>
              <Text style={styles.value}>{order.quantityLabel}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{copy.pickupWindow}</Text>
              <Text style={styles.value}>{order.pickupWindow}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{copy.status}</Text>
              <Text style={styles.value}>{nextActionLabel(order.status, copy)}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.detailSubtitle}</Text>
            {order.items.map((item) => (
              <View key={`${order.id}-${item.name}`} style={styles.itemCard}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemText}>{item.quantityLabel}</Text>
                <Text style={styles.itemText}>{item.packageLabel}</Text>
              </View>
            ))}
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.ready}</Text>
            {order.notes.map((note) => (
              <Text key={note} style={styles.note}>{note}</Text>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable accessibilityRole="button" style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{copy.accept}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{copy.pack}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{copy.readyAction}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SellerOrderDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const { locale } = useStoredLocale();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const copy = getSellerOrdersCopy(locale);

  return (
    <>
      <Stack.Screen
        options={{
          title: orderId ?? copy.detailTitle,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: TOKENS.color.canvas },
        }}
      />
      <SellerOrderDetailScreen
        locale={locale}
        orderId={orderId}
        onBack={() => router.replace("/seller/orders")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scrollContent: { paddingBottom: 32 },
  shell: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 14,
  },
  notFoundShell: { justifyContent: "center", flex: 1, minHeight: 420 },
  backButton: { alignSelf: "flex-start", paddingVertical: 4 },
  backButtonText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "800" },
  heroCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 18,
    gap: 6,
  },
  orderId: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "900", letterSpacing: 0.8 },
  title: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
    color: TOKENS.brand.primary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  panel: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 16,
    gap: 10,
  },
  panelTitle: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "800" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  label: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  value: { color: TOKENS.color.textPrimary, fontSize: 13, fontWeight: "700", flexShrink: 1, textAlign: "right" },
  itemCard: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.canvas,
    padding: 12,
    gap: 3,
  },
  itemName: { color: TOKENS.color.textStrong, fontSize: 14, fontWeight: "800" },
  itemText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  note: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  actionRow: { flexDirection: "row", gap: 10 },
  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.brand.strong,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryButtonText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "900" },
  notFoundTitle: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800" },
  notFoundBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
});
