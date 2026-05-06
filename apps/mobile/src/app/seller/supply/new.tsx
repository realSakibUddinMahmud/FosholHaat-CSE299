import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Locale, SellerSupplyCommodity, SellerSupplyUnit } from "@fosholhaat/types";
import { apiPost } from "../../../lib/api-client";
import { useStoredLocale } from "../../../lib/locale";
import { TOKENS } from "../../../styles/tokens";
import { getMobileSellerCopy } from "./supply-data";

const CATEGORIES: Array<{
  value: SellerSupplyCommodity;
  note: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}> = [
  { value: "potato", note: "Fast-moving lane", icon: "eco" },
  { value: "onion", note: "Core wholesale line", icon: "spa" },
  { value: "vegetables", note: "Fresh daily stock", icon: "local-florist" },
];

const GRADES = ["Grade A", "Grade B", "Grade C"] as const;

export function SellerNewSupplyScreen({ locale }: { locale: Locale }) {
  const router = useRouter();
  const copy = getMobileSellerCopy(locale);
  const [commodity, setCommodity] = useState<SellerSupplyCommodity>("potato");
  const [grade, setGrade] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<SellerSupplyUnit>("bag");
  const [price, setPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [singleBuyEnabled, setSingleBuyEnabled] = useState(true);
  const [groupBuyEnabled, setGroupBuyEnabled] = useState(false);
  const [singleMinQty, setSingleMinQty] = useState("1");
  const [singleMaxQty, setSingleMaxQty] = useState("");
  const [groupMinQty, setGroupMinQty] = useState("1");
  const [groupTargetQty, setGroupTargetQty] = useState("");
  const [groupPrice, setGroupPrice] = useState("");
  const [groupDeadline, setGroupDeadline] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function pickPhotos() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrors(["Photo library permission is required."]);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      base64: true,
      quality: 0.72,
      selectionLimit: 3,
    });
    if (result.canceled) return;
    const next = result.assets
      .map((asset) => asset.base64 ? `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}` : asset.uri)
      .filter(Boolean)
      .slice(0, 3);
    setPhotoUrls((current) => [...current, ...next].slice(0, 3));
  }

  async function submit() {
    const nextErrors: string[] = [];
    const qty = Number(quantity);
    const asking = Number(price);
    const singleMin = Number(singleMinQty) || 1;
    const singleMax = Number(singleMaxQty) || qty;
    const groupMin = Number(groupMinQty) || 1;
    const groupTarget = Number(groupTargetQty) || qty;
    const groupDealPrice = Number(groupPrice) || Math.max(1, Math.floor(asking * 0.95));
    if (!grade.trim()) nextErrors.push(copy.errors.grade);
    if (!quantity || qty <= 0) nextErrors.push(copy.errors.quantity);
    if (!price || asking <= 0) nextErrors.push(copy.errors.price);
    if (!singleBuyEnabled && !groupBuyEnabled) nextErrors.push("Choose single buy, group buy, or both.");
    if (singleBuyEnabled && (singleMin > singleMax || singleMax > qty)) nextErrors.push("Single-buy min/max must stay inside stock.");
    if (groupBuyEnabled && (groupMin > groupTarget || groupTarget > qty)) nextErrors.push("Group-buy min/target must stay inside stock.");
    if (groupBuyEnabled && groupDealPrice > asking) nextErrors.push("Group price cannot exceed asking price.");
    const photoBytes = photoUrls.reduce((sum, uri) => sum + uri.length, 0);
    if (photoBytes > 18_000_000) nextErrors.push("Selected photos are too large. Remove one photo or choose smaller images.");
    setErrors(nextErrors);
    if (nextErrors.length) return;
    setSaving(true);
    setSaved(false);
    try {
      await apiPost("/seller/supply", {
        commodity,
        quantity: qty,
        unit,
        gradeLabel: grade,
        askingPrice: asking,
        availableFrom: /^\d{4}-\d{2}-\d{2}/.test(availableFrom) ? availableFrom : undefined,
        photoUrls,
        singleBuyEnabled,
        groupBuyEnabled,
        singleMinQty: singleBuyEnabled ? singleMin : undefined,
        singleMaxQty: singleBuyEnabled ? singleMax : undefined,
        groupMinQty: groupBuyEnabled ? groupMin : undefined,
        groupTargetQty: groupBuyEnabled ? groupTarget : undefined,
        groupPrice: groupBuyEnabled ? groupDealPrice : undefined,
        groupDeadline: /^\d{4}-\d{2}-\d{2}/.test(groupDeadline) ? groupDeadline : undefined,
      });
      setSaved(true);
      router.replace("/seller/supply");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Supply save failed"]);
    } finally {
      setSaving(false);
    }
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
                  <View style={styles.categoryMedia}>
                    <MaterialIcons name={item.icon} size={34} color={TOKENS.brand.primary} />
                  </View>
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
          <Text style={styles.sectionTitle}>Supply photo</Text>
          <Pressable accessibilityRole="button" style={styles.photoPicker} onPress={pickPhotos}>
            <MaterialIcons name="add-a-photo" size={24} color={TOKENS.brand.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.photoPickerTitle}>Choose supply photos</Text>
              <Text style={styles.photoPickerBody}>Upload up to 3 real photos from this device.</Text>
            </View>
          </Pressable>
          <View style={styles.photoGrid}>
            {photoUrls.map((uri) => (
              <View key={uri.slice(0, 42)} style={styles.photoThumbWrap}>
                <Image source={{ uri }} style={styles.photoThumb} />
                <Pressable style={styles.photoRemove} onPress={() => setPhotoUrls((current) => current.filter((item) => item !== uri))}>
                  <Text style={styles.photoRemoveText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Operational settings</Text>
          <View style={styles.toggleRow}>
            <Pressable style={[styles.toggle, singleBuyEnabled && styles.toggleActive]} onPress={() => setSingleBuyEnabled(!singleBuyEnabled)}>
              <Text style={[styles.toggleText, singleBuyEnabled && styles.toggleTextActive]}>Single buy</Text>
            </Pressable>
            <Pressable style={[styles.toggle, groupBuyEnabled && styles.toggleActive]} onPress={() => setGroupBuyEnabled(!groupBuyEnabled)}>
              <Text style={[styles.toggleText, groupBuyEnabled && styles.toggleTextActive]}>Group buy</Text>
            </Pressable>
          </View>
          <View style={styles.inlineGrid}>
            <View style={styles.field}><Text style={styles.fieldLabel}>Single min</Text><TextInput style={styles.input} keyboardType="numeric" value={singleMinQty} onChangeText={setSingleMinQty} /></View>
            <View style={styles.field}><Text style={styles.fieldLabel}>Single max</Text><TextInput style={styles.input} keyboardType="numeric" value={singleMaxQty} onChangeText={setSingleMaxQty} /></View>
          </View>
          <View style={styles.inlineGrid}>
            <View style={styles.field}><Text style={styles.fieldLabel}>Group min</Text><TextInput style={styles.input} keyboardType="numeric" value={groupMinQty} onChangeText={setGroupMinQty} /></View>
            <View style={styles.field}><Text style={styles.fieldLabel}>Target qty</Text><TextInput style={styles.input} keyboardType="numeric" value={groupTargetQty} onChangeText={setGroupTargetQty} /></View>
          </View>
          <View style={styles.inlineGrid}>
            <View style={styles.field}><Text style={styles.fieldLabel}>Group price</Text><TextInput style={styles.input} keyboardType="numeric" value={groupPrice} onChangeText={setGroupPrice} /></View>
            <View style={styles.field}><Text style={styles.fieldLabel}>Deadline</Text><TextInput style={styles.input} placeholder="2026-05-12" value={groupDeadline} onChangeText={setGroupDeadline} /></View>
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
        <Pressable accessibilityRole="button" onPress={submit} style={[styles.button, saving && styles.buttonDisabled]} disabled={saving}>
          <MaterialIcons name="publish" size={20} color={TOKENS.color.surface} />
          <Text style={styles.buttonText}>{saving ? "Saving..." : copy.saveSupply}</Text>
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
  title: { color: TOKENS.color.textStrong, fontSize: 28, lineHeight: 32, fontWeight: "900", letterSpacing: 0 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  card: {
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  sectionTitle: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900", letterSpacing: 0 },
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
    alignItems: "center",
    justifyContent: "center",
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
  toggleRow: { flexDirection: "row", gap: 10 },
  toggle: { flex: 1, minHeight: 44, borderRadius: 22, backgroundColor: TOKENS.color.soft, alignItems: "center", justifyContent: "center" },
  toggleActive: { backgroundColor: TOKENS.brand.primary },
  toggleText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "900" },
  toggleTextActive: { color: TOKENS.color.surface },
  helperText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 19 },
  photoPicker: {
    minHeight: 88,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: TOKENS.brand.primary,
    backgroundColor: TOKENS.color.soft,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  photoPickerTitle: { color: TOKENS.brand.primary, fontSize: 15, fontWeight: "900" },
  photoPickerBody: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700", lineHeight: 17 },
  photoGrid: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  photoThumbWrap: { width: 96, height: 96, borderRadius: 14, overflow: "hidden", backgroundColor: TOKENS.color.canvas },
  photoThumb: { width: "100%", height: "100%" },
  photoRemove: { position: "absolute", right: 6, bottom: 6, borderRadius: 999, backgroundColor: TOKENS.color.surface, paddingHorizontal: 8, paddingVertical: 5 },
  photoRemoveText: { color: TOKENS.color.textStrong, fontSize: 11, fontWeight: "900" },
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
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: TOKENS.color.surface, fontSize: 16, fontWeight: "900" },
});
