"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock3,
  Landmark,
  Plus,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import type {
  Locale,
  SellerSupplyListing,
  SellerSupplyListResponse,
  SellerSupplyStatus,
} from "@fosholhaat/types";
import { apiFetch, apiPatch } from "../../../lib/api-client";
import {
  getWebSellerSupplyCopy,
  formatSellerMoney,
  SELLER_SUPPLY_LISTINGS,
} from "./supply-data";
import styles from "./supply.module.css";

function metricValue(metricKey: "active" | "readyToday" | "dwrOpen") {
  void metricKey;
  return 0;
}

function stockPercent(status: string) {
  if (status === "active") return 84;
  if (status === "scheduled") return 62;
  if (status === "low-stock") return 28;
  return 16;
}

function ProductIcon({ type }: { type: string }) {
  if (type === "potato") {
    return (
      <svg
        className={styles.supplyProductIcon}
        viewBox="0 0 120 80"
        aria-hidden="true"
      >
        <ellipse cx="43" cy="44" rx="24" ry="18" fill="#b98a52" />
        <ellipse cx="69" cy="38" rx="27" ry="20" fill="#c99a5f" />
        <ellipse cx="78" cy="52" rx="18" ry="13" fill="#a8743f" />
        <circle cx="36" cy="40" r="2.5" fill="#6b4a2d" />
        <circle cx="62" cy="33" r="2.5" fill="#6b4a2d" />
      </svg>
    );
  }
  if (type === "onion") {
    return (
      <svg
        className={styles.supplyProductIcon}
        viewBox="0 0 120 80"
        aria-hidden="true"
      >
        <path
          d="M61 14c10 9 25 22 25 39 0 15-11 24-26 24S34 68 34 53c0-17 17-31 27-39Z"
          fill="#d8b0cf"
        />
        <path
          d="M61 14c-4 17-5 42 0 61"
          fill="none"
          stroke="#8d5b8c"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M58 16c-7-7-8-13-5-15 5 4 8 8 8 14 4-8 10-12 17-13-1 9-8 14-18 16Z"
          fill="#2f7d50"
        />
      </svg>
    );
  }
  return (
    <svg
      className={styles.supplyProductIcon}
      viewBox="0 0 120 80"
      aria-hidden="true"
    >
      <path d="M48 20c18 2 32 15 34 34-19 0-34-13-34-34Z" fill="#3f8f5b" />
      <path d="M72 18c11 9 16 22 13 38-14-7-21-21-13-38Z" fill="#62a96b" />
      <path
        d="M42 26c-7 2-11 7-12 15l14 28 13-4-6-31c-2-6-4-8-9-8Z"
        fill="#e98536"
      />
    </svg>
  );
}

function draftFromListing(listing: SellerSupplyListing) {
  return {
    quantity: String(listing.quantity),
    gradeLabel: listing.gradeLabel,
    askingPrice: String(listing.askingPrice),
    status: listing.status,
    photoUrls: listing.photoUrls ?? [],
    singleBuyEnabled: listing.singleBuyEnabled !== false,
    groupBuyEnabled: listing.groupBuyEnabled === true,
    singleMinQty: String(listing.singleMinQty ?? 1),
    singleMaxQty: String(listing.singleMaxQty ?? listing.quantity),
    groupTargetQty: String(listing.groupTargetQty ?? listing.quantity),
    groupMinQty: String(listing.groupMinQty ?? 1),
    groupMaxQty: String(listing.groupMaxQty ?? listing.groupTargetQty ?? listing.quantity),
    groupPrice: String(
      listing.groupPrice ?? Math.max(1, Math.floor(listing.askingPrice * 0.95)),
    ),
  };
}

function compressPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Photo could not be read"));
    reader.onload = () => {
      image.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas
          .getContext("2d")
          ?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => reject(new Error("Photo could not be loaded"));
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function SellerSupplyListView({
  locale,
  mode = "supply",
}: {
  locale: Locale;
  mode?: "workspace" | "supply";
}) {
  const copy = getWebSellerSupplyCopy(locale);
  const [liveSupply, setLiveSupply] = useState<SellerSupplyListResponse | null>(
    null,
  );
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({
    quantity: "",
    gradeLabel: "",
    askingPrice: "",
    status: "active" as SellerSupplyStatus,
    photoUrls: [] as string[],
    singleBuyEnabled: true,
    groupBuyEnabled: false,
    singleMinQty: "1",
    singleMaxQty: "",
    groupTargetQty: "",
    groupMinQty: "1",
    groupMaxQty: "",
    groupPrice: "",
  });
  const [readingUpdatePhotos, setReadingUpdatePhotos] = useState(false);
  const title = mode === "workspace" ? copy.workspaceTitle : copy.supplyTitle;
  const subtitle =
    mode === "workspace" ? copy.workspaceSubtitle : copy.supplySubtitle;
  const listings =
    liveSupply?.listings ??
    (process.env.NODE_ENV === "test" ? SELLER_SUPPLY_LISTINGS : []);
  const listingCount = listings.length;

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return;
    apiFetch<SellerSupplyListResponse>("/api/seller/supply")
      .then(setLiveSupply)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function saveUpdate(listingId: string) {
    if (readingUpdatePhotos) {
      setError("Wait for photos to finish loading.");
      return;
    }
    setError("");
    try {
      const data = await apiPatch<{ listing: SellerSupplyListing }>(
        `/api/seller/supply/${listingId}`,
        {
          quantity: Number(draft.quantity),
          gradeLabel: draft.gradeLabel,
          askingPrice: Number(draft.askingPrice),
          status: draft.status,
          photoUrls: draft.photoUrls,
          singleBuyEnabled: draft.singleBuyEnabled,
          groupBuyEnabled: draft.groupBuyEnabled,
          singleMinQty: Number(draft.singleMinQty) || 1,
          singleMaxQty: Number(draft.singleMaxQty) || Number(draft.quantity),
          groupTargetQty: draft.groupBuyEnabled
            ? Number(draft.groupTargetQty) || Number(draft.quantity)
            : undefined,
          groupMinQty: draft.groupBuyEnabled
            ? Number(draft.groupMinQty) || 1
            : undefined,
          groupMaxQty:
            draft.groupBuyEnabled && draft.groupMaxQty
              ? Number(draft.groupMaxQty)
              : undefined,
          groupPrice: draft.groupBuyEnabled
            ? Number(draft.groupPrice) || undefined
            : undefined,
        },
      );
      if (draft.photoUrls.length && !data.listing.photoUrls?.length) {
        setError(
          "Photo was not saved by the API. Restart the API and try again.",
        );
        return;
      }
      setLiveSupply((current) =>
        current
          ? {
              ...current,
              listings: current.listings.map((item) =>
                item.id === listingId ? data.listing : item,
              ),
            }
          : current,
      );
      setEditingId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supply update failed");
    }
  }

  async function addDraftPhotos(files: FileList | null) {
    if (!files?.length) return;
    setReadingUpdatePhotos(true);
    try {
      const selected = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, 3);
      const urls = await Promise.all(selected.map(compressPhoto));
      setDraft((current) => ({
        ...current,
        photoUrls: [...current.photoUrls, ...urls].slice(0, 3),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setReadingUpdatePhotos(false);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.heroKicker}>Bogura to Dhaka seller lane</p>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSubtitle}>{subtitle}</p>
          </div>

          <div className={styles.heroActions}>
            {mode === "workspace" ? (
              <Link className={styles.secondaryAction} href="/seller/supply">
                {copy.supplyTitle}
              </Link>
            ) : null}
            <Link className={styles.primaryAction} href="/seller/supply/new">
              <Plus size={16} strokeWidth={2.4} />
              {copy.addSupply}
            </Link>
          </div>
        </section>

        <section
          className={styles.summaryCard}
          aria-label="Seller workspace summary"
        >
          <div className={styles.summaryTop}>
            <div className={styles.summaryChip}>
              <span className={styles.summaryChipDot} aria-hidden="true" />
              Operational summary
            </div>
            <div className={styles.summaryDate}>Live inventory lane</div>
          </div>

          <div className={styles.summaryStats}>
            {(["active", "readyToday", "dwrOpen"] as const).map((metric) => (
              <article key={metric} className={styles.summaryStat}>
                <p className={styles.summaryStatLabel}>
                  {copy.metrics[metric]}
                </p>
                <strong className={styles.summaryStatValue}>
                  {liveSupply?.workspace.metrics.find(
                    (item) => item.key === metric,
                  )?.value ?? metricValue(metric)}
                </strong>
                <p className={styles.summaryStatHint}>
                  {metric === "active"
                    ? "Open lots"
                    : metric === "readyToday"
                      ? "Can move today"
                      : "Linked records"}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workspaceGrid}>
          <section className={styles.listColumn} aria-label={copy.supplyTitle}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>{copy.supplyTitle}</h2>
                <p className={styles.sectionSubtitle}>
                  {listingCount} lots visible
                </p>
              </div>
            </div>

            <div className={styles.inventoryList}>
              {error ? <p className={styles.helperText}>{error}</p> : null}
              {listings.map((listing) => (
                <article key={listing.id} className={styles.supplyCard}>
                  <div className={styles.supplyTop}>
                    {listing.photoUrls?.[0] ? (
                      <img
                        className={styles.supplyPhoto}
                        src={listing.photoUrls[0]}
                        alt={listing.commodityLabel}
                      />
                    ) : (
                      <div
                        className={styles.supplyMedia}
                        aria-label="No saved supply photo"
                      >
                        <ProductIcon type={listing.commodity} />
                      </div>
                    )}
                    <div className={styles.supplyBody}>
                      <div className={styles.cardHeader}>
                        <strong className={styles.cardTitle}>
                          {listing.commodityLabel}
                        </strong>
                        <span className={styles.status}>
                          {copy.statuses[listing.status]}
                        </span>
                      </div>
                      <p className={styles.cardText}>
                        {copy.fields.quantity}: {listing.quantity}{" "}
                        {copy.units[listing.unit]} · {copy.fields.grade}:{" "}
                        {listing.gradeLabel}
                      </p>
                      {!listing.photoUrls?.length ? (
                        <p className={styles.photoMissing}>No photo saved</p>
                      ) : null}
                      <p className={styles.cardText}>
                        {listing.singleBuyEnabled !== false ? "Single buy" : ""}
                        {listing.singleBuyEnabled !== false &&
                        listing.groupBuyEnabled
                          ? " · "
                          : ""}
                        {listing.groupBuyEnabled
                          ? `Group target ${listing.groupTargetQty ?? listing.quantity} ${copy.units[listing.unit]} · min ${listing.groupMinQty ?? 1}`
                          : ""}
                      </p>
                      <div className={styles.progressTrack} aria-hidden="true">
                        <div
                          className={styles.progressFill}
                          style={{ width: `${stockPercent(listing.status)}%` }}
                        />
                      </div>
                      <div className={styles.cardFooter}>
                        <div>
                          <p className={styles.cardText}>{copy.fields.price}</p>
                          <strong className={styles.cardPrice}>
                            {formatSellerMoney(listing.askingPrice)}
                          </strong>
                        </div>
                        <div>
                          <p className={styles.cardText}>
                            {copy.fields.package}
                          </p>
                          <p className={styles.cardText}>
                            {listing.packageLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardLinkRow}>
                    {listing.dwrRecordId ? (
                      <Link
                        className={styles.secondaryAction}
                        href={`/seller/dwr/${listing.dwrRecordId}`}
                      >
                        {copy.viewDwr}
                      </Link>
                    ) : (
                      <span className={styles.disabledAction}>
                        Awaiting hub receipt
                      </span>
                    )}
                    <button
                      type="button"
                      className={styles.tertiaryButton}
                      onClick={() => {
                        setEditingId(listing.id);
                        setDraft(draftFromListing(listing));
                      }}
                    >
                      Update supply
                    </button>
                  </div>
                  {editingId === listing.id ? (
                    <div className={styles.updatePanel}>
                      <label className={styles.field}>
                        Quantity
                        <input
                          className={styles.input}
                          value={draft.quantity}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              quantity: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.field}>
                        Grade
                        <input
                          className={styles.input}
                          value={draft.gradeLabel}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              gradeLabel: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.field}>
                        Asking price
                        <input
                          className={styles.input}
                          value={draft.askingPrice}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              askingPrice: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.field}>
                        Status
                        <select
                          className={styles.select}
                          value={draft.status}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              status: event.target.value as SellerSupplyStatus,
                            }))
                          }
                        >
                          <option value="active">Active</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="paused">Paused</option>
                        </select>
                      </label>
                      <label className={styles.field}>
                        Photos
                        <input
                          className={styles.input}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) =>
                            void addDraftPhotos(event.target.files)
                          }
                        />
                        <span className={styles.helperText}>
                          {readingUpdatePhotos
                            ? "Preparing photos..."
                            : `${draft.photoUrls.length} photo saved in this update`}
                        </span>
                      </label>
                      <label className={styles.field}>
                        <input
                          type="checkbox"
                          checked={draft.singleBuyEnabled}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              singleBuyEnabled: event.target.checked,
                            }))
                          }
                        />
                        Single buy enabled
                      </label>
                      <label className={styles.field}>
                        <input
                          type="checkbox"
                          checked={draft.groupBuyEnabled}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              groupBuyEnabled: event.target.checked,
                            }))
                          }
                        />
                        Group buy enabled
                      </label>
                      {draft.singleBuyEnabled ? (
                        <div className={styles.inlineGrid}>
                          <label className={styles.field}>
                            Single min
                            <input
                              className={styles.input}
                              value={draft.singleMinQty}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  singleMinQty: event.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className={styles.field}>
                            Single max
                            <input
                              className={styles.input}
                              value={draft.singleMaxQty}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  singleMaxQty: event.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                      ) : null}
                      {draft.groupBuyEnabled ? (
                        <div className={styles.inlineGrid}>
                          <label className={styles.field}>
                            Group target
                            <input
                              className={styles.input}
                              value={draft.groupTargetQty}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  groupTargetQty: event.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className={styles.field}>
                            Group min
                            <input
                              className={styles.input}
                              value={draft.groupMinQty}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  groupMinQty: event.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className={styles.field}>
                            Group max
                            <input
                              className={styles.input}
                              value={draft.groupMaxQty}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  groupMaxQty: event.target.value,
                                }))
                              }
                            />
                          </label>
                          <label className={styles.field}>
                            Group price
                            <input
                              className={styles.input}
                              value={draft.groupPrice}
                              onChange={(event) =>
                                setDraft((current) => ({
                                  ...current,
                                  groupPrice: event.target.value,
                                }))
                              }
                            />
                          </label>
                        </div>
                      ) : null}
                      {draft.photoUrls.length ? (
                        <div className={styles.photoPreviewGrid}>
                          {draft.photoUrls.map((url, index) => (
                            <div
                              className={styles.photoPreview}
                              key={`${index}-${url.slice(0, 24)}`}
                            >
                              <img
                                src={url}
                                alt={`Supply photo ${index + 1}`}
                              />
                              <button
                                type="button"
                                className={styles.photoRemove}
                                onClick={() =>
                                  setDraft((current) => ({
                                    ...current,
                                    photoUrls: current.photoUrls.filter(
                                      (_, itemIndex) => itemIndex !== index,
                                    ),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <div className={styles.formActionRow}>
                        <button
                          type="button"
                          className={styles.button}
                          disabled={readingUpdatePhotos}
                          onClick={() => void saveUpdate(listing.id)}
                        >
                          Save update
                        </button>
                        <button
                          type="button"
                          className={styles.tertiaryButton}
                          onClick={() => setEditingId("")}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.railColumn}>
            <section className={styles.supportCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Supply actions</h3>
                <Warehouse
                  size={17}
                  strokeWidth={2.2}
                  className={styles.railIcon}
                />
              </div>
              <div className={styles.actionGrid}>
                <Link className={styles.actionTile} href="/seller/orders">
                  <Truck size={18} strokeWidth={2.2} />
                  Orders
                </Link>
                <Link className={styles.actionTile} href="/seller/dwr">
                  <Clock3 size={18} strokeWidth={2.2} />
                  DWR records
                </Link>
              </div>
            </section>

            <section className={styles.supportCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Pending hub receipts</h3>
                <Clock3
                  size={17}
                  strokeWidth={2.2}
                  className={styles.railIcon}
                />
              </div>
              <div className={styles.supportList}>
                {listings.slice(0, 2).map((listing) => (
                  <article key={listing.id} className={styles.supportItem}>
                    <div>
                      <p className={styles.supportItemTitle}>
                        {listing.commodityLabel}
                      </p>
                      <p className={styles.supportItemMeta}>
                        {listing.stockHint}
                      </p>
                    </div>
                    <span className={styles.status}>
                      {copy.statuses[listing.status]}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.supportCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Settlement context</h3>
                <Landmark
                  size={17}
                  strokeWidth={2.2}
                  className={styles.railIcon}
                />
              </div>
              <p className={styles.supportBody}>
                Track the linked DWR and payout context without leaving the
                seller lane.
              </p>
              <div className={styles.supportAccent}>
                <ShieldCheck size={18} strokeWidth={2.2} />
                <span>Trusted supply record</span>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
