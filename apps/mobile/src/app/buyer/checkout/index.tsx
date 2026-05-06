import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../lib/locale";
import {
  getBuyerCheckoutCopy,
  getBuyerFlowCopy,
} from "../_data";
import type { BuyerCartResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
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
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  useEffect(() => {
    apiFetch<BuyerCartResponse>("/buyer/cart").then(setCart).catch(() => setCart(null));
  }, []);
  const lines = cart?.lines ?? [];
  const totals = cart?.totals ?? { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 };

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
        body={lines.length ? flowCopy.checkoutHint : copy.emptyCartBody}
      />
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
