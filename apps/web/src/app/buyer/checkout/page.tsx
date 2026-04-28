"use client";

import { useEffect, useState, type FormEvent } from "react";
import { type BuyerCartResponse, type BuyerFulfillmentResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiFetch, apiPost } from "../../../lib/api-client";
import { getBuyerWebCheckoutCopy } from "../_data";
import { BuyerOrderSummary, BuyerPageShell } from "../_shared";
import styles from "../buyer-checkout.module.css";

export default function BuyerCheckoutPage() {
  const { locale } = useBrowserLocale();
  const laneCopy = getBuyerWebCheckoutCopy(locale);
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<BuyerCartResponse>("/api/buyer/cart").then(setCart).catch((err: Error) => setError(err.message));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await apiPost<BuyerFulfillmentResponse>("/api/buyer/checkout/fulfillment", {
      choice: form.get("choice"),
      recipientName: form.get("recipientName"),
      phone: form.get("phone"),
      addressLabel: form.get("addressLabel"),
      note: form.get("note"),
    });
    window.location.href = response.nextRoute;
  }

  return (
    <BuyerPageShell locale={locale} activeStep="fulfillment" title="Checkout" subtitle={laneCopy.checkoutLead} summary={<BuyerOrderSummary locale={locale} totals={cart?.totals} />}>
      <h2 className={styles.sectionTitle}>Fulfillment handoff</h2>
      {error ? <p className={styles.hint}>{error}</p> : null}
      <form className={styles.card} onSubmit={submit}>
        <label className={styles.meta}>Choice<input name="choice" defaultValue="hub-pickup" /></label>
        <label className={styles.meta}>Recipient<input name="recipientName" required defaultValue="FosholHaat buyer" /></label>
        <label className={styles.meta}>Phone<input name="phone" required defaultValue="+8801700000000" /></label>
        <label className={styles.meta}>Address<input name="addressLabel" defaultValue="Bogura hub pickup" /></label>
        <label className={styles.meta}>Note<input name="note" defaultValue="Call before handoff" /></label>
        <p className={styles.hint}>{laneCopy.mobileHandoffNote}</p>
        <button className={styles.button} type="submit">Continue to payment</button>
      </form>
    </BuyerPageShell>
  );
}
