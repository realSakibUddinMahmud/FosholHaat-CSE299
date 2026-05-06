"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChevronRight, CircleAlert, ReceiptText } from "lucide-react";
import type { Locale, SellerPayoutListResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "./payouts.module.css";
import {
  SELLER_PAYOUT_COPY,
  type PayoutRow,
  type PayoutStatus,
} from "./payouts.data";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function statusClass(status: PayoutStatus) {
  if (status === "settled") return styles.statusSettled;
  if (status === "processing") return styles.statusProcessing;
  if (status === "pending") return styles.statusPending;
  return styles.statusFailed;
}

function mapPayoutRows(data: SellerPayoutListResponse): PayoutRow[] {
  return data.records.map((record) => ({
    id: record.referenceCode,
    period: record.periodLabel,
    date: new Date(record.createdAt).toLocaleDateString("en-BD", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    orderRef: record.orderRef,
    method: record.method,
    amount: record.amount,
    status: record.status,
    note: `Live payout ${record.referenceCode} from database.`,
  }));
}

function SummaryStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className={styles.summaryStat}>
      <div className={styles.summaryStatLabel}>{label}</div>
      <div className={styles.summaryStatValue}>{value}</div>
      <div className={styles.summaryStatHint}>{hint}</div>
    </div>
  );
}

