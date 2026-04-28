import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import {
  BUYER_CART_FIXTURE,
  BUYER_PAYMENT_FIXTURE,
  getBuyerCheckoutCopy,
  getBuyerFlowCopy,
} from "../../_data";
import {
  BuyerActionButton,
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
  const [method, setMethod] = useState(BUYER_PAYMENT_FIXTURE.method);
  const [reference, setReference] = useState(BUYER_PAYMENT_FIXTURE.referenceLabel ?? "");

  return (
    <BuyerShell
      locale={locale}
      activeStep="payment"
      title={copy.paymentTitle}
      subtitle={flowCopy.paymentHint}
      footer={
        <BuyerActionButton
          label={flowCopy.continueToConfirmation}
          onPress={() => router.push("/buyer/checkout/confirmation")}
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
      <BuyerSummaryCard
        locale={locale}
        lines={BUYER_CART_FIXTURE.lines.map((line) => ({
          label: line.productName,
          value: `${line.quantity} ${line.unit}`,
        }))}
        totals={BUYER_CART_FIXTURE.totals}
      />
    </BuyerShell>
  );
}
