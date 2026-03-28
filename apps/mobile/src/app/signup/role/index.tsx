import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getSharedAuthCopy, getSignupRouteForRole, type SignupRole } from "@fosholhaat/types";
import { SharedAuthLayout } from "../../../components/shared-auth-layout";
import { SharedAuthLocaleLink } from "../../../components/shared-auth-locale-link";
import { sharedAuthStyles } from "../../shared-auth-styles";
import { TOKENS } from "../../../styles/tokens";
import { getApiUrl } from "../../../api-config";
import { useStoredLocale } from "../../../lib/locale";

export default function SignupRoleScreen() {
  const [role, setRole] = useState<SignupRole | null>(null);
  const [error, setError] = useState("");
  const { locale } = useStoredLocale();
  const copy = getSharedAuthCopy(locale);
  const router = useRouter();

  const handleContinue = async () => {
    if (!role) {
      return;
    }

    setError("");
    const fallbackRoute = getSignupRouteForRole(role);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/role-selection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, locale }),
      });

      if (response.ok) {
        const data = (await response.json()) as { nextRoute?: string };
        router.push((data.nextRoute ?? fallbackRoute) as any);
        return;
      }
    } catch {
      // Keep role selection usable even when the preview API is offline.
    }

    router.push(fallbackRoute as any);
  };

  return (
    <SharedAuthLayout
      rightAction={<SharedAuthLocaleLink label={copy.common.languageSwitch} />}
      title={copy.signupRole.title}
      subtitle={copy.signupRole.subtitle}
    >
      {error ? (
        <View style={sharedAuthStyles.error}>
          <Text style={sharedAuthStyles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={() => setRole("buyer")}
        activeOpacity={0.84}
        style={[sharedAuthStyles.roleCard, role === "buyer" && sharedAuthStyles.roleCardActive]}
      >
        <View style={sharedAuthStyles.roleHeader}>
          <View style={sharedAuthStyles.roleLead}>
            <View style={[sharedAuthStyles.roleBadge, role === "buyer" && sharedAuthStyles.roleBadgeActive]}>
              <Text
                style={[
                  sharedAuthStyles.roleBadgeText,
                  role === "buyer" && sharedAuthStyles.roleBadgeTextActive,
                ]}
              >
                BUY
              </Text>
            </View>
            <Text style={sharedAuthStyles.roleTitle}>{copy.signupRole.buyerTitle}</Text>
          </View>
          <Text style={sharedAuthStyles.roleSelect}>{copy.signupRole.select}</Text>
        </View>
        <Text style={sharedAuthStyles.roleDescription}>{copy.signupRole.buyerDescription}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setRole("seller")}
        activeOpacity={0.84}
        style={[sharedAuthStyles.roleCard, role === "seller" && sharedAuthStyles.roleCardActive]}
      >
        <View style={sharedAuthStyles.roleHeader}>
          <View style={sharedAuthStyles.roleLead}>
            <View style={[sharedAuthStyles.roleBadge, role === "seller" && sharedAuthStyles.roleBadgeActive]}>
              <Text
                style={[
                  sharedAuthStyles.roleBadgeText,
                  role === "seller" && sharedAuthStyles.roleBadgeTextActive,
                ]}
              >
                SEL
              </Text>
            </View>
            <Text style={sharedAuthStyles.roleTitle}>{copy.signupRole.sellerTitle}</Text>
          </View>
          <Text style={sharedAuthStyles.roleSelect}>{copy.signupRole.select}</Text>
        </View>
        <Text style={sharedAuthStyles.roleDescription}>{copy.signupRole.sellerDescription}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[sharedAuthStyles.primaryButton, !role && sharedAuthStyles.primaryButtonDisabled]}
        onPress={handleContinue}
        disabled={!role}
        activeOpacity={0.85}
      >
        <Text style={sharedAuthStyles.primaryButtonText}>{copy.signupRole.continue}</Text>
        <MaterialIcons name="arrow-forward" size={20} color={TOKENS.color.surface} />
      </TouchableOpacity>

      <Text style={sharedAuthStyles.footerText}>
        {copy.signupRole.loginPrompt}{" "}
        <Text style={sharedAuthStyles.footerLink} onPress={() => router.push("/login")}>
          {copy.signupRole.loginLink}
        </Text>
      </Text>
    </SharedAuthLayout>
  );
}
