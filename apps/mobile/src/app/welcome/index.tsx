import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { SharedAuthLayout } from "../../components/shared-auth-layout";
import { SharedAuthLocaleLink } from "../../components/shared-auth-locale-link";
import { sharedAuthStyles } from "../shared-auth-styles";
import { useStoredLocale } from "../../lib/locale";

export default function WelcomeScreen() {
  const { locale } = useStoredLocale();
  const copy = getSharedAuthCopy(locale);

  return (
    <SharedAuthLayout
      rightAction={<SharedAuthLocaleLink label={copy.common.languageSwitch} />}
      title={copy.welcome.title}
      subtitle={copy.welcome.subtitle}
      footer={<Text style={sharedAuthStyles.footerText}>{copy.welcome.footer}</Text>}
    >
      <Text style={sharedAuthStyles.helperText}>{copy.welcome.helper}</Text>

      <Link href="/login" asChild>
        <TouchableOpacity style={sharedAuthStyles.primaryButton} activeOpacity={0.85}>
          <Text style={sharedAuthStyles.primaryButtonText}>{copy.welcome.login}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/signup/role" asChild>
        <TouchableOpacity style={sharedAuthStyles.optionCard} activeOpacity={0.85}>
          <Text style={sharedAuthStyles.optionTitle}>{copy.welcome.createAccount}</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/language" asChild>
        <TouchableOpacity activeOpacity={0.75}>
          <Text style={sharedAuthStyles.helperText}>{copy.welcome.chooseLanguage}</Text>
        </TouchableOpacity>
      </Link>
    </SharedAuthLayout>
  );
}
