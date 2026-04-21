"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, MapPin, Search, Sparkles, Store, Truck } from "lucide-react";
import type { Locale } from "@fosholhaat/types";
import { BrandLockup } from "../../components/brand-lockup";
import {
  BUYER_DISCOVERY_CATEGORIES,
  BUYER_DISCOVERY_PRODUCTS,
  getBuyerDiscoveryCopy,
  getBuyerDiscoveryProduct,
  type BuyerDiscoveryCategorySlug,
  type BuyerDiscoveryProduct,
} from "./discovery-data";
import styles from "./buyer-discovery.module.css";

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

function matches(product: BuyerDiscoveryProduct, locale: Locale, query: string) {
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

export function BuyerDiscoveryView({ locale }: { locale: Locale }) {
  const copy = getBuyerDiscoveryCopy(locale);
  const [category, setCategory] = useState<BuyerDiscoveryCategorySlug | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      BUYER_DISCOVERY_PRODUCTS.filter((product) => {
        const categoryMatch = category === "all" || product.categorySlug === category;
        return categoryMatch && matches(product, locale, query);
      }),
    [category, locale, query]
  );

  const totalAvailable = BUYER_DISCOVERY_PRODUCTS.reduce((sum, product) => sum + product.availablePacks, 0);
  const activeCategory = BUYER_DISCOVERY_CATEGORIES.find((item) => item.slug === category);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.hero}>
          <BrandLockup subtitle={copy.resultsLabel} />
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{copy.badge}</span>
            <span className={styles.badgeGhost}>
              <Truck size={14} strokeWidth={2.3} aria-hidden="true" />
              <span>{copy.corridorLabel}: Bogura {"->"} Dhaka</span>
            </span>
          </div>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.lead}>{copy.lead}</p>

          <div className={styles.statsRow} aria-label={copy.resultsLabel}>
            <article className={styles.statCard}>
              <Store size={16} strokeWidth={2.2} aria-hidden="true" />
              <div>
                <div className={styles.statValue}>{count(locale, BUYER_DISCOVERY_PRODUCTS.length)}</div>
                <div className={styles.statLabel}>{copy.resultsLabel}</div>
              </div>
            </article>
            <article className={styles.statCard}>
              <Sparkles size={16} strokeWidth={2.2} aria-hidden="true" />
              <div>
                <div className={styles.statValue}>{count(locale, totalAvailable)}</div>
                <div className={styles.statLabel}>{copy.corridorLabel}</div>
              </div>
            </article>
            <article className={styles.statCard}>
              <BadgeCheck size={16} strokeWidth={2.2} aria-hidden="true" />
              <div>
                <div className={styles.statValue}>{count(locale, 3)}</div>
                <div className={styles.statLabel}>{copy.trustTitle}</div>
              </div>
            </article>
          </div>
        </header>

        <section className={styles.workspace} aria-label={copy.resultsLabel}>
          <div className={styles.toolbar}>
            <label className={styles.searchWrap}>
              <span className={styles.searchLabel}>{copy.searchLabel}</span>
              <span className={styles.searchBox}>
                <Search size={16} strokeWidth={2.2} aria-hidden="true" />
                <input
                  className={styles.searchInput}
                  type="search"
                  value={query}
                  placeholder={copy.searchPlaceholder}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </span>
            </label>

            <div className={styles.filterBlock}>
              <div className={styles.filterLabel}>{copy.categoryLabel}</div>
              <div className={styles.chipRow}>
                <button
                  type="button"
                  className={`${styles.chip} ${category === "all" ? styles.chipActive : ""}`}
                  onClick={() => setCategory("all")}
                >
                  {copy.allLabel}
                </button>
                {BUYER_DISCOVERY_CATEGORIES.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    className={`${styles.chip} ${category === item.slug ? styles.chipActive : ""}`}
                    onClick={() => setCategory(item.slug)}
                  >
                    {item.label[locale]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.contentGrid}>
            <section className={styles.listPanel}>
              <div className={styles.panelHead}>
                <div>
                  <h2 className={styles.panelTitle}>{copy.resultsLabel}</h2>
                  <p className={styles.panelLead}>{activeCategory ? activeCategory.blurb[locale] : copy.lead}</p>
                </div>
                <div className={styles.panelCount}>{count(locale, filtered.length)}</div>
              </div>

              {filtered.length ? (
                <div className={styles.productGrid}>
                  {filtered.map((product) => (
                    <article key={product.productId} className={styles.productCard}>
                      <div className={styles.productTop}>
                        <div>
                          <div className={styles.productName}>{product.name[locale]}</div>
                          <div className={styles.productMeta}>{product.sellerName}</div>
                        </div>
                        <div className={styles.price}>{money(locale, product.pricePerPack)}</div>
                      </div>

                      <p className={styles.productSummary}>{product.summary[locale]}</p>

                      <div className={styles.factRow}>
                        <span className={styles.fact}>
                          <MapPin size={14} strokeWidth={2.2} aria-hidden="true" />
                          {product.location}
                        </span>
                        <span className={styles.fact}>{product.packSize[locale]}</span>
                      </div>

                      <div className={styles.tagRow}>
                        {product.trustTags[locale].map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/buyer/products/${product.productId}`}
                        className={styles.productLink}
                        aria-label={`${copy.detailActionLabel}: ${product.name[locale]}`}
                      >
                        <span className={styles.srOnly}>{product.name[locale]}</span>
                        <span>{copy.detailActionLabel}</span>
                        <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <h3 className={styles.emptyTitle}>{copy.emptyTitle}</h3>
                  <p className={styles.emptyBody}>{copy.emptyBody}</p>
                </div>
              )}
            </section>

            <aside className={styles.sidePanel}>
              <article className={styles.sideCard}>
                <div className={styles.sideTitle}>{copy.trustTitle}</div>
                <p className={styles.sideBody}>{copy.trustBody}</p>
                <div className={styles.sideStack}>
                  <span className={styles.sidePill}>No hidden fee drift</span>
                  <span className={styles.sidePill}>Bilingual browse-ready copy</span>
                  <span className={styles.sidePill}>Read-only discovery lane</span>
                </div>
              </article>

              <article className={styles.sideCard}>
                <div className={styles.sideTitle}>{copy.corridorLabel}</div>
                <p className={styles.sideBody}>Listings stay anchored to the approved Bogura {"->"} Dhaka corridor for this slice.</p>
              </article>
            </aside>
          </div>
        </section>
      </section>
    </main>
  );
}

export function BuyerProductDetailView({
  locale,
  productId,
}: {
  locale: Locale;
  productId: string;
}) {
  const copy = getBuyerDiscoveryCopy(locale);
  const product = getBuyerDiscoveryProduct(productId);
  const missingTitle = locale === "bn" ? "পণ্য পাওয়া যায়নি" : "Product not found";
  const missingBody =
    locale === "bn"
      ? "এই লট এখনকার discovery তালিকায় নেই।"
      : "This lot is not in the current discovery list.";
  const availabilityReady =
    locale === "bn"
      ? `${count(locale, product?.availablePacks ?? 0)} প্যাক প্রস্তুত`
      : `${count(locale, product?.availablePacks ?? 0)} packs ready`;

  if (!product) {
    return (
      <main className={styles.page}>
        <section className={styles.shell}>
          <div className={styles.hero}>
            <span className={styles.badge}>{copy.detailBadge}</span>
            <h1 className={styles.title}>{missingTitle}</h1>
            <p className={styles.lead}>{missingBody}</p>
            <Link href="/buyer" className={styles.backLink}>
              {copy.backLabel}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const related = BUYER_DISCOVERY_PRODUCTS.filter(
    (item) => item.categorySlug === product.categorySlug && item.productId !== product.productId
  ).slice(0, 2);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.detailHero}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>{copy.detailBadge}</span>
            <span className={styles.badgeGhost}>{product.corridor}</span>
          </div>
          <h1 className={styles.title}>{product.name[locale]}</h1>
          <p className={styles.lead}>{product.summary[locale]}</p>

          <div className={styles.detailActions}>
            <Link href="/buyer" className={styles.backLink}>
              {copy.backLabel}
            </Link>
            <span className={styles.priceHero}>{money(locale, product.pricePerPack)}</span>
          </div>
        </header>

        <div className={styles.contentGrid}>
          <section className={styles.listPanel}>
            <article className={styles.detailCard}>
              <div className={styles.detailSplit}>
                <div>
                  <div className={styles.detailLabel}>{copy.sellerLabel}</div>
                  <div className={styles.detailValue}>{product.sellerName}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>{copy.categoryLabel}</div>
                  <div className={styles.detailValue}>
                    {BUYER_DISCOVERY_CATEGORIES.find((item) => item.slug === product.categorySlug)?.label[locale]}
                  </div>
                </div>
                <div>
                  <div className={styles.detailLabel}>{copy.packSizeLabel}</div>
                  <div className={styles.detailValue}>{product.packSize[locale]}</div>
                </div>
                <div>
                  <div className={styles.detailLabel}>{copy.minimumOrderLabel}</div>
                  <div className={styles.detailValue}>{product.minOrder[locale]}</div>
                </div>
              </div>
            </article>

            <article className={styles.detailCard}>
              <div className={styles.detailLabel}>{copy.trustTitle}</div>
              <div className={styles.tagRow}>
                {product.trustTags[locale].map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className={styles.productSummary}>{copy.trustBody}</p>
            </article>

            <article className={styles.detailCard}>
              <div className={styles.detailLabel}>{copy.availabilityLabel}</div>
              <div className={styles.availabilityRow}>
                <span className={styles.availabilityPill}>{availabilityReady}</span>
                <span className={styles.availabilityPill}>{product.location}</span>
              </div>
            </article>
          </section>

          <aside className={styles.sidePanel}>
            <article className={styles.sideCard}>
              <div className={styles.sideTitle}>{copy.relatedTitle}</div>
              <div className={styles.sideStack}>
                {related.map((item) => (
                  <Link key={item.productId} href={`/buyer/products/${item.productId}`} className={styles.relatedLink}>
                    <span>{item.name[locale]}</span>
                    <strong>{money(locale, item.pricePerPack)}</strong>
                  </Link>
                ))}
              </div>
            </article>

            <article className={styles.sideCard}>
              <div className={styles.sideTitle}>{copy.corridorLabel}</div>
              <p className={styles.sideBody}>{product.corridor}</p>
              <p className={styles.sideBody}>{copy.trustBody}</p>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
