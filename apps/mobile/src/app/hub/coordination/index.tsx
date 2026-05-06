import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { HubLaneKey, Locale } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { HUB_COORDINATION_FEED, HUB_OVERVIEW, getHubLaneRoute } from "../_data";

const SCREEN_COPY = {
  en: {
    title: "Order Coordination",
    activeOrders: "Active Orders",
    bottlenecks: "Bottlenecks",
    feedTitle: "Coordination Feed",
    viewAll: "View All",
    urgent: "Urgent",
    manageTask: "Manage Task",
    nav: { hub: "Hub", inbound: "Inbound", sorting: "Sorting", dispatch: "Dispatch" },
  },
  bn: {
    title: "অর্ডার কো-অর্ডিনেশন",
    activeOrders: "সক্রিয় অর্ডার",
    bottlenecks: "বটলনেক",
    feedTitle: "কো-অর্ডিনেশন ফিড",
    viewAll: "সব দেখুন",
    urgent: "জরুরি",
    manageTask: "কাজ ম্যানেজ করুন",
    nav: { hub: "হাব", inbound: "ইনবাউন্ড", sorting: "সোর্টিং", dispatch: "ডিসপ্যাচ" },
  },
} as const satisfies Record<
  Locale,
  {
    title: string;
    activeOrders: string;
    bottlenecks: string;
    feedTitle: string;
    viewAll: string;
    urgent: string;
    manageTask: string;
    nav: Record<"hub" | "inbound" | "sorting" | "dispatch", string>;
  }
>;

function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: number;
  hint: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <View style={[styles.statCard, tone === "warning" && styles.statCardWarning]}>
      <Text style={[styles.statLabel, tone === "warning" && styles.statLabelWarning]}>{label}</Text>
      <Text style={[styles.statValue, tone === "warning" && styles.statValueWarning]}>{value}</Text>
      <Text style={[styles.statHint, tone === "warning" && styles.statHintWarning]}>{hint}</Text>
    </View>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.progressColumn}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { flex: Math.max(value, 0.08) }]} />
        <View style={{ flex: Math.max(1 - value, 0.08) }} />
      </View>
    </View>
  );
}

