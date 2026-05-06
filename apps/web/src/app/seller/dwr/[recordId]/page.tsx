"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Link2, Printer, ShieldCheck } from "lucide-react";
import type { Locale, SellerDwrDetailResponse, SellerDwrRecord } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiFetch } from "../../../../lib/api-client";
import { getSellerDwrRecord, getWebSellerSupplyCopy, formatSellerMoney } from "../../supply/supply-data";
import styles from "../../supply/supply.module.css";

export function SellerDwrDetailView({
  locale,
  recordId,
}: {
  locale: Locale;
  recordId: string;
}) {
  const copy = getWebSellerSupplyCopy(locale);
  const [record, setRecord] = useState<SellerDwrRecord | null>(() => process.env.NODE_ENV === "test" ? getSellerDwrRecord(recordId) : null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<SellerDwrDetailResponse>(`/api/seller/dwr/${recordId}`).then((data) => setRecord(data.record)).catch((err: Error) => setError(err.message));
  }, [recordId]);

  if (!record) {
    return (
      <main className={styles.main}>
        <section className={styles.supportCard}>
          <h1 className={styles.heroTitle}>{copy.notFoundTitle}</h1>
          <p className={styles.heroSubtitle}>{error || copy.notFoundBody}</p>
          <Link className={styles.secondaryAction} href="/seller/supply">
            <ArrowLeft size={16} strokeWidth={2.2} />
            {copy.supplyTitle}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.recordKicker}>Digital warehouse receipt</p>
          <h1 className={styles.heroTitle}>{record.recordCode}</h1>
          <p className={styles.heroSubtitle}>
            {record.commodityLabel} · {record.quantity} {copy.units[record.unit]} · {formatSellerMoney(record.askingPrice)}
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.secondaryAction} href="/seller/supply">
            <ArrowLeft size={16} strokeWidth={2.2} />
            {copy.supplyTitle}
          </Link>
          <button type="button" className={styles.primaryAction} onClick={() => window.print()}>
            <Download size={16} strokeWidth={2.2} />
            Download DWR
          </button>
        </div>
      </section>

      <section className={styles.dwrLayout}>
        <div className={styles.listColumn}>
          <article className={styles.recordHero}>
            <div className={styles.recordHeroTop}>
              <div className={styles.recordThumb} aria-hidden="true" />
              <div>
                <p className={styles.recordKicker}>{copy.dwrTitle}</p>
                <h2 className={styles.recordTitle}>{record.commodityLabel}</h2>
                <p className={styles.recordMeta}>
                  {record.gradeLabel} · {record.packageLabel}
                </p>
              </div>
              <div className={styles.summaryChip}>
                <span className={styles.summaryChipDot} aria-hidden="true" />
                DWR active
              </div>
            </div>

            <div className={styles.verifiedCard}>
              <div className={styles.verifiedTitle}>Verified supply</div>
              <p className={styles.cardText}>Official digital warehouse receipt generated.</p>
              <p className={styles.cardText}>Eligible for order matching.</p>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>{copy.fields.quantity}</div>
                <div className={styles.infoValue}>
                  {record.quantity} {copy.units[record.unit]}
                </div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>{copy.fields.grade}</div>
                <div className={styles.infoValue}>{record.gradeLabel}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>{copy.fields.package}</div>
                <div className={styles.infoValue}>{record.packageLabel}</div>
              </div>
            </div>
          </article>

          <article className={styles.supportCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Operational data</h2>
              <ShieldCheck size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>Hub</div>
                <div className={styles.infoValue}>{record.hubLabel}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>Inspected by</div>
                <div className={styles.infoValue}>{record.inspectorLabel}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>Received at</div>
                <div className={styles.infoValue}>{record.receivedAt}</div>
              </div>
            </div>
            <ul className={styles.notes}>
              {record.notes.map((note) => (
                <li key={note} className={styles.noteItem}>
                  {note}
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.linkCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Digital warehouse receipt</h2>
              <FileText size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <p className={styles.helperText}>Click to view the linked warehouse record and chain of custody.</p>
          </article>
        </div>

        <aside className={styles.railStack}>
          <section className={styles.railPanel}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.railHeading}>Document status</h2>
              <ShieldCheck size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <div className={styles.darkCard}>
              <p className={styles.verifiedTitle}>Official record</p>
              <p className={styles.cardText}>This DWR is cleared for settlement and matching.</p>
              <div className={styles.supportAccent}>
                <ShieldCheck size={18} strokeWidth={2.2} />
                <span>Eligibility confirmed</span>
              </div>
            </div>
          </section>

          <section className={styles.railPanel}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.railHeading}>Linked activity</h2>
              <Link2 size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <div className={styles.railList}>
              <article className={styles.railItem}>
                <div className={styles.railItemTitle}>Active order</div>
                <div className={styles.railItemMeta}>Matched with current seller queue.</div>
              </article>
              <article className={styles.railItem}>
                <div className={styles.railItemTitle}>Settlement</div>
                <div className={styles.railItemMeta}>Pending payout will reference this lot.</div>
              </article>
            </div>
            <Link className={styles.linkCard} href="/seller/supply">
              View full ledger
            </Link>
          </section>

          <section className={styles.railPanel}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.railHeading}>Chain of custody</h2>
              <Printer size={17} strokeWidth={2.2} className={styles.railIcon} />
            </div>
            <div className={styles.darkCard}>
              <p className={styles.cardText}>Verify this DWR hash against the physical dispatch note.</p>
              <div className={styles.hashField}>HASH: Not recorded</div>
              <button type="button" className={styles.hashButton}>
                Verify hash
              </button>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

export default function SellerDwrDetailPage({
  params,
}: {
  params: { recordId: string };
}) {
  const { locale } = useBrowserLocale();
  return <SellerDwrDetailView locale={locale} recordId={params.recordId} />;
}
