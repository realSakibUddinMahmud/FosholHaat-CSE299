"use client";

import Link from "next/link";
import type { Locale } from "@fosholhaat/types";
import {
  getSellerOrderDetail,
  getSellerOrdersCopyWeb,
  getSellerOrderStatusLabel,
  SELLER_ORDER_QUEUE,
} from "./orders.data";
import styles from "./orders.module.css";

function statusClass(status: string) {
  if (status === "incoming") return styles.statusIncoming;
  if (status === "accepted") return styles.statusAccepted;
  if (status === "packed") return styles.statusPacked;
  if (status === "ready") return styles.statusReady;
  return styles.statusRejected;
}

function nextActionLabel(
  action: "accept" | "pack" | "ready" | "reject" | "none",
  copy: ReturnType<typeof getSellerOrdersCopyWeb>,
) {
  if (action === "accept") return copy.accept;
  if (action === "pack") return copy.pack;
  if (action === "ready") return copy.readyAction;
  if (action === "reject") return copy.reject;
  return "No action";
}

export function SellerOrdersListView({ locale }: { locale: Locale }) {
  const copy = getSellerOrdersCopyWeb(locale);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Seller lane</p>
        <h1 className={styles.title}>{copy.queueTitle}</h1>
        <p className={styles.subtitle}>{copy.queueSubtitle}</p>
        <div className={styles.tabs} aria-label="Seller order summary">
          <span className={styles.summaryChip}>{copy.incoming}: {SELLER_ORDER_QUEUE.summary.incoming}</span>
          <span className={styles.summaryChip}>{copy.active}: {SELLER_ORDER_QUEUE.summary.active}</span>
          <span className={styles.summaryChip}>{copy.ready}: {SELLER_ORDER_QUEUE.summary.ready}</span>
        </div>
      </header>

      <section className={styles.layout} aria-label="Seller orders queue">
        <div className={styles.listCard}>
          <h2 className={styles.sectionTitle}>{copy.queueTitle}</h2>
          <p className={styles.sectionSubtitle}>{copy.queueSubtitle}</p>

          <div className={styles.queueList}>
            {SELLER_ORDER_QUEUE.orders.map((order) => (
              <article key={order.id} className={styles.orderCard}>
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.orderId}>{order.id}</p>
                    <h3 className={styles.buyerName}>{order.buyerName}</h3>
                  </div>
                  <span className={`${styles.statusPill} ${statusClass(order.status)}`}>
                    {getSellerOrderStatusLabel(locale, order.status)}
                  </span>
                </div>

                <p className={styles.metaText}>{order.quantityLabel}</p>
                <p className={styles.metaText}>{copy.due}: {order.dueLabel}</p>

                <div className={styles.cardBottom}>
                  <span className={styles.metaText}>Next: {nextActionLabel(order.nextAction, copy)}</span>
                  <Link href={`/seller/orders/${order.id}`} className={styles.linkAction}>
                    {copy.viewDetail}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className={styles.detailCard}>
          <h2 className={styles.sectionTitle}>{copy.detailTitle}</h2>
          <p className={styles.sectionSubtitle}>{copy.detailSubtitle}</p>
          <div className={styles.emptyActions}>
            <Link href="/seller/orders/so-20260421-001" className={styles.primaryAction}>
              {copy.viewDetail}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export function SellerOrderDetailView({
  locale,
  orderId,
}: {
  locale: Locale;
  orderId: string;
}) {
  const copy = getSellerOrdersCopyWeb(locale);
  const detailResponse = getSellerOrderDetail(orderId);
  const detail = detailResponse?.order;

  if (!detail) {
    return (
      <main className={styles.page}>
        <section className={styles.emptyState}>
          <h1 className={styles.title}>{copy.notFoundTitle}</h1>
          <p className={styles.emptyText}>{copy.notFoundBody}</p>
          <div className={styles.emptyActions}>
            <Link href="/seller/orders" className={styles.primaryAction}>
              {copy.queueTitle}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Seller lane</p>
        <h1 className={styles.title}>{copy.detailTitle}</h1>
        <p className={styles.subtitle}>{copy.detailSubtitle}</p>
      </header>

      <section className={styles.detailLayout} aria-label="Seller order detail">
        <div className={styles.detailCard}>
          <div className={styles.cardTop}>
            <div>
              <p className={styles.detailOrderId}>{detail.id}</p>
              <h2 className={styles.detailTitle}>{detail.buyerName}</h2>
              <p className={styles.detailSubtitle}>{detail.quantityLabel}</p>
            </div>
            <span className={`${styles.statusPill} ${statusClass(detail.status)}`}>
              {getSellerOrderStatusLabel(locale, detail.status)}
            </span>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>{copy.quantity}</p>
              <p className={styles.detailValue}>{detail.quantityLabel}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>{copy.due}</p>
              <p className={styles.detailValue}>{detail.dueLabel}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>{copy.pickupWindow}</p>
              <p className={styles.detailValue}>{detail.pickupWindow}</p>
            </div>
          </div>

          <div className={styles.detailGrid}>
            <h3 className={styles.sectionTitle}>{copy.detailSubtitle}</h3>
            <ul className={styles.itemsList}>
              {detail.items.map((item) => (
                <li key={`${item.name}-${item.quantityLabel}`} className={styles.noteCard}>
                  <div className={styles.itemRow}>
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>{item.packageLabel}</p>
                    </div>
                    <strong>{item.quantityLabel}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className={styles.detailCard}>
          <h3 className={styles.sectionTitle}>Actions</h3>
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryAction}>
              {copy.accept}
            </button>
            <button type="button" className={styles.ghostAction}>
              {copy.pack}
            </button>
            <button type="button" className={styles.ghostAction}>
              {copy.readyAction}
            </button>
            <button type="button" className={styles.ghostAction}>
              {copy.reject}
            </button>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>{copy.status}</p>
              <p className={styles.detailValue}>{getSellerOrderStatusLabel(locale, detail.status)}</p>
            </div>
            <div className={styles.detailItem}>
              <p className={styles.detailLabel}>{copy.buyer}</p>
              <p className={styles.detailValue}>{detail.buyerName}</p>
            </div>
          </div>

          <div className={styles.detailGrid}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            <ul className={styles.notesList}>
              {detail.notes.map((note) => (
                <li key={note} className={styles.noteCard}>
                  <p className={styles.metaText}>{note}</p>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/seller/orders" className={styles.linkAction}>
            {copy.queueTitle}
          </Link>
        </aside>
      </section>
    </main>
  );
}
