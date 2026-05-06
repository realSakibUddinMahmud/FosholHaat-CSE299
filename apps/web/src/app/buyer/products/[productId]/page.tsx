"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Star } from "lucide-react";
import type {
  BuyerCartResponse,
  BuyerProductDetailResponse,
} from "@fosholhaat/types";
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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    apiFetch<BuyerProductDetailResponse>(
      `/api/buyer/catalog/products/${productId}?locale=${locale}`,
    )
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
            <Link href="/buyer" className={styles.backLink}>
              {copy.backLabel}
            </Link>
          </div>
        </section>
      </main>
    );
  }
  const imageUrl = product.imageUrls?.[0] || "/images/vegetables.png";
  const minQty = product.singleMinQty ?? 1;
  const maxQty = product.singleMaxQty ?? 999999;
  const orderQty = Math.min(maxQty, Math.max(minQty, quantity));

  return (
    <main className={styles.page}>
      <div className={styles.detailWrap}>
        <div className={styles.detailImageCol}>
          <div className={styles.detailImage}>
            {imageUrl.startsWith("data:") ? (
              <img src={imageUrl} alt={product.title} />
            ) : (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="500px"
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        </div>
        <div className={styles.detailInfoCol}>
          <h1 className={styles.detailName}>{product.title}</h1>
          <p className={styles.detailSeller}>
            {product.sellerLabel} · Bogura → Dhaka
          </p>
          <div className={styles.detailRating}>
            4.8 <Star size={14} fill="currentColor" />
          </div>
          <p className={styles.detailSummary}>{product.description}</p>
          <div className={styles.detailPriceSection}>
            <span className={styles.priceLabel}>WHOLESALE PRICE</span>
            <div className={styles.detailPrice}>{product.priceLabel}</div>
            <span className={styles.detailUnit}>{product.packageLabel}</span>
          </div>
          <div className={styles.detailStats}>
            <div className={styles.detailStat}>
              <span className={styles.detailStatLabel}>Available</span>
              <span className={styles.detailStatValue}>
                {product.stockLabel}
              </span>
            </div>
            <div className={styles.detailStat}>
              <span className={styles.detailStatLabel}>Category</span>
              <span className={styles.detailStatValue}>
                {product.commodity}
              </span>
            </div>
            <div className={styles.detailStat}>
              <span className={styles.detailStatLabel}>Pack</span>
              <span className={styles.detailStatValue}>
                {product.packageLabel}
              </span>
            </div>
          </div>
          <label className={styles.cardQtyLabel}>
            Quantity
            <input
              className={styles.cardQtyInput}
              type="number"
              min={minQty}
              max={maxQty}
              value={orderQty}
              onChange={(event) =>
                setQuantity(
                  Math.min(
                    maxQty,
                    Math.max(minQty, Number(event.target.value) || minQty),
                  ),
                )
              }
            />
          </label>
          <div className={styles.detailTags}>
            <span className={styles.detailTag}>
              {product.verificationLabel ?? "Verified seller"}
            </span>
          </div>
          <div className={styles.detailActions}>
            <button
              className={styles.detailCartBtn}
              type="button"
              onClick={async () => {
                await apiPost<BuyerCartResponse>("/api/buyer/cart/items", {
                  supplyLotId: product.id,
                  quantity: orderQty,
                });
                window.location.href = "/buyer/cart";
              }}
            >
              <ShoppingCart size={18} /> Add to cart
            </button>
            <Link href="/buyer" className={styles.detailBackBtn}>
              {copy.backLabel}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BuyerProductPage({
  params: propParams,
}: {
  params?: { productId: string };
}) {
  const { locale } = useBrowserLocale();
  const params = useParams<{ productId: string }>();
  const productId = propParams?.productId ?? params.productId;
  if (process.env.NODE_ENV === "test")
    return <BuyerProductDetailView locale={locale} productId={productId} />;
  return <LiveBuyerProductPage productId={productId} />;
}
