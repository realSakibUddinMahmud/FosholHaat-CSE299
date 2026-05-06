import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHubSortingCopy } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { HUB_SORTING_QUEUE, getHubSortingDetail } from "./_data";

function dash(value: string | null | undefined) {
  return value ?? "-";
}

function progressFromStatus(status: string) {
  if (status === "IN_PROGRESS") return 0.68;
  if (status === "HOLD") return 0.42;
  if (status === "COMPLETE") return 1;
  return 0.18;
}

export default function HubSortingDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ batchId?: string }>();
  const { locale } = useStoredLocale();
  const copy = getHubSortingCopy(locale);
  const batch = getHubSortingDetail(params.batchId ?? HUB_SORTING_QUEUE.featuredBatchId);

  if (!batch) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.shell, styles.notFoundShell]}>
          <Text style={styles.notFoundTitle}>{copy.detailNotFoundTitle}</Text>
          <Text style={styles.notFoundBody}>{copy.detailNotFoundBody}</Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.replace("/hub/sorting")}>
            <Text style={styles.secondaryButtonText}>{copy.backToQueue}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const progress = progressFromStatus(batch.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <Pressable style={styles.backButton} onPress={() => router.replace("/hub/sorting")}>
            <MaterialIcons name="arrow-back" size={20} color={TOKENS.color.textSecondary} />
            <Text style={styles.backButtonText}>{copy.backToQueue}</Text>
          </Pressable>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{copy.statuses[batch.status]}</Text>
              </View>
              <Text style={styles.heroId}>{batch.batchId}</Text>
            </View>
            <View style={styles.heroIcon}>
              <MaterialIcons name="precision-manufacturing" size={28} color={TOKENS.brand.primary} />
            </View>
            <Text style={styles.heroTitle}>{batch.commodityLabel}</Text>
            <Text style={styles.heroSubtitle}>{batch.laneLabel}</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="trending-up" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.sectionTitle}>Operational Progress</Text>
              </View>
              <Text style={styles.progressCount}>{batch.expectedQuantityLabel}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { flex: progress }]} />
              <View style={{ flex: 1 - progress }} />
            </View>
            <View style={styles.progressFoot}>
              <Text style={styles.progressLabel}>{copy.labels.nextAction}</Text>
              <Text style={styles.progressValue}>{batch.nextActionLabel}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="fact-check" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.sectionTitle}>QA Checkpoints</Text>
              </View>
            </View>
            {batch.itemGroups.map((item) => (
              <View key={item.label} style={styles.checkRow}>
                <View style={styles.checkIcon}>
                  <MaterialIcons name="check" size={16} color={TOKENS.brand.primary} />
                </View>
                <View style={styles.checkCopy}>
                  <Text style={styles.checkTitle}>{item.label}</Text>
                  <Text style={styles.checkBody}>Sorting split and quality status</Text>
                </View>
                <Text style={styles.checkValue}>{item.quantityLabel}</Text>
              </View>
            ))}
          </View>

          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="badge" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.sectionTitle}>Station Assignment</Text>
              </View>
              <Text style={styles.sectionAction}>{dash(batch.holdRecord?.reasonLabel ?? null)}</Text>
            </View>
            <View style={styles.assignmentCard}>
              <View style={styles.assignmentBlock}>
                <Text style={styles.assignmentLabel}>{copy.labels.receiver}</Text>
                <Text style={styles.assignmentValue}>{batch.receiverLabel}</Text>
              </View>
              <View style={styles.assignmentDivider} />
              <View style={styles.assignmentBlock}>
                <Text style={styles.assignmentLabel}>{copy.labels.lane}</Text>
                <Text style={styles.assignmentValue}>{batch.laneLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="warning-amber" size={18} color={TOKENS.color.alertLive} />
                <Text style={styles.sectionTitle}>Operational Exception Log</Text>
              </View>
            </View>
            <View style={styles.discrepancyCard}>
              <Text style={styles.discrepancyTitle}>{batch.holdRecord ? batch.holdRecord.reasonLabel : copy.actions.hold}</Text>
              <Text style={styles.discrepancyBody}>{batch.holdRecord ? batch.holdRecord.note : batch.nextActionLabel}</Text>
              {batch.holdRecord ? <Text style={styles.discrepancyMeta}>{batch.holdRecord.reportedAt}</Text> : null}
            </View>
          </View>

          <View style={styles.actionDock}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Confirm Sorting Update</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Mark Ready for Dispatch</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scrollContent: { paddingBottom: 32 },
  shell: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 14,
  },
  notFoundShell: { justifyContent: "center", flex: 1, minHeight: 420 },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  backButtonText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "800" },
  heroCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 18,
    gap: 8,
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
  },
  statusText: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  heroId: { color: TOKENS.color.textTertiary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  heroIcon: {
    width: 92,
    height: 92,
    borderRadius: 18,
    backgroundColor: TOKENS.color.soft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 6,
  },
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 26, fontWeight: "900", letterSpacing: 0 },
  heroSubtitle: { color: TOKENS.color.textSecondary, fontSize: 15, fontWeight: "700" },
  progressCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 16,
    gap: 12,
  },
  panel: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 16,
    gap: 12,
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  sectionMark: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { color: TOKENS.color.textPrimary, fontSize: 17, fontWeight: "900" },
  sectionAction: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  progressCount: { color: TOKENS.color.textPrimary, fontSize: 16, fontWeight: "900" },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: TOKENS.color.progressTrack,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressFill: { backgroundColor: TOKENS.brand.primary },
  progressFoot: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-end" },
  progressLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  progressValue: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "800", flexShrink: 1, textAlign: "right" },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.canvas,
    padding: 12,
  },
  checkIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: TOKENS.color.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCopy: { flex: 1, gap: 2 },
  checkTitle: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "900" },
  checkBody: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  checkValue: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "900" },
  assignmentCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.canvas,
    padding: 14,
  },
  assignmentBlock: { flex: 1, gap: 4 },
  assignmentDivider: { width: 1, alignSelf: "stretch", backgroundColor: TOKENS.color.borderSoft, marginHorizontal: 12 },
  assignmentLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  assignmentValue: { color: TOKENS.color.textPrimary, fontSize: 15, fontWeight: "900" },
  discrepancyCard: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.errorSurface,
    borderWidth: 1,
    borderColor: TOKENS.color.errorBorder,
    padding: 14,
    gap: 8,
  },
  discrepancyTitle: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "900" },
  discrepancyBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  discrepancyMeta: { color: TOKENS.color.textTertiary, fontSize: 12, fontWeight: "700" },
  actionDock: { flexDirection: "row", gap: 10, paddingTop: 2, flexWrap: "wrap" },
  primaryButton: {
    flex: 1,
    minWidth: 200,
    height: 48,
    borderRadius: 24,
    backgroundColor: TOKENS.brand.strong,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: { color: TOKENS.color.surface, fontSize: 14, fontWeight: "900" },
  secondaryButton: {
    flex: 1,
    minWidth: 160,
    height: 48,
    borderRadius: 24,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryButtonText: { color: TOKENS.color.textSecondary, fontSize: 14, fontWeight: "900" },
  notFoundTitle: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800" },
  notFoundBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
});
