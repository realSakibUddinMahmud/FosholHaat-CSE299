import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import { TOKENS } from "../../../../styles/tokens";
import { getBuyerCheckoutCopy, getBuyerFlowCopy } from "../../_data";
import type { BuyerCartResponse, BuyerCheckoutSubmitResponse } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../../lib/api-client";
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
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch<BuyerCartResponse>("/buyer/cart").then(setCart).catch((err: Error) => setError(err.message));
  }, []);
  async function submit() {
    try {
      const result = await apiPost<BuyerCheckoutSubmitResponse>("/buyer/checkout/submit", {});
      router.replace({ pathname: "/buyer/orders/[orderId]", params: { orderId: result.orderId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : flowCopy.validationSubmit);
    }
  }
  const lines = cart?.lines ?? [];
  const totals = cart?.totals ?? { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 };

  return (
    <BuyerShell
      locale={locale}
      activeStep="confirmation"
      title={copy.confirmationTitle}
      subtitle={flowCopy.confirmationHint}
      footer={<BuyerActionButton label={flowCopy.placeOrder} onPress={submit} />}
    >
      <BuyerBanner
        title={copy.labels.fulfillment}
        body={flowCopy.fulfillmentHint}
      />
      <BuyerBanner title={copy.labels.paymentMethod} body={flowCopy.paymentHint} />
      {error ? <BuyerBanner tone="error" title="Order check" body={error} /> : null}
      <BuyerSummaryCard
        locale={locale}
        lines={lines.map((line) => ({
          label: line.productName,
          value: `${line.quantity} ${line.unit}`,
        }))}
        totals={totals}
      />
      <Text style={styles.noteText}>{flowCopy.orderTrackingNote}</Text>
    </BuyerShell>
  );
}

const styles = StyleSheet.create({
  noteText: { color: TOKENS.color.textSecondary, fontSize: 13, lineHeight: 18 },
});
