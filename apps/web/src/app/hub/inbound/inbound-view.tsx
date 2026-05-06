"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  MapPinned,
  Truck,
} from "lucide-react";
import {
  INBOUND_RECEIPT_STATUS_ORDER,
  InboundReceiptStatus,
  getHubInboundCopy,
  type InboundReceiptDetail,
  type InboundReceiptQueueResponse,
  type Locale,
} from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiPost } from "../../../lib/api-client";
import { HUB_INBOUND_DETAILS, HUB_INBOUND_QUEUE } from "./inbound.data";
import styles from "./inbound.module.css";

const EMPTY_INBOUND_QUEUE: InboundReceiptQueueResponse = {
  summary: { PENDING: 0, RECEIVED: 0, DISCREPANCY: 0, total: 0 },
  receipts: [],
  featuredReceiptId: "",
  activeTab: InboundReceiptStatus.PENDING,
};

const EMPTY_INBOUND_DETAILS: Record<string, InboundReceiptDetail> = {};

function formatCount(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(value);
}

function statusClass(status: InboundReceiptStatus) {
  if (status === "RECEIVED") return styles.statusReceived;
  if (status === "DISCREPANCY") return styles.statusDiscrepancy;
  return styles.statusPending;
}

function formatQuantity(locale: Locale, value: number, unit: string) {
  const number = new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(value);
  return `${number} ${unit}`;
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
  item,
  locale,
  copy,
  selected,
}: {
  item: InboundReceiptQueueResponse["receipts"][number];
  locale: Locale;
  copy: ReturnType<typeof getHubInboundCopy>;
  selected: boolean;
}) {
  return (
    <Link
      href={`/hub/inbound/${item.id}`}
      className={`${styles.queueCard} ${selected ? styles.queueCardActive : ""}`}
      aria-current={selected ? "page" : undefined}
    >
      <div className={styles.queueCardTop}>
        <div>
          <div className={styles.queueCardId}>{item.id}</div>
          <div className={styles.queueCardMeta}>
            <CalendarDays size={12} strokeWidth={2.2} aria-hidden="true" />
            {item.arrivalDate} - {item.arrivalWindowLabel}
          </div>
        </div>
        <span className={`${styles.statusPill} ${statusClass(item.status)}`}>
          {copy.statuses[item.status]}
        </span>
      </div>

      <div className={styles.queueCardTitle}>{item.supplierName}</div>
      <div className={styles.queueCardBody}>
        <span>{item.commodity}</span>
        <span className={styles.queueCardNote}>{item.note}</span>
      </div>

      <div className={styles.queueCardFooter}>
        <span>{formatQuantity(locale, item.expectedQuantity, item.unit)}</span>
        <span className={styles.queueCardLane}>{item.laneLabel}</span>
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

function InboundDetail({
  receipt,
  locale,
  copy,
}: {
  receipt: InboundReceiptDetail;
  locale: Locale;
  copy: ReturnType<typeof getHubInboundCopy>;
}) {
  return (
    <>
      <div className={styles.detailHeader}>
        <div>
          <div className={styles.detailKicker}>{copy.screenTitle}</div>
          <h2 className={styles.detailTitle}>{receipt.id}</h2>
          <p className={styles.detailSubtitle}>
            {receipt.supplierName} - {receipt.commodity}
          </p>
          {receipt.receivedAt ? <div className={styles.receivedAt}>{receipt.receivedAt}</div> : null}
        </div>
        <span className={`${styles.statusPill} ${statusClass(receipt.status)}`}>
          {copy.statuses[receipt.status]}
        </span>
      </div>

      <dl className={styles.detailGrid}>
        <DetailField
          label={copy.labels.expected}
          value={formatQuantity(locale, receipt.expectedQuantity, receipt.unit)}
        />
        <DetailField label={copy.labels.lane} value={receipt.laneLabel} />
        <DetailField label={copy.labels.arrival} value={receipt.arrivalWindowLabel} />
        <DetailField label={copy.labels.receiver} value={receipt.receiverName ?? "-"} />
        <DetailField label={copy.labels.nextStep} value={receipt.nextStepLabel} />
        <DetailField label={copy.labels.note} value={receipt.note} />
      </dl>

      <section className={styles.gradeCard}>
        <div className={styles.gradeCardTop}>
          <div className={styles.gradeCardTitleRow}>
            <BadgeCheck size={16} strokeWidth={2.2} aria-hidden="true" />
            <span>{copy.labels.discrepancy}</span>
          </div>
          <span className={styles.gradePill}>{receipt.expectedGradeLabel}</span>
        </div>
        <div className={styles.gradeGrid}>
          <div>
            <div className={styles.gradeLabel}>{copy.labels.expected}</div>
            <div className={styles.gradeValue}>{receipt.expectedGradeLabel}</div>
          </div>
          <div>
            <div className={styles.gradeLabel}>{copy.labels.actual}</div>
            <div className={styles.gradeValue}>{receipt.actualGradeLabel ?? "-"}</div>
          </div>
        </div>

        {receipt.discrepancy ? (
          <div className={styles.discrepancyBox}>
            <div className={styles.discrepancyLine}>
              <Truck size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{formatQuantity(locale, receipt.discrepancy.actualQuantity, receipt.unit)}</span>
            </div>
            <p className={styles.discrepancyNote}>{receipt.discrepancy.notes}</p>
            <div className={styles.discrepancyMeta}>{receipt.discrepancy.reportedAt}</div>
          </div>
        ) : (
          <div className={styles.discrepancyBox}>
            <div className={styles.discrepancyLine}>
              <CircleAlert size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>{copy.actions.discrepancy}</span>
            </div>
            <p className={styles.discrepancyNote}>{copy.feedback.discrepancy}</p>
          </div>
        )}
      </section>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={() => apiPost(`/api/hub/inbound/${receipt.id}/receive`, { receiverName: "Hub manager" }).then(() => window.location.reload())}
        >
          {copy.actions.receive}
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.secondaryAction}
          onClick={() => apiPost(`/api/hub/inbound/${receipt.id}/discrepancies`, { actualQuantity: Math.max(0, receipt.expectedQuantity - 1), notes: "Checked from web workspace" }).then(() => window.location.reload())}
        >
          {copy.actions.discrepancy}
        </button>
      </div>
    </>
  );
}

export function HubInboundView({
  locale,
  queue = process.env.NODE_ENV === "test" ? HUB_INBOUND_QUEUE : EMPTY_INBOUND_QUEUE,
  details = process.env.NODE_ENV === "test" ? HUB_INBOUND_DETAILS : EMPTY_INBOUND_DETAILS,
  selectedId = queue.featuredReceiptId,
}: {
  locale: Locale;
  queue?: InboundReceiptQueueResponse;
  details?: Record<string, InboundReceiptDetail>;
  selectedId?: string;
}) {
  const copy = getHubInboundCopy(locale);
  const [activeTab, setActiveTab] = useState<InboundReceiptStatus>(() => {
    return details[selectedId]?.status ?? queue.activeTab;
  });

  const filtered = useMemo(
    () => queue.receipts.filter((item) => item.status === activeTab),
    [activeTab, queue.receipts]
  );

  const selected = details[selectedId] ?? null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <div className={styles.heroKicker}>
              <MapPinned size={14} strokeWidth={2.2} aria-hidden="true" />
              {copy.activeLabel}
            </div>
            <h1 className={styles.heroTitle}>{copy.heroTitle}</h1>
            <p className={styles.heroSubtitle}>{copy.heroSubtitle}</p>
          </div>
        </section>

        <section className={styles.summaryCard}>
          <div className={styles.summaryTop}>
            <div className={styles.summaryChip}>
              <span className={styles.summaryChipDot} aria-hidden="true" />
              {queue.summary.total} {copy.activeLabel.toLowerCase()}
            </div>
            <div className={styles.summaryDate}>{copy.screenTitle}</div>
          </div>

          <div className={styles.summaryAmountRow}>
            <div>
              <div className={styles.summaryLabel}>{copy.tabs[activeTab]}</div>
              <div className={styles.summaryAmount}>{formatCount(locale, filtered.length)}</div>
            </div>
            <Link href="/hub/inbound" className={styles.breakdownButton}>
              {copy.backToQueue}
              <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.summaryStats}>
            {INBOUND_RECEIPT_STATUS_ORDER.map((status) => (
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
          <section className={styles.listColumn}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>{copy.activeLabel}</h2>
                <p className={styles.sectionSubtitle}>{copy.queueEmptyBody}</p>
              </div>
              <div className={styles.tabRow} role="tablist" aria-label={copy.screenTitle}>
                {INBOUND_RECEIPT_STATUS_ORDER.map((status) => (
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
                {filtered.map((item) => (
                  <QueueCard
                    key={item.id}
                    item={item}
                    locale={locale}
                    copy={copy}
                    selected={item.id === selectedId}
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
          </section>

          <aside className={styles.detailColumn}>
            <section className={styles.detailCard}>
              {selected ? (
                <InboundDetail receipt={selected} locale={locale} copy={copy} />
              ) : (
                <div className={styles.notFoundState}>
                  <div className={styles.emptyIcon} aria-hidden="true">
                    <CircleAlert size={20} strokeWidth={2.2} />
                  </div>
                  <div className={styles.emptyCopy}>
                    <h3>{copy.detailNotFoundTitle}</h3>
                    <p>{copy.detailNotFoundBody}</p>
                  </div>
                  <Link href="/hub/inbound" className={styles.backLink}>
                    {copy.backToQueue}
                  </Link>
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function HubInboundPage() {
  const { locale } = useBrowserLocale();
  return <HubInboundView locale={locale} />;
}
