"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getHubExceptionCopy, type HubExceptionDetail } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import { useBrowserLocale } from "../../../../lib/locale";
import styles from "../../ops.module.css";

export default function HubExceptionDetailPage() {
  const { locale } = useBrowserLocale();
  const copy = getHubExceptionCopy(locale);
  const params = useParams<{ exceptionId: string }>();
  const [exception, setException] = useState<HubExceptionDetail | null>(null);
  const refresh = useCallback(() => apiFetch<{ exception: HubExceptionDetail }>(`/api/hub/exceptions/${params.exceptionId}`).then((data) => setException(data.exception)).catch(() => setException(null)), [params.exceptionId]);
  useEffect(() => { refresh(); }, [refresh]);
  const mutate = async (action: "resolve" | "escalate") => { await apiPost(`/api/hub/exceptions/${params.exceptionId}/${action}`, action === "resolve" ? { note: "Resolved from hub workspace" } : { targetOwner: "hub-manager" }); await refresh(); };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div><div className={styles.kicker}>Exception detail</div><h1 className={styles.title}>{exception?.title ?? copy.detailNotFoundTitle}</h1><p className={styles.subtitle}>{exception?.description ?? copy.detailNotFoundBody}</p></div>
        <Link className={styles.secondary} href="/hub/exceptions">{copy.backToList}</Link>
      </section>
      <section className={styles.detail}>
        {exception ? (
          <>
            <div className={styles.detailHead}><div><h2 className={styles.detailTitle}>{exception.exceptionId}</h2><p className={styles.detailSub}>{exception.lotLabel} · {exception.laneLabel}</p></div><ShieldAlert /></div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}><span className={styles.label}>{copy.source}</span><div className={styles.value}>{exception.sourceLabel}</div></div>
              <div className={styles.field}><span className={styles.label}>{copy.buyerVisibility}</span><div className={styles.value}>{exception.buyerVisibilityLabel}</div></div>
              <div className={styles.field}><span className={styles.label}>Next action</span><div className={styles.value}>{exception.nextActionLabel}</div></div>
            </div>
            <div className={styles.actions}><button className={styles.primary} type="button" onClick={() => mutate("resolve")}>{copy.actionLabels.resolve}</button><button className={styles.secondary} type="button" onClick={() => mutate("escalate")}>{copy.actionLabels.escalate}</button></div>
          </>
        ) : <div className={styles.empty}><div><h3>{copy.detailNotFoundTitle}</h3><p>{copy.detailNotFoundBody}</p></div></div>}
      </section>
    </main>
  );
}
