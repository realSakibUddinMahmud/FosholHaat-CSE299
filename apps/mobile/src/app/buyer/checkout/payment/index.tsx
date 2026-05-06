import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import {
  getBuyerCheckoutCopy,
  getBuyerFlowCopy,
} from "../../_data";
import type { BuyerCartResponse, BuyerPaymentMethod } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import {
  BuyerActionButton,
  BuyerBanner,
  BuyerChoiceCard,
  BuyerField,
  BuyerShell,
  BuyerSummaryCard,
} from "../../_shared";

export default function BuyerPaymentScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);
  const [method, setMethod] = useState<BuyerPaymentMethod>("cash-on-delivery");
  const [reference, setReference] = useState("");
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch<BuyerCartResponse>("/buyer/cart").then(setCart).catch((err: Error) => setError(err.message));
  }, []);
  async function submit() {
    try {
      await apiPost("/buyer/checkout/payment", { method, payableTotal: cart?.totals.payableTotal ?? 0, referenceLabel: reference || undefined });
      router.push("/buyer/checkout/confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : flowCopy.validationPayment);
    }
  }
  const lines = cart?.lines ?? [];
  const totals = cart?.totals ?? { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 };

  return (
    <BuyerShell
      locale={locale}
      activeStep="payment"
      title={copy.paymentTitle}
      subtitle={flowCopy.paymentHint}
      footer={
        <BuyerActionButton
          label={flowCopy.continueToConfirmation}
          onPress={submit}
        />
      }
    >
      <BuyerChoiceCard
        title={copy.paymentMethods["cash-on-delivery"]}
        subtitle="Pay after handoff confirmation."
        active={method === "cash-on-delivery"}
        onPress={() => setMethod("cash-on-delivery")}
      />
      <BuyerChoiceCard
        title={copy.paymentMethods["mobile-banking"]}
        subtitle="Use a mobile wallet transfer."
        active={method === "mobile-banking"}
        onPress={() => setMethod("mobile-banking")}
      />
      <BuyerChoiceCard
        title={copy.paymentMethods["bank-transfer"]}
        subtitle="Use a bank transfer receipt."
        active={method === "bank-transfer"}
        onPress={() => setMethod("bank-transfer")}
      />
      <BuyerField label="Reference" value={reference} onChangeText={setReference} placeholder="Payment reference" />
      {error ? <BuyerBanner tone="error" title="Payment check" body={error} /> : null}
      <BuyerSummaryCard
        locale={locale}
        lines={lines.map((line) => ({
          label: line.productName,
          value: `${line.quantity} ${line.unit}`,
        }))}
        totals={totals}
      />
    </BuyerShell>
  );
}
