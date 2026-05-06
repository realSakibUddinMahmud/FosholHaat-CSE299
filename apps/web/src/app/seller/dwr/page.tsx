"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Plus, ShieldCheck } from "lucide-react";
import type { Locale, SellerSupplyListResponse, SellerSupplyListing } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
import { useBrowserLocale } from "../../../lib/locale";
import { formatSellerMoney, getWebSellerSupplyCopy } from "../supply/supply-data";
import styles from "../supply/supply.module.css";

export function SellerDwrListView({
  locale,
}: {
  locale: Locale;
}) {
  const copy = getWebSellerSupplyCopy(locale);
  const [rows, setRows] = useState<SellerSupplyListing[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<SellerSupplyListResponse>("/api/seller/supply")
      .then((data) => setRows(data.listings.filter((item) => item.dwrRecordId)))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.recordKicker}>Digital warehouse receipts</p>
          <h1 className={styles.heroTitle}>{copy.dwrTitle}</h1>
          <p className={styles.heroSubtitle}>Open each verified receipt and track its linked supply record.</p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryAction} href="/seller/supply/new">
            <Plus size={16} strokeWidth={2.4} />
            {copy.addSupply}
          </Link>
        </div>
      </section>

      <section className={styles.listColumn}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Active DWR records</h2>
            <p className={styles.sectionSubtitle}>{rows.length} verified records</p>
          </div>
          <ShieldCheck size={18} strokeWidth={2.2} className={styles.railIcon} />
        </div>
        {error ? <p className={styles.helperText}>{error}</p> : null}
        {rows.length ? (
          <div className={styles.inventoryList}>
            {rows.map((listing) => (
              <Link key={listing.dwrRecordId || listing.id} href={`/seller/dwr/${listing.dwrRecordId}`} className={styles.supplyCard}>
                <div className={styles.supplyTop}>
                  <div className={styles.supplyMedia} aria-hidden="true">
                    <FileText size={22} strokeWidth={2.2} />
                  </div>
                  <div className={styles.supplyBody}>
                    <div className={styles.cardHeader}>
                      <strong className={styles.cardTitle}>{listing.commodityLabel}</strong>
                      <span className={styles.status}>DWR active</span>
                    </div>
                    <p className={styles.cardText}>
                      {listing.quantity} {copy.units[listing.unit]} · {listing.gradeLabel}
                    </p>
                    <div className={styles.cardFooter}>
                      <div>
                        <p className={styles.cardText}>{copy.fields.price}</p>
                        <strong className={styles.cardPrice}>{formatSellerMoney(listing.askingPrice)}</strong>
                      </div>
                      <ArrowRight size={18} strokeWidth={2.2} className={styles.railIcon} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.helperText}>No live DWR records found.</p>
        )}
      </section>
    </main>
  );
}

export default function SellerDwrListPage() {
  const { locale } = useBrowserLocale();
  return <SellerDwrListView locale={locale} />;
}
