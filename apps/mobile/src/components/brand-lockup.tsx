import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { MOBILE_TOKENS, TOKENS } from "../styles/tokens";

export function BrandLockup({
  subtitle,
  size = "compact",
}: {
  subtitle?: string;
  size?: "compact" | "large";
}) {
  const wrapStyle = size === "large" ? styles.logoWrapLarge : styles.logoWrapCompact;

  return (
    <View style={styles.root}>
      <View style={[styles.logoWrap, wrapStyle]}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>FosholHaat</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", gap: 10, minWidth: 0 },
  logoWrap: {
    backgroundColor: TOKENS.color.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: TOKENS.color.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    overflow: "hidden",
    flexShrink: 0,
  },
  logoWrapCompact: { width: 44, height: 44 },
  logoWrapLarge: { width: 52, height: 52 },
  logo: { width: "100%", height: "100%" },
  copy: { gap: 1, minWidth: 0, flexShrink: 1 },
  title: {
    color: TOKENS.brand.primary,
    fontSize: MOBILE_TOKENS.font.sectionTitle.size,
    fontWeight: MOBILE_TOKENS.font.sectionTitle.weight,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: TOKENS.color.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
