import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useStoredLocale } from "../../lib/locale";
import { getBuyerDiscoveryCopy, type BuyerCatalogResponse } from "@fosholhaat/types";
import { MOCK_GROUP_BUYS, getGroupBuyCopy } from "./group-buy-data";
import { getBuyerCatalogFixture } from "./discovery-data";
import { getApiUrl } from "../../api-config";
import {
  BuyerDiscoveryShell,
  ProductCard,
  SearchPlate,
  SectionTitle,
} from "./discovery-shared";
import { MOBILE_TOKENS, TOKENS } from "../../styles/tokens";

function pct(current: number, target: number) {
  return target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
}

function FeaturedGroupBuyCard({
  locale,
  onPress,
}: {
  locale: "bn" | "en";
  onPress: () => void;
}) {
  const item = MOCK_GROUP_BUYS[0];
  const copy = getGroupBuyCopy(locale);
  const progress = pct(item.currentQuantity, item.targetQuantity);

  return (
    <Pressable style={styles.groupCard} onPress={onPress}>
      <View style={styles.groupImageWrap}>
        <Image source={{ uri: item.productImage }} style={styles.groupImage} />
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
        <View style={styles.timeBadge}>
          <MaterialIcons name="schedule" size={12} color={TOKENS.color.surface} />
          <Text style={styles.timeBadgeText}>{item.deadline}</Text>
        </View>
      </View>
      <View style={styles.groupBody}>
        <View style={styles.groupHead}>
          <Text style={styles.groupTitle}>{item.productName[locale]}</Text>
          <Text style={styles.groupPrice}>{item.groupPrice.toLocaleString(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 })}/bag</Text>
        </View>
        <Text style={styles.groupSave}>SAVE Tk{(item.unitPrice - item.groupPrice).toLocaleString(locale === "bn" ? "bn-BD" : "en-BD")}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{progress}% filled</Text>
          <Text style={styles.progressText}>{item.targetQuantity} target</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.groupMeta}>
          <Text style={styles.groupMetaText}>{item.participantCount} joined</Text>
          <Text style={styles.groupMetaText}>{copy.joinButton}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function BottomNav({ active }: { active: "home" | "group-buy" | "orders" | "profile" }) {
  const item = (key: typeof active, icon: keyof typeof MaterialIcons.glyphMap, label: string) => (
    <View style={[styles.navItem, active === key && styles.navItemActive]}>
      <MaterialIcons
        name={icon}
        size={24}
        color={active === key ? TOKENS.brand.primary : TOKENS.color.textTertiary}
      />
      <Text style={[styles.navLabel, active === key && styles.navLabelActive]}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.bottomNav}>
      {item("home", "home", "Home")}
      {item("group-buy", "groups", "Group-Buy")}
      {item("orders", "receipt-long", "Orders")}
      {item("profile", "person", "Profile")}
    </View>
  );
}

export default function BuyerDiscoveryHomeScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerDiscoveryCopy(locale);
  const [liveCatalog, setLiveCatalog] = useState<BuyerCatalogResponse | null>(null);
  const catalog = liveCatalog ?? getBuyerCatalogFixture(locale);

  useEffect(() => {
    fetch(`${getApiUrl()}/buyer/catalog?locale=${locale}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: BuyerCatalogResponse | null) => setLiveCatalog(data))
      .catch(() => undefined);
  }, [locale]);

  return (
      <BuyerDiscoveryShell locale={locale} title={copy.browseTitle} subtitle={copy.browseLead}>
      <SearchPlate
        text={copy.searchPlaceholder}
        actionLabel={copy.searchPlaceholder}
        onPress={() => router.push("/buyer/search")}
      />
      <View style={styles.chipRow}>
        <View style={styles.chipActive}><Text style={styles.chipTextActive}>All Items</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Potatoes</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Onions</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Vegetables</Text></View>
      </View>

      <SectionTitle title="Group-Buy Savings" body="Join live deals and lower the unit price." />
      <FeaturedGroupBuyCard locale={locale} onPress={() => router.push("/buyer/group-buys")} />

      <SectionTitle title={copy.labels.highlights} body={copy.shellHint} />
      {catalog.highlights.map((item) => (
        <ProductCard
          key={item.productId}
          item={item}
          actionLabel={copy.actions.openProduct}
          onPress={() => router.push(`/buyer/products/${item.productId}`)}
        />
      ))}

      <View style={styles.footerGap} />
      <BottomNav active="home" />
    </BuyerDiscoveryShell>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "800" },
  chipTextActive: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  groupCard: {
    backgroundColor: TOKENS.color.surface,
    borderRadius: MOBILE_TOKENS.radius.card,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    overflow: "hidden",
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  groupImageWrap: { height: 180, position: "relative" },
  groupImage: { width: "100%", height: "100%" },
  liveBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: TOKENS.color.alertLive,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  liveBadgeText: { color: TOKENS.color.surface, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  timeBadge: {
    position: "absolute",
    right: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TOKENS.color.dark,
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 28,
  },
  timeBadgeText: { color: TOKENS.color.surface, fontSize: 12, fontWeight: "800" },
  groupBody: { padding: 14, gap: 8 },
  groupHead: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  groupTitle: { flex: 1, color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900", letterSpacing: -0.4 },
  groupPrice: { color: TOKENS.brand.primary, fontSize: 16, fontWeight: "900" },
  groupSave: { color: TOKENS.color.alertLive, fontSize: 12, fontWeight: "900", textAlign: "right" },
  progressRow: { flexDirection: "row", justifyContent: "space-between" },
  progressText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: TOKENS.color.progressTrack, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: TOKENS.brand.primary },
  groupMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  groupMetaText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  footerGap: { height: 8 },
  bottomNav: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  navItem: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 6 },
  navItemActive: { opacity: 1 },
  navLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800" },
  navLabelActive: { color: TOKENS.brand.primary },
});
