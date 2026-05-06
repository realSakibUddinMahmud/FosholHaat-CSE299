"use client";

import { useState } from "react";
import { useBrowserLocale } from "../../../../lib/locale";
import { getBuyerWebCheckoutCopy } from "../../_data";
import { BuyerLinkRow, BuyerOrderSummary, BuyerPageShell } from "../../_shared";
import styles from "../../buyer-checkout.module.css";

export default function BuyerOrderSuccessPage() {
  const { locale } = useBrowserLocale();
  const [orderId] = useState(() =>
    typeof window === "undefined"
      ? "Order pending"
      : (new URLSearchParams(window.location.search).get("orderId") ?? "Order pending"),
  );
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
          <strong>{orderId}</strong>
          <span>Submitted</span>
        </div>
        <p className={styles.hint}>Order confirmation is loaded from the database-backed checkout response.</p>
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
