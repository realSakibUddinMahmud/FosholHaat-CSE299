"use client";

import { useState } from "react";
import type { Locale, SellerSupplyCommodity, SellerSupplyUnit } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { getWebSellerSupplyCopy } from "../supply-data";
import styles from "../supply.module.css";

type FormState = {
  commodity: SellerSupplyCommodity;
  quantity: string;
  unit: SellerSupplyUnit;
  gradeLabel: string;
  askingPrice: string;
  availableFrom: string;
};

const CATEGORIES: Array<{
  value: SellerSupplyCommodity;
  note: string;
}> = [
  { value: "potato", note: "Fast-moving, stable demand" },
  { value: "onion", note: "Core wholesale supply line" },
  { value: "vegetables", note: "Daily fresh lots" },
];

export function SellerNewSupplyView({ locale }: { locale: Locale }) {
  const copy = getWebSellerSupplyCopy(locale);
  const [form, setForm] = useState<FormState>({
    commodity: "potato",
    quantity: "",
    unit: "bag",
    gradeLabel: "",
    askingPrice: "",
    availableFrom: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    const nextErrors: string[] = [];
    if (!form.gradeLabel.trim()) nextErrors.push(copy.errors.grade);
    if (!form.quantity || Number(form.quantity) <= 0) nextErrors.push(copy.errors.quantity);
    if (!form.askingPrice || Number(form.askingPrice) <= 0) nextErrors.push(copy.errors.price);
    setErrors(nextErrors);
    setSubmitted(nextErrors.length === 0);
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
                  onClick={() => setForm((current) => ({ ...current, commodity: item.value }))}
                >
                  <div className={styles.categoryMedia} />
                  <strong className={styles.categoryLabel}>{copy.commodities[item.value]}</strong>
                  <span className={styles.categoryMeta}>{item.note}</span>
                </button>
              );
            })}
          </div>
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
                onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
              />
            </label>
            <label className={styles.field}>
              {copy.fields.unit}
              <select
                className={styles.select}
                aria-label={copy.fields.unit}
                value={form.unit}
                onChange={(event) =>
                  setForm((current) => ({ ...current, unit: event.target.value as SellerSupplyUnit }))
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
              onChange={(event) => setForm((current) => ({ ...current, gradeLabel: event.target.value }))}
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
              onChange={(event) => setForm((current) => ({ ...current, askingPrice: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            {copy.fields.availableFrom}
            <input
              className={styles.input}
              aria-label={copy.fields.availableFrom}
              value={form.availableFrom}
              onChange={(event) => setForm((current) => ({ ...current, availableFrom: event.target.value }))}
            />
          </label>
          <p className={styles.helperText}>Keep the asking price close to the current Bogura lane rate.</p>
        </section>

        <section className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Operational settings</h2>
          </div>
          <div className={styles.inlineGrid}>
            <div className={styles.summaryStat}>
              <p className={styles.summaryStatLabel}>{copy.metrics.active}</p>
              <strong className={styles.summaryStatValue}>3</strong>
              <p className={styles.summaryStatHint}>Visible after save</p>
            </div>
            <div className={styles.summaryStat}>
              <p className={styles.summaryStatLabel}>{copy.metrics.readyToday}</p>
              <strong className={styles.summaryStatValue}>2</strong>
              <p className={styles.summaryStatHint}>Eligible for same-day pickup</p>
            </div>
          </div>
          <p className={styles.helperText}>Record quality, stock, and available-from details in one pass.</p>
        </section>

        {errors.length ? (
          <section className={styles.supportCard} aria-label="validation errors">
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
          <button className={styles.button} type="button" onClick={submit}>
            {copy.saveSupply}
          </button>
          <span className={styles.helperText}>Publish only when quantity, grade, and price are checked.</span>
        </div>
      </div>
    </main>
  );
}

export default function SellerNewSupplyPage() {
  const { locale } = useBrowserLocale();
  return <SellerNewSupplyView locale={locale} />;
}
