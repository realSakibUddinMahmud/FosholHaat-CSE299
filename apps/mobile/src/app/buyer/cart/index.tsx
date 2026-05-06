import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../lib/locale";
import { TOKENS } from "../../../styles/tokens";
import type { BuyerCartResponse } from "@fosholhaat/types";
import { getBuyerCheckoutCopy, getBuyerFlowCopy } from "../_data";
import { apiFetch } from "../../../lib/api-client";
import {
  BuyerActionButton,
  BuyerLineCard,
  BuyerShell,
  BuyerSummaryCard,
} from "../_shared";

export default function BuyerCartScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);

  useEffect(() => {
    apiFetch<BuyerCartResponse>("/buyer/cart").then(setCart).catch(() => setCart({ lines: [], totals: { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 }, nextRoute: "/buyer/checkout" }));
  }, []);

  const lines = cart?.lines ?? [];
  const totals = cart?.totals ?? { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 };

  return (
    <BuyerShell
      locale={locale}
      activeStep="cart"
      title={copy.cartTitle}
      subtitle={flowCopy.cartHint}
      footer={<BuyerActionButton label={flowCopy.continueToFulfillment} onPress={() => router.push("/buyer/checkout")} />}
    >
      <View style={{ gap: 12 }}>
        {lines.length === 0 ? <Text style={styles.noteText}>{copy.emptyCartBody}</Text> : null}
        {lines.map((line) => (
          <BuyerLineCard
            key={line.lineId}
            locale={locale}
            title={line.productName}
            meta={`${line.sellerName} - ${line.quantity} ${line.unit}`}
            note={line.note}
            subtotal={line.subtotal}
          />
        ))}
      </View>
      <BuyerSummaryCard
        locale={locale}
        lines={lines.map((line) => ({
          label: line.productName,
          value: `${line.quantity} ${line.unit}`,
        }))}
        totals={totals}
      />
      <Text style={styles.noteText}>{flowCopy.checkoutHint}</Text>
    </BuyerShell>
  );
}

const styles = StyleSheet.create({
  noteText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
});