function TaskCard({
  locale,
  item,
  onOpenLane,
}: {
  locale: Locale;
  item: (typeof HUB_COORDINATION_FEED)[number];
  onOpenLane: (laneKey: HubLaneKey) => void;
}) {
  const copy = SCREEN_COPY[locale];

  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHead}>
        <View style={styles.taskHeaderCopy}>
          <Text style={styles.taskVisibility}>{item.visibilityLabel[locale]}</Text>
          <Text style={styles.taskTitle}>{item.title}</Text>
        </View>
        {item.urgent ? (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>{copy.urgent}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.progressRow}>
        {item.progressLabels[locale].map((label, index) => (
          <ProgressBar key={label} label={label} value={item.progressValue[index]} />
        ))}
      </View>

      <View
        style={[
          styles.infoBanner,
          item.alertTone === "warning"
            ? styles.infoBannerWarning
            : item.alertTone === "info"
              ? styles.infoBannerInfo
              : styles.infoBannerCalm,
        ]}
      >
        <MaterialIcons
          name={
            item.alertTone === "warning"
              ? "error-outline"
              : item.alertTone === "info"
                ? "local-shipping"
                : "check-circle-outline"
          }
          size={16}
          color={
            item.alertTone === "warning"
              ? TOKENS.color.alertLive
              : item.alertTone === "info"
                ? TOKENS.brand.primary
                : TOKENS.brand.primary
          }
        />
        <Text style={styles.infoBannerText}>{item.alertLabel[locale]}</Text>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.avatarRow}>
          {Array.from({ length: item.assigneeCount }).map((_, index) => (
            <View key={`${item.id}-${index}`} style={styles.avatarDot}>
              <MaterialIcons name="person" size={12} color={TOKENS.color.successIcon} />
            </View>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${copy.manageTask} ${item.title}`}
          onPress={() => onOpenLane(item.laneKey)}
          style={styles.manageButton}
        >
          <Text style={styles.manageButtonText}>{copy.manageTask}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function BottomNav({
  locale,
  onOpenLane,
}: {
  locale: Locale;
  onOpenLane: (laneKey: HubLaneKey) => void;
}) {
  const copy = SCREEN_COPY[locale];

  return (
    <View style={styles.bottomNav}>
      <Pressable accessibilityRole="button" style={styles.navItem}>
        <MaterialIcons name="grid-view" size={20} color={TOKENS.brand.primary} />
        <Text style={[styles.navLabel, styles.navLabelActive]}>{copy.nav.hub}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => onOpenLane("inbound")}>
        <MaterialIcons name="south" size={20} color={TOKENS.color.textTertiary} />
        <Text style={styles.navLabel}>{copy.nav.inbound}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => onOpenLane("sorting")}>
        <MaterialIcons name="layers" size={20} color={TOKENS.color.textTertiary} />
        <Text style={styles.navLabel}>{copy.nav.sorting}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => onOpenLane("dispatch")}>
        <MaterialIcons name="local-shipping" size={20} color={TOKENS.color.textTertiary} />
        <Text style={styles.navLabel}>{copy.nav.dispatch}</Text>
      </Pressable>
    </View>
  );
}

export function HubCoordinationScreen({
  locale,
  onOpenLane = () => {},
  onBack = () => {},
}: {
  locale: Locale;
  onOpenLane?: (laneKey: HubLaneKey) => void;
  onBack?: () => void;
}) {
  const copy = SCREEN_COPY[locale];
  const totalActive = HUB_OVERVIEW.lanes.reduce((sum, lane) => sum + lane.count, 0);
  const bottleneckCount = HUB_OVERVIEW.lanes.find((lane) => lane.key === "sorting")?.count ?? 0;
  const urgentCount = HUB_OVERVIEW.alerts.filter((alert) => alert.severity === "high").length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.safeChrome}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color={TOKENS.color.textSecondary} />
          </Pressable>
          <View>
            <Text style={styles.brandTitle}>FosholHaat Hub</Text>
            <Text style={styles.brandSubtitle}>{copy.title}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={styles.iconButton}>
            <MaterialIcons name="notifications-none" size={20} color={TOKENS.brand.primary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <Text style={styles.heroKicker}>LIVE HUB COORDINATION</Text>
            <Text style={styles.heroTitle}>Bogura Hub - Dhaka Central</Text>
            <Text style={styles.heroSubtitle}>
              {totalActive} active lots across inbound, sorting, dispatch, and exceptions.
            </Text>
            <View style={styles.heroMetrics}>
              <StatCard label={copy.activeOrders} value={totalActive} hint="Lots in motion" />
              <StatCard label={copy.bottlenecks} value={bottleneckCount} hint="Line watch" tone="warning" />
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable accessibilityRole="button" style={styles.actionCard}>
              <MaterialIcons name="qr-code-scanner" size={20} color={TOKENS.brand.primary} />
              <Text style={styles.actionLabel}>Scan Lot</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.actionCard}>
              <MaterialIcons name="control-point" size={20} color={TOKENS.brand.primary} />
              <Text style={styles.actionLabel}>Assign Gate</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.actionCard}>
              <MaterialIcons name="warning-amber" size={20} color={TOKENS.color.alertLive} />
              <Text style={styles.actionLabel}>Log Issue</Text>
            </Pressable>
          </View>

          <View style={styles.alertCard}>
            <View style={styles.feedHeader}>
              <Text style={styles.feedTitle}>Critical Coordination</Text>
              <Text style={styles.viewAll}>{urgentCount} live</Text>
            </View>
            <View style={styles.alertList}>
              {HUB_OVERVIEW.alerts.map((alert) => (
                <View
                  key={alert.id}
                  style={[styles.alertItem, alert.severity === "high" && styles.alertItemHigh]}
                >
                  <MaterialIcons
                    name={alert.severity === "high" ? "error-outline" : "info-outline"}
                    size={18}
                    color={alert.severity === "high" ? TOKENS.color.alertLive : TOKENS.brand.primary}
                  />
                  <Text style={styles.alertText}>{alert.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>{copy.feedTitle}</Text>
            <Text style={styles.viewAll}>{copy.viewAll}</Text>
          </View>

          <View style={styles.feedList}>
            {HUB_COORDINATION_FEED.map((item) => (
              <TaskCard key={item.id} locale={locale} item={item} onOpenLane={onOpenLane} />
            ))}
          </View>
        </ScrollView>

        <BottomNav locale={locale} onOpenLane={onOpenLane} />
      </View>
    </SafeAreaView>
  );
}

export default function HubCoordinationRoute() {
  const router = useRouter();
  const { locale } = useStoredLocale();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HubCoordinationScreen
        locale={locale}
        onBack={() => router.replace("/hub")}
        onOpenLane={(laneKey) => router.push(getHubLaneRoute(laneKey))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  safeChrome: { flex: 1, maxWidth: 480, width: "100%", alignSelf: "center" },
  topBar: {
    minHeight: 60,
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
  },
  brandTitle: { color: TOKENS.color.textPrimary, fontSize: 18, fontWeight: "800", letterSpacing: 0 },
  brandSubtitle: {
    color: TOKENS.color.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TOKENS.color.soft,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TOKENS.color.surface,
  },
  scrollContent: { padding: MOBILE_TOKENS.spacing.shellHorizontal, gap: 16, paddingBottom: 112 },
  heroCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.brand.strong,
    padding: 18,
    gap: 12,
  },
  heroKicker: {
    color: TOKENS.color.surface,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    opacity: 0.78,
  },
  heroTitle: { color: TOKENS.color.surface, fontSize: 28, fontWeight: "900", letterSpacing: 0, lineHeight: 32 },
  heroSubtitle: { color: TOKENS.color.surface, fontSize: 14, lineHeight: 20, opacity: 0.9 },
  heroMetrics: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surfaceOverlay,
    padding: 14,
    gap: 6,
  },
  statCardWarning: { backgroundColor: TOKENS.color.errorSurface },
  statLabel: { color: TOKENS.color.surface, fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1 },
  statLabelWarning: { color: TOKENS.color.alertLive },
  statValue: { color: TOKENS.color.surface, fontSize: 30, fontWeight: "900", lineHeight: 32 },
  statValueWarning: { color: TOKENS.color.alertLive },
  statHint: { color: TOKENS.color.surface, fontSize: 11, fontWeight: "700", opacity: 0.82 },
  statHintWarning: { color: TOKENS.color.alertLive, opacity: 0.82 },
  actionRow: { flexDirection: "row", gap: 10 },
  actionCard: {
    flex: 1,
    minHeight: 74,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionLabel: { color: TOKENS.color.textPrimary, fontSize: 12, fontWeight: "800", textAlign: "center" },
  alertCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 14,
    gap: 10,
  },
  feedHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  feedTitle: { color: TOKENS.color.textPrimary, fontSize: 18, fontWeight: "900", letterSpacing: 0 },
  viewAll: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  alertList: { gap: 10 },
  alertItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: MOBILE_TOKENS.radius.control,
    backgroundColor: TOKENS.color.canvas,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 12,
  },
  alertItemHigh: {
    backgroundColor: TOKENS.color.errorSurface,
    borderColor: TOKENS.color.errorBorder,
  },
  alertText: { flex: 1, color: TOKENS.color.textPrimary, fontSize: 13, fontWeight: "700", lineHeight: 18 },
  feedList: { gap: 14 },
  taskCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 16,
    gap: 12,
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  taskHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  taskHeaderCopy: { flex: 1, gap: 4 },
  taskVisibility: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  urgentBadge: {
    borderRadius: 999,
    backgroundColor: TOKENS.color.errorSurface,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  urgentText: { color: TOKENS.color.alertLive, fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  taskTitle: { color: TOKENS.color.textPrimary, fontSize: 18, fontWeight: "900", lineHeight: 24, letterSpacing: 0 },
  progressRow: { flexDirection: "row", gap: 8 },
  progressColumn: { flex: 1, gap: 6 },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: TOKENS.color.progressTrack,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressFill: { backgroundColor: TOKENS.brand.primary },
  progressLabel: {
    color: TOKENS.color.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoBanner: {
    borderRadius: MOBILE_TOKENS.radius.control,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  infoBannerWarning: {
    backgroundColor: TOKENS.color.errorSurface,
    borderColor: TOKENS.color.errorBorder,
  },
  infoBannerCalm: {
    backgroundColor: TOKENS.color.canvas,
    borderColor: TOKENS.color.borderSoft,
  },
  infoBannerInfo: {
    backgroundColor: TOKENS.color.primaryTint,
    borderColor: TOKENS.color.borderSoft,
  },
  infoBannerText: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "700" },
  taskFooter: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarRow: { flexDirection: "row", gap: 6, flex: 1 },
  avatarDot: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  manageButton: {
    flex: 3,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  manageButtonText: { color: TOKENS.color.surface, fontSize: 15, fontWeight: "800" },
  bottomNav: {
    height: 72,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navItem: { alignItems: "center", justifyContent: "center", gap: 4, minWidth: 60 },
  navLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "700" },
  navLabelActive: { color: TOKENS.brand.primary },
});
