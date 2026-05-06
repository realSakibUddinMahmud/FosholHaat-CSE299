"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Package,
  Phone,
  MessageSquare,
  Share2,
  ShieldCheck,
  Truck,
  AlertTriangle,
} from "lucide-react";
import type { BuyerOrderDetail, BuyerOrderTrackingResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../../../lib/api-client";
import { getOrderCopy } from "../../order-data";
import { downloadOrderInvoice } from "../../invoice";
import styles from "./tracking.module.css";

/* ─── Timeline step icons by key ─── */
function StepIcon({ stepKey, status }: { stepKey: string; status: string }) {
  const isDone = status === "done";
  const isCurrent = status === "current";
  const cls = isDone ? styles.stepIconDone : isCurrent ? styles.stepIconCurrent : styles.stepIconUpcoming;

  if (stepKey === "ORDER_PLACED" || stepKey === "ORDER_CONFIRMED")
    return <span className={cls}><CheckCircle2 size={20} /></span>;
  if (stepKey === "SELLER_CONFIRMATION" || stepKey === "HUB_RECEIPT" || stepKey === "GROUP_TARGET_PENDING")
    return <span className={cls}><Package size={20} /></span>;
  if (stepKey === "IN_TRANSIT")
    return <span className={cls}><Truck size={20} /></span>;
  if (stepKey === "DELIVERED" || stepKey === "SCHEDULED_DELIVERY")
    return <span className={cls}><MapPin size={20} /></span>;
  return <span className={cls}><Clock size={20} /></span>;
}

export function BuyerOrderTrackingView({ orderId, locale = "en" }: { orderId: string; locale?: "en" | "bn" }) {
  const copy = getOrderCopy(locale);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{copy.notFoundTitle}</h1>
        <p className={styles.headerMeta}>{copy.notFoundBody}</p>
        <Link href="/buyer/orders" className={styles.backLink}>{copy.backToOrders}</Link>
      </div>
    </main>
  );
}

