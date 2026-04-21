"use client";

import { useBrowserLocale } from "../../../../lib/locale";
import { BUYER_WEB_SUCCESS, getBuyerWebCheckoutCopy } from "../../_data";
import { BuyerLinkRow, BuyerOrderSummary, BuyerPageShell } from "../../_shared";
import styles from "../../buyer-checkout.module.css";

export default function BuyerOrderSuccessPage() {
  const { locale } = useBrowserLocale();
  const laneCopy = getBuyerWebCheckoutCopy(locale);

  return (
    <BuyerPageShell
      locale={locale}
      activeStep="confirmation"
      title="Order placed"
      subtitle={laneCopy.successLead}
      summary={<BuyerOrderSummary locale={locale} />}
    >
      <div className={styles.card}>
        <div className={styles.row}>
          <strong>{BUYER_WEB_SUCCESS.orderId}</strong>
          <span>{BUYER_WEB_SUCCESS.placedAt}</span>
        </div>
        <p className={styles.hint}>{BUYER_WEB_SUCCESS.receiptNote}</p>
        <p className={styles.hint}>{BUYER_WEB_SUCCESS.handoffNote}</p>
      </div>
      <ul className={styles.list}>
        {laneCopy.receiptHints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <BuyerLinkRow primaryHref="/buyer/cart" primaryLabel="Back to cart" />
    </BuyerPageShell>
  );
}
