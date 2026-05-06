"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PackageCheck, Truck } from "lucide-react";
import { getHubDispatchCopy, type HubDispatchLoadDetail } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import { useBrowserLocale } from "../../../../lib/locale";
import styles from "../../ops.module.css";

export default function HubDispatchDetailPage() {
  const { locale } = useBrowserLocale();
  const copy = getHubDispatchCopy(locale);
  const params = useParams<{ loadId: string }>();
  const [load, setLoad] = useState<HubDispatchLoadDetail | null>(null);
  const [missing, setMissing] = useState(false);
  const refresh = useCallback(() => apiFetch<{ load: HubDispatchLoadDetail }>(`/api/hub/dispatch/${params.loadId}`).then((data) => { setLoad(data.load); setMissing(false); }).catch(() => setMissing(true)), [params.loadId]);
  useEffect(() => { refresh(); }, [refresh]);
  const mutate = async (path: string) => { await apiPost(path); await refresh(); };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.kicker}>Dispatch manifest</div>
          <h1 className={styles.title}>{load?.routeName ?? copy.detailNotFoundTitle}</h1>
          <p className={styles.subtitle}>{load?.corridor ?? copy.detailNotFoundBody}</p>
        </div>
        <Link href="/hub/dispatch" className={styles.secondary}>{copy.backToQueue}</Link>
      </section>
      <section className={styles.detail}>
        {load && !missing ? (
          <>
            <div className={styles.detailHead}>
              <div><h2 className={styles.detailTitle}>{load.loadId}</h2><p className={styles.detailSub}>{load.loadingBay} · {load.vehicleId}</p></div>
              <span className={styles.pill}>{copy.statuses[load.status]}</span>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}><span className={styles.label}>{copy.readiness}</span><div className={styles.value}>{load.metric.readinessPercent}%</div></div>
              <div className={styles.field}><span className={styles.label}>{copy.gateAssignment}</span><div className={styles.value}>{load.assignee ?? copy.assignmentStates.unassigned}</div></div>
              <div className={styles.field}><span className={styles.label}>{copy.stagingNote}</span><div className={styles.value}>{load.note}</div></div>
            </div>
            <div className={styles.timeline}>{load.manifest.map((item) => <div key={`${item.lotLabel}-${item.productLabel}`} className={styles.event}><strong>{item.productLabel}</strong><p className={styles.muted}>{item.lotLabel} · {item.quantityLabel} · {item.verificationLabel}</p></div>)}</div>
            <div className={styles.actions}>
              <button className={styles.secondary} type="button" onClick={() => mutate(`/api/hub/dispatch/${load.loadId}/assign`)}><Truck size={16} /> {copy.assignLoad}</button>
              <button className={styles.primary} type="button" onClick={() => mutate(`/api/hub/dispatch/${load.loadId}/dispatched`)}><PackageCheck size={16} /> {copy.releaseDispatch}</button>
            </div>
          </>
        ) : (
          <div className={styles.empty}><div><h3>{copy.detailNotFoundTitle}</h3><p>{copy.detailNotFoundBody}</p></div></div>
        )}
      </section>
    </main>
  );
}
