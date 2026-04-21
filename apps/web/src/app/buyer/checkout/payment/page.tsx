"use client";

import { useBrowserLocale } from "../../../../lib/locale";
import { getBuyerCartCheckoutCopy } from "@fosholhaat/types";
import { BUYER_WEB_PAYMENT, getBuyerWebCheckoutCopy } from "../../_data";
import { BuyerLinkRow, BuyerOrderSummary, BuyerPageShell } from "../../_shared";
import styles from "../../buyer-checkout.module.css";

export default function BuyerCheckoutPaymentPage() {
  const { locale } = useBrowserLocale();
  const copy = getBuyerCartCheckoutCopy(locale);
  const laneCopy = getBuyerWebCheckoutCopy(locale);

  return (
    <BuyerPageShell
      locale={locale}
      activeStep="payment"
      title={copy.paymentTitle}
      subtitle={laneCopy.paymentLead}
      summary={<BuyerOrderSummary locale={locale} />}
    >
      <div className={styles.card}>
        <div className={styles.row}>
          <strong>{copy.paymentMethods[BUYER_WEB_PAYMENT.method]}</strong>
          <span>{BUYER_WEB_PAYMENT.referenceLabel}</span>
        </div>
      </div>
      <ul className={styles.list}>
        {laneCopy.paymentHints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <BuyerLinkRow
        primaryHref="/buyer/checkout/confirmation"
        primaryLabel="Continue to confirmation"
        secondaryHref="/buyer/checkout"
        secondaryLabel="Back to checkout"
      />
    </BuyerPageShell>
  );
}
