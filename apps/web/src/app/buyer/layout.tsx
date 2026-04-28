"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, ShoppingCart, User } from "lucide-react";
import styles from "./buyer-shell.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/buyer" },
  { label: "Categories", href: "/buyer/categories" },
  { label: "Group Buying", href: "/buyer/group-buy" },
  { label: "Orders", href: "/buyer/orders" },
  { label: "Cart", href: "/buyer/cart" },
] as const;

const FOOTER_INDICES = [
  { label: "BOGURA INDEX", commodity: "Potato", price: "৳23.80", change: "(-2%)", down: true },
  { label: "PABNA INDEX", commodity: "Onion", price: "৳41.20", change: "(+1.2%)", down: false },
  { label: "DHAKA WHOLESALE", commodity: "Mixed Veg", price: "৳44.00", change: "(Stable)", down: false },
] as const;

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      {/* ─── Header Nav Bar ─── */}
      <header className={styles.header}>
        <Link href="/buyer" className={styles.brand}>
          <Image src="/logo.png" alt="" width={36} height={36} className={styles.brandLogo} />
          <span className={styles.brandName}>FosholHaat</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.navLinkActive : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerRight}>
          <span className={styles.verifiedBadge}>
            <span className={styles.verifiedDot} />
            BUYER VERIFIED
          </span>
          <button type="button" className={styles.iconBtn} aria-label="Notifications" onClick={() => alert('Notifications coming soon')}>
            <Bell size={18} strokeWidth={2} />
          </button>
          <Link href="/buyer/cart" className={styles.iconBtn} aria-label="Cart">
            <ShoppingCart size={18} strokeWidth={2} />
          </Link>
          <Link href="/buyer/account" className={styles.avatarBtn} aria-label="Account">
            <User size={18} strokeWidth={2} />
          </Link>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <main className={styles.main}>{children}</main>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.indices}>
            {FOOTER_INDICES.map((idx) => (
              <div key={idx.label} className={styles.indexBlock}>
                <div className={styles.indexLabel}>{idx.label}</div>
                <div className={styles.indexValue}>
                  {idx.commodity} {idx.price}{" "}
                  <span className={idx.down ? styles.indexDown : styles.indexUp}>{idx.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.footerRight}>
            <span className={styles.copyright}>© 2024 FosholHaat B2B. All prices real-time.</span>
            <Link href="/help" className={styles.footerLink}>Help Center</Link>
            <Link href="/policies" className={styles.footerLink}>Corridor Policies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
