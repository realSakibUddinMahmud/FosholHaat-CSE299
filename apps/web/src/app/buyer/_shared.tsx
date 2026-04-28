"use client";

import Link from "next/link";
import { getBuyerCartCheckoutCopy, type BuyerCartTotals, type Locale } from "@fosholhaat/types";
import styles from "./buyer-checkout.module.css";

const STEP_LABELS = ["cart", "fulfillment", "payment", "confirmation"] as const;

export function BuyerPageShell({
  locale,
  activeStep,
  title,
  subtitle,
  children,
  summary,
}: {
  locale: Locale;
  activeStep: (typeof STEP_LABELS)[number];
  title: string;
  subtitle: string;
  children: React.ReactNode;
  summary: React.ReactNode;
}) {
  const copy = getBuyerCartCheckoutCopy(locale);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.badge}>Buyer checkout</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.steps}>
            {STEP_LABELS.map((step) => (
              <span
                key={step}
                className={`${styles.step} ${step === activeStep ? styles.stepActive : ""}`}
              >
                {copy.stepLabels[step]}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.main}>{children}</div>
          <aside className={styles.summary}>{summary}</aside>
        </section>
      </div>
    </main>
  );
}

export function BuyerOrderSummary({ locale, totals }: { locale: Locale; totals?: BuyerCartTotals }) {
  const copy = getBuyerCartCheckoutCopy(locale);
  const safeTotals = totals ?? { subtotal: 0, deliveryFee: 0, serviceFee: 0, payableTotal: 0 };
  return (
    <>
      <h2 className={styles.summaryTitle}>{copy.summaryTitle}</h2>
      <div className={styles.row}>
        <span>{copy.labels.subtotal}</span>
        <strong>{formatMoney(safeTotals.subtotal, locale)}</strong>
      </div>
      <div className={styles.row}>
        <span>{copy.labels.deliveryFee}</span>
        <strong>{formatMoney(safeTotals.deliveryFee, locale)}</strong>
      </div>
      <div className={styles.row}>
        <span>{copy.labels.serviceFee}</span>
        <strong>{formatMoney(safeTotals.serviceFee, locale)}</strong>
      </div>
      <div className={styles.divider} />
      <div className={styles.row}>
        <span>{copy.labels.payableTotal}</span>
        <strong className={styles.value}>{formatMoney(safeTotals.payableTotal, locale)}</strong>
      </div>
    </>
  );
}

export function BuyerLinkRow({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className={styles.ctaRow}>
      <Link href={primaryHref} className={styles.button}>
        {primaryLabel}
      </Link>
      {secondaryHref && secondaryLabel ? (
        <Link href={secondaryHref} className={styles.buttonGhost}>
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
