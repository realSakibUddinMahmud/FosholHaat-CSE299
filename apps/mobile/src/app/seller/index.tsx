import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Locale, SellerSupplyListResponse } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import { useStoredLocale } from "../../lib/locale";
import { TOKENS } from "../../styles/tokens";
import { getMobileSellerCopy, formatSellerMoney } from "./supply/supply-data";
import { BrandLockup } from "../../components/brand-lockup";
import { SellerBottomNav } from "./_shared";

const SELLER_SUPPLY_TEST_DATA: SellerSupplyListResponse = {
  workspace: {
    sellerName: "Seller",
    marketLabel: "Bogura to Dhaka",
    metrics: [],
    primaryActionRoute: "/seller/supply/new",
  },
  listings: [{
    id: "supply-test-1",
    commodity: "potato",
    commodityLabel: "Potato",
    quantity: 100,
    unit: "kg",
    gradeLabel: "Grade A",
    packageLabel: "Bag",
    askingPrice: 45,
    status: "active",
    stockHint: "Ready",
  }],
};

function stockPercent(status: string) {
  if (status === "active") return 84;
  if (status === "scheduled") return 62;
  if (status === "low-stock") return 28;
  return 16;
}

export function SellerWorkspaceScreen({ locale, mode = "dashboard" }: { locale: Locale; mode?: "dashboard" | "supply" }) {
  const router = useRouter();
  const copy = getMobileSellerCopy(locale);
  const [supply, setSupply] = useState<SellerSupplyListResponse | null>(process.env.NODE_ENV === "test" ? SELLER_SUPPLY_TEST_DATA : null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<SellerSupplyListResponse>("/seller/supply").then(setSupply).catch((err: Error) => setError(err.message));
  }, []);
  const listings = supply?.listings ?? [];
  const activeLots = listings.filter((listing) => listing.status === "active").length;
  const lowStockLots = listings.filter((listing) => listing.status === "low-stock").length;
  const dwrOpen = listings.filter((listing) => listing.dwrRecordId).length;
  const readyToday = listings.filter((listing) => listing.status === "active" || listing.status === "scheduled").length;

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
          <Text style={styles.heroTitle}>{mode === "supply" ? copy.supplyTitle : copy.workspaceTitle}</Text>
          <Text style={styles.heroSubtitle}>{mode === "supply" ? copy.supplySubtitle : copy.workspaceSubtitle}</Text>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{copy.metrics.active}</Text>
            <Text style={styles.metricValue}>{activeLots}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{copy.metrics.readyToday}</Text>
            <Text style={styles.metricValue}>{readyToday}</Text>
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

        {mode === "supply" ? (
          <>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable style={styles.primaryCta} onPress={() => router.push("/seller/supply/new")}>
              <MaterialIcons name="add" size={20} color={TOKENS.color.surface} />
              <Text style={styles.primaryCtaText}>{copy.addSupply}</Text>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Supply lots</Text>
              <Pressable onPress={() => router.push("/seller/dwr")}>
                <Text style={styles.sectionLink}>DWR records</Text>
              </Pressable>
            </View>

            <View style={styles.inventoryList}>
              {listings.map((listing) => (
                <View key={listing.id} style={styles.inventoryCard}>
                  <View style={styles.inventoryTop}>
                    <View style={styles.media}>
                      {listing.photoUrls?.[0] ? <Image source={{ uri: listing.photoUrls[0] }} style={styles.mediaImage} /> : <Text style={styles.mediaText}>{listing.commodityLabel.slice(0, 1)}</Text>}
                    </View>
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
                      <Text style={styles.cardMeta}>
                        {listing.singleBuyEnabled ? `Single ${listing.singleMinQty ?? 1}-${listing.singleMaxQty ?? listing.quantity}` : "Single off"} · {listing.groupBuyEnabled ? `Group target ${listing.groupTargetQty ?? 0}` : "Group off"}
                      </Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${stockPercent(listing.status)}%` }]} />
                      </View>
                      <View style={styles.inventoryFooter}>
                        <View>
                          <Text style={styles.footerLabel}>Wholesale rate</Text>
                          <Text style={styles.price}>{formatSellerMoney(listing.askingPrice)}</Text>
                        </View>
                        {listing.dwrRecordId ? (
                          <Pressable onPress={() => router.push({ pathname: "/seller/dwr/[recordId]", params: { recordId: listing.dwrRecordId ?? "" } })}>
                            <Text style={styles.footerLink}>View DWR</Text>
                          </Pressable>
                        ) : (
                          <Text style={styles.footerMuted}>DWR pending</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.actionGrid}>
              <Pressable style={styles.actionTilePrimary} onPress={() => router.push("/seller/orders")}>
                <MaterialIcons name="receipt-long" size={22} color={TOKENS.color.surface} />
                <Text style={styles.actionTilePrimaryText}>Order queue</Text>
              </Pressable>
              <Pressable style={styles.actionTile} onPress={() => router.push("/seller/supply")}>
                <MaterialIcons name="inventory-2" size={22} color={TOKENS.brand.primary} />
                <Text style={styles.actionTileText}>Supply list</Text>
              </Pressable>
              <Pressable style={styles.actionTile} onPress={() => router.push("/seller/dwr")}>
                <MaterialIcons name="description" size={22} color={TOKENS.brand.primary} />
                <Text style={styles.actionTileText}>DWR records</Text>
              </Pressable>
              <Pressable style={styles.actionTile} onPress={() => router.push("/seller/payouts")}>
                <MaterialIcons name="account-balance-wallet" size={22} color={TOKENS.brand.primary} />
                <Text style={styles.actionTileText}>Payouts</Text>
              </Pressable>
            </View>

            <View style={styles.splitCard}>
              <Text style={styles.sectionTitle}>Today’s operations</Text>
              <Text style={styles.cardMeta}>Pickup window: Tomorrow morning</Text>
              <View style={styles.inlineStat}>
                <MaterialIcons name="local-shipping" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.inlineStatText}>Daily dispatch: 8:00 PM</Text>
              </View>
              <Text style={styles.helperText}>Use this dashboard for the next action, not full inventory editing.</Text>
            </View>

            <View style={styles.splitCard}>
              <Text style={styles.sectionTitle}>Settlement snapshot</Text>
              <View style={styles.transactionRow}>
                <View>
                  <Text style={styles.footerLabel}>Latest payout lane</Text>
                  <Text style={styles.price}>Live from payouts</Text>
                </View>
                <View style={styles.smallChip}>
                  <MaterialIcons name="check-circle" size={16} color={TOKENS.brand.primary} />
                  <Text style={styles.smallChipText}>Open</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <SellerBottomNav active={mode === "supply" ? "supply" : "dashboard"} />
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
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 30, lineHeight: 34, fontWeight: "900", letterSpacing: 0 },
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
  metricValue: { color: TOKENS.color.textStrong, fontSize: 28, fontWeight: "900", letterSpacing: 0 },
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
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionTilePrimary: {
    width: "48.5%",
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: TOKENS.brand.primary,
    padding: 14,
    justifyContent: "space-between",
  },
  actionTile: {
    width: "48.5%",
    minHeight: 104,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: 18,
    backgroundColor: TOKENS.color.surface,
    padding: 14,
    justifyContent: "space-between",
  },
  actionTilePrimaryText: { color: TOKENS.color.surface, fontSize: 16, fontWeight: "900" },
  actionTileText: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  sectionTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900", letterSpacing: 0 },
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
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaImage: { width: "100%", height: "100%" },
  mediaText: { color: TOKENS.brand.primary, fontSize: 24, fontWeight: "900" },
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
  price: { color: TOKENS.brand.primary, fontSize: 22, fontWeight: "900", letterSpacing: 0 },
  footerLink: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "900" },
  footerMuted: { color: TOKENS.color.textTertiary, fontSize: 13, fontWeight: "900" },
  errorText: { color: TOKENS.color.alertLive, fontSize: 13, fontWeight: "700" },
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
