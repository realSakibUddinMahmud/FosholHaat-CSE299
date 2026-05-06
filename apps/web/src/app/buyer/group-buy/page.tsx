"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock, Search, Users } from "lucide-react";
import type { GroupBuySummary, JoinGroupBuyResponse } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../lib/api-client";
import styles from "./group-buy.module.css";

const CATEGORY_IMAGES: Record<string, string> = {
  potato: "/images/potato.png",
  onion: "/images/onion.png",
  vegetables: "/images/vegetables.png",
};

export default function GroupBuyPage() {
  const [groupBuys, setGroupBuys] = useState<GroupBuySummary[]>([]);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState<string | null>(null);
  const [joinResult, setJoinResult] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<GroupBuySummary[]>("/api/buyer/group-buys")
      .then(setGroupBuys)
      .catch((err: Error) => setError(err.message));
  }, []);

  const handleJoin = async (gbId: string) => {
    setJoining(gbId);
    setJoinResult(null);
    try {
      const result = await apiPost<JoinGroupBuyResponse>(`/api/buyer/group-buys/${gbId}/join`, { quantity: 10 });
      setJoinResult(result.message || "Joined!");
      // Refresh data
      const updated = await apiFetch<GroupBuySummary[]>("/api/buyer/group-buys");
      setGroupBuys(updated);
    } catch (err: unknown) {
      setJoinResult(err instanceof Error ? err.message : "Failed to join");
    } finally {
      setJoining(null);
    }
  };

  function getTimeLeft(deadline: string) {
    const ms = new Date(deadline).getTime() - Date.now();
    if (ms <= 0) return "Ended";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Group-Buy Opportunities</h1>
        <p className={styles.subtitle}>Join group buys to unlock wholesale pricing. More participants = bigger savings for everyone.</p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={16} />
          <input type="search" className={styles.searchInput} placeholder="Search group-buys..." />
        </div>
        <div className={styles.filterBtns}>
          <button type="button" className={styles.filterBtnActive}>Ending Soon ▾</button>
          <button type="button" className={styles.filterBtn}>Highest Savings ▾</button>
          <button type="button" className={styles.filterBtn}>Popular</button>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {joinResult ? <p className={styles.joinBanner}>{joinResult}</p> : null}

      <div className={styles.grid}>
        {groupBuys.map((gb) => {
          const percent = gb.targetQuantity > 0 ? Math.round((gb.currentQuantity / gb.targetQuantity) * 100) : 0;
          const savings = gb.unitPrice - gb.groupPrice;
          const imgSrc = gb.productImage || CATEGORY_IMAGES[gb.productId] || "/images/vegetables.png";
          const timeLeft = getTimeLeft(gb.deadline);

          return (
            <article key={gb.id} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <Image
                  src={imgSrc}
                  alt={gb.productName?.en || "Product"}
                  fill
                  sizes="(max-width: 600px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                />
                <span className={styles.liveBadge}>● LIVE</span>
                <span className={styles.timeBadge}>
                  <Clock size={12} /> Ends in: {timeLeft}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTitleRow}>
                  <h2 className={styles.cardTitle}>{gb.productName?.en || gb.productName?.bn || "Group Buy"}</h2>
                  <div className={styles.cardPricing}>
                    <span className={styles.groupPrice}>৳{gb.groupPrice}/{gb.unit?.en || "unit"}</span>
                    {savings > 0 ? <span className={styles.savingsBadge}>SAVE ৳{savings}</span> : null}
                  </div>
                </div>

                <div className={styles.progressSection}>
                  <div className={styles.progressMeta}>
                    <span className={styles.progressLabel}>
                      <Users size={14} /> {percent}% Filled
                    </span>
                    <span className={styles.progressTarget}>Target: {gb.targetQuantity} {gb.unit?.en || "units"}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>

                <Link
                  href={`/buyer/group-buy/${gb.id}`}
                  className={styles.joinBtn}
                >
                  View Opportunity →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {!groupBuys.length && !error ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No Active Group Buys</h3>
          <p className={styles.emptyDesc}>Check back soon — new group buying opportunities are added regularly.</p>
          <Link href="/buyer" className={styles.emptyBtn}>Browse Marketplace</Link>
        </div>
      ) : null}
    </main>
  );
}
