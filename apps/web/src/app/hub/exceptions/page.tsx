"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { getHubExceptionCopy, HUB_EXCEPTION_STATUS_TABS, type HubExceptionDetail, type HubExceptionListResponse, type HubExceptionStatusTab } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../lib/api-client";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../ops.module.css";

const EMPTY: HubExceptionListResponse = { summary: { active: 0, "waiting-review": 0, resolved: 0, total: 0 }, featuredExceptionId: "", activeTab: "active", exceptions: [] };

export default function HubExceptionManagementWeb() {
  const { locale } = useBrowserLocale();
  const copy = getHubExceptionCopy(locale);
  const [list, setList] = useState<HubExceptionListResponse>(EMPTY);
  const [details, setDetails] = useState<Record<string, HubExceptionDetail>>({});
  const [activeTab, setActiveTab] = useState<HubExceptionStatusTab>("active");
  const [selectedId, setSelectedId] = useState("");

  const load = () => apiFetch<HubExceptionListResponse>("/api/hub/exceptions").then(async (data) => {
    setList(data);
    setActiveTab(data.activeTab);
    setSelectedId(data.featuredExceptionId);
    const entries = await Promise.all(data.exceptions.map(async (item) => {
      const detail = await apiFetch<{ exception: HubExceptionDetail }>(`/api/hub/exceptions/${item.exceptionId}`);
      return [item.exceptionId, detail.exception] as const;
    }));
    setDetails(Object.fromEntries(entries));
  });
  useEffect(() => { load().catch(() => undefined); }, []);
  const items = useMemo(() => list.exceptions.filter((item) => item.statusTab === activeTab), [activeTab, list.exceptions]);
  const selected = selectedId ? details[selectedId] : null;
  const mutate = async (action: "resolve" | "escalate") => {
    if (!selectedId) return;
    await apiPost(`/api/hub/exceptions/${selectedId}/${action}`, action === "resolve" ? { note: "Resolved from hub workspace" } : { targetOwner: "hub-manager" });
    await load();
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.kicker}>Exception control</div>
          <h1 className={styles.title}>{copy.screenTitle}</h1>
          <p className={styles.subtitle}>Track discrepancy source, buyer impact, and resolution ownership.</p>
        </div>
        <span className={styles.chip}>{list.summary.total} total</span>
      </section>

      <section className={styles.stats}>
        {HUB_EXCEPTION_STATUS_TABS.map((tab) => <article key={tab} className={styles.stat}><span className={styles.label}>{copy.tabs[tab]}</span><strong>{list.summary[tab]}</strong></article>)}
      </section>

      <section className={styles.grid}>
        <aside>
          <div className={styles.tabs}>{HUB_EXCEPTION_STATUS_TABS.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}>{copy.tabs[tab]}</button>)}</div>
          <div className={styles.list}>
            {items.map((item) => <button key={item.exceptionId} type="button" onClick={() => setSelectedId(item.exceptionId)} className={`${styles.card} ${styles.buttonCard} ${selectedId === item.exceptionId ? styles.selected : ""}`}><div className={styles.cardTop}><span className={styles.meta}>{item.exceptionId}</span><span className={styles.pill}>{copy.severityLabels[item.severity]}</span></div><div className={styles.cardTitle}>{item.title}</div><p className={styles.muted}>{item.lotLabel} · {item.laneLabel}</p></button>)}
            {!items.length ? <div className={styles.empty}><div><CheckCircle2 size={28} /><h3>{copy.listEmptyTitle}</h3><p>{copy.listEmptyBody}</p></div></div> : null}
          </div>
        </aside>

        <section className={styles.detail}>
          {selected ? (
            <>
              <div className={styles.detailHead}><div><h2 className={styles.detailTitle}>{selected.title}</h2><p className={styles.detailSub}>{selected.description}</p></div><ShieldAlert /></div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}><span className={styles.label}>{copy.source}</span><div className={styles.value}>{selected.sourceLabel}</div></div>
                <div className={styles.field}><span className={styles.label}>{copy.buyerVisibility}</span><div className={styles.value}>{selected.buyerVisibilityLabel}</div></div>
                <div className={styles.field}><span className={styles.label}>Next action</span><div className={styles.value}>{selected.nextActionLabel}</div></div>
              </div>
              <div className={styles.timeline}>{selected.timeline.map((event) => <div key={event.id} className={styles.event}><strong>{event.label}</strong><p className={styles.muted}>{event.timeLabel}</p></div>)}</div>
              <div className={styles.actions}>
                <button type="button" className={styles.primary} onClick={() => mutate("resolve")}>{copy.actionLabels.resolve}</button>
                <button type="button" className={styles.secondary} onClick={() => mutate("escalate")}>{copy.actionLabels.escalate}</button>
              </div>
            </>
          ) : (
            <div className={styles.empty}><div><AlertTriangle size={28} /><h3>{copy.detailNotFoundTitle}</h3><p>{copy.detailNotFoundBody}</p></div></div>
          )}
        </section>
      </section>
    </main>
  );
}
