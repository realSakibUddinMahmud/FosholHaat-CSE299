import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Locale, type SellerPayoutStatus } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";

type PayoutRow = {
  id: string;
  date: { en: string; bn: string };
  method: { en: string; bn: string };
  reference: string;
  amount: number;
  status: SellerPayoutStatus;
};

const COPY = {
  en: {
    subtitle: "SELLER WORKSPACE · FINANCE",
    nextDisbursement: "Next Disbursement",
    pendingSettlement: "Pending Settlement",
    breakdown: "Breakdown",
    totalPaid: "Completed This Month",
    summaryLabel: "Total Payout",
    recentActivity: "Recent Activity",
    filter: "Filter",
    loadMoreHistory: "Load More History",
    detailTitle: "Payout detail",
    detailPeriod: "Period",
    detailMethod: "Method",
    detailExpected: "Expected",
    status: {
      pending: "Pending",
      processing: "Processing",
      settled: "Settled",
    },
  },
  bn: {
    subtitle: "বিক্রেতা কর্মক্ষেত্র · আর্থিক সারাংশ",
    nextDisbursement: "পরের পেমেন্ট",
    pendingSettlement: "বাকি থাকা টাকা",
    breakdown: "বিস্তারিত",
    totalPaid: "এই মাসে জমা",
    summaryLabel: "মোট পেমেন্ট",
    recentActivity: "সাম্প্রতিক কাজ",
    filter: "ফিল্টার",
    loadMoreHistory: "আরও ইতিহাস দেখুন",
    detailTitle: "পেমেন্ট বিস্তারিত",
    detailPeriod: "সময়",
    detailMethod: "পদ্ধতি",
    detailExpected: "প্রত্যাশিত",
    status: {
      pending: "বাকি",
      processing: "চলছে",
      settled: "পাওয়া গেছে",
    },
  },
} as const;

const PAYOUT_ROWS: PayoutRow[] = [
  { id: "#TR-10492", date: { en: "Oct 28, 2023", bn: "২৮ অক্টোবর ২০২৩" }, method: { en: "Bank Transfer", bn: "ব্যাংক ট্রান্সফার" }, reference: "Ref: Order #FH-8492", amount: 12450, status: "settled" },
  { id: "#TR-10488", date: { en: "Oct 27, 2023", bn: "২৭ অক্টোবর ২০২৩" }, method: { en: "bKash (MFS)", bn: "বিকাশ (MFS)" }, reference: "Ref: Order #FH-8485", amount: 8920, status: "processing" },
  { id: "#TR-10482", date: { en: "Oct 26, 2023", bn: "২৬ অক্টোবর ২০২৩" }, method: { en: "Bank Transfer", bn: "ব্যাংক ট্রান্সফার" }, reference: "Ref: Order #FH-8472", amount: 23830, status: "settled" },
  { id: "#TR-10475", date: { en: "Oct 24, 2023", bn: "২৪ অক্টোবর ২০২৩" }, method: { en: "Bank Transfer", bn: "ব্যাংক ট্রান্সফার" }, reference: "Ref: Order #FH-8461", amount: 15200, status: "settled" },
];

