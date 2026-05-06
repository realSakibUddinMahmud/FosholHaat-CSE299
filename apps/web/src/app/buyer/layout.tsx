"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import type { BuyerOrderSummary } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import { NotificationMenu, type NotificationItem } from "../_components/notification-menu";
import styles from "./buyer-shell.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/buyer" },
  { label: "Group Buying", href: "/buyer/group-buy" },
  { label: "Orders", href: "/buyer/orders" },
  { label: "Cart", href: "/buyer/cart" },
  { label: "Account", href: "/buyer/account" },
] as const;

const FOOTER_INDICES = [
  { label: "BOGURA INDEX", commodity: "Potato", price: "৳23.80", change: "(-2%)", down: true },
  { label: "PABNA INDEX", commodity: "Onion", price: "৳41.20", change: "(+1.2%)", down: false },
  { label: "DHAKA WHOLESALE", commodity: "Mixed Veg", price: "৳44.00", change: "(Stable)", down: false },
] as const;

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    apiFetch<BuyerOrderSummary[]>("/api/buyer/orders")
      .then((orders) => {
        setNotifications(
          orders
            .filter((order) => ["PENDING_GROUP_LOCK", "PENDING_SELLER_REVIEW", "CONFIRMED", "READY_FOR_HUB_HANDOFF", "HUB_RECEIVED", "READY_FOR_DISPATCH", "READY_FOR_BUYER_HANDOFF"].includes(order.status))
            .map((order) => ({
              id: order.id,
              title: order.status === "PENDING_GROUP_LOCK" ? "Group target pending" : order.status === "PENDING_SELLER_REVIEW" ? "Waiting for seller" : "Order update",
              body: `${order.title} · ${order.total}`,
              href: `/buyer/orders/${order.id}/tracking`,
              tone: order.status === "READY_FOR_BUYER_HANDOFF" ? "success" : "info",
            })),
        );
      })
      .catch(() => setNotifications([]));
  }, []);

  return (
    <div className={styles.shell}>
      {/* ─── Header Nav Bar ─── */}
      <header className={styles.header}>
        <Link href="/buyer" className={styles.brand}>
          <Image src="/logo.png" alt="" width={36} height={36} className={styles.brandLogo} />
          <span className={styles.brandName}>FosholHaat</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/buyer" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.headerRight}>
          <span className={styles.verifiedBadge}>
            <span className={styles.verifiedDot} />
            BUYER VERIFIED
          </span>
          <NotificationMenu label="Buyer notifications" items={notifications} />
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
            <span className={styles.copyright}>© 2026 FosholHaat B2B. All prices real-time.</span>
            <Link href="/help" className={styles.footerLink}>Help Center</Link>
            <Link href="/policies" className={styles.footerLink}>Corridor Policies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
