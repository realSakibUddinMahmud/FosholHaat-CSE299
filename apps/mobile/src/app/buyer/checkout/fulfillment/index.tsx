import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import {
  getBuyerCheckoutCopy,
  getBuyerFlowCopy,
} from "../../_data";
import type { BuyerCartResponse, BuyerFulfillmentChoice } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import {
  BuyerActionButton,
  BuyerBanner,
  BuyerChoiceCard,
  BuyerField,
  BuyerShell,
  BuyerSummaryCard,
} from "../../_shared";

export default function BuyerFulfillmentScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);
  const [choice, setChoice] = useState<BuyerFulfillmentChoice>("hub-pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch<BuyerCartResponse>("/buyer/cart").then(setCart).catch((err: Error) => setError(err.message));
  }, []);
  async function submit() {
    try {
      await apiPost("/buyer/checkout/fulfillment", { choice, recipientName: name, phone, addressLabel: address });
      router.push("/buyer/checkout/payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : flowCopy.validationFulfillment);
    }
  }
  const lines = cart?.lines ?? [];
  const totals = cart?.totals ?? { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 };

  return (
    <BuyerShell
      locale={locale}
      activeStep="fulfillment"
      title={copy.fulfillmentTitle}
      subtitle={flowCopy.fulfillmentHint}
      footer={
        <BuyerActionButton
          label={flowCopy.continueToPayment}
          onPress={submit}
        />
      }
    >
      <BuyerChoiceCard
        title={flowCopy.pickupChoice}
        subtitle="Pickup from the hub handoff desk."
        active={choice === "hub-pickup"}
        onPress={() => setChoice("hub-pickup")}
      />
      <BuyerChoiceCard
        title={flowCopy.deliveryChoice}
        subtitle="Deliver directly to the buyer address."
        active={choice === "direct-delivery"}
        onPress={() => setChoice("direct-delivery")}
      />
      <BuyerField label={flowCopy.recipientLabel} value={name} onChangeText={setName} placeholder={flowCopy.recipientLabel} />
      <BuyerField label={flowCopy.phoneLabel} value={phone} onChangeText={setPhone} placeholder={flowCopy.phoneLabel} keyboardType="phone-pad" />
      <BuyerField label={flowCopy.addressLabel} value={address} onChangeText={setAddress} placeholder={flowCopy.addressLabel} multiline />
      {error ? <BuyerBanner tone="error" title="Check details" body={error} /> : null}
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
