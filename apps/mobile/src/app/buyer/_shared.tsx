import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBuyerCartCheckoutCopy, type Locale } from "@fosholhaat/types";
import { MOBILE_TOKENS, TOKENS } from "../../styles/tokens";
import { BUYER_STEP_ORDER, formatBuyerMoney, type BuyerStepKey, getBuyerFlowCopy } from "./_data";

type BuyerShellProps = {
  locale: Locale;
  activeStep: BuyerStepKey;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

type BuyerSummaryProps = {
  locale: Locale;
  title?: string;
  lines: { label: string; value: string }[];
  totals: { subtotal: number; deliveryFee: number; serviceFee: number; payableTotal: number };
};

export function BuyerShell({ locale, activeStep, title, subtitle, footer, children }: BuyerShellProps) {
  const routeCopy = getBuyerCartCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <View style={styles.brandBlock}>
              <View style={styles.brandMark}>
                <MaterialIcons name="shopping-cart" size={16} color={TOKENS.color.surface} />
              </View>
              <View>
                <Text style={styles.brandTitle}>FosholHaat</Text>
                <Text style={styles.brandSubtitle}>{flowCopy.shellTitle}</Text>
              </View>
            </View>
            <View style={styles.headerPill}>
              <MaterialIcons name="shopping-cart" size={16} color={TOKENS.brand.primary} />
              <Text style={styles.headerPillText}>{flowCopy.stepIntro}</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>{title}</Text>
            {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
            <View style={styles.stepRow}>
              {BUYER_STEP_ORDER.map((step) => (
                <View key={step} style={[styles.stepChip, step === activeStep && styles.stepChipActive]}>
                  <Text style={[styles.stepChipText, step === activeStep && styles.stepChipTextActive]}>
                    {routeCopy.stepLabels[step]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function BuyerSummaryCard({ locale, title, lines, totals }: BuyerSummaryProps) {
  const routeCopy = getBuyerCartCheckoutCopy(locale);
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title ?? routeCopy.summaryTitle}</Text>
      {lines.map((line) => (
        <View key={line.label} style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{line.label}</Text>
          <Text style={styles.summaryValue}>{line.value}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{routeCopy.labels.subtotal}</Text>
        <Text style={styles.summaryValue}>{formatBuyerMoney(totals.subtotal, locale)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{routeCopy.labels.deliveryFee}</Text>
        <Text style={styles.summaryValue}>{formatBuyerMoney(totals.deliveryFee, locale)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{routeCopy.labels.serviceFee}</Text>
        <Text style={styles.summaryValue}>{formatBuyerMoney(totals.serviceFee, locale)}</Text>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>{routeCopy.labels.payableTotal}</Text>
        <Text style={styles.totalValue}>{formatBuyerMoney(totals.payableTotal, locale)}</Text>
      </View>
    </View>
  );
}

export function BuyerLineCard({
  title,
  meta,
  note,
  subtotal,
  locale,
}: {
  title: string;
  meta: string;
  note?: string;
  subtotal: number;
  locale: Locale;
}) {
  return (
    <View style={styles.lineCard}>
      <View style={styles.lineCardHeader}>
        <View style={styles.lineCardBody}>
          <Text style={styles.lineTitle}>{title}</Text>
          <Text style={styles.lineMeta}>{meta}</Text>
        </View>
        <Text style={styles.lineSubtotal}>{formatBuyerMoney(subtotal, locale)}</Text>
      </View>
      {note ? <Text style={styles.lineNote}>{note}</Text> : null}
    </View>
  );
}

export function BuyerChoiceCard({
  title,
  subtitle,
  active,
  onPress,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.choiceCard, active && styles.choiceCardActive]} onPress={onPress}>
      <View style={styles.choiceBody}>
        <Text style={styles.choiceTitle}>{title}</Text>
        <Text style={styles.choiceSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active ? <View style={styles.radioInner} /> : null}
      </View>
    </Pressable>
  );
}

export function BuyerField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "phone-pad" | "numeric";
  multiline?: boolean;
  error?: string | null;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={TOKENS.color.textTertiary}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function BuyerBanner({
  tone = "info",
  title,
  body,
}: {
  tone?: "info" | "error" | "success";
  title: string;
  body: string;
}) {
  return (
    <View style={[styles.banner, tone === "error" && styles.bannerError, tone === "success" && styles.bannerSuccess]}>
      <Text style={styles.bannerTitle}>{title}</Text>
      <Text style={styles.bannerBody}>{body}</Text>
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
      style={[styles.actionButton, variant === "primary" ? styles.primaryButton : styles.secondaryButton]}
      onPress={onPress}
    >
      <Text style={[styles.actionButtonText, variant === "primary" ? styles.primaryButtonText : styles.secondaryButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  scrollContent: { paddingBottom: 28 },
  shell: {
    maxWidth: 520,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    paddingTop: MOBILE_TOKENS.spacing.headerTop,
    gap: 14,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  brandBlock: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    color: TOKENS.color.textStrong,
    fontSize: MOBILE_TOKENS.font.sectionTitle.size,
    fontWeight: MOBILE_TOKENS.font.sectionTitle.weight,
    letterSpacing: 0,
  },
  brandSubtitle: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  headerPill: { flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 12, height: 36, borderRadius: 18, backgroundColor: TOKENS.color.soft },
  headerPillText: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "800" },
  heroCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 18,
    gap: 10,
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  heroTitle: { color: TOKENS.color.textStrong, fontSize: 22, fontWeight: "900", letterSpacing: 0 },
  heroSubtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  stepRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  stepChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TOKENS.color.surfaceMuted,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
  },
  stepChipActive: { backgroundColor: TOKENS.color.soft, borderColor: TOKENS.color.soft },
  stepChipText: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  stepChipTextActive: { color: TOKENS.brand.primary },
  footer: { gap: 10 },
  panel: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 16,
    gap: 10,
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  panelTitle: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "800" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  summaryLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  summaryValue: { color: TOKENS.color.textPrimary, fontSize: 13, fontWeight: "700", textAlign: "right", flexShrink: 1 },
  divider: { height: 1, backgroundColor: TOKENS.color.borderSoft, marginVertical: 2 },
  totalRow: { paddingTop: 2 },
  totalLabel: { color: TOKENS.color.textStrong, fontSize: 13, fontWeight: "900" },
  totalValue: { color: TOKENS.brand.primary, fontSize: 16, fontWeight: "900", textAlign: "right" },
  lineCard: { borderRadius: MOBILE_TOKENS.radius.card, backgroundColor: TOKENS.color.canvas, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 14, gap: 8 },
  lineCardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  lineCardBody: { flex: 1, gap: 4 },
  lineTitle: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "800" },
  lineMeta: { color: TOKENS.color.textSecondary, fontSize: 12, lineHeight: 17 },
  lineSubtotal: { color: TOKENS.brand.primary, fontSize: 14, fontWeight: "900" },
  lineNote: { color: TOKENS.color.textSecondary, fontSize: 12, lineHeight: 18 },
  choiceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: MOBILE_TOKENS.radius.card,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
  },
  choiceCardActive: { borderColor: TOKENS.brand.primary, backgroundColor: TOKENS.color.selectedSurface },
  choiceBody: { flex: 1, gap: 4 },
  choiceTitle: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "800" },
  choiceSubtitle: { color: TOKENS.color.textSecondary, fontSize: 12, lineHeight: 18 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: TOKENS.color.textTertiary, alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: TOKENS.brand.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: TOKENS.brand.primary },
  fieldGroup: { gap: 8 },
  fieldLabel: { color: TOKENS.color.textPrimary, fontSize: 13, fontWeight: "800" },
  input: { minHeight: 54, borderRadius: MOBILE_TOKENS.radius.productCard, borderWidth: 1, borderColor: TOKENS.color.borderSoft, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: TOKENS.color.canvas, color: TOKENS.color.textPrimary, fontSize: 15 },
  inputMultiline: { minHeight: 78, textAlignVertical: "top" },
  inputError: { borderColor: TOKENS.color.errorBorder, backgroundColor: TOKENS.color.errorSurface },
  errorText: { color: TOKENS.color.alertLive, fontSize: 12, lineHeight: 18, fontWeight: "700" },
  banner: { borderRadius: MOBILE_TOKENS.radius.card, borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.canvas, padding: 14, gap: 4 },
  bannerError: { borderColor: TOKENS.color.errorBorder, backgroundColor: TOKENS.color.errorSurface },
  bannerSuccess: { borderColor: TOKENS.color.successText, backgroundColor: TOKENS.color.successBrightTint },
  bannerTitle: { color: TOKENS.color.textStrong, fontSize: 14, fontWeight: "800" },
  bannerBody: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  actionButton: { minHeight: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  primaryButton: { backgroundColor: TOKENS.brand.primary },
  secondaryButton: { backgroundColor: TOKENS.color.surface, borderWidth: 1, borderColor: TOKENS.color.borderNeutral },
  actionButtonText: { fontSize: 14, fontWeight: "900" },
  primaryButtonText: { color: TOKENS.color.surface },
  secondaryButtonText: { color: TOKENS.color.textSecondary },
});
