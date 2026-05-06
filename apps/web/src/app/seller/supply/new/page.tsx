"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Locale,
  SellerSupplyCommodity,
  SellerSupplyMutationResponse,
  SellerSupplyUnit,
} from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiPost } from "../../../../lib/api-client";
import { getWebSellerSupplyCopy } from "../supply-data";
import styles from "../supply.module.css";

type FormState = {
  commodity: SellerSupplyCommodity;
  quantity: string;
  unit: SellerSupplyUnit;
  gradeLabel: string;
  askingPrice: string;
  availableFrom: string;
  photoUrls: string[];
  singleBuyEnabled: boolean;
  groupBuyEnabled: boolean;
  singleMinQty: string;
  singleMaxQty: string;
  groupTargetQty: string;
  groupMinQty: string;
  groupMaxQty: string;
  groupDeadline: string;
  groupPrice: string;
};

const CATEGORIES: Array<{
  value: SellerSupplyCommodity;
  note: string;
}> = [
  { value: "potato", note: "Fast-moving, stable demand" },
  { value: "onion", note: "Core wholesale supply line" },
  { value: "vegetables", note: "Daily fresh lots" },
];

function ProductIcon({ type }: { type: SellerSupplyCommodity }) {
  if (type === "potato") {
    return (
      <svg
        className={styles.productIcon}
        viewBox="0 0 120 80"
        aria-hidden="true"
      >
        <ellipse cx="43" cy="44" rx="24" ry="18" fill="#b98a52" />
        <ellipse cx="69" cy="38" rx="27" ry="20" fill="#c99a5f" />
        <ellipse cx="78" cy="52" rx="18" ry="13" fill="#a8743f" />
        <circle cx="36" cy="40" r="2.5" fill="#6b4a2d" />
        <circle cx="62" cy="33" r="2.5" fill="#6b4a2d" />
        <circle cx="75" cy="48" r="2" fill="#6b4a2d" />
      </svg>
    );
  }
  if (type === "onion") {
    return (
      <svg
        className={styles.productIcon}
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
          d="M61 14c4 16 7 39 1 61"
          fill="none"
          stroke="#f4d8ef"
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
    <svg className={styles.productIcon} viewBox="0 0 120 80" aria-hidden="true">
      <path d="M48 20c18 2 32 15 34 34-19 0-34-13-34-34Z" fill="#3f8f5b" />
      <path d="M72 18c11 9 16 22 13 38-14-7-21-21-13-38Z" fill="#62a96b" />
      <path
        d="M42 26c-7 2-11 7-12 15l14 28 13-4-6-31c-2-6-4-8-9-8Z"
        fill="#e98536"
      />
      <path
        d="M42 26c1 14 5 28 15 39"
        fill="none"
        stroke="#b55f28"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M34 30c-8-6-14-6-19 0 7 5 14 6 22 3 0 0 4-7 11-9-6-5-14-5-21 1"
        fill="#2f7d50"
      />
    </svg>
  );
}

export function SellerNewSupplyView({ locale }: { locale: Locale }) {
  const router = useRouter();
  const copy = getWebSellerSupplyCopy(locale);
  const [form, setForm] = useState<FormState>({
    commodity: "potato",
    quantity: "",
    unit: "bag",
    gradeLabel: "",
    askingPrice: "",
    availableFrom: "",
    photoUrls: [],
    singleBuyEnabled: true,
    groupBuyEnabled: false,
    singleMinQty: "1",
    singleMaxQty: "",
    groupTargetQty: "",
    groupMinQty: "50",
    groupMaxQty: "",
    groupDeadline: "",
    groupPrice: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readingPhotos, setReadingPhotos] = useState(false);

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

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setReadingPhotos(true);
    try {
      const selected = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, 3);
      const urls = await Promise.all(selected.map(compressPhoto));
      setForm((current) => ({
        ...current,
        photoUrls: [...current.photoUrls, ...urls].slice(0, 3),
      }));
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Photo upload failed",
      ]);
    } finally {
      setReadingPhotos(false);
    }
  }

  async function submit() {
    const nextErrors: string[] = [];
    if (!form.gradeLabel.trim()) nextErrors.push(copy.errors.grade);
    if (!form.quantity || Number(form.quantity) <= 0)
      nextErrors.push(copy.errors.quantity);
    if (!form.askingPrice || Number(form.askingPrice) <= 0)
      nextErrors.push(copy.errors.price);
    if (!form.singleBuyEnabled && !form.groupBuyEnabled)
      nextErrors.push("Choose single buy, group buy, or both.");
    if (
      form.singleBuyEnabled &&
      form.singleMaxQty &&
      Number(form.singleMaxQty) > Number(form.quantity)
    )
      nextErrors.push("Single-buy max cannot exceed total stock.");
    if (
      form.groupBuyEnabled &&
      (!form.groupTargetQty ||
        Number(form.groupTargetQty) <= 0 ||
        Number(form.groupTargetQty) > Number(form.quantity))
    )
      nextErrors.push("Group-buy target must be inside total stock.");
    if (
      form.groupBuyEnabled &&
      (Number(form.groupMinQty) < 1 ||
        Number(form.groupMinQty) > Number(form.groupTargetQty) ||
        (form.groupMaxQty &&
          (Number(form.groupMaxQty) < Number(form.groupMinQty) ||
            Number(form.groupMaxQty) > Number(form.groupTargetQty))))
    )
      nextErrors.push("Group-buy min/max must stay inside the target.");
    if (!form.photoUrls.length)
      nextErrors.push("Add at least one real supply photo.");
    if (readingPhotos) nextErrors.push("Wait for photos to finish loading.");
    setErrors(nextErrors);
    if (nextErrors.length) return;
    setSaving(true);
    setSubmitted(false);
    try {
      const data = await apiPost<SellerSupplyMutationResponse>(
        "/api/seller/supply",
        {
          commodity: form.commodity,
          quantity: Number(form.quantity),
          unit: form.unit,
          gradeLabel: form.gradeLabel,
          askingPrice: Number(form.askingPrice),
          availableFrom: /^\d{4}-\d{2}-\d{2}/.test(form.availableFrom)
            ? form.availableFrom
            : undefined,
          photoUrls: form.photoUrls,
          singleBuyEnabled: form.singleBuyEnabled,
          groupBuyEnabled: form.groupBuyEnabled,
          singleMinQty: Number(form.singleMinQty) || 1,
          singleMaxQty: form.singleMaxQty
            ? Number(form.singleMaxQty)
            : Number(form.quantity),
          groupTargetQty: form.groupBuyEnabled
            ? Number(form.groupTargetQty)
            : undefined,
          groupMinQty: form.groupBuyEnabled
            ? Number(form.groupMinQty) || 1
            : undefined,
          groupMaxQty:
            form.groupBuyEnabled && form.groupMaxQty
              ? Number(form.groupMaxQty)
              : undefined,
          groupDeadline:
            form.groupBuyEnabled && form.groupDeadline
              ? form.groupDeadline
              : undefined,
          groupPrice:
            form.groupBuyEnabled && form.groupPrice
              ? Number(form.groupPrice)
              : undefined,
        },
      );
      if (!data.listing.photoUrls?.length) {
        setErrors([
          "Photo was not saved by the API. Restart the API and try again.",
        ]);
        return;
      }
      setSubmitted(true);
      router.push("/seller/supply");
      router.refresh();
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Supply save failed",
      ]);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>Add new supply</p>
          <h1 className={styles.heroTitle}>{copy.newSupplyTitle}</h1>
          <p className={styles.heroSubtitle}>{copy.newSupplySubtitle}</p>
        </div>
      </section>

      <div className={styles.formShell}>
        <section className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Category selection</h2>
          </div>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((item) => {
              const active = form.commodity === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  className={`${styles.categoryCard} ${active ? styles.categoryCardActive : ""}`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      commodity: item.value,
                    }))
                  }
                >
                  <div className={styles.categoryMedia}>
                    <ProductIcon type={item.value} />
                  </div>
                  <strong className={styles.categoryLabel}>
                    {copy.commodities[item.value]}
                  </strong>
                  <span className={styles.categoryMeta}>{item.note}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Supply photos</h2>
              <p className={styles.sectionSubtitle}>
                Add up to 3 clear photos of this lot.
              </p>
            </div>
          </div>
          <label className={styles.photoDrop}>
            <input
              className={styles.photoInput}
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => void addPhotos(event.target.files)}
            />
            <span className={styles.photoDropTitle}>Choose supply photos</span>
            <span className={styles.helperText}>
              {readingPhotos
                ? "Preparing photos..."
                : "Use real photos of the sacks, crates, or product quality."}
            </span>
          </label>
          {form.photoUrls.length ? (
            <div className={styles.photoPreviewGrid}>
              {form.photoUrls.map((url, index) => (
                <div
                  className={styles.photoPreview}
                  key={`${index}-${url.slice(0, 24)}`}
                >
                  <img src={url} alt={`Supply photo ${index + 1}`} />
                  <button
                    type="button"
                    className={styles.photoRemove}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        photoUrls: current.photoUrls.filter(
                          (_, photoIndex) => photoIndex !== index,
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
        </section>

        <section className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Stock details</h2>
          </div>
          <div className={styles.inlineGrid}>
            <label className={styles.field}>
              {copy.fields.quantity}
              <input
                className={styles.input}
                aria-label={copy.fields.quantity}
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: event.target.value,
                  }))
                }
              />
            </label>
            <label className={styles.field}>
              {copy.fields.unit}
              <select
                className={styles.select}
                aria-label={copy.fields.unit}
                value={form.unit}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    unit: event.target.value as SellerSupplyUnit,
                  }))
                }
              >
                <option value="kg">{copy.units.kg}</option>
                <option value="bag">{copy.units.bag}</option>
                <option value="crate">{copy.units.crate}</option>
              </select>
            </label>
          </div>

          <label className={styles.field}>
            {copy.fields.grade}
            <input
              className={styles.input}
              aria-label={copy.fields.grade}
              value={form.gradeLabel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gradeLabel: event.target.value,
                }))
              }
            />
          </label>
        </section>

        <section className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Pricing</h2>
          </div>
          <label className={styles.field}>
            {copy.fields.price}
            <input
              className={styles.input}
              aria-label={copy.fields.price}
              value={form.askingPrice}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  askingPrice: event.target.value,
                }))
              }
            />
          </label>
          <label className={styles.field}>
            {copy.fields.availableFrom}
            <input
              className={styles.input}
              aria-label={copy.fields.availableFrom}
              value={form.availableFrom}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  availableFrom: event.target.value,
                }))
              }
            />
          </label>
          <p className={styles.helperText}>
            Keep the asking price close to the current Bogura lane rate.
          </p>
        </section>

        <section className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Sale mode</h2>
          </div>
          <div className={styles.inlineGrid}>
            <label className={styles.field}>
              <input
                type="checkbox"
                checked={form.singleBuyEnabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    singleBuyEnabled: event.target.checked,
                  }))
                }
              />
              Single buy visible on buyer home
            </label>
            <label className={styles.field}>
              <input
                type="checkbox"
                checked={form.groupBuyEnabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    groupBuyEnabled: event.target.checked,
                  }))
                }
              />
              Group buy visible on group-buy page
            </label>
          </div>
          {form.singleBuyEnabled ? (
            <div className={styles.inlineGrid}>
              <label className={styles.field}>
                Single min quantity
                <input
                  className={styles.input}
                  value={form.singleMinQty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      singleMinQty: event.target.value,
                    }))
                  }
                />
              </label>
              <label className={styles.field}>
                Single max quantity
                <input
                  className={styles.input}
                  value={form.singleMaxQty}
                  placeholder={form.quantity || "Total stock"}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      singleMaxQty: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          ) : null}
          {form.groupBuyEnabled ? (
            <div className={styles.inlineGrid}>
              <label className={styles.field}>
                Group target quantity
                <input
                  className={styles.input}
                  value={form.groupTargetQty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      groupTargetQty: event.target.value,
                    }))
                  }
                />
              </label>
              <label className={styles.field}>
                Group min order quantity
                <input
                  className={styles.input}
                  value={form.groupMinQty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      groupMinQty: event.target.value,
                    }))
                  }
                />
              </label>
              <label className={styles.field}>
                Group max order quantity
                <input
                  className={styles.input}
                  value={form.groupMaxQty}
                  placeholder={form.groupTargetQty || "Target quantity"}
                  onChange={(event) =>
                    setForm((current) => ({
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
                  value={form.groupPrice}
                  placeholder="Optional discount price"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      groupPrice: event.target.value,
                    }))
                  }
                />
              </label>
              <label className={styles.field}>
                Group deadline
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={form.groupDeadline}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      groupDeadline: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          ) : null}
          <p className={styles.helperText}>
            Single buy goes straight to checkout. Group buy stays pending until
            the target is filled.
          </p>
        </section>

        {errors.length ? (
          <section
            className={styles.supportCard}
            aria-label="validation errors"
          >
            <h2 className={styles.sectionTitle}>Fix these fields</h2>
            <ul className={styles.errorList}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {submitted ? (
          <section className={styles.supportCard}>
            <p className={styles.message}>{copy.success}</p>
          </section>
        ) : null}
      </div>

      <div className={styles.stickyBar}>
        <div className={styles.formActionRow}>
          <button
            className={styles.button}
            type="button"
            onClick={submit}
            disabled={saving || readingPhotos}
          >
            {saving ? "Saving..." : copy.saveSupply}
          </button>
          <span className={styles.helperText}>
            {submitted
              ? copy.success
              : "Publish only when quantity, grade, and price are checked."}
          </span>
        </div>
      </div>
    </main>
  );
}

export default function SellerNewSupplyPage() {
  const { locale } = useBrowserLocale();
  return <SellerNewSupplyView locale={locale} />;
}