function formatMoney(amount: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusColor(status: SellerPayoutStatus) {
  if (status === "settled") return styles.statusSettled;
  if (status === "processing") return styles.statusProcessing;
  return styles.statusPending;
}

export default function SellerPayoutVisibilityScreen() {
  const { locale } = useStoredLocale();
  const copy = COPY[locale === "bn" ? "bn" : "en"];
  const [showDetail, setShowDetail] = useState(false);
  const pendingAmount = 45200;
  const completedAmount = 74832;
  const totalAmount = 120032;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>{copy.subtitle}</Text>
            <Text style={styles.title}>Settlements and payouts</Text>
            <Text style={styles.subtitle}>
              {locale === "bn"
                ? "কত টাকা আসবে, কত টাকা পেয়েছেন, আর কোন পেমেন্টে নজর দরকার তা দেখুন।"
                : "See what is due, what is paid, and which payout needs attention."}
            </Text>
          </View>
          <View style={styles.iconButton}>
            <MaterialIcons name="notifications" size={18} color={TOKENS.color.textSecondary} />
            <View style={styles.badgeDot} />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.summaryPill}>
              <View style={styles.summaryDot} />
              <Text style={styles.summaryPillText}>{copy.nextDisbursement}</Text>
            </View>
            <Text style={styles.summaryDate}>Nov 05, 2023</Text>
          </View>

          <View style={styles.summaryAmountRow}>
            <View style={styles.summaryAmountBlock}>
              <Text style={styles.summaryAmountLabel}>{copy.pendingSettlement}</Text>
              <Text style={styles.summaryAmount}>{formatMoney(pendingAmount, locale)}</Text>
            </View>
            <Pressable style={styles.breakdownButton} onPress={() => setShowDetail((value) => !value)}>
              <Text style={styles.breakdownButtonText}>{copy.breakdown}</Text>
            </Pressable>
          </View>

          {showDetail ? (
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>{copy.detailTitle}</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{copy.detailPeriod}</Text>
                <Text style={styles.detailValue}>Oct 28 - Nov 05</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{copy.detailMethod}</Text>
                <Text style={styles.detailValue}>{locale === "bn" ? "ব্যাংক ট্রান্সফার" : "Bank Transfer"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{copy.detailExpected}</Text>
                <Text style={styles.detailValue}>Nov 05, 2023</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{locale === "bn" ? "বাকি" : "Pending"}</Text>
              <Text style={styles.statValue}>{formatMoney(pendingAmount, locale)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{copy.totalPaid}</Text>
              <Text style={styles.statValue}>{formatMoney(completedAmount, locale)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{copy.summaryLabel}</Text>
              <Text style={styles.statValue}>{formatMoney(totalAmount, locale)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{copy.recentActivity}</Text>
          <Pressable style={styles.filterButton}>
            <MaterialIcons name="tune" size={16} color={TOKENS.color.textSecondary} />
            <Text style={styles.filterText}>{copy.filter}</Text>
          </Pressable>
        </View>

        <View style={styles.rowList}>
          {PAYOUT_ROWS.map((row) => (
            <View key={row.id} style={styles.rowCard}>
              <View style={styles.rowHeader}>
                <View>
                  <Text style={styles.rowId}>{row.id}</Text>
                  <View style={styles.rowMetaLine}>
                    <MaterialIcons name="calendar-today" size={13} color={TOKENS.color.textTertiary} />
                    <Text style={styles.rowMeta}>{row.date[locale === "bn" ? "bn" : "en"]}</Text>
                  </View>
                </View>
                <View style={[styles.statusPill, statusColor(row.status)]}>
                  <Text style={styles.statusText}>{copy.status[row.status]}</Text>
                </View>
              </View>

              <View style={styles.rowFooter}>
                <View style={styles.referenceLine}>
                  <MaterialIcons name="receipt-long" size={16} color={TOKENS.brand.primary} />
                  <View>
                    <Text style={styles.referenceText}>{row.reference}</Text>
                    <Text style={styles.referenceSub}>{row.method[locale === "bn" ? "bn" : "en"]}</Text>
                  </View>
                </View>
                <Text style={styles.rowAmount}>{formatMoney(row.amount, locale)}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>{copy.loadMoreHistory}</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: "grid-view", label: "Home", active: false },
          { icon: "local-shipping", label: "Orders", active: false },
          { icon: "account-balance-wallet", label: "Payouts", active: true },
          { icon: "inventory", label: "Stock", active: false },
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 118, gap: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 30, fontWeight: "900", letterSpacing: -1.1 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20, maxWidth: 290 },
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
  badgeDot: {
    position: "absolute",
    right: 9,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: TOKENS.color.alertLive,
    borderWidth: 1.5,
    borderColor: TOKENS.color.surface,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 18,
    gap: 14,
    shadowColor: TOKENS.color.dark,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  summaryTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  summaryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
    alignSelf: "flex-start",
  },
  summaryDot: { width: 7, height: 7, borderRadius: 999, backgroundColor: TOKENS.brand.primary },
  summaryPillText: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 0.6, textTransform: "uppercase" },
  summaryDate: { color: TOKENS.color.textPrimary, fontSize: 15, fontWeight: "700" },
  summaryAmountRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  summaryAmountBlock: { flex: 1, gap: 3 },
  summaryAmountLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  summaryAmount: { color: TOKENS.color.textStrong, fontSize: 36, lineHeight: 40, fontWeight: "900", letterSpacing: -1.1 },
  breakdownButton: {
    minWidth: 86,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: TOKENS.brand.strong,
    alignItems: "center",
    justifyContent: "center",
  },
  breakdownButtonText: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "800" },
  detailCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.selectedSurface,
    padding: 12,
    gap: 8,
  },
  detailTitle: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  detailLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  detailValue: { color: TOKENS.color.textStrong, fontSize: 12, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.canvas,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 4,
  },
  statLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
  statValue: { color: TOKENS.color.textPrimary, fontSize: 15, fontWeight: "800" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  sectionTitle: { color: TOKENS.color.textPrimary, fontSize: 18, fontWeight: "800", letterSpacing: -0.2 },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 34,
  },
  filterText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  rowList: { gap: 12 },
  rowCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 14,
    gap: 12,
    shadowColor: TOKENS.color.dark,
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  rowId: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900" },
  rowMetaLine: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  rowMeta: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "600" },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  statusSettled: { backgroundColor: TOKENS.color.successSoft, borderColor: TOKENS.color.successBright },
  statusProcessing: { backgroundColor: TOKENS.color.successBrightTint, borderColor: TOKENS.color.successText },
  statusPending: { backgroundColor: TOKENS.color.surfaceMuted, borderColor: TOKENS.color.borderNeutral },
  statusText: { fontSize: 10, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase", color: TOKENS.brand.primary },
  rowFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  referenceLine: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  referenceText: { color: TOKENS.color.textStrong, fontSize: 13, fontWeight: "800" },
  referenceSub: { color: TOKENS.color.textSecondary, fontSize: 12, marginTop: 2 },
  rowAmount: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  loadMoreButton: {
    marginTop: 2,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: TOKENS.color.borderNeutral,
    backgroundColor: TOKENS.color.surface,
    paddingVertical: 14,
    alignItems: "center",
  },
  loadMoreText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase" },
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
