"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  GitMerge,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Truck,
  User,
  Zap,
} from "lucide-react";
import styles from "./hub-shell.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/hub", icon: LayoutDashboard },
  { label: "Inbound", href: "/hub/inbound", icon: ArrowDown },
  { label: "Sorting", href: "/hub/sorting", icon: GitMerge },
  { label: "Dispatch", href: "/hub/dispatch", icon: ArrowUp },
  { label: "Exceptions", href: "/hub/exceptions", icon: AlertTriangle },
  { label: "Coordination", href: "/hub/coordination", icon: Truck },
] as const;

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      {/* ─── Left Sidebar ─── */}
      <aside className={styles.sidebar}>
        <Link href="/hub" className={styles.brand}>
          <Image src="/logo.png" alt="" width={36} height={36} className={styles.brandLogo} />
          <div className={styles.brandText}>
            <span className={styles.brandName}>FosholHaat Hub</span>
            <span className={styles.brandSub}>OPERATIONAL HUB</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/hub" && pathname.startsWith(href));
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
          <Link href="/hub/account" className={styles.navItem}>
            <User size={18} strokeWidth={2} />
            <span>Account</span>
          </Link>

          <button type="button" className={styles.statusBtn}>
            <Zap size={16} strokeWidth={2} />
            System Status
          </button>

          <div className={styles.bottomLinks}>
            <a href="/support" className={styles.bottomLink}>Support</a>
            <a href="/logs" className={styles.bottomLink}>Operational Logs</a>
          </div>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className={styles.mainArea}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.searchWrap}>
            <Truck size={16} strokeWidth={2} className={styles.searchIcon} />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search corridors, gates, or SKUs..."
            />
          </div>
          <div className={styles.topbarRight}>
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <Bell size={18} strokeWidth={2} />
              <span className={styles.notifDot} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Help">
              <HelpCircle size={18} strokeWidth={2} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Settings">
              <Settings size={18} strokeWidth={2} />
            </button>
            <div className={styles.hubUser}>
              <div className={styles.hubUserInfo}>
                <div className={styles.hubUserName}>Operations Lead</div>
                <div className={styles.hubUserShift}>SHIFT B-42</div>
              </div>
              <div className={styles.hubAvatar}>
                <User size={16} strokeWidth={2} />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