export function SellerPayoutsView({
  locale,
  initialSelectedId,
}: {
  locale: Locale;
  initialSelectedId?: string;
}) {
  const copy = SELLER_PAYOUT_COPY[locale];
  const [livePayouts, setLivePayouts] = useState<SellerPayoutListResponse | null>(null);
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? "");
  const [error, setError] = useState("");
  const displayRows = useMemo(() => (livePayouts ? mapPayoutRows(livePayouts) : []), [livePayouts]);
  const selectedRow = displayRows.find((row) => row.id === selectedId) ?? displayRows[0];
  const pendingAmount = livePayouts?.summary.pending ?? 0;
  const completedAmount = livePayouts?.summary.completed ?? 0;
  const totalAmount = livePayouts?.summary.total ?? 0;
  const activitySummary = `Showing ${displayRows.length} live transactions`;
  const nextDisbursementDate = livePayouts?.summary.nextDisbursementDate
    ? new Date(livePayouts.summary.nextDisbursementDate).toLocaleDateString("en-BD", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    apiFetch<SellerPayoutListResponse>("/api/seller/payouts")
      .then((data) => {
        setLivePayouts(data);
        if (!initialSelectedId) {
          const featured = data.records.find((record) => record.id === data.featuredDetailId);
          setSelectedId(featured?.referenceCode ?? data.records[0]?.referenceCode ?? "");
        }
      })
      .catch((err: Error) => setError(err.message));
  }, [initialSelectedId]);

  const handleBreakdown = () => {
    const nextRow = displayRows.find((row) => row.status !== "settled") ?? displayRows[0];
    if (nextRow) setSelectedId(nextRow.id);
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedId(id);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{copy.heroTitle}</h1>
          <p className={styles.heroSubtitle}>{copy.heroSubtitle}</p>
        </section>

        <section className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div className={styles.summaryChip}>
              <span className={styles.summaryChipDot} aria-hidden="true" />
              {copy.heroKicker}
            </div>
            {nextDisbursementDate ? <div className={styles.summaryDate}>{nextDisbursementDate}</div> : null}
          </div>

          <div className={styles.summaryAmountRow}>
            <div>
              <div className={styles.summaryLabel}>{copy.pendingLabel}</div>
              <div className={styles.summaryAmount}>{formatMoney(pendingAmount)}</div>
            </div>
            <button type="button" className={styles.breakdownButton} onClick={handleBreakdown}>
              {copy.breakdown}
              <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.summaryStats}>
            <SummaryStat
              label={copy.summary.pending}
              value={formatMoney(pendingAmount)}
              hint={copy.pendingLabel}
            />
            <SummaryStat
              label={copy.summary.completed}
              value={formatMoney(completedAmount)}
              hint={copy.detail.title}
            />
            <SummaryStat
              label={copy.summary.total}
              value={formatMoney(totalAmount)}
              hint={copy.activityTitle}
            />
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.listColumn}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>{copy.activityTitle}</h2>
                <p className={styles.sectionSubtitle}>{activitySummary}</p>
              </div>
            </div>
            {error ? <p className={styles.sectionSubtitle}>{error}</p> : null}

            {displayRows.length ? (
              <>
                <div className={styles.tableCard}>
                  <div className={styles.tableScroll}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>{copy.table.transactionId}</th>
                          <th>{copy.table.date}</th>
                          <th>{copy.table.orderRef}</th>
                          <th>{copy.table.method}</th>
                          <th>{copy.table.amount}</th>
                          <th>{copy.table.status}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayRows.map((row) => {
                          const active = row.id === selectedRow?.id;
                          return (
                            <tr
                              key={row.id}
                              className={active ? styles.rowActive : ""}
                              onClick={() => setSelectedId(row.id)}
                              onKeyDown={(event) => handleRowKeyDown(event, row.id)}
                              role="button"
                              tabIndex={0}
                              aria-pressed={active}
                            >
                              <td>
                                <div className={styles.rowId}>{row.id}</div>
                                <div className={styles.rowMeta}>
                                  <CalendarDays size={12} strokeWidth={2.2} aria-hidden="true" />
                                  {row.period}
                                </div>
                              </td>
                              <td>{row.date}</td>
                              <td className={styles.rowRef}>{row.orderRef}</td>
                              <td>{row.method}</td>
                              <td className={styles.rowAmount}>{formatMoney(row.amount)}</td>
                              <td>
                                <span className={`${styles.statusPill} ${statusClass(row.status)}`}>
                                  {copy.status[row.status]}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.tableFooter}>
                    <span>{activitySummary}</span>
                  </div>
                </div>

                <div className={styles.mobileList}>
                  {displayRows.map((row) => {
                    const active = row.id === selectedRow?.id;
                    return (
                      <button
                        key={row.id}
                        type="button"
                        className={`${styles.mobileCard} ${active ? styles.mobileCardActive : ""}`}
                        onClick={() => setSelectedId(row.id)}
                      >
                        <div className={styles.mobileCardTop}>
                          <div>
                            <div className={styles.rowId}>{row.id}</div>
                            <div className={styles.rowMeta}>
                              <CalendarDays size={12} strokeWidth={2.2} aria-hidden="true" />
                              {row.period} • {row.method}
                            </div>
                          </div>
                          <span className={`${styles.statusPill} ${statusClass(row.status)}`}>
                            {copy.status[row.status]}
                          </span>
                        </div>

                        <div className={styles.mobileCardBottom}>
                          <div className={styles.mobileRowNote}>
                            <ReceiptText size={14} strokeWidth={2.2} aria-hidden="true" />
                            <span>{row.orderRef}</span>
                          </div>
                          <div className={styles.rowAmount}>{formatMoney(row.amount)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon} aria-hidden="true">
                  <CircleAlert size={20} strokeWidth={2.2} />
                </div>
                <div className={styles.emptyCopy}>
                  <h3>{copy.empty.title}</h3>
                  <p>{copy.empty.body}</p>
                </div>
              </div>
            )}
          </section>

          <aside className={styles.railColumn}>
            <section className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div>
                  <div className={styles.detailKicker}>{copy.detail.title}</div>
                  {selectedRow ? (
                    <>
                      <h3 className={styles.detailTitle}>{selectedRow.id}</h3>
                      <p className={styles.detailSubtitle}>{copy.detail.subtitle}</p>
                    </>
                  ) : (
                    <>
                      <h3 className={styles.detailTitle}>{copy.detail.notFoundTitle}</h3>
                      <p className={styles.detailSubtitle}>{copy.detail.notFoundBody}</p>
                    </>
                  )}
                </div>
                {selectedRow ? (
                  <span className={`${styles.statusPill} ${statusClass(selectedRow.status)}`}>
                    {copy.status[selectedRow.status]}
                  </span>
                ) : null}
              </div>

              {selectedRow ? (
                <>
                  <dl className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <dt>{copy.detail.orderRef}</dt>
                      <dd>{selectedRow.orderRef}</dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt>{copy.detail.method}</dt>
                      <dd>{selectedRow.method}</dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt>{copy.detail.date}</dt>
                      <dd>{selectedRow.date}</dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt>{copy.detail.noteLabel}</dt>
                      <dd>{selectedRow.note}</dd>
                    </div>
                  </dl>
                </>
              ) : null}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function SellerPayoutsPage() {
  const { locale } = useBrowserLocale();
  return <SellerPayoutsView locale={locale} />;
}
