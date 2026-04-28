"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CircleAlert,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  SORTING_BATCH_STATUS_ORDER,
  getHubSortingCopy,
  type Locale,
  type SortingBatchDetail,
  type SortingBatchStatus,
  type SortingQueueResponse,
} from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiPost } from "../../../lib/api-client";
import { HUB_SORTING_DETAILS, HUB_SORTING_QUEUE } from "./sorting.data";
import styles from "./sorting.module.css";

function formatCount(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(value);
}

function statusClass(status: SortingBatchStatus) {
  if (status === "IN_PROGRESS") return styles.statusInProgress;
  if (status === "HOLD") return styles.statusHold;
  if (status === "COMPLETE") return styles.statusComplete;
  return styles.statusReady;
}

function QueueStat({
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

function QueueTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.tabButton} ${active ? styles.tabButtonActive : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function QueueCard({
  batch,
  copy,
  selected,
}: {
  batch: SortingQueueResponse["batches"][number];
  copy: ReturnType<typeof getHubSortingCopy>;
  selected: boolean;
}) {
  return (
    <Link
      href={`/hub/sorting/${batch.batchId}`}
      className={`${styles.queueCard} ${selected ? styles.queueCardActive : ""}`}
      aria-current={selected ? "page" : undefined}
    >
      <div className={styles.queueCardTop}>
        <div>
          <div className={styles.queueCardId}>{batch.batchId}</div>
          <div className={styles.queueCardMeta}>{batch.updatedAtLabel}</div>
        </div>
        <span className={`${styles.statusPill} ${statusClass(batch.status)}`}>
          {copy.statuses[batch.status]}
        </span>
      </div>

      <div className={styles.queueCardTitle}>{batch.commodityLabel}</div>
      <div className={styles.queueCardBody}>
        <span>{batch.expectedQuantityLabel}</span>
        <span className={styles.queueCardNote}>{batch.nextActionLabel}</span>
      </div>

      <div className={styles.queueCardFooter}>
        <span>{batch.expectedQuantityLabel}</span>
        <span>{batch.updatedAtLabel}</span>
      </div>
    </Link>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={styles.detailField}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function SortingDetail({
  batch,
  copy,
}: {
  batch: SortingBatchDetail;
  copy: ReturnType<typeof getHubSortingCopy>;
}) {
  return (
    <>
      <div className={styles.detailHeader}>
        <div>
          <div className={styles.detailKicker}>{copy.screenTitle}</div>
          <h2 className={styles.detailTitle}>{batch.batchId}</h2>
          <p className={styles.detailSubtitle}>
            {batch.commodityLabel} - {batch.laneLabel}
          </p>
          <div className={styles.detailMetaRow}>
            <span>{batch.receiverLabel}</span>
            <span>{batch.updatedAtLabel}</span>
          </div>
        </div>
        <span className={`${styles.statusPill} ${statusClass(batch.status)}`}>
          {copy.statuses[batch.status]}
        </span>
      </div>

      <dl className={styles.detailGrid}>
        <DetailField label={copy.labels.lane} value={batch.laneLabel} />
        <DetailField label={copy.labels.receiver} value={batch.receiverLabel} />
        <DetailField label={copy.labels.nextAction} value={batch.nextActionLabel} />
      </dl>

      <section className={styles.mixCard}>
        <div className={styles.mixHeader}>
          <div className={styles.mixTitleRow}>
            <SlidersHorizontal size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>{copy.labels.itemMix}</span>
          </div>
          <span className={styles.mixPill}>{batch.expectedQuantityLabel}</span>
        </div>

        <div className={styles.mixList}>
          {batch.itemGroups.map((group) => (
            <div key={group.label} className={styles.mixItem}>
              <span>{group.label}</span>
              <strong>{group.quantityLabel}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.holdCard}>
        <div className={styles.holdTitleRow}>
          <CircleAlert size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>{copy.labels.holdReason}</span>
        </div>
        {batch.holdRecord ? (
          <>
            <div className={styles.holdReasonPill}>{batch.holdRecord.reasonLabel}</div>
            <p className={styles.holdNote}>{batch.holdRecord.note}</p>
            <div className={styles.holdMeta}>{batch.holdRecord.reportedAt}</div>
          </>
        ) : (
          <>
            <div className={styles.holdReasonPill}>{copy.actions.hold}</div>
            <p className={styles.holdNote}>{batch.nextActionLabel}</p>
          </>
        )}
      </section>

      <div className={styles.actionRow}>
        <button type="button" className={styles.primaryAction} onClick={() => apiPost(`/api/hub/sorting/${batch.batchId}/start`, { operatorName: "Hub manager" }).then(() => window.location.reload())}>
          {copy.actions.start}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <button type="button" className={styles.secondaryAction} onClick={() => apiPost(`/api/hub/sorting/${batch.batchId}/hold`, { reason: "count-mismatch", note: "Checked from web workspace" }).then(() => window.location.reload())}>
          {copy.actions.hold}
        </button>
        <button type="button" className={styles.ghostAction} onClick={() => apiPost(`/api/hub/sorting/${batch.batchId}/complete`, { operatorName: "Hub manager" }).then(() => window.location.reload())}>
          {copy.actions.complete}
        </button>
      </div>
    </>
  );
}

export function HubSortingView({
  locale,
  queue = HUB_SORTING_QUEUE,
  details = HUB_SORTING_DETAILS,
  selectedId = queue.featuredBatchId,
}: {
  locale: Locale;
  queue?: SortingQueueResponse;
  details?: Record<string, SortingBatchDetail>;
  selectedId?: string;
}) {
  const copy = getHubSortingCopy(locale);
  const selected = details[selectedId] ?? null;
  const [activeTab, setActiveTab] = useState<SortingBatchStatus>(
    selected?.status ?? queue.activeTab
  );

  useEffect(() => {
    setActiveTab(selected?.status ?? queue.activeTab);
  }, [queue.activeTab, selected?.status]);

  const filtered = useMemo(
    () => queue.batches.filter((batch) => batch.status === activeTab),
    [activeTab, queue.batches]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">
              <Package size={16} strokeWidth={2.25} />
            </div>
            <div>
              <div className={styles.brandTitle}>{copy.screenTitle}</div>
              <div className={styles.brandSub}>Hub workspace - sorting detail</div>
            </div>
          </div>

          <label className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={16} strokeWidth={2.2} />
            <span className={styles.srOnly}>{copy.heroTitle}</span>
            <input className={styles.searchInput} placeholder={copy.heroSubtitle} aria-label={copy.heroTitle} />
          </label>

          <div className={styles.headerChip}>{copy.activeLabel}</div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <div className={styles.heroKicker}>{copy.activeLabel}</div>
            <h1 className={styles.heroTitle}>{copy.heroTitle}</h1>
            <p className={styles.heroSubtitle}>{copy.heroSubtitle}</p>
          </div>
        </section>

        <section className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div className={styles.summaryChip}>
              {queue.summary.total} {copy.activeLabel.toLowerCase()}
            </div>
            <div className={styles.summaryDate}>{copy.screenTitle}</div>
          </div>

          <div className={styles.summaryStats}>
            {SORTING_BATCH_STATUS_ORDER.map((status) => (
              <QueueStat
                key={status}
                label={copy.statuses[status]}
                value={formatCount(locale, queue.summary[status])}
                hint={copy.tabs[status]}
              />
            ))}
          </div>
        </section>

        <div className={styles.contentGrid}>
          <aside className={styles.listColumn}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>{copy.activeLabel}</h2>
                <p className={styles.sectionSubtitle}>{copy.heroSubtitle}</p>
              </div>
              <div className={styles.tabRow} role="tablist" aria-label={copy.screenTitle}>
                {SORTING_BATCH_STATUS_ORDER.map((status) => (
                  <QueueTab
                    key={status}
                    active={activeTab === status}
                    label={copy.tabs[status]}
                    onClick={() => setActiveTab(status)}
                  />
                ))}
              </div>
            </div>

            {filtered.length ? (
              <div className={styles.queueList}>
                {filtered.map((batch) => (
                  <QueueCard
                    key={batch.batchId}
                    batch={batch}
                    copy={copy}
                    selected={batch.batchId === selectedId}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon} aria-hidden="true">
                  <CircleAlert size={20} strokeWidth={2.2} />
                </div>
                <div className={styles.emptyCopy}>
                  <h3>{copy.queueEmptyTitle}</h3>
                  <p>{copy.queueEmptyBody}</p>
                </div>
              </div>
            )}
          </aside>

          <section className={styles.detailColumn}>
            <section className={styles.detailCard}>
              {selected ? (
                <SortingDetail batch={selected} copy={copy} />
              ) : (
                <div className={styles.notFoundState}>
                  <div className={styles.emptyIcon} aria-hidden="true">
                    <CircleAlert size={20} strokeWidth={2.2} />
                  </div>
                  <div className={styles.emptyCopy}>
                    <h3>{copy.detailNotFoundTitle}</h3>
                    <p>{copy.detailNotFoundBody}</p>
                  </div>
                  <Link href={`/hub/sorting/${queue.featuredBatchId}`} className={styles.backLink}>
                    {copy.backToQueue}
                  </Link>
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function HubSortingViewWithLocale() {
  const { locale } = useBrowserLocale();
  return <HubSortingView locale={locale} selectedId={HUB_SORTING_QUEUE.featuredBatchId} />;
}
