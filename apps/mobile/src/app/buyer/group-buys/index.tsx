import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Locale } from "@fosholhaat/types";
import tokens from "@fosholhaat/tokens/tokens.json";
import { MOCK_GROUP_BUYS, getGroupBuyCopy } from "../group-buy-data";

const locale: Locale = "bn";

function progress(current: number, target: number) {
  return target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
}

function GroupBuyCard({ item, onPress }: { item: (typeof MOCK_GROUP_BUYS)[number]; onPress: () => void }) {
  const pct = progress(item.currentQuantity, item.targetQuantity);
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.productImage }} style={styles.image} />
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
        <View style={styles.timeBadge}>
          <MaterialIcons name="schedule" size={12} color={tokens.color.surface} />
          <Text style={styles.timeBadgeText}>{new Date(item.deadline).toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit" })}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text style={styles.title}>{item.productName[locale]}</Text>
          <Text style={styles.price}>৳{item.groupPrice}/bag</Text>
        </View>
        <Text style={styles.save}>SAVE ৳{item.unitPrice - item.groupPrice}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.meta}>{pct}% Filled</Text>
          <Text style={styles.meta}>Target: {item.targetQuantity} Bags</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>View Opportunity</Text>
          <MaterialIcons name="arrow-forward" size={18} color={tokens.color.surface} />
        </View>
      </View>
    </Pressable>
  );
}

export default function GroupBuyListScreen() {
  const router = useRouter();
  const copy = getGroupBuyCopy(locale);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>FosholHaat</Text>
            <Text style={styles.subBrand}>B2B MARKETPLACE</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialIcons name="notifications-none" size={22} color={tokens.color.textSecondary} />
          </View>
        </View>

        <Text style={styles.pageTitle}>{copy.listTitle}</Text>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={tokens.color.textTertiary} />
          <Text style={styles.searchText}>{copy.listSubtitle}</Text>
        </View>

        <View style={styles.chipRow}>
          <View style={styles.chipActive}><Text style={styles.chipTextActive}>Ending Soon</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>Highest Savings</Text></View>
          <View style={styles.chip}><Text style={styles.chipText}>Popular</Text></View>
        </View>

        <View style={styles.list}>
          {MOCK_GROUP_BUYS.map((item) => (
            <GroupBuyCard key={item.id} item={item} onPress={() => router.push(`/buyer/group-buys/${item.id}`)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.canvas },
  shell: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: tokens.color.textPrimary, fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  subBrand: { color: tokens.color.textTertiary, fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  headerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: tokens.color.surface, alignItems: "center", justifyContent: "center" },
  pageTitle: { color: tokens.color.textPrimary, fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  searchBar: {
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: tokens.color.surface,
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchText: { color: tokens.color.textTertiary, fontSize: 15, fontWeight: "600", flexShrink: 1 },
  chipRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  chip: { height: 38, paddingHorizontal: 16, borderRadius: 19, backgroundColor: tokens.color.surface, borderWidth: 1, borderColor: tokens.color.borderSoft, alignItems: "center", justifyContent: "center" },
  chipActive: { height: 38, paddingHorizontal: 16, borderRadius: 19, backgroundColor: tokens.brand.primary, alignItems: "center", justifyContent: "center" },
  chipText: { color: tokens.color.textSecondary, fontSize: 13, fontWeight: "800" },
  chipTextActive: { color: tokens.color.surface, fontSize: 13, fontWeight: "800" },
  list: { gap: 14, paddingBottom: 24 },
  card: {
    backgroundColor: tokens.color.surface,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
    shadowColor: tokens.color.textPrimary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  imageWrap: { height: 220, position: "relative" },
  image: { width: "100%", height: "100%" },
  liveBadge: { position: "absolute", top: 14, left: 14, backgroundColor: tokens.color.alertLive, borderRadius: 10, paddingHorizontal: 10, height: 28, alignItems: "center", justifyContent: "center" },
  liveBadgeText: { color: tokens.color.surface, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  timeBadge: { position: "absolute", right: 14, bottom: 14, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: tokens.color.dark, borderRadius: 14, paddingHorizontal: 10, height: 28 },
  timeBadgeText: { color: tokens.color.surface, fontSize: 12, fontWeight: "800" },
  body: { padding: 16, gap: 8 },
  headRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  title: { flex: 1, color: tokens.color.textPrimary, fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  price: { color: tokens.brand.primary, fontSize: 18, fontWeight: "900" },
  save: { color: tokens.color.alertLive, fontSize: 12, fontWeight: "900", textAlign: "right" },
  progressRow: { flexDirection: "row", justifyContent: "space-between" },
  meta: { color: tokens.color.textSecondary, fontSize: 12, fontWeight: "800" },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: tokens.color.progressTrack, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999, backgroundColor: tokens.brand.primary },
  ctaRow: { minHeight: 52, borderRadius: 26, backgroundColor: tokens.brand.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, marginTop: 4 },
  ctaText: { color: tokens.color.surface, fontSize: 15, fontWeight: "900" },
});
