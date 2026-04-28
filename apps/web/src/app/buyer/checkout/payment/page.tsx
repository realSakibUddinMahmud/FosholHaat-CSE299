"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getBuyerCartCheckoutCopy, type BuyerCartResponse, type BuyerPaymentResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import { getBuyerWebCheckoutCopy } from "../../_data";
import { BuyerOrderSummary, BuyerPageShell } from "../../_shared";
import styles from "../../buyer-checkout.module.css";

export default function BuyerCheckoutPaymentPage() {
  const { locale } = useBrowserLocale();
  const copy = getBuyerCartCheckoutCopy(locale);
  const laneCopy = getBuyerWebCheckoutCopy(locale);
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<BuyerCartResponse>("/api/buyer/cart").then(setCart).catch(() => undefined);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await apiPost<BuyerPaymentResponse>("/api/buyer/checkout/payment", {
      method: form.get("method"),
      payableTotal: cart?.totals.payableTotal ?? 0,
      referenceLabel: form.get("referenceLabel"),
    });
    window.location.href = response.nextRoute;
  }

  return (
    <BuyerPageShell locale={locale} activeStep="payment" title={copy.paymentTitle} subtitle={laneCopy.paymentLead} summary={<BuyerOrderSummary locale={locale} totals={cart?.totals} />}>
      <form className={styles.card} onSubmit={submit}>
        <label className={styles.meta}>Method<input name="method" defaultValue="cash-on-delivery" /></label>
        <label className={styles.meta}>Reference<input name="referenceLabel" defaultValue="COD" /></label>
        <button className={styles.button} type="submit">{copy.actions.continueToConfirmation}</button>
      </form>
      <ul className={styles.list}>{laneCopy.paymentHints.map((item) => <li key={item}>{item}</li>)}</ul>
    </BuyerPageShell>
  );
}
