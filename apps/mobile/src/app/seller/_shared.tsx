import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TOKENS } from "../../styles/tokens";
import { BrandLockup } from "../../components/brand-lockup";

type SellerNavKey = "dashboard" | "supply" | "orders" | "payouts" | "profile";

const NAV: Array<{ key: SellerNavKey; icon: string; label: string; href: string }> = [
  { key: "dashboard", icon: "dashboard", label: "Dashboard", href: "/seller" },
  { key: "supply", icon: "inventory-2", label: "Supply", href: "/seller/supply" },
  { key: "orders", icon: "receipt-long", label: "Orders", href: "/seller/orders" },
  { key: "payouts", icon: "account-balance-wallet", label: "Payouts", href: "/seller/payouts" },
  { key: "profile", icon: "account-circle", label: "Profile", href: "/seller/profile" },
];

export function SellerHeader({ title }: { title?: string }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <BrandLockup subtitle={title ?? "Seller workspace"} />
      <Pressable style={styles.iconButton} onPress={() => router.push("/seller/notifications")}>
        <MaterialIcons name="notifications-none" size={20} color={TOKENS.color.textSecondary} />
      </Pressable>
    </View>
  );
}

export function SellerBottomNav({ active }: { active: SellerNavKey }) {
  const router = useRouter();
  return (
    <View style={styles.bottomNav}>
      {NAV.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable key={item.key} style={styles.navItem} onPress={() => router.push(item.href as never)}>
            <MaterialIcons
              name={item.icon as never}
              size={22}
              color={isActive ? TOKENS.brand.primary : TOKENS.color.textTertiary}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    backgroundColor: TOKENS.color.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 8,
    backgroundColor: TOKENS.color.surfaceOverlayStrong,
    borderTopWidth: 1,
    borderTopColor: TOKENS.color.borderSoft,
  },
  navItem: { alignItems: "center", gap: 3, minWidth: 58 },
  navLabel: { color: TOKENS.color.textTertiary, fontSize: 9, fontWeight: "900", letterSpacing: 0, textTransform: "uppercase" },
  navLabelActive: { color: TOKENS.brand.primary },
});
