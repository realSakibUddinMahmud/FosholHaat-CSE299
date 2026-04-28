"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BuyerOrderSummary } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
import { MOCK_ORDERS, getOrderCopy, getOrderStatusLabel } from "./order-data";
import styles from "./buyer-orders.module.css";

export default function BuyerOrdersPage() {
  const locale = "en"; // defaulting to 'en' for now, or could use useBrowserLocale
  const copy = getOrderCopy(locale);
  const [orders, setOrders] = useState<BuyerOrderSummary[]>(() => process.env.NODE_ENV === "test" ? MOCK_ORDERS : []);
  const [error, setError] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<BuyerOrderSummary[]>("/api/buyer/orders").then(setOrders).catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{copy.title}</h1>
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.orderList}>
        {orders.map((order) => (
          <article key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <div className={styles.orderId}>#{order.id}</div>
                <h2 className={styles.orderTitle}>{order.title}</h2>
                <p className={styles.orderMeta}>{copy.date}: {order.dateGroup}</p>
                <div className={styles.orderStatus}>{getOrderStatusLabel(locale, order.status)}</div>
              </div>
              <strong className={styles.orderTotal}>{order.total}</strong>
            </div>
            <div className={styles.orderActions}>
              <Link className={styles.btnPrimary} href={`/buyer/orders/${order.id}`}>{copy.viewDetails}</Link>
              <Link className={styles.btnSecondary} href={`/buyer/orders/${order.id}/tracking`}>{copy.track}</Link>
            </div>
          </article>
        ))}
      </div>
      {!orders.length && !error ? <p className={styles.emptyState}>No orders found.</p> : null}
    </main>
  );
}
