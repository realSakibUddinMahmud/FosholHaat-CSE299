import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getSharedAuthCopy, type Locale } from "@fosholhaat/types";
import { SharedAuthLayout } from "../../components/shared-auth-layout";
import { sharedAuthStyles } from "../shared-auth-styles";
import { getApiUrl } from "../../api-config";
import { readStoredLocale, writeStoredLocale } from "../../lib/locale";
import { TOKENS } from "../../styles/tokens";

export default function LanguageScreen() {
  const [locale, setLocale] = useState<Locale>("bn");
  const router = useRouter();
  const copy = getSharedAuthCopy(locale);

  useEffect(() => {
    readStoredLocale().then(setLocale);
  }, []);

  const handleContinue = async () => {
    await writeStoredLocale(locale);

    try {
      const apiUrl = getApiUrl();
      await fetch(`${apiUrl}/auth/locale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
    } catch {
      // Local storage stays authoritative on the client.
    }

    router.push("/login");
  };

  return (
    <SharedAuthLayout title={copy.language.title} subtitle={copy.language.subtitle}>
      <TouchableOpacity
        onPress={() => setLocale("en")}
        activeOpacity={0.82}
        style={[
          sharedAuthStyles.optionCard,
          locale === "en" && sharedAuthStyles.optionCardActive,
        ]}
      >
        <View style={sharedAuthStyles.optionLead}>
          <View
            style={[
              sharedAuthStyles.optionBadge,
              locale === "en" && sharedAuthStyles.optionBadgeActive,
            ]}
          >
            <Text
              style={[
                sharedAuthStyles.optionBadgeText,
                locale === "en" && sharedAuthStyles.optionBadgeTextActive,
              ]}
            >
              EN
            </Text>
          </View>
          <View style={sharedAuthStyles.optionBody}>
            <Text style={sharedAuthStyles.optionTitle}>{copy.language.englishTitle}</Text>
            <Text style={sharedAuthStyles.optionDescription}>{copy.language.englishHint}</Text>
          </View>
        </View>
        <View
          style={[
            sharedAuthStyles.radio,
            locale === "en" && sharedAuthStyles.radioActive,
          ]}
        >
          {locale === "en" ? <View style={sharedAuthStyles.radioInner} /> : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setLocale("bn")}
        activeOpacity={0.82}
        style={[
          sharedAuthStyles.optionCard,
          locale === "bn" && sharedAuthStyles.optionCardActive,
        ]}
      >
        <View style={sharedAuthStyles.optionLead}>
          <View
            style={[
              sharedAuthStyles.optionBadge,
              locale === "bn" && sharedAuthStyles.optionBadgeActive,
            ]}
          >
            <Text
              style={[
                sharedAuthStyles.optionBadgeText,
                locale === "bn" && sharedAuthStyles.optionBadgeTextActive,
              ]}
            >
              {copy.common.bangla}
            </Text>
          </View>
          <View style={sharedAuthStyles.optionBody}>
            <Text style={sharedAuthStyles.optionTitle}>{copy.language.banglaTitle}</Text>
            <Text style={sharedAuthStyles.optionDescription}>{copy.language.banglaHint}</Text>
          </View>
        </View>
        <View
          style={[
            sharedAuthStyles.radio,
            locale === "bn" && sharedAuthStyles.radioActive,
          ]}
        >
          {locale === "bn" ? <View style={sharedAuthStyles.radioInner} /> : null}
        </View>
      </TouchableOpacity>

      <Text style={sharedAuthStyles.helperText}>{copy.language.helper}</Text>

      <TouchableOpacity
        style={sharedAuthStyles.primaryButton}
        onPress={handleContinue}
        activeOpacity={0.85}
      >
        <Text style={sharedAuthStyles.primaryButtonText}>{copy.language.continue}</Text>
        <MaterialIcons
          name="arrow-forward"
          size={20}
          color={TOKENS.color.surface}
        />
      </TouchableOpacity>
    </SharedAuthLayout>
  );
}
