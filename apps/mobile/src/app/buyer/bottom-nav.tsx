import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TOKENS from "@fosholhaat/tokens/tokens.json";

type BuyerTab = "home" | "group-buy" | "orders" | "profile";

export function BuyerBottomNav({ active }: { active: BuyerTab }) {
  const router = useRouter();
  const item = (key: BuyerTab, icon: keyof typeof MaterialIcons.glyphMap, label: string, href: "/buyer" | "/buyer/group-buys" | "/buyer/orders" | "/buyer/profile") => (
    <Pressable style={styles.navItem} onPress={() => router.push(href)} accessibilityRole="button">
      <MaterialIcons name={icon} size={24} color={active === key ? TOKENS.brand.primary : TOKENS.color.textTertiary} />
      <Text style={[styles.navLabel, active === key && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={styles.bottomNav}>
      {item("home", "home", "Home", "/buyer")}
      {item("group-buy", "groups", "Group-Buy", "/buyer/group-buys")}
      {item("orders", "receipt-long", "Orders", "/buyer/orders")}
      {item("profile", "person", "Profile", "/buyer/profile")}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: TOKENS.color.textPrimary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  navItem: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 6 },
  navLabel: { color: TOKENS.color.textTertiary, fontSize: 11, fontWeight: "800" },
  navLabelActive: { color: TOKENS.brand.primary },
});
