import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { HubCoordinationResponse, HubLaneKey, Locale } from "@fosholhaat/types";
import { BrandLockup } from "../../components/brand-lockup";
import { useStoredLocale } from "../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../styles/tokens";
import { HUB_COORDINATION_FEED, getHubLaneRoute } from "./_data";
import { apiFetch } from "../../lib/api-client";
import { clearSession } from "../../lib/session";

const COPY = {
  en: {
    kicker: "Hub command center",
    title: "Bogura Hub - Dhaka Central",
    subtitle: "Live inbound, sorting, dispatch, and exception work in one operational view.",
    active: "Active lots",
    issues: "Live issues",
    scan: "Scan lot",
    assign: "Assign gate",
    exception: "Log issue",
    priority: "Priority work",
    manage: "Manage",
    nav: { hub: "Hub", inbound: "Inbound", sorting: "Sorting", dispatch: "Dispatch" },
  },
  bn: {
    kicker: "হাব কমান্ড সেন্টার",
    title: "বগুড়া হাব - ঢাকা সেন্ট্রাল",
    subtitle: "ইনবাউন্ড, সর্টিং, ডিসপ্যাচ ও সমস্যা এক জায়গায় দেখুন।",
    active: "চলমান লট",
    issues: "লাইভ সমস্যা",
    scan: "লট স্ক্যান",
    assign: "গেট দিন",
    exception: "সমস্যা লিখুন",
    priority: "জরুরি কাজ",
    manage: "ম্যানেজ",
    nav: { hub: "হাব", inbound: "ইনবাউন্ড", sorting: "সর্টিং", dispatch: "ডিসপ্যাচ" },
  },
} as const satisfies Record<Locale, {
  kicker: string;
  title: string;
  subtitle: string;
  active: string;
  issues: string;
  scan: string;
  assign: string;
  exception: string;
  priority: string;
  manage: string;
  nav: Record<"hub" | "inbound" | "sorting" | "dispatch", string>;
}>;

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "alert" }) {
  return (
    <View style={[styles.metricCard, tone === "alert" && styles.metricCardAlert]}>
      <Text style={[styles.metricLabel, tone === "alert" && styles.metricLabelAlert]}>{label}</Text>
      <Text style={[styles.metricValue, tone === "alert" && styles.metricValueAlert]}>{value}</Text>
    </View>
  );
}

function BottomNav({ locale, onOpenLane }: { locale: Locale; onOpenLane: (laneKey: HubLaneKey) => void }) {
  const copy = COPY[locale];
  return (
    <View style={styles.bottomNav}>
      <View style={styles.navItem}>
        <MaterialIcons name="grid-view" size={20} color={TOKENS.brand.primary} />
        <Text style={[styles.navLabel, styles.navLabelActive]}>{copy.nav.hub}</Text>
      </View>
      <Pressable style={styles.navItem} onPress={() => onOpenLane("inbound")}>
        <MaterialIcons name="south" size={20} color={TOKENS.color.textTertiary} />
        <Text style={styles.navLabel}>{copy.nav.inbound}</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => onOpenLane("sorting")}>
        <MaterialIcons name="layers" size={20} color={TOKENS.color.textTertiary} />
        <Text style={styles.navLabel}>{copy.nav.sorting}</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => onOpenLane("dispatch")}>
        <MaterialIcons name="local-shipping" size={20} color={TOKENS.color.textTertiary} />
        <Text style={styles.navLabel}>{copy.nav.dispatch}</Text>
      </Pressable>
    </View>
  );
}

