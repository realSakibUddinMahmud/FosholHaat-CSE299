"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import type { GroupBuyDetail, JoinGroupBuyResponse } from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import styles from "./detail.module.css";

const CATEGORY_IMAGES: Record<string, string> = {
  potato: "/images/potato.png",
  onion: "/images/onion.png",
  vegetables: "/images/vegetables.png",
};

export default function GroupBuyDetailPage() {
  const params = useParams<{ groupBuyId: string }>();
  const router = useRouter();
  const groupBuyId = params.groupBuyId;

  const [detail, setDetail] = useState<GroupBuyDetail | null>(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [joining, setJoining] = useState(false);
  const [joinResult, setJoinResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    apiFetch<GroupBuyDetail>(`/api/buyer/group-buys/${groupBuyId}`)
      .then((d) => {
        setDetail(d);
        setQuantity(d.minimumJoinQuantity || 10);
      })
      .catch((err: Error) => setError(err.message));
  }, [groupBuyId]);

  const handleJoin = async () => {
    setJoining(true);
    setJoinResult(null);
    try {
      const result = await apiPost<JoinGroupBuyResponse>(
        `/api/buyer/group-buys/${groupBuyId}/join`,
        { quantity }
      );
      setJoinResult({ success: result.success, message: result.message || "Successfully joined!" });
      // Refresh detail to get updated committed qty
      const updated = await apiFetch<GroupBuyDetail>(`/api/buyer/group-buys/${groupBuyId}`);
      setDetail(updated);
    } catch (err: unknown) {
      setJoinResult({ success: false, message: err instanceof Error ? err.message : "Failed to join" });
    } finally {
      setJoining(false);
    }
  };

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <h1>Group Buy Not Found</h1>
          <p>{error}</p>
          <Link href="/buyer/group-buy" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Group Buys
          </Link>
        </div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className={styles.page}>
        <p className={styles.loadingText}>Loading group buy details...</p>
      </main>
    );
  }

  const percent = detail.targetQuantity > 0 ? Math.round((detail.currentQuantity / detail.targetQuantity) * 100) : 0;
  const savings = detail.unitPrice - detail.groupPrice;
  const remaining = Math.max(0, detail.targetQuantity - detail.currentQuantity);
  const productSlug = detail.productId?.replace(/-/g, "") || "";
  const imgSrc = CATEGORY_IMAGES[productSlug] || CATEGORY_IMAGES["potato"] || "/images/potato.png";

  function getTimeLeft(deadline: string) {
    const ms = new Date(deadline).getTime() - Date.now();
    if (ms <= 0) return "Ended";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  }

  const minQty = detail.minimumJoinQuantity || 1;
  const maxQty = detail.maximumJoinQuantity || detail.targetQuantity;

  return (
    <main className={styles.page}>
      <Link href="/buyer/group-buy" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Group Buys
      </Link>

      <div className={styles.layout}>
        {/* ─── Left: Image ─── */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrap}>
            <Image
              src={imgSrc}
              alt={detail.productName?.en || "Product"}
              fill
              sizes="600px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className={styles.badgeRow}>
            <span className={styles.verifiedBadge}>
              <ShieldCheck size={14} /> VERIFIED SELLER
            </span>
            <span className={styles.qualityBadge}>QUALITY GUARANTEED</span>
          </div>
        </div>

        {/* ─── Right: Details ─── */}
        <div className={styles.detailSection}>
          <h1 className={styles.productName}>
            {detail.productName?.en || detail.productName?.bn || "Group Buy"}
          </h1>

          {detail.description?.en && (
            <p className={styles.description}>{detail.description.en}</p>
          )}

          {/* Pricing row */}
          <div className={styles.pricingRow}>
            <div className={styles.priceMain}>
              <span className={styles.groupPriceValue}>৳{detail.groupPrice}</span>
              <span className={styles.priceUnit}>/{detail.unit?.en || "unit"}</span>
            </div>
            <div className={styles.priceMeta}>
              <span className={styles.originalPrice}>৳{detail.unitPrice}</span>
              {savings > 0 && <span className={styles.savingsBadge}>Save ৳{savings}</span>}
            </div>
            <span className={styles.timeLeftBadge}>
              <Clock size={14} /> {getTimeLeft(detail.deadline)}
            </span>
          </div>

          {/* Status Card */}
          <div className={styles.statusCard}>
            <div className={styles.statusRow}>
              <div>
                <span className={styles.statusLabel}>CURRENT STATUS</span>
                <span className={styles.participantCount}>
                  {detail.participantCount} Participants
                </span>
              </div>
              <div className={styles.statusRight}>
                <span className={styles.percentValue}>{percent}%</span>
                <span className={styles.committedLabel}>Committed</span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <div className={styles.progressDetails}>
              <span>Goal: {detail.targetQuantity} {detail.unit?.en || "units"}</span>
              <span>{remaining} {detail.unit?.en || "units"} to go</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className={styles.quantitySection}>
            <div>
              <span className={styles.quantityLabel}>ORDER QUANTITY</span>
              <span className={styles.quantityHint}>Min {minQty} {detail.unit?.en || "units"}</span>
            </div>
            <div className={styles.quantityControls}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(minQty, q - minQty))}
                disabled={quantity <= minQty}
              >
                <Minus size={16} />
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + minQty))}
                disabled={quantity >= maxQty}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Join Result Banner */}
          {joinResult && (
            <div className={`${styles.resultBanner} ${joinResult.success ? styles.resultSuccess : styles.resultError}`}>
              {joinResult.message}
            </div>
          )}

          {/* Join Button */}
          <button
            type="button"
            className={styles.joinBtn}
            onClick={handleJoin}
            disabled={joining || detail.status !== "ACTIVE"}
          >
            {joining ? "Joining..." : "Join Group Buy →"}
          </button>

          {/* How it works */}
          <div className={styles.howItWorks}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <div>
                <h4 className={styles.stepTitle}>Commit Your Quantity</h4>
                <p className={styles.stepDesc}>Select how many {detail.unit?.en || "units"} you need and join the group.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <div>
                <h4 className={styles.stepTitle}>Goal Achievement</h4>
                <p className={styles.stepDesc}>Once {detail.targetQuantity} {detail.unit?.en || "units"} are reached, the price is locked in for everyone.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <div>
                <h4 className={styles.stepTitle}>Direct Delivery</h4>
                <p className={styles.stepDesc}>Products are sourced from the farm and delivered to your shop.</p>
              </div>
            </div>
          </div>

          {/* Seller info */}
          {detail.sellerName && (
            <div className={styles.sellerInfo}>
              <Truck size={16} />
              <span>Supplied by <strong>{detail.sellerName}</strong></span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
