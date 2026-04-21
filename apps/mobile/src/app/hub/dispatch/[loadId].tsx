import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHubDispatchCopy } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { getHubDispatchDetail } from "./_data";

export default function HubDispatchDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ loadId?: string }>();
  const { locale } = useStoredLocale();
  const copy = getHubDispatchCopy(locale);
  const load = getHubDispatchDetail(params.loadId ?? "LD-2048");

  if (!load) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.shell, styles.notFoundShell]}>
          <Text style={styles.notFoundTitle}>{copy.detailNotFoundTitle}</Text>
          <Text style={styles.notFoundBody}>{copy.detailNotFoundBody}</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace("/hub/dispatch")}>
            <Text style={styles.primaryButtonText}>{copy.backToQueue}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <Pressable style={styles.backButton} onPress={() => router.replace("/hub/dispatch")}>
            <MaterialIcons name="arrow-back" size={18} color={TOKENS.color.textSecondary} />
            <Text style={styles.backButtonText}>{copy.backToQueue}</Text>
          </Pressable>

          <View style={styles.heroCard}>
            <Text style={styles.loadId}>{load.loadId}</Text>
            <Text style={styles.routeName}>{load.routeName}</Text>
            <Text style={styles.destination}>{load.destination}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaPill}>{copy.statuses[load.status]}</Text>
              <Text style={styles.metaPill}>{copy.assignmentStates[load.assignmentState]}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.gateAssignment}</Text>
            <View style={styles.panelRow}>
              <Text style={styles.panelLabel}>Truck</Text>
              <Text style={styles.panelValue}>{load.vehicleId}</Text>
            </View>
            <View style={styles.panelRow}>
              <Text style={styles.panelLabel}>Bay</Text>
              <Text style={styles.panelValue}>{load.loadingBay}</Text>
            </View>
            <View style={styles.panelRow}>
              <Text style={styles.panelLabel}>Assignee</Text>
              <Text style={styles.panelValue}>{load.assignee ?? copy.assignLoad}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.loadMetrics}</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>{copy.metrics.staged}</Text>
                <Text style={styles.metricValue}>{load.metric.stagedParcels}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>{copy.metrics.total}</Text>
                <Text style={styles.metricValue}>{load.metric.totalParcels}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>{copy.metrics.remaining}</Text>
                <Text style={styles.metricValue}>{load.metric.remainingParcels}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>{copy.readiness}</Text>
                <Text style={styles.metricValue}>{load.metric.readinessPercent}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.manifestSummary}</Text>
            {load.manifest.map((item) => (
              <View key={item.lotLabel} style={styles.manifestRow}>
                <View style={styles.manifestHead}>
                  <Text style={styles.manifestLot}>{item.lotLabel}</Text>
                  <Text style={styles.manifestVerification}>{item.verificationLabel}</Text>
                </View>
                <Text style={styles.manifestProduct}>{item.productLabel}</Text>
                <Text style={styles.manifestQuantity}>{item.quantityLabel}</Text>
              </View>
            ))}
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.stagingNote}</Text>
            <Text style={styles.note}>{load.note}</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{copy.assignLoad}</Text>
            </Pressable>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{load.status === "staging" ? copy.confirmReadiness : copy.releaseDispatch}</Text>
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
  heroCard: { borderRadius: MOBILE_TOKENS.radius.heroCard, backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 18, gap: 8 },
  loadId: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  routeName: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800", letterSpacing: -0.9 },
  destination: { color: TOKENS.color.textSecondary, fontSize: 15, fontWeight: "700" },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  metaPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: TOKENS.color.soft, color: TOKENS.brand.primary, overflow: "hidden", fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  panel: { borderRadius: MOBILE_TOKENS.radius.card, backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 16, gap: 12 },
  panelTitle: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "800" },
  panelRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  panelLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  panelValue: { color: TOKENS.color.textPrimary, fontSize: 13, fontWeight: "700", flexShrink: 1, textAlign: "right" },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: { width: "47%", borderRadius: MOBILE_TOKENS.radius.card, backgroundColor: TOKENS.color.canvas, padding: 12, gap: 4 },
  metricLabel: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  metricValue: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "800" },
  manifestRow: { borderRadius: MOBILE_TOKENS.radius.card, backgroundColor: TOKENS.color.canvas, padding: 12, gap: 4 },
  manifestHead: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  manifestLot: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  manifestVerification: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "800" },
  manifestProduct: { color: TOKENS.color.textPrimary, fontSize: 14, fontWeight: "700" },
  manifestQuantity: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  note: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 2 },
  primaryButton: { flex: 1, height: 46, borderRadius: 23, backgroundColor: TOKENS.brand.strong, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  primaryButtonText: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  secondaryButton: { flex: 1, height: 46, borderRadius: 23, backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderNeutral, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  secondaryButtonText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "900" },
  notFoundTitle: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800" },
  notFoundBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
});
