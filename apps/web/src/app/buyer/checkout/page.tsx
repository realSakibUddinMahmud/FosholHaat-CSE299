"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Truck, Warehouse } from "lucide-react";
import {
  type BuyerCartResponse,
  type BuyerFulfillmentResponse,
} from "@fosholhaat/types";
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
    apiFetch<BuyerCartResponse>("/api/buyer/cart")
      .then(setCart)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await apiPost<BuyerFulfillmentResponse>(
      "/api/buyer/checkout/fulfillment",
      {
        choice: form.get("choice"),
        recipientName: form.get("recipientName"),
        phone: form.get("phone"),
        addressLabel: form.get("addressLabel"),
        note: form.get("note"),
      },
    );
    window.location.href = response.nextRoute;
  }

  return (
    <BuyerPageShell
      locale={locale}
      activeStep="fulfillment"
      title="Checkout"
      subtitle={laneCopy.checkoutLead}
      summary={<BuyerOrderSummary locale={locale} totals={cart?.totals} />}
    >
      <h2 className={styles.sectionTitle}>Fulfillment handoff</h2>
      {error ? <p className={styles.hint}>{error}</p> : null}
      <form className={styles.formCard} onSubmit={submit}>
        <div className={styles.choiceGrid}>
          <label className={styles.choiceCard}>
            <input
              type="radio"
              name="choice"
              value="hub-pickup"
              defaultChecked
            />
            <Warehouse size={20} />
            <strong>Hub pickup</strong>
            <span>Collect from the assigned Dhaka hub.</span>
          </label>
          <label className={styles.choiceCard}>
            <input type="radio" name="choice" value="direct-delivery" />
            <Truck size={20} />
            <strong>Direct delivery</strong>
            <span>Send to the shop address after hub release.</span>
          </label>
        </div>
        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            Recipient
            <input
              name="recipientName"
              placeholder="Buyer or shop contact"
              required
            />
          </label>
          <label className={styles.field}>
            Phone
            <input name="phone" placeholder="+880..." required />
          </label>
          <label className={styles.fieldWide}>
            Address
            <input
              name="addressLabel"
              placeholder="Shop, market, or hub note"
            />
          </label>
          <label className={styles.fieldWide}>
            Note
            <input name="note" placeholder="Optional handling note" />
          </label>
        </div>
        <p className={styles.hint}>{laneCopy.mobileHandoffNote}</p>
        <button className={styles.button} type="submit">
          Continue to payment
        </button>
      </form>
    </BuyerPageShell>
  );
}
