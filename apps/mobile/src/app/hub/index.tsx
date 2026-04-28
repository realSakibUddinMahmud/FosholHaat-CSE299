import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Locale } from "@fosholhaat/types";
import { getHubCoordinationCopy } from "@fosholhaat/types";
import { BrandLockup } from "../../components/brand-lockup";
import { useStoredLocale } from "../../lib/locale";
import { MOBILE_TOKENS, TOKENS } from "../../styles/tokens";

export function HubWorkspaceScreen({
  locale,
  onOpenWorkspace = () => {},
}: {
  locale: Locale;
  onOpenWorkspace?: () => void;
}) {
  const copy = getHubCoordinationCopy(locale);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <BrandLockup subtitle={copy.screenTitle} />
        <Text style={styles.kicker}>HUB COORDINATION</Text>
        <Text style={styles.title}>{copy.screenTitle}</Text>
        <Text style={styles.subtitle}>{copy.screenSubtitle}</Text>

        <Pressable accessibilityRole="button" onPress={onOpenWorkspace} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{copy.labels.openWorkspace}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function HubWorkspaceRoute() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getHubCoordinationCopy(locale);

  return (
    <>
      <Stack.Screen
        options={{
          title: copy.screenTitle,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: TOKENS.color.canvas },
        }}
      />
      <HubWorkspaceScreen locale={locale} onOpenWorkspace={() => router.push("/hub/coordination")} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: TOKENS.color.canvas },
  shell: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: MOBILE_TOKENS.spacing.shellHorizontal,
    gap: 14,
  },
  kicker: { color: TOKENS.brand.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  title: { color: TOKENS.color.textStrong, fontSize: 28, fontWeight: "800", letterSpacing: -0.8 },
  subtitle: { color: TOKENS.color.textSecondary, fontSize: 14, lineHeight: 20 },
  primaryButton: {
    marginTop: 8,
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: TOKENS.brand.strong,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: { color: TOKENS.color.surface, fontSize: 14, fontWeight: "900" },
});
