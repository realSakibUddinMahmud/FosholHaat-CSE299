import React from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../lib/locale";
import {
  BUYER_CART_FIXTURE,
  BUYER_FULFILLMENT_FIXTURE,
  getBuyerCheckoutCopy,
  getBuyerFlowCopy,
} from "../_data";
import {
  BuyerActionButton,
  BuyerBanner,
  BuyerShell,
  BuyerSummaryCard,
} from "../_shared";

export default function BuyerCheckoutScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);

  return (
    <BuyerShell
      locale={locale}
      activeStep="fulfillment"
      title={copy.checkoutTitle}
      subtitle={flowCopy.checkoutHint}
      footer={
        <BuyerActionButton
          label={flowCopy.continueToFulfillment}
          onPress={() => router.push("/buyer/checkout/fulfillment")}
        />
      }
    >
      <BuyerBanner
        title={copy.fulfillmentTitle}
        body={`${flowCopy.recipientLabel}: ${BUYER_FULFILLMENT_FIXTURE.recipientName}`}
      />
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
