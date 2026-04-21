"use client";

import { useState, type KeyboardEvent } from "react";
import {
  ArrowDownToLine,
  BadgeCheck,
  Bell,
  Boxes,
  CircleAlert,
  CircleUserRound,
  Download,
  LayoutGrid,
  Landmark,
  Package,
  ReceiptText,
  Search,
  SlidersHorizontal,
  Truck,
  Wallet,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import type { Locale } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "./payouts.module.css";
import {
  SELLER_PAYOUT_COPY,
  SELLER_PAYOUT_ROWS,
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
  rows = SELLER_PAYOUT_ROWS,
  initialSelectedId,
}: {
  locale: Locale;
  rows?: PayoutRow[];
  initialSelectedId?: string;
}) {
  const copy = SELLER_PAYOUT_COPY[locale];
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? rows[0]?.id ?? "");
  const selectedRow = rows.find((row) => row.id === selectedId);
  const pendingAmount = 45200;
  const completedAmount = 78250;
  const totalAmount = pendingAmount + completedAmount;

  const handleBreakdown = () => {
    const nextRow = rows.find((row) => row.status !== "settled") ?? rows[0];
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
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">
              <Package size={16} strokeWidth={2.25} />
            </div>
            <div>
              <div className={styles.brandTitle}>{copy.appName}</div>
              <div className={styles.brandSub}>{copy.workspace}</div>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Seller workspace navigation">
            <button type="button" className={styles.navItem}>
              {copy.nav.dashboard}
            </button>
            <button type="button" className={styles.navItem}>
              {copy.nav.supply}
            </button>
            <button type="button" className={styles.navItem}>
              {copy.nav.orders}
            </button>
            <button type="button" className={`${styles.navItem} ${styles.navItemActive}`}>
              {copy.nav.payouts}
            </button>
            <button type="button" className={styles.navItem}>
              {copy.nav.dwr}
            </button>
            <button type="button" className={styles.navItem}>
              {copy.nav.account}
            </button>
          </nav>

          <div className={styles.headerActions}>
            <label className={styles.searchWrap}>
              <Search className={styles.searchIcon} size={16} strokeWidth={2.2} />
              <span className={styles.srOnly}>{copy.searchPlaceholder}</span>
              <input
                className={styles.searchInput}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
              />
            </label>
            <button type="button" className={styles.iconButton} aria-label="Notifications">
              <Bell size={18} strokeWidth={2.2} />
            </button>
            <div className={styles.avatar} aria-hidden="true">
              <CircleUserRound size={22} strokeWidth={1.9} />
            </div>
          </div>
        </div>
      </header>

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
            <div className={styles.summaryDate}>{copy.nextDisbursementLabel}</div>
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
                <p className={styles.sectionSubtitle}>{copy.viewHistory}</p>
              </div>
              <button type="button" className={styles.filterButton}>
                <SlidersHorizontal size={15} strokeWidth={2.2} aria-hidden="true" />
                {copy.filter}
              </button>
            </div>

            {rows.length ? (
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
                        {rows.map((row) => {
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
                    <span>{copy.viewHistory}</span>
                    <div className={styles.pagination}>
                      <button type="button" className={styles.paginationButton}>
                        Previous
                      </button>
                      <button type="button" className={styles.paginationButton}>
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.mobileList}>
                  {rows.map((row) => {
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

                <button type="button" className={styles.loadMoreButton}>
                  {copy.loadMore}
                </button>
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

                  <button type="button" className={styles.detailAction}>
                    {copy.detail.action}
                    <ArrowDownToLine size={16} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </section>

            <section className={styles.profileCard}>
              <div className={styles.railHeader}>
                <h3 className={styles.railTitle}>{copy.profile.title}</h3>
                <Landmark size={17} strokeWidth={2.2} className={styles.railIcon} />
              </div>
              <p className={styles.railText}>{copy.profile.blurb}</p>

              <div className={styles.profilePanel}>
                <div className={styles.profileBadgeRow}>
                  <span className={styles.profileBadge}>Commercial Account</span>
                  <BadgeCheck size={18} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <div className={styles.profileEntityLabel}>{copy.profile.businessLabel}</div>
                <div className={styles.profileEntityName}>GreenLeaf Wholesalers Ltd.</div>
                <div className={styles.profileMetaRow}>
                  <span>{copy.profile.payoutMethodLabel}</span>
                  <strong>CHASE **** 8291</strong>
                </div>
              </div>

              <button type="button" className={styles.profileAction}>
                {copy.profile.action}
              </button>
            </section>

            <section className={styles.exportCard}>
              <div className={styles.railHeader}>
                <h3 className={styles.railTitle}>{copy.export.title}</h3>
                <Download size={17} strokeWidth={2.2} className={styles.railIcon} />
              </div>
              <p className={styles.railText}>{copy.export.blurb}</p>
              <div className={styles.exportList}>
                <button type="button" className={styles.exportButton}>
                  <Download size={15} strokeWidth={2.2} aria-hidden="true" />
                  {copy.export.csv}
                </button>
                <button type="button" className={styles.exportButton}>
                  <Download size={15} strokeWidth={2.2} aria-hidden="true" />
                  {copy.export.pdf}
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <nav className={styles.bottomNav} aria-label="Seller mobile navigation">
        <button type="button" className={styles.bottomNavItem}>
          <LayoutGrid size={20} strokeWidth={2.2} />
          <span>{copy.mobileNav.home}</span>
        </button>
        <button type="button" className={styles.bottomNavItem}>
          <Truck size={20} strokeWidth={2.2} />
          <span>{copy.mobileNav.orders}</span>
        </button>
        <button type="button" className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
          <Wallet size={20} strokeWidth={2.2} />
          <span>{copy.mobileNav.payouts}</span>
        </button>
        <button type="button" className={styles.bottomNavItem}>
          <Boxes size={20} strokeWidth={2.2} />
          <span>{copy.mobileNav.stock}</span>
        </button>
        <button type="button" className={styles.bottomNavItem}>
          <CircleUserRound size={20} strokeWidth={2.2} />
          <span>{copy.mobileNav.profile}</span>
        </button>
      </nav>
    </div>
  );
}

export default function SellerPayoutsPage() {
  const { locale } = useBrowserLocale();
  return <SellerPayoutsView locale={locale} />;
}
