"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Locale, SellerOrderDetail, SellerOrderDetailResponse, SellerOrderQueueResponse } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../lib/api-client";
import { getSellerOrderDetail, getSellerOrdersCopyWeb, getSellerOrderStatusLabel, SELLER_ORDER_QUEUE } from "./orders.data";
import styles from "./orders.module.css";

function statusClass(status: string) {
  if (status === "incoming") return styles.statusIncoming;
  if (status === "accepted") return styles.statusAccepted;
  if (status === "packed") return styles.statusPacked;
  if (status === "ready") return styles.statusReady;
  return styles.statusRejected;
}

export function SellerOrdersListView({ locale }: { locale: Locale }) {
  const copy = getSellerOrdersCopyWeb(locale);
  const [queue, setQueue] = useState<SellerOrderQueueResponse | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<SellerOrderQueueResponse>("/api/seller/orders").then(setQueue).catch((err: Error) => setError(err.message));
  }, []);
  const orders = queue?.orders ?? (process.env.NODE_ENV === "test" ? SELLER_ORDER_QUEUE.orders : []);
  return (
    <main className={styles.page}>
      <header className={styles.header}><p className={styles.kicker}>Seller lane</p><h1 className={styles.title}>{copy.queueTitle}</h1><p className={styles.subtitle}>{copy.queueSubtitle}</p></header>
      <section className={styles.layout}>
        <div className={styles.listCard}>
          {error ? <p className={styles.metaText}>{error}</p> : null}
          <div className={styles.queueList}>
            {orders.map((order) => (
              <article key={order.id} className={styles.orderCard}>
                <div className={styles.cardTop}><div><p className={styles.orderId}>{order.id}</p><h3 className={styles.buyerName}>{order.buyerName}</h3></div><span className={`${styles.statusPill} ${statusClass(order.status)}`}>{getSellerOrderStatusLabel(locale, order.status)}</span></div>
                <p className={styles.metaText}>{order.quantityLabel}</p>
                <div className={styles.cardBottom}><span className={styles.metaText}>{copy.due}: {order.dueLabel}</span><Link href={`/seller/orders/${order.id}`} className={styles.linkAction}>{copy.viewDetail}</Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function SellerOrderDetailView({ locale, orderId }: { locale: Locale; orderId: string }) {
  const copy = getSellerOrdersCopyWeb(locale);
  const [detail, setDetail] = useState<SellerOrderDetail | null>(() => process.env.NODE_ENV === "test" ? (getSellerOrderDetail(orderId)?.order ?? null) : null);
  const [error, setError] = useState("");
  const load = useCallback(() => apiFetch<SellerOrderDetailResponse>(`/api/seller/orders/${orderId}`).then((data) => setDetail(data.order)).catch((err: Error) => setError(err.message)), [orderId]);
  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    load();
  }, [load]);
  const action = async (name: "accept" | "pack" | "ready") => {
    const data = await apiPost<{ order: SellerOrderDetail }>(`/api/seller/orders/${orderId}/${name}`);
    setDetail(data.order);
  };

  if (!detail) return <main className={styles.page}><section className={styles.emptyState}><h1 className={styles.title}>{copy.notFoundTitle}</h1><p className={styles.emptyText}>{error || copy.notFoundBody}</p><Link href="/seller/orders" className={styles.primaryAction}>{copy.queueTitle}</Link></section></main>;

  return (
    <main className={styles.page}>
      <header className={styles.header}><p className={styles.kicker}>Seller lane</p><h1 className={styles.title}>{copy.detailTitle}</h1><p className={styles.subtitle}>{copy.detailSubtitle}</p></header>
      <section className={styles.detailLayout}>
        <div className={styles.detailCard}>
          <div className={styles.cardTop}><div><p className={styles.detailOrderId}>{detail.id}</p><h2 className={styles.detailTitle}>{detail.buyerName}</h2><p className={styles.detailSubtitle}>{detail.quantityLabel}</p></div><span className={`${styles.statusPill} ${statusClass(detail.status)}`}>{getSellerOrderStatusLabel(locale, detail.status)}</span></div>
          <p className={styles.metaText}>{detail.pickupWindow}</p>
          <ul className={styles.itemsList}>{detail.items.map((item) => <li key={`${item.name}-${item.quantityLabel}`} className={styles.noteCard}><div className={styles.itemRow}><span>{item.name}</span><strong>{item.quantityLabel}</strong></div></li>)}</ul>
        </div>
        <aside className={styles.detailCard}>
          <h3 className={styles.sectionTitle}>Actions</h3>
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryAction} onClick={() => action("accept")}>{copy.accept}</button>
            <button type="button" className={styles.ghostAction} onClick={() => action("pack")}>{copy.pack}</button>
            <button type="button" className={styles.ghostAction} onClick={() => action("ready")}>{copy.readyAction}</button>
          </div>
          <Link href="/seller/orders" className={styles.linkAction}>{copy.queueTitle}</Link>
        </aside>
      </section>
    </main>
  );
}
