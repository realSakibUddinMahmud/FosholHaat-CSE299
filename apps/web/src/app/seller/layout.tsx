"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
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
import styles from "./seller-shell.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { label: "Supply", href: "/seller/supply", icon: Package },
  { label: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { label: "Payouts", href: "/seller/payouts", icon: CreditCard },
  { label: "DWR Records", href: "/seller/dwr", icon: FileText },
] as const;

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

        <div className={styles.sidebarBottom}>
          <Link href="/seller/account" className={styles.navItem}>
            <User size={18} strokeWidth={2} />
            <span>Account</span>
          </Link>
        </div>

        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <User size={16} strokeWidth={2} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Arif Khan</div>
            <div className={styles.userRole}>Premium Seller</div>
          </div>
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
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <Bell size={18} strokeWidth={2} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Settings">
              <Settings size={18} strokeWidth={2} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