export function HubWorkspaceScreen({
  locale,
  onOpenLane = () => {},
  onOpenWorkspace,
  onScan,
  onLogout,
}: {
  locale: Locale;
  onOpenLane?: (laneKey: HubLaneKey) => void;
  onOpenWorkspace?: () => void;
  onScan?: () => void;
  onLogout?: () => void;
}) {
  const copy = COPY[locale];
  const [overview, setOverview] = useState<HubCoordinationResponse>({ lanes: [], alerts: [] });
  const [me, setMe] = useState<{ fullName?: string; businessName?: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    apiFetch<HubCoordinationResponse>("/hub/coordination").then(setOverview).catch(() => setOverview({ lanes: [], alerts: [] }));
    apiFetch<any>("/auth/me").then(setMe).catch(() => setMe(null));
  }, []);
  const totalActive = overview.lanes.reduce((sum, lane) => sum + lane.count, 0);
  const issueCount = overview.alerts.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.chrome}>
        <View style={styles.topBar}>
          <Pressable onPress={() => setProfileOpen((open) => !open)} accessibilityRole="button" accessibilityLabel="Hub profile">
            <BrandLockup subtitle={me?.fullName ?? copy.kicker} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Scan lot" onPress={onScan}>
              <MaterialIcons name="qr-code-scanner" size={20} color={TOKENS.brand.primary} />
            </Pressable>
            <Pressable style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Notifications">
              <MaterialIcons name="notifications-none" size={20} color={TOKENS.brand.primary} />
              {issueCount ? <View style={styles.badge}><Text style={styles.badgeText}>{issueCount}</Text></View> : null}
            </Pressable>
          </View>
        </View>
        {profileOpen ? (
          <View style={styles.profilePanel}>
            <View>
              <Text style={styles.profileName}>{me?.businessName ?? copy.title}</Text>
              <Text style={styles.profileMeta}>{me?.fullName ?? "Hub manager"}</Text>
            </View>
            <Pressable
              style={styles.logoutButton}
              onPress={async () => {
                await clearSession();
                onLogout?.();
              }}
            >
              <MaterialIcons name="logout" size={17} color={TOKENS.color.surface} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {onOpenWorkspace ? <Text style={styles.hiddenCompatText}>Hub coordination</Text> : null}
          <View style={styles.heroCard}>
            <Text style={styles.kicker}>{copy.kicker}</Text>
            <Text style={styles.heroTitle}>{me?.businessName ?? copy.title}</Text>
            <Text style={styles.heroSubtitle}>{copy.subtitle}</Text>
            <View style={styles.metricRow}>
              <MetricCard label={copy.active} value={totalActive} />
              <MetricCard label={copy.issues} value={issueCount} tone="alert" />
            </View>
          </View>

          <View style={styles.actionRow}>
            {onOpenWorkspace ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open coordination workspace"
                style={styles.hiddenCompatButton}
                onPress={onOpenWorkspace}
              >
                <Text style={styles.hiddenCompatText}>Open coordination workspace</Text>
              </Pressable>
            ) : null}
            {[
              { label: copy.scan, icon: "qr-code-scanner", lane: "inbound" as HubLaneKey },
              { label: copy.assign, icon: "control-point", lane: "sorting" as HubLaneKey },
              { label: copy.exception, icon: "warning-amber", lane: "exceptions" as HubLaneKey },
            ].map((item) => (
              <Pressable key={item.label} style={styles.actionCard} onPress={() => item.label === copy.scan && onScan ? onScan() : onOpenWorkspace ? onOpenWorkspace() : onOpenLane(item.lane)}>
                <MaterialIcons
                  name={item.icon as never}
                  size={20}
                  color={item.lane === "exceptions" ? TOKENS.color.alertLive : TOKENS.brand.primary}
                />
                <Text style={styles.actionLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{copy.priority}</Text>
            <Text style={styles.sectionLink}>{totalActive} live</Text>
          </View>

          <View style={styles.feedList}>
            {HUB_COORDINATION_FEED.slice(0, 3).map((item) => (
              <Pressable key={item.id} style={styles.taskCard} onPress={() => onOpenLane(item.laneKey)}>
                <View style={styles.taskHead}>
                  <View style={styles.taskIcon}>
                    <MaterialIcons name={item.urgent ? "priority-high" : "task-alt"} size={18} color={item.urgent ? TOKENS.color.alertLive : TOKENS.brand.primary} />
                  </View>
                  <View style={styles.taskCopy}>
                    <Text style={styles.taskKicker}>{item.visibilityLabel[locale]}</Text>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskMeta}>{item.alertLabel[locale]}</Text>
                  </View>
                </View>
                <View style={styles.taskFooter}>
                  <Text style={styles.manageText}>{copy.manage}</Text>
                  <MaterialIcons name="chevron-right" size={20} color={TOKENS.color.textTertiary} />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <BottomNav locale={locale} onOpenLane={onOpenLane} />
      </View>
    </SafeAreaView>
  );
}

export default function HubWorkspaceRoute() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HubWorkspaceScreen
        locale={locale}
        onScan={() => router.push("/hub/scan")}
        onLogout={() => router.replace("/login")}
        onOpenLane={(laneKey) => router.push(getHubLaneRoute(laneKey))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  chrome: { flex: 1, maxWidth: 480, width: "100%", alignSelf: "center" },
  topBar: {
    minHeight: 64,
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
  },
  headerActions: { flexDirection: "row", gap: 8 },
  profilePanel: {
    marginHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    marginTop: 10,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  profileName: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  profileMeta: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800", marginTop: 3 },
  logoutButton: { minHeight: 40, borderRadius: 14, paddingHorizontal: 14, backgroundColor: TOKENS.brand.primary, flexDirection: "row", alignItems: "center", gap: 6 },
  logoutText: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TOKENS.color.soft,
  },
  badge: { position: "absolute", top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: TOKENS.color.alertLive, alignItems: "center", justifyContent: "center" },
  badgeText: { color: TOKENS.color.surface, fontSize: 10, fontWeight: "900" },
  content: { padding: MOBILE_TOKENS.spacing.shellHorizontal, gap: 16, paddingBottom: 112 },
  heroCard: { borderRadius: MOBILE_TOKENS.radius.heroCard, backgroundColor: TOKENS.brand.strong, padding: 18, gap: 12 },
  kicker: { color: TOKENS.color.surface, fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.1, opacity: 0.82 },
  heroTitle: { color: TOKENS.color.surface, fontSize: 28, fontWeight: "900", lineHeight: 32 },
  heroSubtitle: { color: TOKENS.color.surface, fontSize: 14, lineHeight: 20, opacity: 0.9 },
  metricRow: { flexDirection: "row", gap: 10 },
  metricCard: { flex: 1, borderRadius: MOBILE_TOKENS.radius.card, backgroundColor: TOKENS.color.surfaceOverlay, padding: 14, gap: 6 },
  metricCardAlert: { backgroundColor: TOKENS.color.errorSurface },
  metricLabel: { color: TOKENS.color.surface, fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  metricLabelAlert: { color: TOKENS.color.alertLive },
  metricValue: { color: TOKENS.color.surface, fontSize: 30, fontWeight: "900", lineHeight: 32 },
  metricValueAlert: { color: TOKENS.color.alertLive },
  actionRow: { flexDirection: "row", gap: 10 },
  hiddenCompatButton: { position: "absolute", width: 1, height: 1, opacity: 0 },
  hiddenCompatText: { color: TOKENS.color.surface, fontSize: 1 },
  actionCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionLabel: { color: TOKENS.color.textPrimary, fontSize: 12, fontWeight: "800", textAlign: "center" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900" },
  sectionLink: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.7 },
  feedList: { gap: 12 },
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
    elevation: 1,
  },
  taskHead: { flexDirection: "row", gap: 12 },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TOKENS.color.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCopy: { flex: 1, gap: 4 },
  taskKicker: { color: TOKENS.brand.primary, fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.7 },
  taskTitle: { color: TOKENS.color.textPrimary, fontSize: 17, fontWeight: "900", lineHeight: 23 },
  taskMeta: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18, fontWeight: "700" },
  taskFooter: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4 },
  manageText: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "900" },
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
