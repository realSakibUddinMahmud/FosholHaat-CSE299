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
import { getSharedAuthCopy, type SignupResponse } from "@fosholhaat/types";
import { SharedAuthLayout } from "../../../components/shared-auth-layout";
import { SharedAuthLocaleLink } from "../../../components/shared-auth-locale-link";
import { sharedAuthStyles } from "../../shared-auth-styles";
import { TOKENS } from "../../../styles/tokens";
import { useStoredLocale } from "../../../lib/locale";
import { getApiUrl } from "../../../api-config";
import { saveSession } from "../../../lib/session";

export default function SellerSignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    focus: "",
    contactName: "",
    phone: "",
    district: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { locale } = useStoredLocale();
  const copy = getSharedAuthCopy(locale);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${getApiUrl()}/auth/signup/seller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, role: "seller" }),
      });
      if (!response.ok) {
        setError(copy.login.invalidCredentials);
        return;
      }
      const data: SignupResponse = await response.json();
      await saveSession({
        sessionToken: data.sessionToken,
        role: data.user.role,
        locale: data.user.locale,
        nextRoute: data.nextRoute,
      });
      router.push(data.nextRoute as never);
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
        title={copy.sellerSignup.title}
        subtitle={copy.sellerSignup.subtitle}
      >
        {error ? (
          <View style={sharedAuthStyles.error}>
            <Text style={sharedAuthStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.sellerSignup.businessName}</Text>
          <TextInput
            style={[
              sharedAuthStyles.input,
              focusedInput === "business" && sharedAuthStyles.focusedInput,
            ]}
            placeholder={copy.sellerSignup.businessNamePlaceholder}
            placeholderTextColor={TOKENS.color.textTertiary}
            value={form.businessName}
            onChangeText={(businessName) => setForm((value) => ({ ...value, businessName }))}
            onFocus={() => setFocusedInput("business")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.sellerSignup.tradeFocus}</Text>
          <View style={sharedAuthStyles.inputRow}>
            <Text style={sharedAuthStyles.leadingIcon}>
              <MaterialIcons name="expand-more" size={18} color={TOKENS.color.textTertiary} />
            </Text>
            <TextInput
              style={[
                sharedAuthStyles.input,
                sharedAuthStyles.inputWithLeading,
                focusedInput === "focus" && sharedAuthStyles.focusedInput,
              ]}
              placeholder={copy.sellerSignup.tradeFocusPlaceholder}
              placeholderTextColor={TOKENS.color.textTertiary}
              value={form.focus}
              onChangeText={(focus) => setForm((value) => ({ ...value, focus }))}
              onFocus={() => setFocusedInput("focus")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.sellerSignup.contactPerson}</Text>
          <View style={sharedAuthStyles.inputRow}>
            <Text style={sharedAuthStyles.leadingIcon}>
              <MaterialIcons name="person-outline" size={16} color={TOKENS.color.textTertiary} />
            </Text>
            <TextInput
              style={[
                sharedAuthStyles.input,
                sharedAuthStyles.inputWithLeading,
                focusedInput === "contact" && sharedAuthStyles.focusedInput,
              ]}
              placeholder={copy.sellerSignup.contactPersonPlaceholder}
              placeholderTextColor={TOKENS.color.textTertiary}
              value={form.contactName}
              onChangeText={(contactName) => setForm((value) => ({ ...value, contactName }))}
              onFocus={() => setFocusedInput("contact")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.sellerSignup.phoneNumber}</Text>
          <View style={sharedAuthStyles.inputRow}>
            <Text style={sharedAuthStyles.leadingIcon}>
              <MaterialIcons name="phone" size={16} color={TOKENS.color.textTertiary} />
            </Text>
            <TextInput
              style={[
                sharedAuthStyles.input,
                sharedAuthStyles.inputWithLeading,
                focusedInput === "phone" && sharedAuthStyles.focusedInput,
              ]}
              placeholder="+880 1XXX XXXXXX"
              placeholderTextColor={TOKENS.color.textTertiary}
              value={form.phone}
              onChangeText={(phone) => setForm((value) => ({ ...value, phone }))}
              onFocus={() => setFocusedInput("phone")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.sellerSignup.collectionArea}</Text>
          <View style={sharedAuthStyles.inputRow}>
            <Text style={sharedAuthStyles.leadingIcon}>
              <MaterialIcons name="place" size={16} color={TOKENS.color.textTertiary} />
            </Text>
            <TextInput
              style={[
                sharedAuthStyles.input,
                sharedAuthStyles.inputWithLeading,
                focusedInput === "area" && sharedAuthStyles.focusedInput,
              ]}
              placeholder={copy.sellerSignup.collectionAreaPlaceholder}
              placeholderTextColor={TOKENS.color.textTertiary}
              value={form.district}
              onChangeText={(district) => setForm((value) => ({ ...value, district }))}
              onFocus={() => setFocusedInput("area")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>

        <View style={sharedAuthStyles.inputGroup}>
          <Text style={sharedAuthStyles.label}>{copy.sellerSignup.password}</Text>
          <View style={sharedAuthStyles.inputRow}>
            <TextInput
              style={[
                sharedAuthStyles.input,
                sharedAuthStyles.inputWithTrailing,
                focusedInput === "password" && sharedAuthStyles.focusedInput,
              ]}
              placeholder={copy.sellerSignup.passwordPlaceholder}
              placeholderTextColor={TOKENS.color.textTertiary}
              value={form.password}
              onChangeText={(password) => setForm((value) => ({ ...value, password }))}
              secureTextEntry={!showPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              style={sharedAuthStyles.trailingActionButton}
              onPress={() => setShowPassword((value) => !value)}
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
          activeOpacity={0.85}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={TOKENS.color.surface} />
          ) : (
            <>
              <Text style={sharedAuthStyles.primaryButtonText}>{copy.sellerSignup.submit}</Text>
              <MaterialIcons name="arrow-forward" size={20} color={TOKENS.color.surface} />
            </>
          )}
        </TouchableOpacity>

        <Text style={sharedAuthStyles.footerText}>
          {copy.sellerSignup.loginPrompt}{" "}
          <Text style={sharedAuthStyles.footerLink} onPress={() => router.push("/login")}>
            {copy.sellerSignup.loginLink}
          </Text>
        </Text>
      </SharedAuthLayout>
    </KeyboardAvoidingView>
  );
}
