import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { LoginResponse } from "@fosholhaat/types";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { SharedAuthLayout } from "../../components/shared-auth-layout";
import { SharedAuthLocaleLink } from "../../components/shared-auth-locale-link";
import { sharedAuthStyles } from "../shared-auth-styles";
import { TOKENS } from "../../styles/tokens";
import { getApiUrl } from "../../api-config";
import { useStoredLocale } from "../../lib/locale";

export default function LoginScreen() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { locale } = useStoredLocale();
  const copy = getSharedAuthCopy(locale);
  const router = useRouter();

  const updateForm = (key: "identifier" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    if (!form.identifier || !form.password) {
      setError(copy.login.missingCredentials);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
          locale,
        }),
      });

      if (!res.ok) {
        setError(copy.login.invalidCredentials);
        return;
      }

      const data: LoginResponse = await res.json();
      if (data.nextRoute) {
        router.push(data.nextRoute as any);
      } else {
        setError(copy.login.missingDestination);
      }
    } catch {
      setError(copy.login.connectionFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SharedAuthLayout
        rightAction={<SharedAuthLocaleLink label={copy.common.languageSwitch} />}
        title={copy.login.title}
        subtitle={copy.login.subtitle}
      >
        {error ? (
          <View style={sharedAuthStyles.error}>
            <Text style={sharedAuthStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.login.identifierLabel}</Text>
          <TextInput
            style={[
              sharedAuthStyles.input,
              focusedInput === "identifier" && sharedAuthStyles.focusedInput,
            ]}
            placeholder={copy.login.identifierPlaceholder}
            placeholderTextColor={TOKENS.color.textTertiary}
            value={form.identifier}
            onChangeText={(value) => updateForm("identifier", value)}
            onFocus={() => setFocusedInput("identifier")}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
          />
        </View>

        <View style={sharedAuthStyles.inputGroup}>
          <View style={sharedAuthStyles.inlineMeta}>
            <Text style={sharedAuthStyles.label}>{copy.login.passwordLabel}</Text>
            <Text style={sharedAuthStyles.metaLink}>{copy.login.forgot}</Text>
          </View>
          <View style={sharedAuthStyles.inputRow}>
            <TextInput
              style={[
                sharedAuthStyles.input,
                sharedAuthStyles.inputWithTrailing,
                focusedInput === "password" && sharedAuthStyles.focusedInput,
              ]}
              placeholder={copy.login.passwordPlaceholder}
              placeholderTextColor={TOKENS.color.textTertiary}
              value={form.password}
              onChangeText={(value) => updateForm("password", value)}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={sharedAuthStyles.trailingActionButton}
              onPress={() => setShowPassword((value) => !value)}
              accessibilityLabel={
                showPassword
                  ? copy.login.hidePassword
                  : copy.login.showPassword
              }
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color={TOKENS.color.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={sharedAuthStyles.primaryButton}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={TOKENS.color.surface} />
          ) : (
            <Text style={sharedAuthStyles.primaryButtonText}>
              {copy.login.submit}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={sharedAuthStyles.footerText}>
          {copy.login.createAccountPrompt}{" "}
          <Text
            style={sharedAuthStyles.footerLink}
            onPress={() => router.push("/signup/role")}
          >
            {copy.login.createAccountLink}
          </Text>
        </Text>
      </SharedAuthLayout>
    </KeyboardAvoidingView>
  );
}
