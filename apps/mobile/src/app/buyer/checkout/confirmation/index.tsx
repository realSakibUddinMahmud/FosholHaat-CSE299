import React from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import { TOKENS } from "../../../../styles/tokens";
import {
  BUYER_CONFIRMATION_FIXTURE,
  getBuyerCheckoutCopy,
  getBuyerFlowCopy,
} from "../../_data";
import {
  BuyerActionButton,
  BuyerBanner,
  BuyerShell,
  BuyerSummaryCard,
} from "../../_shared";

export default function BuyerConfirmationScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);

  return (
    <BuyerShell
      locale={locale}
      activeStep="confirmation"
      title={copy.confirmationTitle}
      subtitle={flowCopy.confirmationHint}
      footer={<BuyerActionButton label={flowCopy.placeOrder} onPress={() => router.push("/buyer/orders/success")} />}
    >
      <BuyerBanner
        title={copy.labels.fulfillment}
        body={`${BUYER_CONFIRMATION_FIXTURE.fulfillment.recipientName} - ${BUYER_CONFIRMATION_FIXTURE.fulfillment.phone}`}
      />
      <BuyerBanner title={copy.labels.paymentMethod} body={copy.paymentMethods[BUYER_CONFIRMATION_FIXTURE.payment.method]} />
      <BuyerSummaryCard
        locale={locale}
        lines={BUYER_CONFIRMATION_FIXTURE.lines.map((line) => ({
          label: line.productName,
          value: `${line.quantity} ${line.unit}`,
        }))}
        totals={BUYER_CONFIRMATION_FIXTURE.totals}
      />
      <Text style={styles.noteText}>{flowCopy.orderTrackingNote}</Text>
    </BuyerShell>
  );
}

const styles = StyleSheet.create({
  noteText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
});
