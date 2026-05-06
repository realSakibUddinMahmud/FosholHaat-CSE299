"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, PackageCheck, QrCode, ShieldCheck, Truck } from "lucide-react";
import type { Locale, SellerOrderDetail, SellerOrderDetailResponse, SellerOrderQueueResponse, SellerOrderSummary } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../lib/api-client";
import { getSellerOrderDetail, getSellerOrdersCopyWeb, getSellerOrderStatusLabel, SELLER_ORDER_QUEUE } from "./orders.data";
import styles from "./orders.module.css";

function statusClass(status: string) {
  if (status === "incoming") return styles.statusIncoming;
  if (status === "accepted") return styles.statusAccepted;
  if (status === "packed") return styles.statusPacked;
  if (status === "handoff_ready") return styles.statusHandoff;
  if (status === "hub_received" || status === "sorting") return styles.statusHub;
  if (status === "ready") return styles.statusReady;
  return styles.statusRejected;
}

function ProductThumb({ order }: { order: SellerOrderSummary }) {
  return order.productImageUrl ? <img className={styles.thumb} src={order.productImageUrl} alt="" /> : <div className={styles.thumbFallback}>{(order.productName ?? "F").slice(0, 1)}</div>;
}

function OrderCard({ locale, order }: { locale: Locale; order: SellerOrderSummary }) {
  return (
    <article className={styles.orderCard}>
      <div className={styles.orderLead}>
        <ProductThumb order={order} />
        <div>
          <p className={styles.orderId}>#{order.id.slice(-8)} · {order.orderType}</p>
          <h3 className={styles.buyerName}>{order.buyerName}</h3>
          <p className={styles.metaText}>{order.productName} · {order.quantityLabel}</p>
        </div>
        <span className={`${styles.statusPill} ${statusClass(order.status)}`}>{getSellerOrderStatusLabel(locale, order.status)}</span>
      </div>
      <div className={styles.timelineRail}><span /><span /><span /><span /></div>
      <div className={styles.detailGrid}>
        <div className={styles.detailItem}><p>Payment</p><strong>{order.paymentStatus}</strong></div>
        <div className={styles.detailItem}><p>Total</p><strong>{order.totalLabel}</strong></div>
        <div className={styles.detailItem}><p>Hub</p><strong>{order.hubName ?? order.dueLabel}</strong></div>
        <div className={styles.detailItem}><p>Next step</p><strong>{order.nextAction.replaceAll("_", " ")}</strong></div>
      </div>
      <Link href={`/seller/orders/${order.id}`} className={styles.primaryAction}>View order</Link>
    </article>
  );
}

export function SellerOrdersListView({ locale }: { locale: Locale }) {
  const copy = getSellerOrdersCopyWeb(locale);
  const [queue, setQueue] = useState<SellerOrderQueueResponse | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<SellerOrderQueueResponse>("/api/seller/orders").then(setQueue).catch((err: Error) => setError(err.message));
  }, []);
  const data = queue ?? (process.env.NODE_ENV === "test" ? SELLER_ORDER_QUEUE : null);
  const orders = data?.orders ?? [];
  const summary = data?.summary ?? { incoming: 0, active: 0, ready: 0, groupProgress: 0 };
  const needsReview = orders.filter((order) => order.status === "incoming");
  const activeOrders = orders.filter((order) => ["accepted", "packed", "handoff_ready", "hub_received", "sorting"].includes(order.status));
  const readyOrders = orders.filter((order) => order.status === "ready");

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Orders & Fulfillment</p>
          <h1 className={styles.title}>{copy.queueTitle}</h1>
          <p className={styles.subtitle}>Review demand, create hub handoff labels, and track QR-sealed packages.</p>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryChip}><strong>{summary.incoming}</strong> Needs review</span>
          <span className={styles.summaryChip}><strong>{summary.groupProgress}</strong> Group progress</span>
          <span className={styles.summaryChip}><strong>{summary.active}</strong> Hub handoffs</span>
          <span className={styles.summaryChip}><strong>{summary.ready}</strong> Ready</span>
        </div>
      </header>

      <section className={styles.layout}>
        <div className={styles.queueList}>
          {error ? <p className={styles.errorText}>{error}</p> : null}
          <section className={styles.panel}><h2 className={styles.sectionTitle}>Needs review</h2>{needsReview.length ? needsReview.map((order) => <OrderCard key={order.id} locale={locale} order={order} />) : <p className={styles.emptyText}>No single or locked group orders need a seller decision.</p>}</section>
          <section className={styles.panel}>
            <h2 className={styles.sectionTitle}>Group progress</h2>
            {data?.groupProgress.length ? data.groupProgress.map((group) => (
              <article key={group.id} className={styles.groupCard}>
                <div className={styles.cardTop}><div><p className={styles.orderId}>#{group.id}</p><h3>{group.title}</h3></div><span className={styles.statusPill}>{group.percent}% full</span></div>
                <div className={styles.progressBar}><span style={{ width: `${group.percent}%` }} /></div>
                <div className={styles.detailGrid}><div className={styles.detailItem}><p>Committed</p><strong>{group.committedQty} / {group.targetQty} {group.unit}</strong></div><div className={styles.detailItem}><p>Buyers</p><strong>{group.buyerCount}</strong></div><div className={styles.detailItem}><p>Deadline</p><strong>{group.deadlineLabel}</strong></div></div>
                <p className={styles.metaText}>Visible for planning only. Seller action unlocks after target fill.</p>
              </article>
            )) : <p className={styles.emptyText}>No live group buys are collecting buyer demand.</p>}
          </section>
          <section className={styles.panel}><h2 className={styles.sectionTitle}>In progress</h2>{[...activeOrders, ...readyOrders].length ? [...activeOrders, ...readyOrders].map((order) => <OrderCard key={order.id} locale={locale} order={order} />) : <p className={styles.emptyText}>Accepted packages and hub handoffs will appear here.</p>}</section>
        </div>
        <aside className={styles.sidePanel}>
          <h2>Fulfillment rule</h2>
          <div className={styles.checkRow}><ShieldCheck size={18} /> Seller accepts</div>
          <div className={styles.checkRow}><QrCode size={18} /> QR + seal generated</div>
          <div className={styles.checkRow}><Truck size={18} /> Hub scans package</div>
          <div className={styles.checkRow}><PackageCheck size={18} /> Buyer tracking updates</div>
        </aside>
      </section>
    </main>
  );
}

