"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { useBrowserLocale } from "../../../lib/locale";
import { getBuyerCartCheckoutCopy, type BuyerCartResponse } from "@fosholhaat/types";
import { apiFetch, apiPatch } from "../../../lib/api-client";
import { BUYER_WEB_CART_LINES, BUYER_WEB_CART_TOTALS } from "../_data";
import { formatMoney } from "../_shared";
import styles from "./buyer-cart.module.css";

export default function BuyerCartPage() {
  const { locale } = useBrowserLocale();
  const copy = getBuyerCartCheckoutCopy(locale);
  const [cart, setCart] = useState<BuyerCartResponse | null>(null);
  const [error, setError] = useState("");
  
  const loadCart = () =>
    apiFetch<BuyerCartResponse>("/api/buyer/cart")
      .then(setCart)
      .catch((err: Error) => setError(err.message));

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    loadCart();
  }, []);

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(await apiPatch<BuyerCartResponse>(`/api/buyer/cart/items/${lineId}`, { quantity }));
  };

  const testMode = process.env.NODE_ENV === "test";
  const lines = cart?.lines ?? (testMode ? BUYER_WEB_CART_LINES : []);
  const totals = cart?.totals ?? (testMode ? BUYER_WEB_CART_TOTALS : { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 });

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{copy.cartTitle}</h1>
        <p className={styles.subtitle}>Review your procurement selection</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainArea}>
          <div className={styles.logisticsBanner}>
            <Truck className={styles.logisticsIcon} size={24} />
            <div className={styles.logisticsText}>
              <h3 className={styles.logisticsTitle}>Logistics Priority Corridor</h3>
              <p className={styles.logisticsDesc}>Bogura hub dispatch available for tomorrow morning.</p>
            </div>
          </div>

          {error ? <p style={{ color: "red" }}>{error}</p> : null}

          <div className={styles.cartList}>
            {lines.map((line) => (
              <article key={line.lineId} className={styles.cartItem}>
                <div className={styles.itemImageWrap}>
                  <span className={styles.itemImageFallback}>IMAGE</span>
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <div>
                      <h3 className={styles.itemName}>{line.productName}</h3>
                      <p className={styles.itemSeller}>{line.sellerName}</p>
                    </div>
                    <div className={styles.itemTotal}>{formatMoney(line.subtotal, locale)}</div>
                  </div>
                  
                  <div className={styles.itemControls}>
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} type="button" onClick={() => updateQuantity(line.lineId, line.quantity - 1)}>-</button>
                      <span className={styles.qtyValue}>{line.quantity}</span>
                      <button className={styles.qtyBtn} type="button" onClick={() => updateQuantity(line.lineId, line.quantity + 1)}>+</button>
                    </div>
                    <span className={styles.itemUnit}>{line.quantity} {line.unit} selected</span>
                  </div>
                </div>
              </article>
            ))}
            {!lines.length && !error ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>Cart is empty</h3>
                <p className={styles.emptyDesc}>You haven't added any premium wholesale lots yet.</p>
                <Link href="/buyer" className={styles.emptyBtn}>Browse Marketplace</Link>
              </div>
            ) : null}
          </div>
        </div>

        <aside className={styles.summaryArea}>
          <h2 className={styles.summaryTitle}>{copy.summaryTitle}</h2>
          <div className={styles.summaryRow}>
            <span>{copy.labels.subtotal}</span>
            <strong>{formatMoney(totals.subtotal, locale)}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{copy.labels.deliveryFee}</span>
            <strong>{formatMoney(totals.deliveryFee, locale)}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{copy.labels.serviceFee}</span>
            <strong>{formatMoney(totals.serviceFee, locale)}</strong>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryTotal}>
            <span>{copy.labels.payableTotal}</span>
            <span className={styles.summaryTotalValue}>{formatMoney(totals.payableTotal, locale)}</span>
          </div>
          <Link href="/buyer/checkout" className={styles.checkoutBtn}>
            {copy.actions.continueToCheckout}
          </Link>
        </aside>
      </div>
    </main>
  );
}
