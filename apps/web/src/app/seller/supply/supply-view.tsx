"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Clock3,
  Landmark,
  Plus,
  Search,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import type { Locale, SellerSupplyListResponse } from "@fosholhaat/types";
import { BrandLockup } from "../../../components/brand-lockup";
import { getWebSellerSupplyCopy, SELLER_SUPPLY_LISTINGS, formatSellerMoney } from "./supply-data";
import styles from "./supply.module.css";

function metricValue(metricKey: "active" | "readyToday" | "dwrOpen") {
  if (metricKey === "active") return 3;
  if (metricKey === "readyToday") return 2;
  return 3;
}

function stockPercent(status: string) {
  if (status === "active") return 84;
  if (status === "scheduled") return 62;
  if (status === "low-stock") return 28;
  return 16;
}

function activeNav(mode: "workspace" | "supply") {
  return mode === "workspace" ? "Dashboard" : "Supply";
}

export function SellerSupplyListView({
  locale,
  mode = "supply",
}: {
  locale: Locale;
  mode?: "workspace" | "supply";
}) {
  const copy = getWebSellerSupplyCopy(locale);
  const [liveSupply, setLiveSupply] = useState<SellerSupplyListResponse | null>(null);
  const title = mode === "workspace" ? copy.workspaceTitle : copy.supplyTitle;
  const subtitle = mode === "workspace" ? copy.workspaceSubtitle : copy.supplySubtitle;
  const activeTab = activeNav(mode);
  const listings = liveSupply?.listings ?? SELLER_SUPPLY_LISTINGS;
  const listingCount = listings.length;

  useEffect(() => {
    if (typeof fetch !== "function") return;
    fetch("/api/seller/supply", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: SellerSupplyListResponse | null) => setLiveSupply(data))
      .catch(() => undefined);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <BrandLockup subtitle={mode === "workspace" ? copy.workspaceTitle : copy.supplyTitle} />
          </div>

          <nav className={styles.nav} aria-label="Seller workspace navigation">
            {(["Dashboard", "Supply", "Orders", "Payouts", "DWR Records", "Account"] as const).map(
              (label) => (
                <span
                  key={label}
                  className={`${styles.navItem} ${label === activeTab ? styles.navItemActive : ""}`}
                >
                  {label}
                </span>
              ),
            )}
          </nav>

          <div className={styles.headerActions}>
            <label className={styles.searchWrap}>
              <Search className={styles.searchIcon} size={16} strokeWidth={2.2} />
              <span className={styles.srOnly}>{title}</span>
              <input
                className={styles.searchInput}
                aria-label={title}
                placeholder={mode === "workspace" ? "Search supply lots" : "Search lots"}
              />
            </label>
            <button type="button" className={styles.iconButton} aria-label="Notifications">
              <Bell size={18} strokeWidth={2.2} />
            </button>
            <div className={styles.avatar} aria-hidden="true">
              SH
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.heroKicker}>Bogura to Dhaka seller lane</p>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSubtitle}>{subtitle}</p>
          </div>

          <div className={styles.heroActions}>
            <Link className={styles.secondaryAction} href="/seller/supply">
              {copy.supplyTitle}
            </Link>
            <Link className={styles.primaryAction} href="/seller/supply/new">
              <Plus size={16} strokeWidth={2.4} />
              {copy.addSupply}
            </Link>
          </div>
        </section>

        <section className={styles.summaryCard} aria-label="Seller workspace summary">
          <div className={styles.summaryTop}>
            <div className={styles.summaryChip}>
              <span className={styles.summaryChipDot} aria-hidden="true" />
              Operational summary
            </div>
            <div className={styles.summaryDate}>Live inventory lane</div>
          </div>

          <div className={styles.summaryStats}>
            {(["active", "readyToday", "dwrOpen"] as const).map((metric) => (
              <article key={metric} className={styles.summaryStat}>
                <p className={styles.summaryStatLabel}>{copy.metrics[metric]}</p>
                <strong className={styles.summaryStatValue}>
                  {liveSupply?.workspace.metrics.find((item) => item.key === metric)?.value ?? metricValue(metric)}
                </strong>
                <p className={styles.summaryStatHint}>
                  {metric === "active" ? "Open lots" : metric === "readyToday" ? "Can move today" : "Linked records"}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workspaceGrid}>
          <section className={styles.listColumn} aria-label={copy.supplyTitle}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>{copy.supplyTitle}</h2>
                <p className={styles.sectionSubtitle}>{listingCount} lots visible</p>
              </div>
              <Link className={styles.tertiaryAction} href="/seller/supply/new">
                <Plus size={16} strokeWidth={2.4} />
                {copy.addSupply}
              </Link>
            </div>

            <div className={styles.inventoryList}>
              {listings.map((listing) => (
                <article key={listing.id} className={styles.supplyCard}>
                  <div className={styles.supplyTop}>
                    <div className={styles.supplyMedia} aria-hidden="true">
                      {listing.commodityLabel.slice(0, 1)}
                    </div>
                    <div className={styles.supplyBody}>
                      <div className={styles.cardHeader}>
                        <strong className={styles.cardTitle}>{listing.commodityLabel}</strong>
                        <span className={styles.status}>{copy.statuses[listing.status]}</span>
                      </div>
                      <p className={styles.cardText}>
                        {copy.fields.quantity}: {listing.quantity} {copy.units[listing.unit]} · {copy.fields.grade}:{" "}
                        {listing.gradeLabel}
                      </p>
                      <div className={styles.progressTrack} aria-hidden="true">
                        <div className={styles.progressFill} style={{ width: `${stockPercent(listing.status)}%` }} />
                      </div>
                      <div className={styles.cardFooter}>
                        <div>
                          <p className={styles.cardText}>{copy.fields.price}</p>
                          <strong className={styles.cardPrice}>{formatSellerMoney(listing.askingPrice)}</strong>
                        </div>
                        <div>
                          <p className={styles.cardText}>{copy.fields.package}</p>
                          <p className={styles.cardText}>{listing.packageLabel}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardLinkRow}>
                    <Link className={styles.secondaryAction} href={`/seller/dwr/${listing.dwrRecordId}`}>
                      {copy.viewDwr}
                    </Link>
                    <Link className={styles.tertiaryAction} href="/seller/supply/new">
                      Update stock
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.railColumn}>
            <section className={styles.supportCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Supply actions</h3>
                <Warehouse size={17} strokeWidth={2.2} className={styles.railIcon} />
              </div>
              <div className={styles.actionGrid}>
                <Link className={styles.actionTile} href="/seller/supply/new">
                  <Plus size={18} strokeWidth={2.2} />
                  New lot
                </Link>
                <Link className={styles.actionTile} href="/seller/orders">
                  <Truck size={18} strokeWidth={2.2} />
                  Orders
                </Link>
              </div>
            </section>

            <section className={styles.supportCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Pending hub receipts</h3>
                <Clock3 size={17} strokeWidth={2.2} className={styles.railIcon} />
              </div>
              <div className={styles.supportList}>
                {listings.slice(0, 2).map((listing) => (
                  <article key={listing.id} className={styles.supportItem}>
                    <div>
                      <p className={styles.supportItemTitle}>{listing.commodityLabel}</p>
                      <p className={styles.supportItemMeta}>{listing.stockHint}</p>
                    </div>
                    <span className={styles.status}>{copy.statuses[listing.status]}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.supportCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Settlement context</h3>
                <Landmark size={17} strokeWidth={2.2} className={styles.railIcon} />
              </div>
              <p className={styles.supportBody}>
                Track the linked DWR and payout context without leaving the seller lane.
              </p>
              <div className={styles.supportAccent}>
                <ShieldCheck size={18} strokeWidth={2.2} />
                <span>Trusted supply record</span>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
