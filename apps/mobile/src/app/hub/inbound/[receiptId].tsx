import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHubInboundCopy } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { HUB_INBOUND_QUEUE, getHubInboundDetail } from "./_data";

function dash(value: string | null | undefined) {
  return value ?? "-";
}

function formatWhen(value: string | null, fallback: string) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function HubInboundDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ receiptId?: string }>();
  const { locale } = useStoredLocale();
  const copy = getHubInboundCopy(locale);
  const receipt = getHubInboundDetail(params.receiptId ?? HUB_INBOUND_QUEUE.featuredReceiptId);

  if (!receipt) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.shell, styles.notFoundShell]}>
          <Text style={styles.notFoundTitle}>{copy.detailNotFoundTitle}</Text>
          <Text style={styles.notFoundBody}>{copy.detailNotFoundBody}</Text>
          <Pressable style={styles.secondaryButton} onPress={() => router.replace("/hub/inbound")}>
            <Text style={styles.secondaryButtonText}>{copy.backToQueue}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const timestamp = formatWhen(receipt.receivedAt, `${receipt.arrivalDate} ${receipt.arrivalWindowLabel}`);
  const discrepancyLabel = receipt.discrepancy
    ? `${receipt.discrepancy.actualQuantity} ${receipt.unit}`
    : copy.actions.discrepancy;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <Pressable style={styles.backButton} onPress={() => router.replace("/hub/inbound")}>
            <MaterialIcons name="arrow-back" size={20} color={TOKENS.color.textSecondary} />
            <Text style={styles.backButtonText}>{copy.backToQueue}</Text>
          </Pressable>

          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{copy.statuses[receipt.status]}</Text>
              </View>
              <Text style={styles.heroId}>{receipt.id}</Text>
            </View>
            <View style={styles.heroIcon}>
              <MaterialIcons name="inventory-2" size={28} color={TOKENS.brand.primary} />
            </View>
            <Text style={styles.heroTitle}>{receipt.commodity}</Text>
            <Text style={styles.heroSubtitle}>{receipt.supplierName}</Text>
            <Text style={styles.heroMeta}>{receipt.laneLabel}</Text>
          </View>

          <View style={styles.snapshotCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="info-outline" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.sectionTitle}>Intake Snapshot</Text>
              </View>
            </View>

            <View style={styles.keyValueRow}>
              <Text style={styles.keyLabel}>{copy.labels.expected}</Text>
              <Text style={styles.keyValue}>{receipt.expectedQuantity} {receipt.unit}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.keyValueRow}>
              <Text style={styles.keyLabel}>{copy.labels.lane}</Text>
              <Text style={styles.keyValue}>{receipt.laneLabel}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.keyValueRow}>
              <Text style={styles.keyLabel}>{copy.labels.arrival}</Text>
              <Text style={styles.keyValue}>{receipt.arrivalWindowLabel}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.keyValueRow}>
              <Text style={styles.keyLabel}>{copy.labels.receiver}</Text>
              <Text style={styles.keyValue}>{dash(receipt.receiverName)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.keyValueRow}>
              <Text style={styles.keyLabel}>Timestamp</Text>
              <Text style={styles.keyValue}>{timestamp}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="rule" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.sectionTitle}>Verification Checklist</Text>
              </View>
            </View>
            <View style={styles.checkItem}>
              <MaterialIcons name={receipt.discrepancy ? "check-box-outline-blank" : "check-box"} size={18} color={TOKENS.brand.primary} />
              <Text style={styles.checkText}>Weight confirmation at dock</Text>
            </View>
            <View style={styles.checkItem}>
              <MaterialIcons name={receipt.actualGradeLabel ? "check-box" : "check-box-outline-blank"} size={18} color={TOKENS.brand.primary} />
              <Text style={styles.checkText}>Grade matched against intake note</Text>
            </View>
            <View style={styles.checkItem}>
              <MaterialIcons name={receipt.receiverName ? "check-box" : "check-box-outline-blank"} size={18} color={TOKENS.brand.primary} />
              <Text style={styles.checkText}>Receiver sign-off recorded</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionMark}>
                <MaterialIcons name="grade" size={18} color={TOKENS.brand.primary} />
                <Text style={styles.sectionTitle}>Quality Grading</Text>
              </View>
              <Text style={styles.sectionAction}>{copy.actions.discrepancy}</Text>
            </View>
            <View style={styles.gradeCard}>
              <View style={styles.gradeBadge}>
                <Text style={styles.gradeBadgeText}>{receipt.expectedGradeLabel}</Text>
              </View>
              <View style={styles.gradeCopy}>
                <Text style={styles.gradeTitle}>{receipt.expectedGradeLabel}</Text>
                <Text style={styles.gradeSubtitle}>{dash(receipt.actualGradeLabel)}</Text>
              </View>
            </View>
            <View style={styles.discrepancyCard}>
              <View style={styles.discrepancyRow}>
                <MaterialIcons
                  name={receipt.discrepancy ? "warning-amber" : "info-outline"}
                  size={18}
                  color={receipt.discrepancy ? TOKENS.color.alertLive : TOKENS.brand.primary}
                />
                <Text style={styles.discrepancyTitle}>
                  {receipt.discrepancy ? discrepancyLabel : copy.feedback.discrepancy}
                </Text>
              </View>
              <Text style={styles.discrepancyBody}>
                {receipt.discrepancy ? receipt.discrepancy.notes : receipt.note}
              </Text>
              {receipt.discrepancy ? (
                <Text style={styles.discrepancyMeta}>{receipt.discrepancy.reportedAt}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.actionDock}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{copy.actions.receive}</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Flag Issue</Text>
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
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 26, fontWeight: "900", letterSpacing: -0.8 },
  heroSubtitle: { color: TOKENS.color.textSecondary, fontSize: 15, fontWeight: "700" },
  heroMeta: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  snapshotCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 16,
    gap: 10,
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
  keyValueRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  keyLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  keyValue: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "800", textAlign: "right", flexShrink: 1 },
  divider: { height: 1, backgroundColor: TOKENS.color.borderSoft },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkText: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "700", flexShrink: 1 },
  gradeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.canvas,
  },
  gradeBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TOKENS.brand.primary,
  },
  gradeBadgeText: { color: TOKENS.color.surface, fontSize: 20, fontWeight: "900" },
  gradeCopy: { flex: 1, gap: 4 },
  gradeTitle: { color: TOKENS.color.textPrimary, fontSize: 18, fontWeight: "900" },
  gradeSubtitle: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  discrepancyCard: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.errorSurface,
    borderWidth: 1,
    borderColor: TOKENS.color.errorBorder,
    padding: 14,
    gap: 8,
  },
  discrepancyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  discrepancyTitle: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "900", flexShrink: 1 },
  discrepancyBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  discrepancyMeta: { color: TOKENS.color.textTertiary, fontSize: 12, fontWeight: "700" },
  actionDock: { flexDirection: "row", gap: 10, paddingTop: 2 },
  primaryButton: {
    flex: 1,
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
