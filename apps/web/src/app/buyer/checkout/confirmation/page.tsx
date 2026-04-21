"use client";

import { useBrowserLocale } from "../../../../lib/locale";
import { getBuyerCartCheckoutCopy } from "@fosholhaat/types";
import { BUYER_WEB_CONFIRMATION, getBuyerWebCheckoutCopy } from "../../_data";
import { BuyerLinkRow, BuyerOrderSummary, BuyerPageShell } from "../../_shared";
import styles from "../../buyer-checkout.module.css";

export default function BuyerCheckoutConfirmationPage() {
  const { locale } = useBrowserLocale();
  const copy = getBuyerCartCheckoutCopy(locale);
  const laneCopy = getBuyerWebCheckoutCopy(locale);

  return (
    <BuyerPageShell
      locale={locale}
      activeStep="confirmation"
      title={copy.confirmationTitle}
      subtitle={laneCopy.confirmationLead}
      summary={<BuyerOrderSummary locale={locale} />}
    >
      <div className={styles.card}>
        <strong>{copy.labels.fulfillment}</strong>
        <div className={styles.meta}>
          {BUYER_WEB_CONFIRMATION.fulfillment.recipientName} •{" "}
          {BUYER_WEB_CONFIRMATION.fulfillment.addressLabel}
        </div>
      </div>
      <div className={styles.card}>
        <strong>{copy.labels.paymentMethod}</strong>
        <div className={styles.meta}>
          {copy.paymentMethods[BUYER_WEB_CONFIRMATION.payment.method]} •{" "}
          {BUYER_WEB_CONFIRMATION.payment.referenceLabel}
        </div>
      </div>
      <BuyerLinkRow
        primaryHref="/buyer/orders/success"
        primaryLabel={copy.actions.submitOrder}
        secondaryHref="/buyer/checkout/payment"
        secondaryLabel="Back to payment"
      />
    </BuyerPageShell>
  );
}
