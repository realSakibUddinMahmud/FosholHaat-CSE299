import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../lib/locale";
import { TOKENS } from "../../../styles/tokens";
import { BUYER_CART_FIXTURE, getBuyerCheckoutCopy, getBuyerFlowCopy } from "../_data";
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

  return (
    <BuyerShell
      locale={locale}
      activeStep="cart"
      title={copy.cartTitle}
      subtitle={flowCopy.cartHint}
      footer={<BuyerActionButton label={flowCopy.continueToFulfillment} onPress={() => router.push("/buyer/checkout")} />}
    >
      <View style={{ gap: 12 }}>
        {BUYER_CART_FIXTURE.lines.map((line) => (
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
        lines={BUYER_CART_FIXTURE.lines.map((line) => ({
          label: line.productName,
          value: `${line.quantity} ${line.unit}`,
        }))}
        totals={BUYER_CART_FIXTURE.totals}
      />
      <Text style={styles.noteText}>{flowCopy.checkoutHint}</Text>
    </BuyerShell>
  );
}

const styles = StyleSheet.create({
  noteText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
});
