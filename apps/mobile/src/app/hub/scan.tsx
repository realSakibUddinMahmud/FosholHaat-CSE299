import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TOKENS } from "../../styles/tokens";

function parsePayload(raw: string) {
  try {
    const data = JSON.parse(raw);
    return {
      orderId: String(data.orderId ?? ""),
      handoffCode: String(data.handoffCode ?? ""),
      sealCode: String(data.sealCode ?? ""),
      hubId: String(data.hubId ?? ""),
    };
  } catch {
    return null;
  }
}

export default function HubScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState("");
  const [manual, setManual] = useState("");
  const parsed = useMemo(() => parsePayload(scanned || manual), [scanned, manual]);
  const canUseCamera = Platform.OS !== "web" && permission?.granted;

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.shell}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={TOKENS.brand.primary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.kicker}>Hub scan</Text>
          <Text style={styles.title}>Scan seller handoff QR</Text>
          <Text style={styles.copy}>Verify the QR payload before receiving the sealed package at inbound.</Text>
        </View>

        <View style={styles.scannerCard}>
          {!permission?.granted && Platform.OS !== "web" ? (
            <Pressable style={styles.primary} onPress={requestPermission}>
              <Text style={styles.primaryText}>Enable camera scanner</Text>
            </Pressable>
          ) : canUseCamera ? (
            <CameraView
              style={styles.camera}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={scanned ? undefined : ({ data }) => setScanned(data)}
            />
          ) : (
            <View style={styles.webFallback}>
              <MaterialIcons name="qr-code-scanner" size={42} color={TOKENS.brand.primary} />
              <Text style={styles.copy}>Camera scanning is unavailable in this browser view. Paste the QR payload below.</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Manual QR payload</Text>
          <TextInput value={manual} onChangeText={setManual} placeholder='{"type":"FOSHOLHAAT_SELLER_HANDOFF"...}' style={styles.input} multiline />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Scan result</Text>
          {parsed ? (
            <>
              <Text style={styles.value}>Order {parsed.orderId || "Not supplied"}</Text>
              <Text style={styles.meta}>Handoff {parsed.handoffCode || "Not supplied"}</Text>
              <Text style={styles.meta}>Seal {parsed.sealCode || "Not supplied"}</Text>
            </>
          ) : (
            <Text style={styles.meta}>{scanned || manual ? "QR payload is not valid handoff JSON." : "No QR scanned yet."}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primary} onPress={() => router.push("/hub/inbound")}>
            <Text style={styles.primaryText}>Open inbound receiving</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => { setScanned(""); setManual(""); }}>
            <Text style={styles.secondaryText}>Reset scan</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  shell: { flex: 1, maxWidth: 480, width: "100%", alignSelf: "center", padding: 18, gap: 14 },
  back: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  backText: { color: TOKENS.brand.primary, fontWeight: "900" },
  header: { gap: 6 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 28, fontWeight: "900" },
  copy: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  scannerCard: { height: 300, borderRadius: 22, overflow: "hidden", borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface },
  camera: { flex: 1 },
  webFallback: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22, gap: 12 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, padding: 14, gap: 8 },
  label: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  input: { minHeight: 76, borderRadius: 14, borderWidth: 1, borderColor: TOKENS.color.borderSoft, padding: 12, color: TOKENS.color.textPrimary, backgroundColor: TOKENS.color.canvas },
  value: { color: TOKENS.color.textStrong, fontSize: 18, fontWeight: "900" },
  meta: { color: TOKENS.color.textSecondary, fontSize: 13, fontWeight: "700" },
  actions: { gap: 10 },
  primary: { minHeight: 52, borderRadius: 16, backgroundColor: TOKENS.brand.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  primaryText: { color: TOKENS.color.surface, fontSize: 15, fontWeight: "900" },
  secondary: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: TOKENS.color.borderSoft, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: TOKENS.color.textStrong, fontSize: 15, fontWeight: "900" },
});
