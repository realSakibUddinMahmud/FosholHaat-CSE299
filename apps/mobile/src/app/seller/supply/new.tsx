import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Locale, SellerSupplyCommodity, SellerSupplyUnit } from "@fosholhaat/types";
import { useStoredLocale } from "../../../lib/locale";
import { TOKENS } from "../../../styles/tokens";
import { getMobileSellerCopy } from "./supply-data";

const CATEGORIES: Array<{
  value: SellerSupplyCommodity;
  note: string;
}> = [
  { value: "potato", note: "Fast-moving lane" },
  { value: "onion", note: "Core wholesale line" },
  { value: "vegetables", note: "Fresh daily stock" },
];

const GRADES = ["Grade A", "Grade B", "Grade C"] as const;

export function SellerNewSupplyScreen({ locale }: { locale: Locale }) {
  const copy = getMobileSellerCopy(locale);
  const [commodity, setCommodity] = useState<SellerSupplyCommodity>("potato");
  const [grade, setGrade] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<SellerSupplyUnit>("bag");
  const [price, setPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function submit() {
    const nextErrors: string[] = [];
    if (!grade.trim()) nextErrors.push(copy.errors.grade);
    if (!quantity || Number(quantity) <= 0) nextErrors.push(copy.errors.quantity);
    if (!price || Number(price) <= 0) nextErrors.push(copy.errors.price);
    setErrors(nextErrors);
    setSaved(nextErrors.length === 0);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Add new supply</Text>
          <Text style={styles.title}>{copy.newSupplyTitle}</Text>
          <Text style={styles.subtitle}>{copy.newSupplySubtitle}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Category selection</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((item) => {
              const active = commodity === item.value;
              return (
                <Pressable
                  key={item.value}
                  style={[styles.categoryCard, active && styles.categoryCardActive]}
                  onPress={() => setCommodity(item.value)}
                >
                  <View style={styles.categoryMedia} />
                  <Text style={styles.categoryLabel}>{copy.commodities[item.value]}</Text>
                  <Text style={styles.categoryMeta}>{item.note}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stock details</Text>
          <View style={styles.inlineGrid}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{copy.fields.quantity}</Text>
              <TextInput
                accessibilityLabel={copy.fields.quantity}
                placeholder="500"
                placeholderTextColor={TOKENS.color.textTertiary}
                style={styles.input}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{copy.fields.unit}</Text>
              <View style={styles.selectShell}>
                <TextInput
                  accessibilityLabel={copy.fields.unit}
                  placeholder={copy.units[unit]}
                  placeholderTextColor={TOKENS.color.textTertiary}
                  style={styles.input}
                  value={unit}
                  onChangeText={(value) => setUnit(value as SellerSupplyUnit)}
                />
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{copy.fields.grade}</Text>
            <TextInput
              accessibilityLabel={copy.fields.grade}
              placeholder="Grade A"
              placeholderTextColor={TOKENS.color.textTertiary}
              style={styles.input}
              value={grade}
              onChangeText={setGrade}
            />
          </View>

          <View style={styles.gradeRow}>
            {GRADES.map((item) => (
              <Pressable
                key={item}
                style={[styles.gradeChip, grade === item && styles.gradeChipActive]}
                onPress={() => setGrade(item)}
              >
                <Text style={[styles.gradeChipText, grade === item && styles.gradeChipTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{copy.fields.price}</Text>
            <TextInput
              accessibilityLabel={copy.fields.price}
              placeholder="32.50"
              placeholderTextColor={TOKENS.color.textTertiary}
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{copy.fields.availableFrom}</Text>
            <TextInput
              accessibilityLabel={copy.fields.availableFrom}
              placeholder="Tomorrow morning"
              placeholderTextColor={TOKENS.color.textTertiary}
              style={styles.input}
              value={availableFrom}
              onChangeText={setAvailableFrom}
            />
          </View>
          <Text style={styles.helperText}>Recommended market price for Bogura Hub: ৳31.00 - ৳34.00</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Operational settings</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.metrics.active}</Text>
              <Text style={styles.summaryValue}>3</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{copy.metrics.readyToday}</Text>
              <Text style={styles.summaryValue}>2</Text>
            </View>
          </View>
          <View style={styles.summaryCardSoft}>
            <MaterialIcons name="local-shipping" size={18} color={TOKENS.brand.primary} />
            <Text style={styles.summarySoftText}>Daily dispatch: 8:00 PM</Text>
          </View>
        </View>

        {errors.length ? (
          <View style={styles.card}>
            {errors.map((error) => (
              <Text key={error} style={styles.error}>
                {error}
              </Text>
            ))}
          </View>
        ) : null}
        {saved ? (
          <View style={styles.card}>
            <Text style={styles.message}>{copy.success}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.stickyBar}>
        <Pressable accessibilityRole="button" onPress={submit} style={styles.button}>
          <MaterialIcons name="publish" size={20} color={TOKENS.color.surface} />
          <Text style={styles.buttonText}>{copy.saveSupply}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function SellerNewSupplyRoute() {
  const { locale } = useStoredLocale();
  return <SellerNewSupplyScreen locale={locale} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 112, gap: 14 },
  hero: { gap: 8 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 28, lineHeight: 32, fontWeight: "900", letterSpacing: -1 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  card: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  sectionTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900", letterSpacing: -0.4 },
  categoryGrid: { flexDirection: "row", gap: 10 },
  categoryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: 16,
    padding: 10,
    gap: 8,
    backgroundColor: TOKENS.color.surface,
  },
  categoryCardActive: {
    borderColor: TOKENS.brand.primary,
    shadowColor: TOKENS.brand.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryMedia: {
    height: 92,
    borderRadius: 14,
    backgroundColor: TOKENS.color.soft,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
  },
  categoryLabel: { color: TOKENS.color.textStrong, fontSize: 14, fontWeight: "900" },
  categoryMeta: { color: TOKENS.color.textSecondary, fontSize: 12, lineHeight: 16 },
  inlineGrid: { flexDirection: "row", gap: 10 },
  field: { flex: 1, gap: 8 },
  fieldLabel: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800" },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    borderRadius: 14,
    backgroundColor: TOKENS.color.canvas,
    paddingHorizontal: 14,
    color: TOKENS.color.textStrong,
    fontSize: 16,
    fontWeight: "700",
  },
  selectShell: { position: "relative" },
  gradeRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  gradeChip: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TOKENS.color.surface,
  },
  gradeChipActive: {
    borderColor: TOKENS.brand.primary,
    backgroundColor: TOKENS.color.soft,
  },
  gradeChipText: { color: TOKENS.color.textSecondary, fontSize: 15, fontWeight: "800" },
  gradeChipTextActive: { color: TOKENS.brand.primary },
  helperText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 19 },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.canvas,
    padding: 12,
    gap: 4,
  },
  summaryLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  summaryValue: { color: TOKENS.color.textStrong, fontSize: 20, fontWeight: "900" },
  summaryCardSoft: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summarySoftText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  error: { color: TOKENS.color.alertLive, fontSize: 14, fontWeight: "700" },
  message: { color: TOKENS.brand.primary, fontSize: 14, fontWeight: "800" },
  stickyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surfaceOverlayStrong,
  },
  button: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: TOKENS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonText: { color: TOKENS.color.surface, fontSize: 16, fontWeight: "900" },
});
