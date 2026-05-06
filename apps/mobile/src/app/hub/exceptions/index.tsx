import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getHubExceptionCopy,
  type HubExceptionAction,
  type HubExceptionDetail,
  type HubExceptionSeverity,
  type HubExceptionStatusTab,
} from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { HUB_EXCEPTION_DETAILS, HUB_EXCEPTION_LIST } from "./_data";

function severityColor(severity: HubExceptionSeverity) {
  if (severity === "critical") return TOKENS.color.alertLive;
  if (severity === "high-priority") return TOKENS.brand.primary;
  return TOKENS.color.textTertiary;
}

export default function HubExceptionManagementScreen() {
  const { locale } = useStoredLocale();
  const copy = getHubExceptionCopy(locale);
  const [activeTab, setActiveTab] = useState<HubExceptionStatusTab>(HUB_EXCEPTION_LIST.activeTab);
  const [selectedId, setSelectedId] = useState<string | null>(HUB_EXCEPTION_LIST.featuredExceptionId);
  const selected = selectedId ? HUB_EXCEPTION_DETAILS[selectedId] : null;
  const items = useMemo(
    () => HUB_EXCEPTION_LIST.exceptions.filter((item) => item.statusTab === activeTab),
    [activeTab],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{copy.screenTitle}</Text>
            <MaterialIcons name="tune" size={20} color={TOKENS.color.textSecondary} />
          </View>

          <View style={styles.tabRow}>
            {(["active", "waiting-review", "resolved"] as HubExceptionStatusTab[]).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{copy.tabs[tab]}</Text>
              </Pressable>
            ))}
          </View>

          {items.length ? (
            <View style={styles.cardList}>
              {items.map((item) => (
                <Pressable key={item.exceptionId} style={styles.card} onPress={() => setSelectedId(item.exceptionId)}>
                  <View style={styles.cardTop}>
                    <View style={styles.severityRow}>
                      <MaterialIcons name="error-outline" size={14} color={severityColor(item.severity)} />
                      <Text style={[styles.severityText, { color: severityColor(item.severity) }]}>
                        {copy.severityLabels[item.severity]}
                      </Text>
                    </View>
                    <Text style={styles.timeText}>{item.createdAgoLabel}</Text>
                  </View>

                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.metaText}>
                    {item.lotLabel} - {item.laneLabel}
                  </Text>
                  <Text style={styles.visibilityText}>{item.buyerVisibilityLabel}</Text>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.primaryAction}
                      onPress={() => setSelectedId(item.exceptionId)}
                      testID={`exception-action-${item.exceptionId}`}
                    >
                      <Text style={styles.primaryActionText}>{item.recommendedActionLabel}</Text>
                    </Pressable>
                    <Pressable
                      style={styles.moreButton}
                      onPress={() => setSelectedId(item.exceptionId)}
                      testID={`exception-more-${item.exceptionId}`}
                    >
                      <MaterialIcons name="more-vert" size={18} color={TOKENS.color.textSecondary} />
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{copy.listEmptyTitle}</Text>
              <Text style={styles.emptyBody}>{copy.listEmptyBody}</Text>
            </View>
          )}

          {selected ? <ExceptionDetailSheet copy={copy} detail={selected} onClose={() => setSelectedId(null)} /> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ExceptionDetailSheet({
  copy,
  detail,
  onClose,
}: {
  copy: ReturnType<typeof getHubExceptionCopy>;
  detail: HubExceptionDetail;
  onClose: () => void;
}) {
  return (
    <View style={styles.sheet}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{detail.title}</Text>
        <Pressable onPress={onClose}>
          <MaterialIcons name="close" size={20} color={TOKENS.color.textSecondary} />
        </Pressable>
      </View>

      <Text style={styles.sheetDescription}>{detail.description}</Text>
      <Text style={styles.sheetMeta}>{detail.lotLabel} - {detail.laneLabel}</Text>
      <Text style={styles.sheetVisibility}>{detail.buyerVisibilityLabel}</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>{copy.source}</Text>
        <Text style={styles.infoValue}>{detail.sourceLabel}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>{copy.timeline}</Text>
        {detail.timeline.map((event) => (
          <Text key={event.id} style={styles.timelineRow}>{event.label} - {event.timeLabel}</Text>
        ))}
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoValue}>{detail.nextActionLabel}</Text>
      </View>

      <View style={styles.sheetActions}>
        {detail.actionOptions.map((action) => (
          <Pressable key={action} style={[styles.sheetActionButton, action === "resolve" && styles.sheetActionPrimary]}>
            <Text style={[styles.sheetActionText, action === "resolve" && styles.sheetActionTextPrimary]}>
              {copy.actionLabels[action as HubExceptionAction]}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scrollContent: { paddingBottom: 28 },
  shell: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 14,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: TOKENS.color.textStrong, fontSize: 28, fontWeight: "800", letterSpacing: 0 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: TOKENS.color.surfaceMuted,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  tabButton: { flex: 1, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tabButtonActive: { backgroundColor: TOKENS.color.surface },
  tabLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  tabLabelActive: { color: TOKENS.brand.primary },
  cardList: { gap: 12 },
  card: {
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    padding: 16,
    gap: 10,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  severityRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  severityText: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  timeText: { color: TOKENS.color.textTertiary, fontSize: 12, fontWeight: "700" },
  cardTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "800", letterSpacing: 0 },
  metaText: { color: TOKENS.color.textSecondary, fontSize: 14, fontWeight: "700" },
  visibilityText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 2 },
  primaryAction: { flex: 1, height: 42, borderRadius: 10, backgroundColor: TOKENS.brand.strong, alignItems: "center", justifyContent: "center" },
  primaryActionText: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  moreButton: { width: 42, height: 42, borderRadius: 10, borderWidth: 1, borderColor: TOKENS.color.borderSoft, alignItems: "center", justifyContent: "center" },
  emptyCard: { borderRadius: MOBILE_TOKENS.radius.heroCard, backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 18, gap: 8 },
  emptyTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "800" },
  emptyBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  sheet: { backgroundColor: TOKENS.color.surface, borderRadius: MOBILE_TOKENS.radius.heroCard, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 16, gap: 12, marginTop: 6 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  sheetTitle: { flex: 1, color: TOKENS.color.textStrong, fontSize: 20, fontWeight: "800", letterSpacing: 0 },
  sheetDescription: { color: TOKENS.color.textPrimary, fontSize: 14, lineHeight: 20 },
  sheetMeta: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  sheetVisibility: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  infoBlock: { gap: 6 },
  infoLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  infoValue: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "700" },
  timelineRow: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  sheetActions: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  sheetActionButton: { minWidth: 100, height: 40, borderRadius: 12, backgroundColor: TOKENS.color.canvas, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  sheetActionPrimary: { backgroundColor: TOKENS.brand.strong },
  sheetActionText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "900" },
  sheetActionTextPrimary: { color: TOKENS.color.surface },
});
