"use client";

import { useBrowserLocale } from "../../../lib/locale";
import { BUYER_WEB_FULFILLMENT, getBuyerWebCheckoutCopy } from "../_data";
import { BuyerLinkRow, BuyerOrderSummary, BuyerPageShell } from "../_shared";
import styles from "../buyer-checkout.module.css";

export default function BuyerCheckoutPage() {
  const { locale } = useBrowserLocale();
  const laneCopy = getBuyerWebCheckoutCopy(locale);

  return (
    <BuyerPageShell
      locale={locale}
      activeStep="fulfillment"
      title="Checkout"
      subtitle={laneCopy.checkoutLead}
      summary={<BuyerOrderSummary locale={locale} />}
    >
      <h2 className={styles.sectionTitle}>Fulfillment handoff</h2>
      <div className={styles.card}>
        <div className={styles.row}>
          <strong>{BUYER_WEB_FULFILLMENT.recipientName}</strong>
          <span>{BUYER_WEB_FULFILLMENT.phone}</span>
        </div>
        <p className={styles.hint}>{BUYER_WEB_FULFILLMENT.addressLabel}</p>
        <p className={styles.hint}>{laneCopy.mobileHandoffNote}</p>
      </div>
      <ul className={styles.list}>
        {laneCopy.summaryHints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <BuyerLinkRow
        primaryHref="/buyer/checkout/payment"
        primaryLabel="Continue to payment"
        secondaryHref="/buyer/cart"
        secondaryLabel="Review cart"
      />
    </BuyerPageShell>
  );
}
