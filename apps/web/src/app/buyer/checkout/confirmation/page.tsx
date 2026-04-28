"use client";

import { useEffect, useState } from "react";
import { getBuyerCartCheckoutCopy, type BuyerCartResponse, type BuyerCheckoutSubmitResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import { getBuyerWebCheckoutCopy } from "../../_data";
import { BuyerOrderSummary, BuyerPageShell } from "../../_shared";
import styles from "../../buyer-checkout.module.css";

export default function BuyerCheckoutConfirmationPage() {
  const { locale } = useBrowserLocale();
  const copy = getBuyerCartCheckoutCopy(locale);
  const laneCopy = getBuyerWebCheckoutCopy(locale);
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<BuyerCartResponse>("/api/buyer/cart").then(setCart).catch((err: Error) => setError(err.message));
  }, []);

  async function submit() {
    const response = await apiPost<BuyerCheckoutSubmitResponse>("/api/buyer/checkout/submit");
    window.location.href = `${response.successRoute}?orderId=${encodeURIComponent(response.orderId)}`;
  }

  return (
    <BuyerPageShell locale={locale} activeStep="confirmation" title={copy.confirmationTitle} subtitle={laneCopy.confirmationLead} summary={<BuyerOrderSummary locale={locale} totals={cart?.totals} />}>
      {error ? <p className={styles.hint}>{error}</p> : null}
      <div className={styles.card}><strong>{copy.labels.fulfillment}</strong><div className={styles.meta}>Submitted in previous step</div></div>
      <div className={styles.card}><strong>{copy.labels.paymentMethod}</strong><div className={styles.meta}>Submitted in previous step</div></div>
      <button className={styles.button} type="button" onClick={submit}>{copy.actions.submitOrder}</button>
    </BuyerPageShell>
  );
}
