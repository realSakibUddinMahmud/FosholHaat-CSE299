"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, PackageCheck, Truck } from "lucide-react";
import { getHubDispatchCopy, HUB_DISPATCH_LOAD_STATUSES, type HubDispatchLoadDetail, type HubDispatchLoadStatus, type HubDispatchQueueResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../lib/locale";
import { apiFetch, apiPost } from "../../../lib/api-client";
import styles from "../ops.module.css";

const EMPTY: HubDispatchQueueResponse = { summary: { staging: 0, ready: 0, departed: 0, total: 0 }, loads: [], featuredLoadId: "", activeTab: "staging" };

function statusTone(status: HubDispatchLoadStatus) {
  if (status === "ready") return "Ready";
  if (status === "departed") return "Departed";
  return "Staging";
}

export default function HubDispatchPage() {
  const { locale } = useBrowserLocale();
  const copy = getHubDispatchCopy(locale);
  const [queue, setQueue] = useState<HubDispatchQueueResponse>(EMPTY);
  const [details, setDetails] = useState<Record<string, HubDispatchLoadDetail>>({});
  const [tab, setTab] = useState<HubDispatchLoadStatus>("staging");
  const selectedId = queue.featuredLoadId || queue.loads[0]?.loadId || "";
  const selected = selectedId ? details[selectedId] : null;

  const load = () => apiFetch<HubDispatchQueueResponse>("/api/hub/dispatch").then(async (data) => {
    setQueue(data);
    setTab(data.activeTab);
    const entries = await Promise.all(data.loads.map(async (item) => {
      const detail = await apiFetch<{ load: HubDispatchLoadDetail }>(`/api/hub/dispatch/${item.loadId}`);
      return [item.loadId, detail.load] as const;
    }));
    setDetails(Object.fromEntries(entries));
  });

  useEffect(() => { load().catch(() => undefined); }, []);
  const loads = useMemo(() => queue.loads.filter((load) => load.status === tab), [queue.loads, tab]);
  const mutate = async (path: string) => { await apiPost(path); await load(); };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.kicker}>Dispatch control</div>
          <h1 className={styles.title}>{copy.screenTitle}</h1>
          <p className={styles.subtitle}>{copy.hubTitle} · {copy.subtitle}</p>
        </div>
        <div className={styles.heroStats}>
          <span className={styles.chip}>{queue.summary.total} loads</span>
          <span className={styles.chip}>{queue.summary.ready} ready</span>
        </div>
      </section>

      <section className={styles.stats}>
        {HUB_DISPATCH_LOAD_STATUSES.map((status) => (
          <article key={status} className={styles.stat}>
            <span className={styles.label}>{copy.tabs[status]}</span>
            <strong>{queue.summary[status]}</strong>
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <aside>
          <div className={styles.tabs}>
            {HUB_DISPATCH_LOAD_STATUSES.map((status) => (
              <button key={status} className={`${styles.tab} ${tab === status ? styles.tabActive : ""}`} onClick={() => setTab(status)} type="button">{copy.tabs[status]}</button>
            ))}
          </div>
          <div className={styles.list}>
            {loads.map((load) => (
              <Link key={load.loadId} href={`/hub/dispatch/${load.loadId}`} className={`${styles.card} ${load.loadId === selectedId ? styles.selected : ""}`}>
                <div className={styles.cardTop}>
                  <span className={styles.meta}>{load.loadId}</span>
                  <span className={styles.pill}>{statusTone(load.status)}</span>
                </div>
                <div className={styles.cardTitle}>{load.routeName}</div>
                <p className={styles.muted}>{load.parcelCount} parcels · {load.stopCount} stops · {load.assignmentState}</p>
              </Link>
            ))}
            {!loads.length ? <div className={styles.empty}><div><h3>{copy.queueEmptyTitle}</h3><p>{copy.queueEmptyBody}</p></div></div> : null}
          </div>
        </aside>

        <section className={styles.detail}>
          {selected ? (
            <>
              <div className={styles.detailHead}>
                <div><h2 className={styles.detailTitle}>{selected.routeName}</h2><p className={styles.detailSub}>{selected.corridor} · {selected.loadingBay}</p></div>
                <span className={styles.pill}>{copy.statuses[selected.status]}</span>
              </div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}><span className={styles.label}>{copy.metrics.staged}</span><div className={styles.value}>{selected.metric.stagedParcels}</div></div>
                <div className={styles.field}><span className={styles.label}>{copy.metrics.remaining}</span><div className={styles.value}>{selected.metric.remainingParcels}</div></div>
                <div className={styles.field}><span className={styles.label}>{copy.gateAssignment}</span><div className={styles.value}>{selected.assignee ?? "Unassigned"}</div></div>
              </div>
              <div className={styles.progress}><div className={styles.bar} style={{ width: `${selected.metric.readinessPercent}%` }} /></div>
              <div className={styles.timeline}>
                {selected.manifest.map((item) => <div key={`${item.lotLabel}-${item.productLabel}`} className={styles.event}><strong>{item.productLabel}</strong><p className={styles.muted}>{item.quantityLabel} · {item.verificationLabel}</p></div>)}
              </div>
              <div className={styles.actions}>
                <button className={styles.secondary} type="button" onClick={() => mutate(`/api/hub/dispatch/${selected.loadId}/assign`)}><Truck size={16} /> {copy.assignLoad}</button>
                <button className={styles.primary} type="button" onClick={() => mutate(`/api/hub/dispatch/${selected.loadId}/dispatched`)}><PackageCheck size={16} /> {copy.releaseDispatch}</button>
              </div>
            </>
          ) : (
            <div className={styles.empty}><div><PackageCheck size={28} /><h3>{copy.detailNotFoundTitle}</h3><p>{copy.detailNotFoundBody}</p><Link className={styles.secondary} href="/hub/coordination">Open coordination <ArrowRight size={14} /></Link></div></div>
          )}
        </section>
      </section>
    </main>
  );
}
