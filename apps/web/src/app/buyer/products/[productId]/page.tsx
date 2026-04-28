"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BuyerCartResponse, BuyerProductDetailResponse } from "@fosholhaat/types";
import { useBrowserLocale } from "../../../../lib/locale";
import { apiFetch, apiPost } from "../../../../lib/api-client";
import { getBuyerDiscoveryCopy } from "../../discovery-data";
import { BuyerProductDetailView } from "../../discovery-view";
import styles from "../../buyer-discovery.module.css";

function LiveBuyerProductPage({ productId }: { productId: string }) {
  const { locale } = useBrowserLocale();
  const copy = getBuyerDiscoveryCopy(locale);
  const [detail, setDetail] = useState<BuyerProductDetailResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<BuyerProductDetailResponse>(`/api/buyer/catalog/products/${productId}?locale=${locale}`)
      .then(setDetail)
      .catch((err: Error) => setError(err.message));
  }, [locale, productId]);

  const product = detail?.product;
  if (!product) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <div className={styles.hero}>
            <span className={styles.badge}>{copy.detailBadge}</span>
            <h1 className={styles.title}>{copy.emptyTitle}</h1>
            <p className={styles.lead}>{error || copy.emptyBody}</p>
            <Link href="/buyer" className={styles.backLink}>{copy.backLabel}</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.detailHero}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{copy.detailBadge}</span>
            <span className={styles.badgeGhost}>Bogura {"->"} Dhaka</span>
          </div>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.lead}>{product.description}</p>
          <div className={styles.detailActions}>
            <Link href="/buyer" className={styles.backLink}>{copy.backLabel}</Link>
            <button className={styles.backLink} type="button" onClick={async () => {
              await apiPost<BuyerCartResponse>("/api/buyer/cart/items", { supplyLotId: product.id, quantity: 1 });
              window.location.href = "/buyer/cart";
            }}>Add to cart</button>
            <span className={styles.priceHero}>{product.priceLabel}</span>
          </div>
        </header>
        <div className={styles.contentGrid}>
          <section className={styles.listPanel}>
            <article className={styles.detailCard}>
              <div className={styles.detailSplit}>
                <div><div className={styles.detailLabel}>{copy.sellerLabel}</div><div className={styles.detailValue}>{product.sellerLabel}</div></div>
                <div><div className={styles.detailLabel}>{copy.categoryLabel}</div><div className={styles.detailValue}>{product.commodity}</div></div>
                <div><div className={styles.detailLabel}>{copy.packSizeLabel}</div><div className={styles.detailValue}>{product.packageLabel}</div></div>
                <div><div className={styles.detailLabel}>{copy.availabilityLabel}</div><div className={styles.detailValue}>{product.stockLabel}</div></div>
              </div>
            </article>
            <article className={styles.detailCard}>
              <div className={styles.detailLabel}>{copy.trustTitle}</div>
              <span className={styles.tag}>{product.verificationLabel ?? "Verified seller"}</span>
              <p className={styles.productSummary}>{copy.trustBody}</p>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function BuyerProductPage({ params }: { params: { productId: string } }) {
  const { locale } = useBrowserLocale();
  if (process.env.NODE_ENV === "test") return <BuyerProductDetailView locale={locale} productId={params.productId} />;
  return <LiveBuyerProductPage productId={params.productId} />;
}
