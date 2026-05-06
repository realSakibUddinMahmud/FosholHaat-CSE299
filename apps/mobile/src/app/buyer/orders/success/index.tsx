import React from "react";
import { useRouter } from "expo-router";
import { useStoredLocale } from "../../../../lib/locale";
import { getBuyerCheckoutCopy, getBuyerFlowCopy } from "../../_data";
import {
  BuyerActionButton,
  BuyerBanner,
  BuyerShell,
} from "../../_shared";

export default function BuyerOrderSuccessScreen() {
  const router = useRouter();
  const { locale } = useStoredLocale();
  const copy = getBuyerCheckoutCopy(locale);
  const flowCopy = getBuyerFlowCopy(locale);

  return (
    <BuyerShell
      locale={locale}
      activeStep="confirmation"
      title={copy.successTitle}
      subtitle={flowCopy.successHint}
      footer={
        <BuyerActionButton
          label={flowCopy.viewOrders}
          onPress={() => router.push("/buyer/orders")}
          variant="secondary"
        />
      }
    >
      <BuyerBanner
        tone="success"
        title={copy.successTitle}
        body={flowCopy.orderTrackingNote}
      />
    </BuyerShell>
  );
}
