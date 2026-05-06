"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import type { SellerOrderQueueResponse } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import { NotificationMenu, type NotificationItem } from "../_components/notification-menu";
import styles from "./seller-shell.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { label: "Supply", href: "/seller/supply", icon: Package },
  { label: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { label: "Payouts", href: "/seller/payouts", icon: CreditCard },
  { label: "DWR Records", href: "/seller/dwr", icon: FileText },
] as const;

type AccountProfile = {
  fullName: string;
  businessName?: string;
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    apiFetch<AccountProfile>("/api/auth/me")
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    apiFetch<SellerOrderQueueResponse>("/api/seller/orders")
      .then((queue) => {
        const orderItems = queue.orders.map((order) => ({
          id: order.id,
          title: order.nextAction === "accept" ? "Order needs review" : order.nextAction === "print_label" ? "Print hub label" : order.nextAction === "ready_for_hub" ? "Mark ready for hub" : "Order update",
          body: `${order.productName ?? "Order"} · ${order.quantityLabel} · ${order.paymentStatus}`,
          href: `/seller/orders/${order.id}`,
          tone: order.nextAction === "accept" ? "urgent" as const : "info" as const,
        }));
        const groupItems = queue.groupProgress.map((group) => ({
          id: group.id,
          title: "Group buy progress",
          body: `${group.title}: ${group.committedQty}/${group.targetQty} ${group.unit}`,
          href: "/seller/orders",
          tone: "info" as const,
        }));
        setNotifications([...orderItems, ...groupItems]);
      })
      .catch(() => setNotifications([]));
  }, []);

  const displayName = profile?.businessName || profile?.fullName || "Seller profile";

  return (
    <div className={styles.shell}>
      {/* ─── Left Sidebar ─── */}
      <aside className={styles.sidebar}>
        <Link href="/seller" className={styles.brand}>
          <Image src="/logo.png" alt="" width={36} height={36} className={styles.brandLogo} />
          <div className={styles.brandText}>
            <span className={styles.brandName}>FOSHOLHAAT</span>
            <span className={styles.brandSub}>Seller Portal</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/seller" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <User size={16} strokeWidth={2} />
          </div>
          <Link href="/seller/account" className={styles.userInfo}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userRole}>{profile?.fullName ?? "Seller workspace"}</div>
          </Link>
          <form action="/api/auth/logout" method="post" className={styles.logoutForm}>
            <button type="submit" className={styles.logoutBtn} aria-label="Logout">
              <LogOut size={16} strokeWidth={2} />
            </button>
          </form>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className={styles.mainArea}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.pageContext}>Supply Operations Desk</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.searchWrap}>
              <ClipboardList size={16} strokeWidth={2} className={styles.searchIcon} />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search lots or orders..."
              />
            </div>
            <NotificationMenu label="Seller notifications" items={notifications} />
            <Link href="/seller/account" className={styles.iconBtn} aria-label="Settings">
              <Settings size={18} strokeWidth={2} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
