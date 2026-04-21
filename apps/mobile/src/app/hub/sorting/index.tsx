import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHubSortingCopy, type SortingBatchStatus, type SortingBatchSummary } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { HUB_SORTING_QUEUE } from "./_data";

export default function HubSortingQueueScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getHubSortingCopy(locale);
  const [activeTab, setActiveTab] = useState<SortingBatchStatus>(HUB_SORTING_QUEUE.activeTab);
  const batches = useMemo(
    () => HUB_SORTING_QUEUE.batches.filter((item: SortingBatchSummary) => item.status === activeTab),
    [activeTab],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brandTitle}>FosholHaat</Text>
              <Text style={styles.brandSubtitle}>{copy.screenTitle}</Text>
            </View>
            <View style={styles.headerPill}>
              <MaterialIcons name="shuffle" size={16} color={TOKENS.brand.primary} />
              <Text style={styles.headerPillText}>{copy.activeLabel}</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>{copy.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{copy.heroSubtitle}</Text>
            <View style={styles.metricRow}>
              {(["READY", "IN_PROGRESS", "HOLD", "COMPLETE"] as SortingBatchStatus[]).map((status) => (
                <Pressable
                  key={status}
                  style={[styles.metricCard, activeTab === status && styles.metricCardActive]}
                  onPress={() => setActiveTab(status)}
                >
                  <Text style={styles.metricLabel}>{copy.tabs[status]}</Text>
                  <Text style={styles.metricValue}>{HUB_SORTING_QUEUE.summary[status]}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {batches.length ? (
            <View style={styles.queueList}>
              {batches.map((batch) => (
                <Pressable
                  key={batch.batchId}
                  style={styles.queueCard}
                  onPress={() => router.push(`/hub/sorting/${batch.batchId}`)}
                >
                  <View style={styles.queueCardHeader}>
                    <View style={styles.routeBlock}>
                      <Text style={styles.batchId}>{batch.batchId}</Text>
                      <Text style={styles.routeName}>{batch.commodityLabel}</Text>
                    </View>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>{copy.statuses[batch.status]}</Text>
                    </View>
                  </View>

                  <Text style={styles.destination}>{batch.expectedQuantityLabel}</Text>
                  <Text style={styles.corridor}>{batch.laneLabel}</Text>
                  <Text style={styles.note}>{batch.nextActionLabel}</Text>

                  <View style={styles.queueFooter}>
                    <Text style={styles.assignmentText}>{batch.updatedAtLabel}</Text>
                    <MaterialIcons name="chevron-right" size={20} color={TOKENS.color.textTertiary} />
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{copy.queueEmptyTitle}</Text>
              <Text style={styles.emptyBody}>{copy.queueEmptyBody}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scrollContent: { paddingBottom: 40 },
  shell: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 16,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  brandTitle: { color: TOKENS.brand.primary, fontSize: MOBILE_TOKENS.font.sectionTitle.size, fontWeight: MOBILE_TOKENS.font.sectionTitle.weight, letterSpacing: -0.5 },
  brandSubtitle: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  headerPill: { flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 12, height: 36, borderRadius: 18, backgroundColor: TOKENS.color.soft },
  headerPillText: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "800" },
  heroCard: { borderRadius: MOBILE_TOKENS.radius.heroCard, backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 18, gap: 12 },
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "800", letterSpacing: -0.8 },
  heroSubtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  metricRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  metricCard: { width: "47%", borderRadius: MOBILE_TOKENS.radius.card, backgroundColor: TOKENS.color.canvas, borderWidth: 1, borderColor: TOKENS.color.borderSoft, paddingVertical: 10, paddingHorizontal: 10, gap: 4 },
  metricCardActive: { borderColor: TOKENS.brand.primary, backgroundColor: TOKENS.color.soft },
  metricLabel: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  metricValue: { color: TOKENS.color.textStrong, fontSize: 20, fontWeight: "800" },
  queueList: { gap: 12 },
  queueCard: { borderRadius: MOBILE_TOKENS.radius.heroCard, backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 16, gap: 12 },
  queueCardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  routeBlock: { flex: 1, gap: 4 },
  batchId: { color: TOKENS.brand.primary, fontSize: 13, fontWeight: "800", textTransform: "uppercase" },
  routeName: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "800", letterSpacing: -0.4 },
  statusPill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: TOKENS.color.surfaceMuted },
  statusText: { color: TOKENS.color.textSecondary, fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  destination: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "700" },
  corridor: { color: TOKENS.color.textTertiary, fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
  note: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  queueFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  assignmentText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  emptyCard: { borderRadius: MOBILE_TOKENS.radius.heroCard, borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, padding: 18, gap: 8 },
  emptyTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "800" },
  emptyBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
});
