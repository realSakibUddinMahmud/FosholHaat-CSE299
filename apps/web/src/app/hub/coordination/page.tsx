"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ClipboardCheck, QrCode, Users } from "lucide-react";
import { getHubCoordinationCopy, type HubCoordinationResponse, type HubLaneKey, type HubReceiveHandoffResponse } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../lib/api-client";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../ops.module.css";

const EMPTY: HubCoordinationResponse = {
  lanes: [
    { key: "inbound", count: 0, urgentCount: 0 },
    { key: "sorting", count: 0, urgentCount: 0 },
    { key: "dispatch", count: 0, urgentCount: 0 },
    { key: "exceptions", count: 0, urgentCount: 0 },
  ],
  alerts: [],
};

export default function HubCoordinationPage() {
  const { locale } = useBrowserLocale();
  const copy = getHubCoordinationCopy(locale);
  const [overview, setOverview] = useState<HubCoordinationResponse>(EMPTY);
  const [laneKey, setLaneKey] = useState<HubLaneKey>("inbound");
  const [assigneeId, setAssigneeId] = useState("");
  const [handoffCode, setHandoffCode] = useState("");
  const [sealCode, setSealCode] = useState("");
  const [message, setMessage] = useState("");

  const refresh = () => apiFetch<HubCoordinationResponse>("/api/hub/coordination").then(setOverview).catch(() => undefined);
  useEffect(() => { refresh(); }, []);

  const assign = async (event: FormEvent) => {
    event.preventDefault();
    const result = await apiPost<{ message: string }>("/api/hub/coordination/assignments", { laneKey, assigneeId });
    setMessage(result.message);
    setAssigneeId("");
  };
  const receive = async (event: FormEvent) => {
    event.preventDefault();
    const result = await apiPost<HubReceiveHandoffResponse>("/api/hub/coordination/handoffs/receive", { handoffCode, sealCode });
    setMessage(`${result.orderCode}: ${result.message}`);
    setHandoffCode("");
    setSealCode("");
    await refresh();
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.kicker}>Fulfillment command</div>
          <h1 className={styles.title}>{copy.screenTitle}</h1>
          <p className={styles.subtitle}>{copy.screenSubtitle}</p>
        </div>
        <span className={styles.chip}>{overview.alerts.length} alerts</span>
      </section>

      <section className={styles.stats}>
        {overview.lanes.map((lane) => <article key={lane.key} className={styles.stat}><span className={styles.label}>{copy.lanes[lane.key]}</span><strong>{lane.count}</strong><p className={styles.muted}>{lane.urgentCount ?? 0} urgent</p></article>)}
      </section>

      <section className={styles.grid}>
        <form className={styles.detail} onSubmit={receive}>
          <div className={styles.detailHead}><div><h2 className={styles.detailTitle}>QR + seal receiving</h2><p className={styles.detailSub}>Scan seller handoff and verify seal before hub receipt.</p></div><QrCode /></div>
          <div className={styles.fieldRow}>
            <input className={styles.input} value={handoffCode} onChange={(event) => setHandoffCode(event.target.value)} placeholder="Handoff code" required />
            <input className={styles.input} value={sealCode} onChange={(event) => setSealCode(event.target.value)} placeholder="Seal code" required />
          </div>
          <button className={styles.primary} type="submit"><BadgeCheck size={16} /> Receive handoff</button>
          {message ? <p className={styles.muted}>{message}</p> : null}
        </form>

        <aside className={styles.side}>
          <form onSubmit={assign}>
            <div className={styles.detailHead}><div><h2 className={styles.detailTitle}>{copy.labels.assign}</h2><p className={styles.detailSub}>Assign ownership for the next operational lane.</p></div><Users /></div>
            <div className={styles.fieldRow}>
              <select className={styles.input} value={laneKey} onChange={(event) => setLaneKey(event.target.value as HubLaneKey)}>
                {overview.lanes.map((lane) => <option key={lane.key} value={lane.key}>{copy.lanes[lane.key]}</option>)}
              </select>
              <input className={styles.input} value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} placeholder={copy.labels.assignee} required />
            </div>
            <button className={styles.secondary} type="submit"><ClipboardCheck size={16} /> {copy.labels.save}</button>
          </form>
          <div className={styles.timeline}>
            {overview.alerts.length ? overview.alerts.map((alert) => <Link key={alert.id} href="/hub/exceptions" className={styles.event}><strong>{alert.label}</strong><p className={styles.muted}>{alert.severity}</p></Link>) : <div className={styles.event}><strong>{copy.emptyState.title}</strong><p className={styles.muted}>{copy.emptyState.body}</p></div>}
          </div>
        </aside>
      </section>
    </main>
  );
}
