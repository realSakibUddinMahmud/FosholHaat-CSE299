import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Locale } from "@fosholhaat/types";
import { useLocalSearchParams } from "expo-router";
import { useStoredLocale } from "../../../lib/locale";
import { TOKENS } from "../../../styles/tokens";
import { MOBILE_SELLER_DWR_RECORDS, formatSellerMoney, getMobileSellerCopy } from "../supply/supply-data";

export function SellerDwrScreen({
  locale,
  recordId,
}: {
  locale: Locale;
  recordId: string;
}) {
  const copy = getMobileSellerCopy(locale);
  const record = MOBILE_SELLER_DWR_RECORDS.find((item) => item.id === recordId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!record ? (
          <View style={styles.card}>
            <Text style={styles.title}>{copy.notFoundTitle}</Text>
            <Text style={styles.subtitle}>{copy.notFoundBody}</Text>
          </View>
        ) : (
          <>
            <View style={styles.hero}>
              <Text style={styles.kicker}>Digital warehouse receipt</Text>
              <Text style={styles.title}>{record.recordCode}</Text>
              <Text style={styles.subtitle}>
                {record.commodityLabel} · {record.quantity} {copy.units[record.unit]} · {formatSellerMoney(record.askingPrice)}
              </Text>
            </View>

            <View style={styles.recordCard}>
              <View style={styles.recordTop}>
                <View style={styles.recordThumb} />
                <View style={styles.recordBody}>
                  <Text style={styles.recordLabel}>{copy.dwrTitle}</Text>
                  <Text style={styles.recordTitle}>{record.commodityLabel}</Text>
                  <Text style={styles.recordMeta}>
                    {record.gradeLabel} · {record.packageLabel}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>DWR active</Text>
                </View>
              </View>
            </View>

            <View style={styles.verifiedCard}>
              <MaterialIcons name="verified" size={22} color={TOKENS.brand.primary} />
              <View style={styles.verifiedBody}>
                <Text style={styles.verifiedTitle}>Verified supply</Text>
                <Text style={styles.verifiedText}>Official digital warehouse receipt generated.</Text>
                <Text style={styles.verifiedText}>Eligible for order matching.</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Operational data</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>{copy.fields.quantity}</Text>
              <Text style={styles.infoValue}>
                {record.quantity} {copy.units[record.unit]}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>{copy.fields.grade}</Text>
              <Text style={styles.infoValue}>{record.gradeLabel}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Hub</Text>
              <Text style={styles.infoValue}>{record.hubLabel}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Inspected by</Text>
              <Text style={styles.infoValue}>{record.inspectorLabel}</Text>
            </View>

            <View style={styles.noteCard}>
              {record.notes.map((note) => (
                <View key={note} style={styles.noteRow}>
                  <MaterialIcons name="check-circle" size={16} color={TOKENS.brand.primary} />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>

            <View style={styles.linkCard}>
              <MaterialIcons name="description" size={20} color={TOKENS.color.textSecondary} />
              <View style={styles.linkBody}>
                <Text style={styles.linkTitle}>Digital Warehouse Receipt</Text>
                <Text style={styles.linkMeta}>Click to view the linked warehouse record.</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={TOKENS.color.textTertiary} />
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: "home", label: "Home", active: false },
          { icon: "inventory", label: "Supplies", active: true },
          { icon: "shopping-cart", label: "Orders", active: false },
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

export default function SellerDwrRoute() {
  const { locale } = useStoredLocale();
  const params = useLocalSearchParams<{ recordId?: string }>();
  return <SellerDwrScreen locale={locale} recordId={params.recordId ?? ""} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 112, gap: 14 },
  hero: { gap: 6 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 30, lineHeight: 34, fontWeight: "900", letterSpacing: -1.1 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  card: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
  },
  recordCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
  },
  recordTop: { flexDirection: "row", gap: 10, alignItems: "center" },
  recordThumb: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: TOKENS.color.soft,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
  },
  recordBody: { flex: 1, gap: 2 },
  recordLabel: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  recordTitle: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "900", letterSpacing: -0.8 },
  recordMeta: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "700" },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: TOKENS.color.soft,
    alignSelf: "flex-start",
  },
  statusText: { color: TOKENS.brand.primary, fontSize: 10, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  verifiedCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.primaryTint,
    backgroundColor: TOKENS.color.primaryTintSoft,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  verifiedBody: { flex: 1, gap: 4 },
  verifiedTitle: { color: TOKENS.brand.primary, fontSize: 16, fontWeight: "900" },
  verifiedText: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase" },
  infoCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  infoLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  infoValue: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  noteCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  noteRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  noteText: { flex: 1, color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  linkCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  linkBody: { flex: 1, gap: 4 },
  linkTitle: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  linkMeta: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
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
    backgroundColor: TOKENS.color.surfaceOverlayStrong,
    borderTopWidth: 1,
    borderTopColor: TOKENS.color.borderSoft,
  },
  navItem: { alignItems: "center", gap: 3, minWidth: 58 },
  navLabel: { color: TOKENS.color.textTertiary, fontSize: 10, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  navLabelActive: { color: TOKENS.brand.primary },
});
