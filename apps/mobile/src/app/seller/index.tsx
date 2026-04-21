import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Locale } from "@fosholhaat/types";
import { useStoredLocale } from "../../lib/locale";
import { TOKENS } from "../../styles/tokens";
import { getMobileSellerCopy, MOBILE_SELLER_SUPPLY_LISTINGS, formatSellerMoney } from "./supply/supply-data";
import { BrandLockup } from "../../components/brand-lockup";

function stockPercent(status: string) {
  if (status === "active") return 84;
  if (status === "scheduled") return 62;
  if (status === "low-stock") return 28;
  return 16;
}

export function SellerWorkspaceScreen({ locale }: { locale: Locale }) {
  const copy = getMobileSellerCopy(locale);
  const activeLots = MOBILE_SELLER_SUPPLY_LISTINGS.filter((listing) => listing.status === "active").length;
  const lowStockLots = MOBILE_SELLER_SUPPLY_LISTINGS.filter((listing) => listing.status === "low-stock").length;
  const dwrOpen = MOBILE_SELLER_SUPPLY_LISTINGS.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandLockup subtitle="Seller workspace" />
          <View style={styles.headerActions}>
            <View style={styles.iconButton}>
              <MaterialIcons name="notifications-none" size={20} color={TOKENS.color.textSecondary} />
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SH</Text>
            </View>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroKicker}>Bogura to Dhaka seller lane</Text>
          <Text style={styles.heroTitle}>{copy.workspaceTitle}</Text>
          <Text style={styles.heroSubtitle}>{copy.workspaceSubtitle}</Text>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{copy.metrics.active}</Text>
            <Text style={styles.metricValue}>{activeLots}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{copy.metrics.readyToday}</Text>
            <Text style={styles.metricValue}>2</Text>
          </View>
          <View style={styles.metricCardAlert}>
            <Text style={styles.metricLabel}>Stock alerts</Text>
            <Text style={styles.metricValue}>{lowStockLots}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>DWR open</Text>
            <Text style={styles.metricValue}>{dwrOpen}</Text>
          </View>
        </View>

        <Pressable style={styles.primaryCta}>
          <MaterialIcons name="add" size={20} color={TOKENS.color.surface} />
          <Text style={styles.primaryCtaText}>{copy.addSupply}</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active inventory</Text>
          <Text style={styles.sectionLink}>Manage all</Text>
        </View>

        <View style={styles.inventoryList}>
          {MOBILE_SELLER_SUPPLY_LISTINGS.map((listing) => (
            <View key={listing.id} style={styles.inventoryCard}>
              <View style={styles.inventoryTop}>
                <View style={styles.media} />
                <View style={styles.inventoryBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{listing.commodityLabel}</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>{copy.statuses[listing.status]}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardMeta}>
                    {listing.quantity} {copy.units[listing.unit]} · {listing.gradeLabel}
                  </Text>
                  <Text style={styles.cardMeta}>{listing.packageLabel}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${stockPercent(listing.status)}%` }]} />
                  </View>
                  <View style={styles.inventoryFooter}>
                    <View>
                      <Text style={styles.footerLabel}>Wholesale rate</Text>
                      <Text style={styles.price}>{formatSellerMoney(listing.askingPrice)}</Text>
                    </View>
                    <Text style={styles.footerLink}>View DWR</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.splitCard}>
          <Text style={styles.sectionTitle}>Logistics & dispatch</Text>
          <Text style={styles.cardMeta}>Pickup window: Tomorrow morning</Text>
          <View style={styles.inlineStat}>
            <MaterialIcons name="local-shipping" size={18} color={TOKENS.brand.primary} />
            <Text style={styles.inlineStatText}>Daily dispatch: 8:00 PM</Text>
          </View>
          <Text style={styles.helperText}>Keep the next outbound window visible and close to the stock cards.</Text>
        </View>

        <View style={styles.splitCard}>
          <Text style={styles.sectionTitle}>Transaction summary</Text>
          <View style={styles.transactionRow}>
            <View>
              <Text style={styles.footerLabel}>Ref: TRX-8829</Text>
              <Text style={styles.price}>৳125,500.00</Text>
            </View>
            <View style={styles.smallChip}>
              <MaterialIcons name="check-circle" size={16} color={TOKENS.brand.primary} />
              <Text style={styles.smallChipText}>Settled</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { icon: "dashboard", label: "Dashboard", active: true },
          { icon: "inventory-2", label: "Supply", active: false },
          { icon: "receipt-long", label: "Orders", active: false },
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

export default function SellerWorkspaceRoute() {
  const { locale } = useStoredLocale();
  return <SellerWorkspaceScreen locale={locale} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 118, gap: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.color.soft,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  hero: { gap: 8, paddingTop: 4 },
  heroKicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 30, lineHeight: 34, fontWeight: "900", letterSpacing: -1.1 },
  heroSubtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: {
    width: "48.5%",
    minHeight: 92,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 16,
    padding: 14,
    justifyContent: "space-between",
  },
  metricCardAlert: {
    width: "48.5%",
    minHeight: 92,
    borderWidth: 1,
    borderColor: TOKENS.color.warningLowStock,
    backgroundColor: TOKENS.color.soft,
    borderRadius: 16,
    padding: 14,
    justifyContent: "space-between",
  },
  metricLabel: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  metricValue: { color: TOKENS.color.textStrong, fontSize: 28, fontWeight: "900", letterSpacing: -0.8 },
  primaryCta: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: TOKENS.brand.primary,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryCtaText: { color: TOKENS.color.surface, fontSize: 16, fontWeight: "900" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  sectionTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  sectionLink: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "800" },
  inventoryList: { gap: 12 },
  inventoryCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  inventoryTop: { flexDirection: "row", gap: 12 },
  media: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: TOKENS.color.soft,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
  },
  inventoryBody: { flex: 1, gap: 6 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 8, alignItems: "flex-start" },
  cardTitle: { color: TOKENS.color.textStrong, fontSize: 17, fontWeight: "900", flexShrink: 1 },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: TOKENS.color.soft,
  },
  statusText: { color: TOKENS.brand.primary, fontSize: 10, fontWeight: "900", letterSpacing: 0.8, textTransform: "uppercase" },
  cardMeta: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "700" },
  progressTrack: { height: 7, borderRadius: 999, backgroundColor: TOKENS.color.progressTrack, overflow: "hidden", marginTop: 2 },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: TOKENS.brand.primary },
  inventoryFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 10, marginTop: 2 },
  footerLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
  price: { color: TOKENS.brand.primary, fontSize: 22, fontWeight: "900", letterSpacing: -0.8 },
  footerLink: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "900" },
  splitCard: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  inlineStat: { flexDirection: "row", alignItems: "center", gap: 8 },
  inlineStatText: { color: TOKENS.color.textStrong, fontSize: 13, fontWeight: "800" },
  helperText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 19 },
  transactionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 10 },
  smallChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
  },
  smallChipText: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "800" },
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
