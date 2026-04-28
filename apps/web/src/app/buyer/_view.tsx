"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  ClipboardCheck,
  Package2,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Truck,
  WalletCards,
} from "lucide-react";
import {
  getBuyerCartCheckoutCopy,
  type BuyerCartCheckoutCopy,
  type Locale,
} from "@fosholhaat/types";
import {
  BUYER_WEB_CART_LINES,
  BUYER_WEB_CART_TOTALS,
  BUYER_WEB_CHECKOUT_COPY,
  BUYER_WEB_FULFILLMENT,
  BUYER_WEB_PAYMENT,
  BUYER_WEB_SUCCESS,
} from "./_data";
import styles from "./buyer-cart-checkout.module.css";

type StepId = "cart" | "checkout" | "payment" | "confirmation";

const STEP_META: Array<{
  id: StepId;
  href: string;
  labelFor: (copy: BuyerCartCheckoutCopy) => string;
}> = [
  { id: "cart", href: "/buyer/cart", labelFor: (copy) => copy.stepLabels.cart },
  { id: "checkout", href: "/buyer/checkout", labelFor: (copy) => copy.checkoutTitle },
  { id: "payment", href: "/buyer/checkout/payment", labelFor: (copy) => copy.stepLabels.payment },
  {
    id: "confirmation",
    href: "/buyer/checkout/confirmation",
    labelFor: (copy) => copy.stepLabels.confirmation,
  },
];

