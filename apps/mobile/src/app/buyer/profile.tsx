import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandLockup } from "../../components/brand-lockup";
import { apiFetch } from "../../lib/api-client";
import { clearSession } from "../../lib/session";
import { TOKENS } from "../../styles/tokens";
import { BuyerBottomNav } from "./bottom-nav";

type Me = { fullName?: string; businessName?: string; email?: string; phone?: string; district?: string; role?: string };

export default function BuyerProfileScreen() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch<Me>("/auth/me").then((data) => { setMe(data); setError(""); }).catch((err: Error) => setError(err.message));
  }, []);
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BrandLockup subtitle="Buyer workspace" />
        <View style={styles.hero}>
          <Text style={styles.kicker}>Buyer profile</Text>
          <Text style={styles.title}>{me?.businessName || me?.fullName || "Buyer account"}</Text>
          <Text style={styles.subtitle}>{me?.phone || me?.email || "Account details from database"}</Text>
        </View>
        {error ? (
          <View style={styles.card}>
            <Text style={styles.error}>{error}</Text>
            <Pressable style={styles.primary} onPress={() => router.replace("/login")}>
              <Text style={styles.primaryText}>Log in again</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.grid}>
          {[
            ["Name", me?.fullName],
            ["Business", me?.businessName],
            ["Phone", me?.phone],
            ["Email", me?.email],
            ["District", me?.district],
          ].map(([label, value]) => (
            <View key={label} style={styles.card}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value || "Not saved"}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.logout}
          onPress={async () => {
            await clearSession();
            router.replace("/login");
          }}
        >
          <MaterialIcons name="logout" size={18} color={TOKENS.color.surface} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
        <BuyerBottomNav active="profile" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: TOKENS.color.canvas },
  content: { maxWidth: 560, width: "100%", alignSelf: "center", padding: 20, gap: 14, paddingBottom: 36 },
  hero: { borderRadius: 22, borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, padding: 18, gap: 8 },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  title: { color: TOKENS.color.textStrong, fontSize: 28, fontWeight: "900" },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, fontWeight: "700" },
  grid: { gap: 10 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: TOKENS.color.borderSoft, backgroundColor: TOKENS.color.surface, padding: 14, gap: 6 },
  label: { color: TOKENS.color.textSecondary, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  value: { color: TOKENS.color.textStrong, fontSize: 16, fontWeight: "900" },
  error: { color: TOKENS.color.alertLive, fontSize: 13, fontWeight: "800" },
  primary: { minHeight: 46, borderRadius: 14, backgroundColor: TOKENS.brand.primary, alignItems: "center", justifyContent: "center" },
  primaryText: { color: TOKENS.color.surface, fontWeight: "900" },
  logout: { minHeight: 52, borderRadius: 16, backgroundColor: TOKENS.color.alertLive, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  logoutText: { color: TOKENS.color.surface, fontWeight: "900", fontSize: 15 },
});
