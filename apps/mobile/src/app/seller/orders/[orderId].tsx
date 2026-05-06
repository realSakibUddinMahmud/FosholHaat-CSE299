import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import QRCode from "qrcode";
import { type Locale, type SellerOrderDetailResponse, getSellerOrdersCopy } from "@fosholhaat/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStoredLocale } from "../../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../../styles/tokens";
import { apiFetch, apiPost } from "../../../lib/api-client";
import { nextActionLabel, SELLER_ORDER_TEST_DETAIL } from "./_data";

type Props = {
  locale: Locale;
  orderId?: string;
  onBack?: () => void;
};

export function SellerOrderDetailScreen({ locale, orderId, onBack = () => {} }: Props) {
  const copy = getSellerOrdersCopy(locale);
  const [data, setData] = useState<SellerOrderDetailResponse | null>(process.env.NODE_ENV === "test" ? SELLER_ORDER_TEST_DETAIL : null);
  const [loading, setLoading] = useState(process.env.NODE_ENV !== "test");
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    if (!orderId) {
      setLoading(false);
      setError("No order ID");
      return;
    }
    apiFetch<SellerOrderDetailResponse>(`/seller/orders/${orderId}`)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const order = data?.order;

  useEffect(() => {
    if (!order?.handoff?.qrPayload) return;
    QRCode.toDataURL(order.handoff.qrPayload, { margin: 1, width: 240 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [order?.handoff?.qrPayload]);

  async function handleAction(action: string) {
    if (!orderId) return;
    setActionLoading(true);
    try {
      const result = await apiPost<SellerOrderDetailResponse>(`/seller/orders/${orderId}/${action}`, {});
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function printHandoffLabel() {
    if (!order?.handoff) return;
    const qr = qrDataUrl ? `<img src="${qrDataUrl}" style="width:180px;height:180px" />` : "";
    const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:28px;color:#0f172a"><div style="border:2px solid #0b5a34;border-radius:18px;padding:24px;max-width:520px"><h1 style="margin:0;color:#0b5a34">FosholHaat Hub Handoff</h1><p><b>Order:</b> ${order.id}</p><p><b>Buyer:</b> ${order.buyerName}</p><p><b>Quantity:</b> ${order.quantityLabel}</p>${qr}<h2>Handoff ${order.handoff.handoffCode}</h2><p><b>Seal:</b> ${order.handoff.sealCode}</p><p><b>Hub:</b> ${order.handoff.hubName}, ${order.handoff.hubDistrict}</p><p style="margin-top:24px">Send only sealed packages. Hub must scan QR and verify seal before DWR receipt.</p></div></body></html>`;
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const doc = window.open("", "_blank", "width=720,height=900");
      doc?.document.write(html);
      doc?.document.close();
      doc?.print();
      return;
    }
    const file = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={TOKENS.brand.primary} style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.shell, styles.notFoundShell]}>
          <Text style={styles.notFoundTitle}>{copy.notFoundTitle}</Text>
          <Text style={styles.notFoundBody}>{error || copy.notFoundBody}</Text>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{copy.queueTitle}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{copy.viewDetail}</Text>
          </Pressable>

          <View style={styles.heroCard}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.title}>{order.buyerName}</Text>
            <Text style={styles.subtitle}>{copy.queueSubtitle}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaPill}>{copy.statuses[order.status]}</Text>
              <Text style={styles.metaPill}>{order.dueLabel}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.detailTitle}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{copy.quantity}</Text>
              <Text style={styles.value}>{order.quantityLabel}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{copy.pickupWindow}</Text>
              <Text style={styles.value}>{order.pickupWindow}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{copy.status}</Text>
              <Text style={styles.value}>{nextActionLabel(order.status, copy)}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{copy.detailSubtitle}</Text>
            {order.items.map((item) => (
              <View key={`${order.id}-${item.name}`} style={styles.itemCard}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemText}>{item.quantityLabel}</Text>
                <Text style={styles.itemText}>{item.packageLabel}</Text>
              </View>
            ))}
          </View>

          {order.handoff ? (
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Hub handoff QR and seal</Text>
              <View style={styles.qrBox}>
                {qrDataUrl ? <Image source={{ uri: qrDataUrl }} style={styles.qrImage} /> : <Text style={styles.qrText}>Generating QR...</Text>}
              </View>
              <View style={styles.row}><Text style={styles.label}>Handoff</Text><Text style={styles.value}>{order.handoff.handoffCode}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Seal</Text><Text style={styles.value}>{order.handoff.sealCode}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Hub</Text><Text style={styles.value}>{order.handoff.hubName}, {order.handoff.hubDistrict}</Text></View>
              <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={printHandoffLabel}>
                <Text style={styles.secondaryButtonText}>Print/share handoff label</Text>
              </Pressable>
            </View>
          ) : null}

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Order lifecycle</Text>
            {order.notes?.map((note) => <Text key={note} style={styles.note}>{note}</Text>)}
            {order.trackingEvents.length ? order.trackingEvents.map((event) => (
              <Text key={event.id} style={styles.note}>{event.label}: {event.message}</Text>
            )) : order.notes?.length ? null : <Text style={styles.note}>No tracking events yet.</Text>}
          </View>

          <View style={styles.actionRow}>
            {order.nextAction === "accept" && (
              <Pressable
                accessibilityRole="button"
                style={styles.primaryButton}
                onPress={() => handleAction("accept")}
                disabled={actionLoading}
              >
                <Text style={styles.primaryButtonText}>{copy.accept}</Text>
              </Pressable>
            )}
            {order.nextAction === "print_label" && (
              <Pressable
                accessibilityRole="button"
                style={styles.primaryButton}
                onPress={() => handleAction("print-label")}
                disabled={actionLoading}
              >
                <Text style={styles.primaryButtonText}>Print QR label</Text>
              </Pressable>
            )}
            {order.nextAction === "ready_for_hub" && (
              <Pressable
                accessibilityRole="button"
                style={styles.primaryButton}
                onPress={() => handleAction("ready")}
                disabled={actionLoading}
              >
                <Text style={styles.primaryButtonText}>Ready for hub</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SellerOrderDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const { locale } = useStoredLocale();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const copy = getSellerOrdersCopy(locale);

  return (
    <>
      <Stack.Screen
        options={{
          title: orderId ?? copy.detailTitle,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: TOKENS.color.canvas },
        }}
      />
      <SellerOrderDetailScreen
        locale={locale}
        orderId={orderId}
        onBack={() => router.replace("/seller/orders")}
      />
    </>
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
  backButton: { alignSelf: "flex-start", paddingVertical: 4 },
  backButtonText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "800" },
  heroCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 18,
    gap: 6,
  },
  orderId: { color: TOKENS.brand.primary, fontSize: 12, fontWeight: "900", letterSpacing: 0.8 },
  title: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800", letterSpacing: 0 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TOKENS.color.soft,
    color: TOKENS.brand.primary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  panel: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: 16,
    gap: 10,
  },
  panelTitle: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "800" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  label: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  value: { color: TOKENS.color.textPrimary, fontSize: 13, fontWeight: "700", flexShrink: 1, textAlign: "right" },
  itemCard: {
    borderRadius: MOBILE_TOKENS.radius.card,
    backgroundColor: TOKENS.color.canvas,
    padding: 12,
    gap: 3,
  },
  itemName: { color: TOKENS.color.textStrong, fontSize: 14, fontWeight: "800" },
  itemText: { color: TOKENS.color.textSecondary, fontSize: 12, fontWeight: "700" },
  note: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
  qrBox: { minHeight: 190, borderRadius: 16, borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.canvas, padding: 12, justifyContent: "center", alignItems: "center" },
  qrImage: { width: 170, height: 170 },
  qrText: { color: TOKENS.color.textPrimary, fontSize: 11, fontWeight: "800" },
  actionRow: { flexDirection: "row", gap: 10 },
  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.brand.strong,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: { color: TOKENS.color.surface, fontSize: 13, fontWeight: "900" },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderNeutral,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  secondaryButtonText: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "900" },
  notFoundTitle: { color: TOKENS.color.textStrong, fontSize: 24, fontWeight: "800" },
  notFoundBody: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
});
