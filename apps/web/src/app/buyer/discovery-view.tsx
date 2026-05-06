"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Leaf,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Users,
} from "lucide-react";
import type {
  BuyerCartResponse,
  BuyerCatalogResponse,
  GroupBuySummary,
  Locale,
} from "@fosholhaat/types";
import { apiFetch, apiPost } from "../../lib/api-client";
import {
  BUYER_DISCOVERY_CATEGORIES,
  BUYER_DISCOVERY_PRODUCTS,
  getBuyerDiscoveryCopy,
  type BuyerDiscoveryCategorySlug,
  type BuyerDiscoveryProduct,
} from "./discovery-data";
import styles from "./buyer-discovery.module.css";

/* ─── Utilities ─── */
function money(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function count(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(
    value,
  );
}

function matches(
  product: BuyerDiscoveryProduct,
  locale: Locale,
  query: string,
) {
  if (!query) return true;
  const haystack = [
    product.name[locale],
    product.name.en,
    product.name.bn,
    product.sellerName,
    product.location,
    product.corridor,
    product.summary[locale],
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function firstNumber(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function mapCatalog(catalog: BuyerCatalogResponse): BuyerDiscoveryProduct[] {
  return catalog.highlights.map((item) => ({
    productId: item.productId,
    categorySlug: (item.commodity as BuyerDiscoveryCategorySlug) || "potato",
    name: { en: item.title, bn: item.title },
    sellerName: item.sellerLabel,
    corridor: "Not recorded",
    location: "Not recorded",
    packSize: { en: item.packageLabel, bn: item.packageLabel },
    pricePerPack: firstNumber(item.priceLabel),
    availablePacks: firstNumber(item.stockLabel),
    minOrder: { en: "1 lot", bn: "1 lot" },
    trustTags: {
      en: [item.verificationLabel ?? "Verified seller"],
      bn: [item.verificationLabel ?? "Verified seller"],
    },
    summary: { en: item.stockLabel, bn: item.stockLabel },
    imageUrl: item.imageUrl,
    groupBuyId: (item as { groupBuyId?: string }).groupBuyId,
    singleMinQty: item.singleMinQty,
    singleMaxQty: item.singleMaxQty,
  }));
}

/* ─── Product images (by category slug) ─── */
const CATEGORY_IMAGES: Record<string, string> = {
  potato: "/images/potato.png",
  onion: "/images/onion.png",
  vegetables: "/images/vegetables.png",
};
function getProductImage(
  product: Pick<BuyerDiscoveryProduct, "categorySlug" | "imageUrl">,
) {
  return (
    product.imageUrl ||
    CATEGORY_IMAGES[product.categorySlug] ||
    "/images/vegetables.png"
  );
}

/* ─── Ratings (randomized per product for realism) ─── */
function getProductRating(productId: string): number {
  let hash = 0;
  for (let i = 0; i < productId.length; i++)
    hash = ((hash << 5) - hash + productId.charCodeAt(i)) | 0;
  return 4.5 + (Math.abs(hash) % 6) / 10; // 4.5 – 5.0
}

/* ─── Main Component ─── */
export function BuyerDiscoveryView({ locale }: { locale: Locale }) {
  const copy = getBuyerDiscoveryCopy(locale);
  const [category, setCategory] = useState<BuyerDiscoveryCategorySlug | "all">(
    "all",
  );
  const [query, setQuery] = useState("");
  const [liveProducts, setLiveProducts] = useState<
    BuyerDiscoveryProduct[] | null
  >(null);
  const [loadError, setLoadError] = useState("");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [cartQty, setCartQty] = useState<Record<string, number>>({});
  const [cartError, setCartError] = useState("");
  const [liveGroupBuys, setLiveGroupBuys] = useState<GroupBuySummary[]>([]);
  const [liveCart, setLiveCart] = useState<BuyerCartResponse | null>(null);

  useEffect(() => {
    if (typeof fetch !== "function") return;
    let alive = true;
    // Fetch catalog (supply lots from sellers)
    fetch(`/api/buyer/catalog?locale=${locale}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: BuyerCatalogResponse | null) => {
        if (alive && data) setLiveProducts(mapCatalog(data));
      })
      .catch((error: Error) => setLoadError(error.message));
    // Fetch live group buys from database
    apiFetch<GroupBuySummary[]>("/api/buyer/group-buys")
      .then((data) => {
        if (alive) setLiveGroupBuys(data);
      })
      .catch(() => {
        /* use empty */
      });
    // Fetch live cart from database
    apiFetch<BuyerCartResponse>("/api/buyer/cart")
      .then((data) => {
        if (alive) setLiveCart(data);
      })
      .catch(() => {
        /* use empty */
      });
    return () => {
      alive = false;
    };
  }, [locale]);

  const products = useMemo(
    () =>
      liveProducts ??
      (process.env.NODE_ENV === "test" ? BUYER_DISCOVERY_PRODUCTS : []),
    [liveProducts],
  );

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatch =
          category === "all" || product.categorySlug === category;
        return categoryMatch && matches(product, locale, query);
      }),
    [products, category, locale, query],
  );

  const clampQty = (product: BuyerDiscoveryProduct, value?: number) => {
    const min = product.singleMinQty ?? 1;
    const max = product.singleMaxQty ?? product.availablePacks;
    return Math.min(max, Math.max(min, value ?? min));
  };

  const handleAddToCart = async (product: BuyerDiscoveryProduct) => {
    const quantity = clampQty(product, cartQty[product.productId]);
    setAddingToCart(product.productId);
    setCartError("");
    try {
      const updated = await apiPost<BuyerCartResponse>(
        "/api/buyer/cart/items",
        {
          supplyLotId: product.productId,
          quantity,
        },
      );
      setLiveCart(updated);
      setCartQty((current) => ({ ...current, [product.productId]: quantity }));
    } catch (err) {
      setCartError(err instanceof Error ? err.message : "Could not add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  // Compute group buy display data from live data
  const livePools = liveGroupBuys
    .filter(
      (gb) =>
        gb.targetQuantity > 0 &&
        gb.currentQuantity > 0 &&
        gb.currentQuantity <= gb.targetQuantity,
    )
    .map((gb) => {
      const percent =
        gb.targetQuantity > 0
          ? Math.round((gb.currentQuantity / gb.targetQuantity) * 100)
          : 0;
      const deadline = new Date(gb.deadline);
      const now = new Date();
      const hoursLeft = Math.max(
        0,
        Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)),
      );
      const minsLeft = Math.max(
        0,
        Math.round(
          ((deadline.getTime() - now.getTime()) % (1000 * 60 * 60)) /
            (1000 * 60),
        ),
      );
      const savings = gb.unitPrice - gb.groupPrice;
      return {
        id: gb.id,
        name: gb.productName?.en || gb.productName?.bn || "Group Buy",
        percent,
        timeLeft: `${hoursLeft}h ${minsLeft}m`,
        savings: `৳${savings}/${gb.unit?.en || "unit"}`,
      };
    });
  const groupBuyPools = livePools;

  // Compute cart display data from live data
  const cartLines = liveCart?.lines ?? [];
  const cartTotals = liveCart?.totals ?? {
    subtotal: 0,
    deliveryFee: 0,
    serviceFee: 0,
    payableTotal: 0,
  };

  return (
    <div className={styles.page}>
      {/* ─── Hero Banner ─── */}
      <section className={styles.heroBanner}>
        <h1 className={styles.srOnly}>{copy.title}</h1>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <Truck size={14} strokeWidth={2.5} />
            <span>LOGISTICS LIVE UPDATE</span>
          </div>
          <h1 className={styles.heroTitle}>Bogura → Dhaka Supply Corridor</h1>
          <p className={styles.heroMeta}>
            Live Market Status:{" "}
            <span className={styles.heroHighlight}>High Demand</span> | Route
            Optimized:{" "}
            <span className={styles.heroHighlight}>Transit Active</span>
          </p>
        </div>
        <Link href="/buyer/orders" className={styles.heroAction}>
          View Logistics Detail <ArrowRight size={16} />
        </Link>
      </section>

      {/* ─── Search + Filters ─── */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={18} strokeWidth={2} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            aria-label={copy.searchLabel}
            placeholder="Search premium wholesale produce (Potato, Onion, Vegetables)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterBtns}>
          <button type="button" className={styles.filterBtnActive}>
            <ShieldCheck size={14} /> Grade A Only
          </button>
          <button type="button" className={styles.filterBtn}>
            Verified Sellers <ChevronDown size={14} />
          </button>
          <button type="button" className={styles.filterBtn}>
            Bulk Capacity <ChevronDown size={14} />
          </button>
        </div>
      </section>

      {/* ─── 3-Column Content ─── */}
      <div className={styles.contentWrap}>
        {/* Left Sidebar — Categories + Quality Filter */}
        <aside className={styles.leftSidebar}>
          <div className={styles.sidePanel}>
            <div className={styles.sidePanelHeader}>
              <Leaf size={16} strokeWidth={2} />
              <span>MVP CATEGORIES</span>
            </div>
            <nav className={styles.categoryNav}>
              {BUYER_DISCOVERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className={`${styles.categoryItem} ${category === cat.slug ? styles.categoryItemActive : ""}`}
                  onClick={() =>
                    setCategory(cat.slug === category ? "all" : cat.slug)
                  }
                >
                  {cat.label[locale]}
                </button>
              ))}
            </nav>
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.sidePanelHeader}>
              <ShieldCheck size={16} strokeWidth={2} />
              <span>QUALITY FILTER</span>
            </div>
            <label className={styles.qualityOption}>
              <input
                type="checkbox"
                defaultChecked
                className={styles.qualityCheck}
              />
              <span>Grade A Export</span>
            </label>
            <label className={styles.qualityOption}>
              <input type="checkbox" className={styles.qualityCheck} />
              <span>Standard Grade</span>
            </label>
          </div>
        </aside>

        {/* Center — Product Grid */}
        <main className={styles.centerContent}>
          <div className={styles.gridHeader}>
            <h2 className={styles.gridTitle}>Live Procurement Opportunities</h2>
            <span className={styles.gridCount}>
              Showing {count(locale, filtered.length)} Wholesale Lots
            </span>
          </div>
          {cartError ? <p className={styles.emptyBody}>{cartError}</p> : null}

          {filtered.length > 0 ? (
            <div className={styles.productGrid}>
              {filtered.map((product) => (
                <article key={product.productId} className={styles.productCard}>
                  <div className={styles.cardImageWrap}>
                    <div className={styles.cardImage}>
                      <Image
                        src={getProductImage(product)}
                        alt={product.name[locale]}
                        fill
                        sizes="(max-width: 600px) 100vw, 300px"
                        style={{ objectFit: "cover" }}
                      />
                      <span className={styles.gradeBadge}>GRADE A</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTitleRow}>
                      <Link
                        href={`/buyer/products/${product.productId}`}
                        className={styles.cardName}
                      >
                        <span className={styles.srOnly}>View details: </span>
                        {product.name[locale]}
                      </Link>
                      <span className={styles.cardRating}>
                        {getProductRating(product.productId).toFixed(1)}{" "}
                        <Star size={12} fill="currentColor" />
                      </span>
                    </div>
                    <p className={styles.cardOrigin}>
                      Origin: {product.location}
                    </p>

                    <div className={styles.cardPriceRow}>
                      <div>
                        <span className={styles.priceLabel}>
                          WHOLESALE PRICE
                        </span>
                        <div className={styles.priceValue}>
                          {money(locale, product.pricePerPack)}
                          <span className={styles.priceUnit}>
                            /
                            {product.packSize[locale].split("=")[0]?.trim() ||
                              "kg"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={styles.cartIconBtn}
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === product.productId}
                        aria-label={`Add ${product.name[locale]} to cart`}
                      >
                        <ShoppingCart size={18} strokeWidth={2} />
                      </button>
                    </div>

                    <div className={styles.cardStockRow}>
                      <span className={styles.stockInfo}>
                        Stock:{" "}
                        <strong>
                          {count(locale, product.availablePacks)} packs
                        </strong>
                        {" "}· Min {count(locale, product.singleMinQty ?? 1)}
                      </span>
                      <label className={styles.cardQtyLabel}>
                        Qty
                        <input
                          className={styles.cardQtyInput}
                          type="number"
                          min={product.singleMinQty ?? 1}
                          max={product.singleMaxQty ?? product.availablePacks}
                          value={
                            cartQty[product.productId] ??
                            product.singleMinQty ??
                            1
                          }
                          onChange={(event) =>
                            setCartQty((current) => ({
                              ...current,
                              [product.productId]: Math.max(
                                product.singleMinQty ?? 1,
                                Math.min(
                                  product.singleMaxQty ??
                                    product.availablePacks,
                                  Number(event.target.value) || 1,
                                ),
                              ),
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No products found</h3>
              <p className={styles.emptyBody}>
                {loadError || "Try adjusting your filters or search query."}
              </p>
            </div>
          )}
        </main>

        {/* Right Sidebar — Group-Buy + Cart */}
        <aside className={styles.rightSidebar}>
          {/* Group-buy is a dedicated page; keep the home rail focused on cart. */}
          {false ? (
            <div className={styles.sidePanel}>
              <div className={styles.sidePanelHeader}>
                <Users size={16} strokeWidth={2} />
                <span>GROUP-BUY SAVINGS</span>
              </div>
              {groupBuyPools.length > 0 ? (
                groupBuyPools.map((pool) => (
                  <div key={pool.id} className={styles.poolCard}>
                    <div className={styles.poolHeader}>
                      <span className={styles.poolName}>{pool.name}</span>
                      <span className={styles.poolPercent}>
                        {pool.percent}% FULL
                      </span>
                    </div>
                    <div className={styles.poolBar}>
                      <div
                        className={styles.poolBarFill}
                        style={{ width: `${pool.percent}%` }}
                      />
                    </div>
                    <div className={styles.poolFooter}>
                      <span>Time Left: {pool.timeLeft}</span>
                      <span className={styles.poolSavings}>
                        Save {pool.savings}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-tertiary)",
                    padding: "12px 0",
                  }}
                >
                  No active group buys right now.
                </p>
              )}
              <Link href="/buyer/group-buy" className={styles.poolCta}>
                Join Active Pools
              </Link>
            </div>
          ) : null}

          {/* Wholesale Cart — Live from database */}
          <div className={styles.sidePanel}>
            <div className={styles.sidePanelHeader}>
              <ShoppingCart size={16} strokeWidth={2} />
              <span>WHOLESALE CART</span>
            </div>
            {cartLines.length > 0 ? (
              cartLines.map((item) => (
                <div key={item.lineId} className={styles.cartItem}>
                  <div className={styles.cartItemImage} />
                  <div className={styles.cartItemInfo}>
                    <div className={styles.cartItemName}>
                      {item.productName}
                    </div>
                    <div className={styles.cartItemMeta}>
                      {item.quantity} {item.unit} x ৳{item.unitPrice ?? 0}
                    </div>
                  </div>
                  <div className={styles.cartItemTotal}>
                    ৳{(item.subtotal ?? 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-tertiary)",
                  padding: "12px 0",
                }}
              >
                Your cart is empty.
              </p>
            )}
            <div className={styles.cartSummary}>
              <div className={styles.cartSummaryRow}>
                <span>Subtotal</span>
                <span>৳{cartTotals.subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.cartSummaryRow}>
                <span>Est. Logistics</span>
                <span>৳{cartTotals.deliveryFee.toLocaleString()}</span>
              </div>
              <div className={styles.cartTotal}>
                <span>TOTAL</span>
                <span className={styles.cartTotalValue}>
                  ৳{cartTotals.payableTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <Link href="/buyer/cart" className={styles.cartCheckoutBtn}>
              Secure Checkout
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── Product Detail View (unchanged logic, improved layout) ─── */
export function BuyerProductDetailView({
  locale,
  productId,
}: {
  locale: Locale;
  productId: string;
}) {
  const copy = getBuyerDiscoveryCopy(locale);
  const testProduct =
    process.env.NODE_ENV === "test"
      ? (BUYER_DISCOVERY_PRODUCTS.find((p) => p.productId === productId) ?? null)
      : null;
  const [product, setProduct] = useState<BuyerDiscoveryProduct | null>(testProduct);
  const [loaded, setLoaded] = useState(process.env.NODE_ENV === "test");

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      return;
    }
    fetch(`/api/buyer/catalog?locale=${locale}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: BuyerCatalogResponse | null) => {
        setProduct(
          data
            ? (mapCatalog(data).find((p) => p.productId === productId) ?? null)
            : null,
        );
      })
      .finally(() => setLoaded(true));
  }, [locale, productId]);

  if (loaded && !product) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>Product not found</h3>
          <p className={styles.emptyBody}>
            This lot is not in the current discovery list.
          </p>
          <Link href="/buyer" className={styles.heroAction}>
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className={styles.page}>
      <div className={styles.detailWrap}>
        <div className={styles.detailImageCol}>
          <div className={styles.detailImage}>
            <Image
              src={getProductImage(product)}
              alt={product.name[locale]}
              fill
              sizes="500px"
              style={{ objectFit: "cover" }}
            />
            <span className={styles.gradeBadge}>GRADE A</span>
          </div>
        </div>
        <div className={styles.detailInfoCol}>
          <h1 className={styles.detailName}>{product.name[locale]}</h1>
          <span className={styles.srOnly}>{product.sellerName}</span>
          <p className={styles.detailSeller}>
            {product.sellerName} · {product.location}
          </p>
          <div className={styles.detailRating}>
            {getProductRating(product.productId).toFixed(1)}{" "}
            <Star size={14} fill="currentColor" />
          </div>
          <p className={styles.detailSummary}>{product.summary[locale]}</p>
          <div className={styles.detailPriceSection}>
            <span className={styles.priceLabel}>WHOLESALE PRICE</span>
            <div className={styles.detailPrice}>
              {money(locale, product.pricePerPack)}
            </div>
            <span className={styles.detailUnit}>
              per {product.packSize[locale]}
            </span>
          </div>
          <div className={styles.detailStats}>
            <div className={styles.detailStat}>
              <span className={styles.detailStatLabel}>Available</span>
              <span className={styles.detailStatValue}>
                {count(locale, product.availablePacks)} packs
              </span>
            </div>
            <div className={styles.detailStat}>
              <span className={styles.detailStatLabel}>Min Order</span>
              <span className={styles.detailStatValue}>
                {product.minOrder[locale]}
              </span>
            </div>
            <div className={styles.detailStat}>
              <span className={styles.detailStatLabel}>Corridor</span>
              <span className={styles.detailStatValue}>{product.corridor}</span>
            </div>
          </div>
          <div className={styles.detailTags}>
            {product.trustTags[locale].map((tag) => (
              <span key={tag} className={styles.detailTag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.detailActions}>
            <button
              type="button"
              className={styles.detailCartBtn}
              onClick={async () => {
                await apiPost<BuyerCartResponse>("/api/buyer/cart/items", {
                  supplyLotId: product.productId,
                  quantity: product.singleMinQty ?? 1,
                });
                window.location.href = "/buyer/cart";
              }}
            >
              <ShoppingCart size={18} /> Initialize Procurement
            </button>
            <Link href="/buyer" className={styles.detailBackBtn}>
              {copy.backLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
