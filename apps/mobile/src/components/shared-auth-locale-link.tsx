import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sharedAuthStyles } from "../app/shared-auth-styles";
import { TOKENS } from "../styles/tokens";

type SharedAuthLocaleLinkProps = {
  label: string;
};

export function SharedAuthLocaleLink({ label }: SharedAuthLocaleLinkProps) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push("/language")} activeOpacity={0.8}>
      <View style={sharedAuthStyles.inlineAction}>
        <MaterialIcons name="language" size={16} color={TOKENS.brand.primary} />
        <Text style={sharedAuthStyles.metaLink}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}
