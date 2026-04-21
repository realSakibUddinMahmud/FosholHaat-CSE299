"use client";

import Link from "next/link";
import { type Locale, getHubCoordinationCopy } from "@fosholhaat/types";
import { BrandLockup } from "../../components/brand-lockup";
import { useBrowserLocale } from "../../lib/locale";
import { HUB_OVERVIEW, getHubLaneHref } from "./hub.data";
import styles from "./hub.module.css";

export function HubWorkspaceView({ locale }: { locale: Locale }) {
  const copy = getHubCoordinationCopy(locale);
  const activeCount = HUB_OVERVIEW.lanes.reduce((sum, lane) => sum + lane.count, 0);
  const urgentCount = HUB_OVERVIEW.alerts.filter((alert) => alert.severity === "high").length;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <BrandLockup subtitle={copy.screenTitle} />
          <p className={styles.kicker}>HUB COORDINATION</p>
          <h1 className={styles.title}>{copy.screenTitle}</h1>
          <p className={styles.subtitle}>{copy.screenSubtitle}</p>
        </div>
        <div className={styles.heroMeta}>
          <div className={styles.heroChip}>
            <span className={styles.heroChipValue}>{activeCount}</span>
            <span className={styles.heroChipLabel}>Active lots</span>
          </div>
          <div className={styles.heroChip}>
            <span className={styles.heroChipValue}>{urgentCount}</span>
            <span className={styles.heroChipLabel}>Urgent alerts</span>
          </div>
        </div>
      </header>

      <section className={styles.metricStrip}>
        {HUB_OVERVIEW.lanes.map((lane) => (
          <article key={lane.key} className={styles.metricCard}>
            <p className={styles.metricLabel}>{copy.lanes[lane.key]}</p>
            <div className={styles.metricValueRow}>
              <strong className={styles.metricValue}>{lane.count}</strong>
              {lane.urgentCount ? <span className={styles.metricBadge}>{lane.urgentCount} urgent</span> : null}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.board}>
        <div className={styles.laneColumn}>
          {HUB_OVERVIEW.lanes.map((lane) => {
            const href = getHubLaneHref(lane.key);

            return href ? (
              <Link key={lane.key} href={href} className={styles.laneCard}>
                <div className={styles.laneHeader}>
                  <h2 className={styles.laneTitle}>{copy.lanes[lane.key]}</h2>
                  {(lane.urgentCount ?? 0) > 0 ? (
                    <span className={styles.urgentBadge}>
                      {lane.urgentCount} {copy.labels.urgent}
                    </span>
                  ) : null}
                </div>
                <p className={styles.laneCount}>
                  {lane.count} <span className={styles.metaText}>{copy.labels.items}</span>
                </p>
              </Link>
            ) : (
              <article key={lane.key} className={styles.laneCardStatic}>
                <div className={styles.laneHeader}>
                  <h2 className={styles.laneTitle}>{copy.lanes[lane.key]}</h2>
                  <span className={styles.mobileOnlyBadge}>{copy.labels.mobileOnly}</span>
                </div>
                <p className={styles.laneCount}>
                  {lane.count} <span className={styles.metaText}>{copy.labels.items}</span>
                </p>
              </article>
            );
          })}
        </div>

        <aside className={styles.alertRail}>
          <h2 className={styles.sectionTitle}>{copy.labels.alerts}</h2>
          <div className={styles.alertList}>
            {HUB_OVERVIEW.alerts.map((alert) => (
              <article
                key={alert.id}
                className={alert.severity === "high" ? styles.alertHigh : styles.alertMedium}
              >
                <p className={styles.alertText}>{alert.label}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

export default function HubWorkspacePage() {
  const { locale } = useBrowserLocale();
  return <HubWorkspaceView locale={locale} />;
}
