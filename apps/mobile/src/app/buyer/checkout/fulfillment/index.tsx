import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import {
  BUYER_CART_FIXTURE,
  BUYER_FULFILLMENT_FIXTURE,
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

export default function BuyerFulfillmentScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);
  const [choice, setChoice] = useState(BUYER_FULFILLMENT_FIXTURE.choice);
  const [name, setName] = useState(BUYER_FULFILLMENT_FIXTURE.recipientName);
  const [phone, setPhone] = useState(BUYER_FULFILLMENT_FIXTURE.phone);
  const [address, setAddress] = useState(BUYER_FULFILLMENT_FIXTURE.addressLabel ?? "");

  return (
    <BuyerShell
      locale={locale}
      activeStep="fulfillment"
      title={copy.fulfillmentTitle}
      subtitle={flowCopy.fulfillmentHint}
      footer={
        <BuyerActionButton
          label={flowCopy.continueToPayment}
          onPress={() => router.push("/buyer/checkout/payment")}
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
