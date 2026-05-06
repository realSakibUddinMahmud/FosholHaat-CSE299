"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Landmark, Package, Plus, ShoppingCart, UserRound, Wallet } from "lucide-react";
import type { SellerOrderQueueResponse, SellerPayoutListResponse, SellerSupplyListResponse } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import { formatSellerMoney } from "./supply/supply-data";
import styles from "./supply/supply.module.css";

type SellerProfile = {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  businessName?: string;
  corridor?: string;
  district?: string;
};

function metric(supply: SellerSupplyListResponse | null, key: "active" | "readyToday" | "dwrOpen") {
  return supply?.workspace.metrics.find((item) => item.key === key)?.value ?? 0;
}

function value(text?: string | null) {
  return text ? text : "Not saved";
}

export default function SellerWorkspacePage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [supply, setSupply] = useState<SellerSupplyListResponse | null>(null);
  const [orders, setOrders] = useState<SellerOrderQueueResponse | null>(null);
  const [payouts, setPayouts] = useState<SellerPayoutListResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<SellerProfile>("/api/auth/me"),
      apiFetch<SellerSupplyListResponse>("/api/seller/supply"),
      apiFetch<SellerOrderQueueResponse>("/api/seller/orders"),
      apiFetch<SellerPayoutListResponse>("/api/seller/payouts"),
    ])
      .then(([profileData, supplyData, orderData, payoutData]) => {
        setProfile(profileData);
        setSupply(supplyData);
        setOrders(orderData);
        setPayouts(payoutData);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const openOrders = (orders?.summary.incoming ?? 0) + (orders?.summary.active ?? 0);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>Seller dashboard</p>
          <h1 className={styles.heroTitle}>{profile?.businessName ?? "Seller dashboard"}</h1>
          <p className={styles.heroSubtitle}>Track account health, live lots, open orders, and settlement status.</p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryAction} href="/seller/supply/new">
            <Plus size={16} strokeWidth={2.4} />
            Add supply
          </Link>
        </div>
      </section>

      {error ? <section className={styles.supportCard}><p className={styles.helperText}>{error}</p></section> : null}

      <section className={styles.summaryCard} aria-label="Seller dashboard summary">
        <div className={styles.summaryTop}>
          <div className={styles.summaryChip}>
            <span className={styles.summaryChipDot} aria-hidden="true" />
            Live database
          </div>
          <div className={styles.summaryDate}>{value(profile?.district)}</div>
        </div>
        <div className={styles.summaryStats}>
          <article className={styles.summaryStat}>
            <p className={styles.summaryStatLabel}>Active lots</p>
            <strong className={styles.summaryStatValue}>{metric(supply, "active")}</strong>
            <p className={styles.summaryStatHint}>From seller supply rows</p>
          </article>
          <article className={styles.summaryStat}>
            <p className={styles.summaryStatLabel}>Open orders</p>
            <strong className={styles.summaryStatValue}>{openOrders}</strong>
            <p className={styles.summaryStatHint}>Assigned to this seller</p>
          </article>
          <article className={styles.summaryStat}>
            <p className={styles.summaryStatLabel}>Pending payout</p>
            <strong className={styles.summaryStatValue}>{formatSellerMoney(payouts?.summary.pending ?? 0)}</strong>
            <p className={styles.summaryStatHint}>Unsettled seller amount</p>
          </article>
        </div>
      </section>

      <section className={styles.workspaceGrid}>
        <section className={styles.listColumn}>
          <article className={styles.supportCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Account snapshot</h2>
              <UserRound size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <p className={styles.supportBody}>Contact: {value(profile?.fullName)}</p>
            <p className={styles.supportBody}>Phone: {value(profile?.phone)}</p>
            <p className={styles.supportBody}>Business: {value(profile?.businessName)}</p>
          </article>

          <article className={styles.supportCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Recent supply lots</h2>
                <p className={styles.sectionSubtitle}>{supply?.listings.length ?? 0} lots from database</p>
              </div>
              <Link className={styles.tertiaryAction} href="/seller/supply">View supply</Link>
            </div>
            <div className={styles.supportList}>
              {(supply?.listings ?? []).slice(0, 3).map((listing) => (
                <article key={listing.id} className={styles.supportItem}>
                  <div>
                    <p className={styles.supportItemTitle}>{listing.commodityLabel}</p>
                    <p className={styles.supportItemMeta}>{listing.quantity} {listing.unit} · {formatSellerMoney(listing.askingPrice)}</p>
                  </div>
                  <span className={styles.status}>{listing.status}</span>
                </article>
              ))}
            </div>
          </article>
        </section>

        <aside className={styles.railColumn}>
          <section className={styles.supportCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Quick actions</h3>
              <Landmark size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <div className={styles.actionGrid}>
              <Link className={styles.actionTile} href="/seller/orders"><ShoppingCart size={18} strokeWidth={2.2} />Orders</Link>
              <Link className={styles.actionTile} href="/seller/dwr"><Package size={18} strokeWidth={2.2} />DWR records</Link>
            </div>
          </section>

          <section className={styles.supportCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Order queue</h3>
              <ShoppingCart size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <div className={styles.supportList}>
              {(orders?.orders ?? []).slice(0, 3).map((order) => (
                <article key={order.id} className={styles.supportItem}>
                  <div>
                    <p className={styles.supportItemTitle}>{order.buyerName}</p>
                    <p className={styles.supportItemMeta}>{order.quantityLabel}</p>
                  </div>
                  <span className={styles.status}>{order.status}</span>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.supportCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Settlement</h3>
              <Wallet size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <p className={styles.supportBody}>{payouts?.records.length ?? 0} payout records linked to this seller.</p>
            <Link className={styles.tertiaryAction} href="/seller/payouts">View payouts</Link>
          </section>
        </aside>
      </section>
    </main>
  );
}
