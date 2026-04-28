"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Filter, Search, ShoppingCart } from "lucide-react";
import type { BuyerCatalogResponse, BuyerCartResponse } from "@fosholhaat/types";
import { apiPost } from "../../../lib/api-client";
import styles from "./categories.module.css";

const CATEGORY_IMAGES: Record<string, string> = {
  potato: "/images/potato.png",
  onion: "/images/onion.png",
  vegetables: "/images/vegetables.png",
};

interface LiveProduct {
  productId: string;
  title: string;
  commodity: string;
  priceLabel: string;
  packageLabel: string;
  stockLabel: string;
  sellerLabel: string;
  verificationLabel?: string;
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<{slug: string; label: string; productCount: number}[]>([]);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/buyer/catalog?locale=en", { cache: "no-store" })
      .then(res => res.ok ? res.json() : null)
      .then((data: BuyerCatalogResponse | null) => {
        if (data) {
          setProducts(data.highlights);
          setCategories(data.categories);
        }
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const filtered = products.filter(p => {
    const catMatch = activeCategory === "all" || p.commodity === activeCategory;
    const qMatch = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.sellerLabel.toLowerCase().includes(query.toLowerCase());
    return catMatch && qMatch;
  });

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await apiPost<BuyerCartResponse>("/api/buyer/cart/items", { supplyLotId: productId, quantity: 1 });
    } catch { /* silent */ } finally {
      setAddingToCart(null);
    }
  };

  const activeCatLabel = activeCategory === "all" ? "All Products" : categories.find(c => c.slug === activeCategory)?.label || activeCategory;

  return (
    <main className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{activeCatLabel}</h1>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={16} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder={`Search in ${activeCatLabel}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.categoryTabs}>
        <button
          type="button"
          className={activeCategory === "all" ? styles.tabActive : styles.tab}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.slug}
            type="button"
            className={activeCategory === cat.slug ? styles.tabActive : styles.tab}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.label} ({cat.productCount})
          </button>
        ))}
      </div>

      <div className={styles.sortRow}>
        <button type="button" className={styles.sortBtn}>
          <Filter size={14} /> Price
        </button>
        <button type="button" className={styles.sortBtn}>Grade</button>
        <button type="button" className={styles.sortBtn}>View</button>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.productGrid}>
        {filtered.map(product => {
          const imgSrc = CATEGORY_IMAGES[product.commodity] || "/images/vegetables.png";
          const price = product.priceLabel.replace(/[^\d৳.]/g, '').trim() || product.priceLabel;

          return (
            <article key={product.productId} className={styles.productCard}>
              <div className={styles.cardImageWrap}>
                <Image
                  src={imgSrc}
                  alt={product.title}
                  fill
                  sizes="(max-width: 600px) 50vw, 250px"
                  style={{ objectFit: "cover" }}
                />
                <span className={styles.gradeBadge}>VERIFIED GRADE A</span>
              </div>
              <div className={styles.cardBody}>
                <Link href={`/buyer/products/${product.productId}`} className={styles.cardName}>
                  {product.title}
                </Link>
                <div className={styles.priceRow}>
                  <div>
                    <span className={styles.price}>{product.priceLabel}</span>
                    <span className={styles.unit}> / {product.packageLabel}</span>
                  </div>
                </div>
                <div className={styles.stockRow}>
                  <span className={styles.stockLabel}>✓ {product.stockLabel}</span>
                  <button
                    type="button"
                    className={styles.cartBtn}
                    onClick={() => handleAddToCart(product.productId)}
                    disabled={addingToCart === product.productId}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!filtered.length && !error ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No products found</p>
          <p className={styles.emptyDesc}>Try a different category or search term.</p>
        </div>
      ) : null}
    </main>
  );
}