export default function BuyerOrderTrackingPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const [tracking, setTracking] = useState<BuyerOrderTrackingResponse | null>(null);
  const [error, setError] = useState("");
  const [invoiceBusy, setInvoiceBusy] = useState(false);

  useEffect(() => {
    apiFetch<BuyerOrderTrackingResponse>(`/api/buyer/orders/${orderId}/tracking`)
      .then(setTracking)
      .catch((err: Error) => setError(err.message));
  }, [orderId]);

  /* Derive timeline steps */
  const timeline = tracking?.timeline ?? [];
  /* Derive logistics metadata */
  const logistics = tracking?.logistics;
  const snapshot = tracking?.snapshot;
  const handleInvoice = async () => {
    setInvoiceBusy(true);
    try {
      downloadOrderInvoice(await apiFetch<BuyerOrderDetail>(`/api/buyer/orders/${orderId}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invoice could not be downloaded.");
    } finally {
      setInvoiceBusy(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* ─── Breadcrumb ─── */}
      <nav className={styles.breadcrumb}>
        <Link href="/buyer">Dashboard</Link>
        <span className={styles.breadSep}>›</span>
        <Link href="/buyer/orders">My Orders</Link>
        <span className={styles.breadSep}>›</span>
        <span className={styles.breadActive}>Tracking #{orderId}</span>
      </nav>

      {/* ─── Header ─── */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Order Tracking</h1>
          <p className={styles.headerMeta}>
            {tracking
              ? `Managing bulk shipment from ${logistics?.originHub ?? "Not assigned"} to ${logistics?.destinationHub ?? "Not assigned"}`
              : `Tracking order #${orderId}`}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.outlineBtn} onClick={handleInvoice} disabled={invoiceBusy}>
            <Download size={16} /> {invoiceBusy ? "Preparing..." : "Download Invoice"}
          </button>
          <button type="button" className={styles.solidBtn}>
            <Share2 size={16} /> Share Status
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      {error ? <p className={styles.errorBanner}>{error}</p> : null}

      {/* ─── Two-column layout ─── */}
      <div className={styles.contentGrid}>
        {/* ── LEFT: Live Shipment Timeline ── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <MapPin size={18} /> Live Shipment Timeline
          </h2>

          <ol className={styles.timeline}>
            {timeline.map((step, idx) => {
              const isDone = step.status === "done";
              const isCurrent = step.status === "current";
              const isLast = idx === timeline.length - 1;

              return (
                <li key={step.key} className={styles.timelineItem}>
                  <div className={styles.timelineTrack}>
                    <StepIcon stepKey={step.key} status={step.status} />
                    {!isLast && (
                      <div className={`${styles.timelineLine} ${isDone ? styles.timelineLineDone : ""}`} />
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    {isCurrent && <span className={styles.activeBadge}>CURRENTLY ACTIVE</span>}
                    <h3 className={`${styles.stepLabel} ${isCurrent ? styles.stepLabelActive : ""} ${!isDone && !isCurrent ? styles.stepLabelUpcoming : ""}`}>
                      {step.label}
                    </h3>
                    {step.occurredAt && (
                      <p className={styles.stepDate}>{new Date(step.occurredAt).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}</p>
                    )}
                    {step.description && <p className={styles.stepDesc}>{step.description}</p>}

                    {/* GPS ping info for in-transit step */}
                    {isCurrent && logistics?.lastPing && (
                      <div className={styles.gpsPing}>
                        <div>
                          <span className={styles.gpsPingLabel}>LAST PING</span>
                          <span className={styles.gpsPingValue}>{logistics.lastPing}</span>
                        </div>
                        {logistics.speed && (
                          <div>
                            <span className={styles.gpsPingLabel}>SPEED</span>
                            <span className={styles.gpsPingValue}>{logistics.speed}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {!timeline.length && !error && (
            <p className={styles.loadingText}>Loading timeline...</p>
          )}
        </section>

        {/* ── RIGHT: Shipment Snapshot + Quality ── */}
        <aside className={styles.rightCol}>
          {/* Shipment Snapshot */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Package size={18} /> Shipment Snapshot
            </h2>

            {snapshot && (
              <>
                <div className={styles.snapshotItem}>
                  <div className={styles.snapshotIcon}><Truck size={20} /></div>
                  <div>
                    <div className={styles.snapshotName}>{snapshot.title}</div>
                    <div className={styles.snapshotSku}>SKU: {snapshot.sku ?? "N/A"}</div>
                    <div className={styles.snapshotPrice}>BDT {snapshot.total}</div>
                  </div>
                </div>

                <div className={styles.snapshotSection}>
                  <h4 className={styles.snapshotSectionTitle}>DELIVERY ADDRESS</h4>
                  <p className={styles.snapshotText}>
                    <MapPin size={14} /> {snapshot.deliveryAddress}
                  </p>
                </div>

                <div className={styles.snapshotSection}>
                  <h4 className={styles.snapshotSectionTitle}>BUSINESS CONTACT</h4>
                  <p className={styles.snapshotContactName}>{snapshot.contactName}</p>
                  <p className={styles.snapshotContactPhone}>{snapshot.contactPhone}</p>
                </div>
              </>
            )}

            <div className={styles.actionBtns}>
              <button type="button" className={styles.outlineBtn}>
                <Phone size={14} /> Contact Logistics Support
              </button>
              <button type="button" className={styles.dangerOutlineBtn}>
                <AlertTriangle size={14} /> Report an Issue
              </button>
            </div>
          </div>

          {/* Quality Assurance */}
          <div className={styles.qaCard}>
            <h3 className={styles.qaTitle}>
              <ShieldCheck size={18} /> Quality Assurance
            </h3>
            <p className={styles.qaDesc}>
              Hub quality records appear here after the warehouse receipt is logged.
            </p>
            <span className={styles.qaLink}>No certificate recorded yet</span>
          </div>
        </aside>
      </div>

      {/* ─── Logistics Intelligence (bottom full-width) ─── */}
      {logistics && (
        <section className={styles.logisticsPanel}>
          <div className={styles.logisticsInfo}>
            <h2 className={styles.logisticsTitle}>Logistics Intelligence</h2>
            <span className={styles.liveBadge}>Database status tracking</span>

            <div className={styles.logisticsMeta}>
              <div>
                <span className={styles.logisticsLabel}>TRUCK ID</span>
                <span className={styles.logisticsValue}>{logistics.truckId ?? "Not assigned"}</span>
              </div>
              <div>
                <span className={styles.logisticsLabel}>FLEET PARTNER</span>
                <span className={styles.logisticsValue}>{logistics.fleetPartner ?? "Not assigned"}</span>
              </div>
            </div>

            <div className={styles.logisticsActions}>
              <button type="button" className={styles.outlineBtn}><Phone size={14} /> Call Driver</button>
              <button type="button" className={styles.outlineBtn}><MessageSquare size={14} /> Message</button>
            </div>
          </div>

          <div className={styles.mapPlaceholder}>
            <Truck size={32} className={styles.mapIcon} />
            <span className={styles.mapLabel}>{logistics.lastPing ?? "No live ping"}</span>
          </div>
        </section>
      )}

      {/* ─── Back link ─── */}
      <div className={styles.backRow}>
        <Link href={`/buyer/orders/${orderId}`} className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Order Details
        </Link>
      </div>
    </main>
  );
}
