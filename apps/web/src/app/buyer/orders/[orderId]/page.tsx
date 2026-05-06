"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import type { BuyerOrderDetail } from "@fosholhaat/types";
import { apiFetch } from "../../../../lib/api-client";
import { getOrderCopy, getOrderStatusLabel } from "../order-data";
import { downloadOrderInvoice } from "../invoice";
import styles from "./order-detail.module.css";

function StatusIcon({ status }: { status: string }) {
  if (status === "READY_FOR_DISPATCH") return <Truck size={24} />;
  if (status === "COMPLETED") return <CheckCircle2 size={24} />;
  if (status === "IN_FULFILLMENT") return <Package size={24} />;
  return <Clock size={24} />;
}

export function BuyerOrderDetailView({ orderId, locale = "en" }: { orderId: string; locale?: "en" | "bn" }) {
  const copy = getOrderCopy(locale);

  return (
    <main className={styles.page}>
      <div className={styles.errorState}>
        <h1 className={styles.errorTitle}>{copy.notFoundTitle}</h1>
        <p className={styles.errorDesc}>{copy.notFoundBody}</p>
        <Link href="/buyer/orders" className={styles.backLink}>{copy.backToOrders}</Link>
      </div>
    </main>
  );
}

export default function BuyerOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const copy = getOrderCopy("en");
  const [order, setOrder] = useState<BuyerOrderDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<BuyerOrderDetail>(`/api/buyer/orders/${orderId}`)
      .then(setOrder)
      .catch((err: Error) => setError(err.message));
  }, [orderId]);

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <h1 className={styles.errorTitle}>{copy.notFoundTitle}</h1>
          <p className={styles.errorDesc}>{error}</p>
          <Link href="/buyer/orders" className={styles.backLink}>{copy.backToOrders}</Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className={styles.page}>
        <p className={styles.loadingText}>Loading order details...</p>
      </main>
    );
  }

  const statusLabel = getOrderStatusLabel("en", order.status);

  const miniSteps = order.workflow;

  return (
    <main className={styles.page}>
      {/* ─── Breadcrumb ─── */}
      <nav className={styles.breadcrumb}>
        <Link href="/buyer">Home</Link>
        <span className={styles.breadSep}>›</span>
        <Link href="/buyer/orders">Orders</Link>
        <span className={styles.breadSep}>›</span>
        <span className={styles.breadActive}>Order #{order.id}</span>
      </nav>

      {/* ─── Header ─── */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Order #{order.id}</h1>
          <p className={styles.headerMeta}>Placed on {order.dateGroup}</p>
        </div>
        <button type="button" className={styles.outlineBtn} onClick={() => downloadOrderInvoice(order)}>
          <Download size={16} /> Download Invoice
        </button>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className={styles.contentGrid}>
        {/* ── LEFT COLUMN ── */}
        <div className={styles.leftCol}>
          {/* Status + Mini Timeline Card */}
          <section className={styles.card}>
            <div className={styles.statusRow}>
              <div className={styles.statusBadge}>
                <StatusIcon status={order.status} />
                <div>
                  <span className={styles.statusLabel}>ORDER STATUS</span>
                  <span className={styles.statusValue}>{statusLabel}</span>
                </div>
              </div>
              <div className={styles.estDelivery}>
                <span className={styles.estLabel}>EXPECTED DELIVERY</span>
                <span className={styles.estValue}>{order.estDelivery || "TBD"}</span>
              </div>
            </div>

            <hr className={styles.cardDivider} />

            <ol className={styles.miniTimeline}>
              {miniSteps.map((step) => (
                <li key={step.key} className={styles.miniStep}>
                  <span className={`${styles.miniStepDot} ${step.status === "done" ? styles.miniStepDotDone : step.status === "current" ? styles.miniStepDotActive : ""}`} />
                  <div>
                    <span className={`${styles.miniStepLabel} ${step.status === "current" ? styles.miniStepLabelActive : ""} ${step.status === "upcoming" ? styles.miniStepLabelUpcoming : ""}`}>
                      {step.label}
                    </span>
                    {step.description ? <p className={styles.miniStepDesc}>{step.description}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Order Items Card */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Order Items ({order.items.length})</h2>
            <div className={styles.itemsList}>
              {order.items.map((item) => {
                return (
                  <div key={`${item.name}-${item.quantity}`} className={styles.itemRow}>
                    <div className={styles.itemImageWrap}>
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} width={64} height={64} style={{ objectFit: "cover", borderRadius: "10px" }} />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemOrigin}>{item.sellerName ?? "Seller not recorded"}</span>
                      <div className={styles.itemBadges}>
                        <span className={styles.itemBadge}>{item.quantity}</span>
                        {item.packageLabel ? <span className={styles.itemBadge}>{item.packageLabel}</span> : null}
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      <span className={styles.itemPriceValue}>{item.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Hub Info */}
          <section className={styles.card}>
            <div className={styles.hubRow}>
              <div className={styles.hubInfo}>
                <h3 className={styles.hubName}>Hub receipt status</h3>
                <p className={styles.hubDesc}>Hub and DWR details will appear after the seller handoff is recorded.</p>
                <div className={styles.hubMeta}>
                  <div>
                    <span className={styles.hubMetaLabel}>HANDOFF TIME</span>
                    <span className={styles.hubMetaValue}>{order.dateGroup}</span>
                  </div>
                  <div>
                    <span className={styles.hubMetaLabel}>SEAL NUMBER</span>
                    <span className={styles.hubMetaValue}>Not assigned</span>
                  </div>
                </div>
              </div>
              <div className={styles.hubMap} />
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <aside className={styles.rightCol}>
          {/* Procurement Summary */}
          <div className={styles.card}>
            <div className={styles.summaryHeader}>
              <h2 className={styles.cardTitle}>Procurement Summary</h2>
              <span className={styles.tierBadge}>B2B TIER 1</span>
            </div>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({order.items.length} items)</span>
                <span>{order.subtotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Logistics & Handling</span>
                <span>{order.deliveryFee}</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total Amount</span>
              <div className={styles.totalRight}>
                <span className={styles.totalValue}>{order.total}</span>
              </div>
            </div>

            <div className={styles.paymentRow}>
              <span className={styles.paymentIcon}>🏦</span>
              <div>
                <span className={styles.paymentLabel}>PAYMENT METHOD</span>
                <span className={styles.paymentValue}>{order.paymentMethod}</span>
              </div>
            </div>

            <Link href={`/buyer/orders/${order.id}/tracking`} className={styles.trackBtn}>
              <Truck size={18} /> Track Shipment
            </Link>

            <button type="button" className={styles.reportLink}>
              <AlertTriangle size={14} /> Report an Issue
            </button>
          </div>

          {/* Delivery Address */}
          <div className={styles.card}>
            <h3 className={styles.addressLabel}>DELIVERY ADDRESS</h3>
            <p className={styles.addressName}>Delivery location</p>
            <p className={styles.addressText}>
              <MapPin size={14} /> {order.shippingAddress}
            </p>
            <p className={styles.addressPhone}>Not recorded</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
