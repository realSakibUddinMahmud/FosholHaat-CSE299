import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { BuyerCatalogHighlight, BuyerDiscoveryCategorySummary, Locale } from "@fosholhaat/types";
import { getBuyerDiscoveryCopy } from "@fosholhaat/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOBILE_TOKENS, TOKENS } from "../../styles/tokens";
import { BrandLockup } from "../../components/brand-lockup";

export function BuyerDiscoveryShell({
  locale,
  title,
  subtitle,
  children,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const copy = getBuyerDiscoveryCopy(locale);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <View style={styles.brandBlock}>
              <BrandLockup subtitle={copy.shellTitle} />
            </View>
            <View style={styles.headerActions}>
              <View style={styles.iconPill}>
                <MaterialIcons name="notifications-none" size={18} color={TOKENS.color.textSecondary} />
              </View>
              <View style={styles.iconPill}>
                <MaterialIcons name="account-circle" size={18} color={TOKENS.color.textSecondary} />
              </View>
            </View>
          </View>
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>{copy.labels.highlights}</Text>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SearchPlate({
  text,
  actionLabel,
  onPress,
}: {
  text: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  const content = (
    <>
      <MaterialIcons name="search" size={20} color={TOKENS.color.textSecondary} />
      <Text style={styles.searchText}>{text}</Text>
      <MaterialIcons name="keyboard-voice" size={18} color={TOKENS.color.textSecondary} />
      {onPress ? (
        <MaterialIcons name="chevron-right" size={18} color={TOKENS.color.textSecondary} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.searchPlate, pressed && styles.searchPlatePressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={actionLabel ?? text}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.searchPlate}>{content}</View>;
}

export function CategoryRow({
  categories,
  onPress,
}: {
  categories: BuyerDiscoveryCategorySummary[];
  onPress: (slug: string) => void;
}) {
  return (
    <View style={styles.categoryRow}>
      {categories.map((category) => (
        <Pressable key={category.slug} style={styles.categoryChip} onPress={() => onPress(category.slug)}>
          <Text style={styles.categoryLabel}>{category.label}</Text>
          <Text style={styles.categoryCount}>{category.productCount}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ProductCard({
  item,
  actionLabel,
  onPress,
}: {
  item: BuyerCatalogHighlight;
  actionLabel: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageStub}>
        <View style={styles.imageBadge}>
          <Text style={styles.imageBadgeText}>{item.verificationLabel ?? "Live"}</Text>
        </View>
        <Text style={styles.imageText}>{item.imageUrl}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardPrice}>{item.priceLabel}</Text>
        </View>
        <Text style={styles.cardMeta}>{item.sellerLabel}</Text>
        <Text style={styles.cardHint}>{item.packageLabel}</Text>
        <View style={styles.factRow}>
          <Text style={styles.cardHint}>{item.stockLabel}</Text>
          <Text style={styles.cardTrust}>{item.verificationLabel}</Text>
        </View>
      </View>
      <View style={styles.cardActionRow}>
        <Text style={styles.cardAction}>{actionLabel}</Text>
        <View style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={16} color={TOKENS.brand.primary} />
        </View>
      </View>
    </Pressable>
  );
}

export function SectionTitle({ title, body }: { title: string; body?: string }) {
  return (
    <View style={styles.sectionTitleBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {body ? <Text style={styles.sectionBody}>{body}</Text> : null}
    </View>
  );
}

export function NoticeCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.notice}>
      <Text style={styles.noticeTitle}>{title}</Text>
      <Text style={styles.noticeBody}>{body}</Text>
    </View>
  );
}

export function BuyerActionButton({
  label,
  onPress,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        variant === "primary" ? styles.actionPrimary : styles.actionSecondary,
        pressed && styles.actionPressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.actionText, variant === "primary" ? styles.actionTextPrimary : styles.actionTextSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scroll: { paddingBottom: 28 },
  shell: {
    maxWidth: 560,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 14,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  brandBlock: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: TOKENS.color.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    backgroundColor: TOKENS.color.surface,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 18,
    gap: 8,
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  heroEyebrow: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "900", letterSpacing: -0.7, lineHeight: 30 },
  heroSubtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  searchPlate: {
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  searchPlatePressed: { opacity: 0.92 },
  searchText: { color: TOKENS.color.textSecondary, fontSize: 14, flexShrink: 1 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryChip: {
    minWidth: 92,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
  categoryLabel: { color: TOKENS.color.textStrong, fontSize: 13, fontWeight: "800" },
  categoryCount: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "900" },
  sectionTitleBlock: { gap: 4 },
  sectionTitle: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  sectionBody: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  card: {
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: MOBILE_TOKENS.radius.card,
    overflow: "hidden",
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  imageStub: {
    minHeight: 130,
    backgroundColor: TOKENS.color.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  imageBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    backgroundColor: TOKENS.color.alertLive,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBadgeText: { color: TOKENS.color.surface, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  imageText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700", opacity: 0.7 },
  cardBody: { padding: 14, gap: 6 },
  cardTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  cardTitle: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900", flex: 1 },
  cardMeta: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  cardPrice: { color: TOKENS.brand.primary, fontSize: 14, fontWeight: "900" },
  factRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  cardHint: { color: TOKENS.color.textSecondary, fontSize: 12, lineHeight: 17 },
  cardTrust: { color: TOKENS.color.successText, fontSize: 12, fontWeight: "800" },
  cardActionRow: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  cardAction: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "900" },
  cartButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: TOKENS.color.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  notice: { backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderSoft, borderRadius: MOBILE_TOKENS.radius.card, padding: 14, gap: 4 },
  noticeTitle: { color: TOKENS.color.textStrong, fontSize: 14, fontWeight: "900" },
  noticeBody: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  actionButton: { minHeight: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  actionPrimary: { backgroundColor: TOKENS.brand.primary },
  actionSecondary: { backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderNeutral },
  actionPressed: { opacity: 0.92 },
  actionText: { fontSize: 14, fontWeight: "900" },
  actionTextPrimary: { color: TOKENS.color.surface },
  actionTextSecondary: { color: TOKENS.color.textSecondary },
});
