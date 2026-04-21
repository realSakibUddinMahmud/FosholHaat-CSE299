"use client";

import { useBrowserLocale } from "../../../lib/locale";
import { getBuyerCartCheckoutCopy } from "@fosholhaat/types";
import { BUYER_WEB_CART_LINES, getBuyerWebCheckoutCopy } from "../_data";
import { BuyerLinkRow, BuyerOrderSummary, BuyerPageShell, formatMoney } from "../_shared";
import styles from "../buyer-checkout.module.css";

export default function BuyerCartPage() {
  const { locale } = useBrowserLocale();
  const copy = getBuyerCartCheckoutCopy(locale);
  const laneCopy = getBuyerWebCheckoutCopy(locale);

  return (
    <BuyerPageShell
      locale={locale}
      activeStep="cart"
      title={copy.cartTitle}
      subtitle={laneCopy.cartLead}
      summary={<BuyerOrderSummary locale={locale} />}
    >
      <h2 className={styles.sectionTitle}>{copy.cartTitle}</h2>
      {BUYER_WEB_CART_LINES.map((line) => (
        <article key={line.lineId} className={styles.card}>
          <div className={styles.row}>
            <div>
              <strong>{line.productName}</strong>
              <div className={styles.meta}>
                {line.sellerName} - {line.quantity} {line.unit}
              </div>
            </div>
            <span className={styles.value}>{formatMoney(line.subtotal, locale)}</span>
          </div>
          {line.note ? <p className={styles.hint}>{line.note}</p> : null}
        </article>
      ))}
      <BuyerLinkRow primaryHref="/buyer/checkout" primaryLabel={copy.actions.continueToCheckout} />
    </BuyerPageShell>
  );
}