export function SellerOrderDetailView({ locale, orderId }: { locale: Locale; orderId: string }) {
  const copy = getSellerOrdersCopyWeb(locale);
  const [detail, setDetail] = useState<SellerOrderDetail | null>(() => process.env.NODE_ENV === "test" ? (getSellerOrderDetail(orderId)?.order ?? null) : null);
  const [error, setError] = useState("");
  const load = useCallback(() => apiFetch<SellerOrderDetailResponse>(`/api/seller/orders/${orderId}`).then((data) => setDetail(data.order)).catch((err: Error) => setError(err.message)), [orderId]);
  useEffect(() => { if (process.env.NODE_ENV !== "test") void load(); }, [load]);
  const openHandoffLabel = () => window.open(`/api/seller/orders/${orderId}/handoff-label`, "_blank", "noopener,noreferrer");
  const action = async (name: "accept" | "pack" | "ready" | "print-label") => {
    const data = await apiPost<{ order: SellerOrderDetail }>(`/api/seller/orders/${orderId}/${name}`);
    setDetail(data.order);
    if (name === "print-label") openHandoffLabel();
  };
  if (!detail) return <main className={styles.page}><section className={styles.emptyState}><h1>{copy.notFoundTitle}</h1><p>{error || copy.notFoundBody}</p><Link href="/seller/orders" className={styles.primaryAction}>{copy.queueTitle}</Link></section></main>;

  return (
    <main className={styles.page}>
      <header className={styles.detailHero}>
        <div><p className={styles.kicker}>Order #{detail.id.slice(-8)} · {detail.orderType}</p><h1 className={styles.title}>{detail.buyerName}</h1><p className={styles.subtitle}>{detail.productName} · {detail.quantityLabel}</p></div>
        <span className={`${styles.statusPill} ${statusClass(detail.status)}`}>{getSellerOrderStatusLabel(locale, detail.status)}</span>
      </header>
      <section className={styles.detailLayout}>
        <div className={styles.mainColumn}>
          <section className={styles.panel}>
            <div className={styles.orderLead}><ProductThumb order={detail} /><div><h2>{detail.productName}</h2><p className={styles.metaText}>{detail.quantityLabel} · {detail.unitPriceLabel}</p></div><strong>{detail.totalLabel}</strong></div>
            <div className={styles.detailGrid}><div className={styles.detailItem}><p>Payment</p><strong>{detail.paymentStatus}</strong></div><div className={styles.detailItem}><p>Hub handoff</p><strong>{detail.pickupWindow}</strong></div><div className={styles.detailItem}><p>Next step</p><strong>{detail.nextAction.replaceAll("_", " ")}</strong></div></div>
          </section>
          <section className={styles.panel}><h2 className={styles.sectionTitle}>Order lifecycle</h2><div className={styles.eventList}>{detail.trackingEvents.map((event) => <div key={event.id} className={styles.eventRow}><CheckCircle2 size={18} /><div><strong>{event.label}</strong><p>{event.message}</p></div></div>)}</div></section>
        </div>
        <aside className={styles.sidePanel}>
          <h2>Hub handoff label</h2>
          {detail.handoff ? (
            <>
              <div className={styles.qrBox}><img src={`/api/seller/orders/${orderId}/handoff-qr.svg`} alt={`QR for handoff ${detail.handoff.handoffCode}`} /></div>
              <div className={styles.labelBox}><p>Handoff</p><strong>{detail.handoff.handoffCode}</strong></div>
              <div className={styles.labelBox}><p>Seal code</p><strong>{detail.handoff.sealCode}</strong></div>
              <div className={styles.labelBox}><p>Hub</p><strong>{detail.handoff.hubName}, {detail.handoff.hubDistrict}</strong></div>
            </>
          ) : <p className={styles.emptyText}>Accept the order to generate QR and seal.</p>}
          <div className={styles.actionStack}>
            {detail.nextAction === "accept" ? <button className={styles.primaryAction} onClick={() => action("accept")}>Accept order</button> : null}
            {detail.nextAction === "print_label" ? <button className={styles.primaryAction} onClick={() => action("print-label")}>Print QR label</button> : null}
            {detail.nextAction === "ready_for_hub" ? <button className={styles.primaryAction} onClick={() => action("ready")}>Mark ready for hub</button> : null}
            <button className={styles.ghostAction} onClick={openHandoffLabel} disabled={!detail.handoff}>Print handoff sheet</button>
            <button type="button" className={styles.linkAction} onClick={() => { window.location.href = "/seller/orders"; }}>Back to orders</button>
          </div>
          <div className={styles.notice}><Clock3 size={18} /> Send only sealed packages. Hub will scan QR and verify seal before DWR receipt.</div>
        </aside>
      </section>
    </main>
  );
}