function money(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function count(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(value);
}

function StepStepper({
  locale,
  activeStep,
}: {
  locale: Locale;
  activeStep: StepId;
}) {
  const copy = getBuyerCartCheckoutCopy(locale);

  return (
    <nav className={styles.stepper} aria-label="Checkout progress">
      {STEP_META.map((step, index) => {
        const active = step.id === activeStep;
        return (
          <Link
            key={step.id}
            href={step.href}
            className={`${styles.stepPill} ${active ? styles.stepPillActive : ""}`}
            aria-current={active ? "step" : undefined}
          >
            <span className={styles.stepIndex}>{index + 1}</span>
            <span>{step.labelFor(copy)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={styles.summaryRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function SummaryRail({
  title,
  lead,
  rows,
  hints,
  badgeLabel,
  statusLabel,
  icon: Icon = ShieldCheck,
}: {
  title: string;
  lead: string;
  rows: Array<{ label: string; value: string }>;
  hints: string[];
  badgeLabel: string;
  statusLabel: string;
  icon?: typeof ShieldCheck;
}) {
  return (
    <aside className={styles.summaryRail}>
      <div className={styles.summaryRailTop}>
        <div className={styles.summaryBadge}>
          <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>{badgeLabel}</span>
        </div>
        <div className={styles.summaryStatus}>{statusLabel}</div>
      </div>

      <h2 className={styles.summaryTitle}>{title}</h2>
      <p className={styles.summaryLead}>{lead}</p>

      <dl className={styles.summaryList}>
        {rows.map((row) => (
          <SummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>

      <div className={styles.summaryHints}>
        {hints.map((hint) => (
          <span key={hint} className={styles.summaryHint}>
            {hint}
          </span>
        ))}
      </div>
    </aside>
  );
}

function LineItem({
  locale,
  line,
}: {
  locale: Locale;
  line: (typeof BUYER_WEB_CART_LINES)[number];
}) {
  const copy = getBuyerCartCheckoutCopy(locale);
  return (
    <article className={styles.lineItem}>
      <div className={styles.lineItemTop}>
        <div>
          <div className={styles.lineItemName}>{line.productName}</div>
          <div className={styles.lineItemMeta}>{line.sellerName}</div>
        </div>
        <div className={styles.lineItemPrice}>{money(locale, line.subtotal)}</div>
      </div>

      <div className={styles.lineItemGrid}>
        <SummaryRow label={copy.labels.quantity} value={`${count(locale, line.quantity)} ${line.unit}`} />
        <SummaryRow label={copy.labels.subtotal} value={money(locale, line.unitPrice)} />
      </div>

      {line.note ? <p className={styles.lineItemNote}>{line.note}</p> : null}
    </article>
  );
}

function ActionBar({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className={styles.actionBar}>
      {primary}
      {secondary}
    </div>
  );
}

function PageFrame({
  locale,
  step,
  title,
  lead,
  main,
  summary,
}: {
  locale: Locale;
  step: StepId;
  title: string;
  lead: string;
  main: ReactNode;
  summary: ReactNode;
}) {
  const webCopy = BUYER_WEB_CHECKOUT_COPY[locale];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">
              <ShoppingCart size={16} strokeWidth={2.4} />
            </div>
            <div>
              <div className={styles.brandTitle}>FosholHaat</div>
              <div className={styles.brandSub}>{webCopy.pageBadge}</div>
            </div>
          </div>
          <div className={styles.headerCopy}>{webCopy.mobileHandoffNote}</div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.heroBadge}>{webCopy.pageBadge}</span>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroLead}>{lead}</p>
          <StepStepper locale={locale} activeStep={step} />
        </section>

        <div className={styles.layout}>
          <section className={styles.primaryColumn}>{main}</section>
          <div className={styles.summaryColumn}>{summary}</div>
        </div>
      </main>
    </div>
  );
}

function CartSummary({ locale }: { locale: Locale }) {
  const copy = getBuyerCartCheckoutCopy(locale);
  const webCopy = BUYER_WEB_CHECKOUT_COPY[locale];
  return (
    <SummaryRail
      title={copy.summaryTitle}
      lead={webCopy.cartLead}
      rows={[
        { label: copy.labels.subtotal, value: money(locale, BUYER_WEB_CART_TOTALS.subtotal) },
        { label: copy.labels.deliveryFee, value: money(locale, BUYER_WEB_CART_TOTALS.deliveryFee) },
        { label: copy.labels.serviceFee, value: money(locale, BUYER_WEB_CART_TOTALS.serviceFee) },
        { label: copy.labels.payableTotal, value: money(locale, BUYER_WEB_CART_TOTALS.payableTotal) },
      ]}
      hints={webCopy.trustPoints}
      badgeLabel={webCopy.pageBadge}
      statusLabel={webCopy.trustPoints[0]}
      icon={ReceiptText}
    />
  );
}

export function BuyerCartView({ locale }: { locale: Locale }) {
  const copy = getBuyerCartCheckoutCopy(locale);

  return (
    <PageFrame
      locale={locale}
      step="cart"
      title={copy.cartTitle}
      lead={BUYER_WEB_CHECKOUT_COPY[locale].cartLead}
      summary={<CartSummary locale={locale} />}
      main={
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <h2 className={styles.cardTitle}>{copy.cartTitle}</h2>
              <p className={styles.cardLead}>{BUYER_WEB_CHECKOUT_COPY[locale].cartLead}</p>
            </div>
            <span className={styles.cardTag}>{copy.labels.payableTotal}</span>
          </div>

          <div className={styles.lineList}>
            {BUYER_WEB_CART_LINES.map((line) => (
              <LineItem key={line.lineId} locale={locale} line={line} />
            ))}
          </div>

          <ActionBar
            primary={
              <Link href="/buyer/checkout" className={styles.primaryAction}>
                {copy.actions.continueToCheckout}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            }
            secondary={<div className={styles.inlineNote}>{BUYER_WEB_CHECKOUT_COPY[locale].trustPoints[1]}</div>}
          />
        </section>
      }
    />
  );
}

export function BuyerCheckoutView({ locale }: { locale: Locale }) {
  const copy = getBuyerCartCheckoutCopy(locale);
  const webCopy = BUYER_WEB_CHECKOUT_COPY[locale];

  return (
    <PageFrame
      locale={locale}
      step="checkout"
      title={copy.checkoutTitle}
      lead={webCopy.checkoutLead}
      summary={
      <SummaryRail
        title={copy.summaryTitle}
          lead={webCopy.checkoutLead}
          rows={[
            {
              label: copy.labels.fulfillment,
              value:
                copy.fulfillmentChoices[BUYER_WEB_FULFILLMENT.choice],
            },
            { label: copy.labels.recipient, value: BUYER_WEB_FULFILLMENT.recipientName },
            { label: copy.labels.address, value: BUYER_WEB_FULFILLMENT.addressLabel ?? "—" },
            { label: copy.labels.payableTotal, value: money(locale, BUYER_WEB_CART_TOTALS.payableTotal) },
          ]}
          hints={webCopy.summaryHints}
          badgeLabel={webCopy.pageBadge}
          statusLabel={webCopy.trustPoints[0]}
          icon={Truck}
        />
      }
      main={
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <h2 className={styles.cardTitle}>{copy.checkoutTitle}</h2>
              <p className={styles.cardLead}>{webCopy.checkoutLead}</p>
            </div>
            <span className={styles.cardTag}>{webCopy.mobileHandoffNote}</span>
          </div>

          <div className={styles.checklist}>
            {webCopy.trustPoints.map((point) => (
              <div key={point} className={styles.checkItem}>
                <BadgeCheck size={16} strokeWidth={2.3} aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className={styles.noticeCard}>
            <div className={styles.noticeTitle}>
              <ClipboardCheck size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>{webCopy.mobileHandoffNote}</span>
            </div>
            <p className={styles.noticeBody}>
              Web keeps the summary visible while the actual fulfillment choice stays in the mobile flow.
            </p>
          </div>

          <ActionBar
            primary={
              <Link href="/buyer/checkout/payment" className={styles.primaryAction}>
                {copy.actions.continueToPayment}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            }
          />
        </section>
      }
    />
  );
}

export function BuyerPaymentView({ locale }: { locale: Locale }) {
  const copy = getBuyerCartCheckoutCopy(locale);
  const webCopy = BUYER_WEB_CHECKOUT_COPY[locale];

  return (
    <PageFrame
      locale={locale}
      step="payment"
      title={copy.paymentTitle}
      lead={webCopy.paymentLead}
      summary={
        <SummaryRail
          title={copy.summaryTitle}
          lead={webCopy.paymentLead}
          rows={[
            { label: copy.labels.paymentMethod, value: copy.paymentMethods[BUYER_WEB_PAYMENT.method] },
            { label: copy.labels.payableTotal, value: money(locale, BUYER_WEB_PAYMENT.payableTotal) },
            { label: copy.labels.address, value: BUYER_WEB_FULFILLMENT.addressLabel ?? "—" },
            { label: copy.labels.recipient, value: BUYER_WEB_FULFILLMENT.recipientName },
          ]}
          hints={webCopy.paymentHints}
          badgeLabel={webCopy.pageBadge}
          statusLabel={webCopy.trustPoints[0]}
          icon={Banknote}
        />
      }
      main={
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <h2 className={styles.cardTitle}>{copy.paymentTitle}</h2>
              <p className={styles.cardLead}>{webCopy.paymentLead}</p>
            </div>
            <span className={styles.cardTag}>{copy.labels.payableTotal}</span>
          </div>

          <div className={styles.optionGrid}>
            {webCopy.paymentHints.map((hint, index) => (
              <article key={hint} className={`${styles.optionCard} ${index === 1 ? styles.optionCardActive : ""}`}>
                <div className={styles.optionCardTop}>
                  <WalletCards size={16} strokeWidth={2.2} aria-hidden="true" />
                  <span>{hint}</span>
                </div>
                <p className={styles.optionCardBody}>
                  {index === 1
                    ? copy.paymentMethods[BUYER_WEB_PAYMENT.method]
                    : index === 0
                      ? "Choose one payment method only."
                      : BUYER_WEB_PAYMENT.referenceLabel}
                </p>
              </article>
            ))}
          </div>

          <ActionBar
            primary={
              <Link href="/buyer/checkout/confirmation" className={styles.primaryAction}>
                {copy.actions.continueToConfirmation}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            }
          />
        </section>
      }
    />
  );
}

export function BuyerConfirmationView({ locale }: { locale: Locale }) {
  const copy = getBuyerCartCheckoutCopy(locale);
  const webCopy = BUYER_WEB_CHECKOUT_COPY[locale];

  return (
    <PageFrame
      locale={locale}
      step="confirmation"
      title={copy.confirmationTitle}
      lead={webCopy.confirmationLead}
      summary={
        <SummaryRail
          title={copy.summaryTitle}
          lead={webCopy.confirmationLead}
          rows={[
            { label: copy.labels.fulfillment, value: copy.fulfillmentChoices[BUYER_WEB_FULFILLMENT.choice] },
            { label: copy.labels.paymentMethod, value: copy.paymentMethods[BUYER_WEB_PAYMENT.method] },
            { label: copy.labels.payableTotal, value: money(locale, BUYER_WEB_CART_TOTALS.payableTotal) },
            { label: copy.labels.address, value: BUYER_WEB_FULFILLMENT.addressLabel ?? "—" },
          ]}
          hints={webCopy.summaryHints}
          badgeLabel={webCopy.pageBadge}
          statusLabel={webCopy.trustPoints[0]}
          icon={Package2}
        />
      }
      main={
        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <h2 className={styles.cardTitle}>{copy.confirmationTitle}</h2>
              <p className={styles.cardLead}>{webCopy.confirmationLead}</p>
            </div>
            <span className={styles.cardTag}>{copy.labels.payableTotal}</span>
          </div>

          <div className={styles.reviewStack}>
            <article className={styles.reviewCard}>
              <div className={styles.reviewTitle}>
                <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.labels.fulfillment}</span>
              </div>
              <p>{copy.fulfillmentChoices[BUYER_WEB_FULFILLMENT.choice]}</p>
              <p>{BUYER_WEB_FULFILLMENT.addressLabel}</p>
              <p>{BUYER_WEB_FULFILLMENT.note}</p>
            </article>

            <article className={styles.reviewCard}>
              <div className={styles.reviewTitle}>
                <WalletCards size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>{copy.labels.paymentMethod}</span>
              </div>
              <p>{copy.paymentMethods[BUYER_WEB_PAYMENT.method]}</p>
              <p>{money(locale, BUYER_WEB_PAYMENT.payableTotal)}</p>
              <p>{BUYER_WEB_PAYMENT.referenceLabel}</p>
            </article>
          </div>

          <div className={styles.reviewTotal}>
            <span>{copy.labels.payableTotal}</span>
            <strong>{money(locale, BUYER_WEB_CART_TOTALS.payableTotal)}</strong>
          </div>

          <ActionBar
            primary={
              <Link href="/buyer/orders/success" className={styles.primaryAction}>
                {copy.actions.submitOrder}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            }
          />
        </section>
      }
    />
  );
}

export function BuyerSuccessView({ locale }: { locale: Locale }) {
  const copy = getBuyerCartCheckoutCopy(locale);
  const webCopy = BUYER_WEB_CHECKOUT_COPY[locale];

  return (
    <PageFrame
      locale={locale}
      step="confirmation"
      title={copy.successTitle}
      lead={webCopy.successLead}
      summary={
        <SummaryRail
          title={copy.summaryTitle}
          lead={webCopy.successLead}
          rows={[
            { label: "Order ID", value: BUYER_WEB_SUCCESS.orderId },
            { label: copy.labels.payableTotal, value: money(locale, BUYER_WEB_CART_TOTALS.payableTotal) },
            { label: copy.labels.paymentMethod, value: copy.paymentMethods[BUYER_WEB_PAYMENT.method] },
            { label: copy.labels.fulfillment, value: copy.fulfillmentChoices[BUYER_WEB_FULFILLMENT.choice] },
          ]}
          hints={webCopy.receiptHints}
          badgeLabel={webCopy.pageBadge}
          statusLabel={webCopy.trustPoints[0]}
          icon={ReceiptText}
        />
      }
      main={
        <section className={styles.card}>
          <div className={styles.successTop}>
            <div className={styles.successBadge}>
              <BadgeCheck size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>{webCopy.pageBadge}</span>
            </div>
            <div className={styles.successMeta}>{BUYER_WEB_SUCCESS.placedAt}</div>
          </div>

          <h2 className={styles.cardTitle}>{copy.successTitle}</h2>
          <p className={styles.cardLead}>{webCopy.successLead}</p>

          <article className={styles.receiptCard}>
            <div className={styles.receiptRow}>
              <span>Confirmation</span>
              <strong>{BUYER_WEB_SUCCESS.orderId}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>{copy.labels.payableTotal}</span>
              <strong>{money(locale, BUYER_WEB_CART_TOTALS.payableTotal)}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>{copy.labels.paymentMethod}</span>
              <strong>{copy.paymentMethods[BUYER_WEB_PAYMENT.method]}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>{copy.labels.fulfillment}</span>
              <strong>{copy.fulfillmentChoices[BUYER_WEB_FULFILLMENT.choice]}</strong>
            </div>
          </article>

          <div className={styles.noticeCard}>
            <div className={styles.noticeTitle}>
              <ClipboardCheck size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>{BUYER_WEB_SUCCESS.handoffNote}</span>
            </div>
            <p className={styles.noticeBody}>{BUYER_WEB_SUCCESS.receiptNote}</p>
          </div>

          <ActionBar
            primary={
              <Link href="/buyer/cart" className={styles.primaryAction}>
                {copy.actions.reviewCart}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            }
            secondary={<div className={styles.inlineNote}>Tracking stays in the next buyer-orders slice.</div>}
          />
        </section>
      }
    />
  );
}
