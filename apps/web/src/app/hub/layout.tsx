"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  GitMerge,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Truck,
  User,
  Zap,
} from "lucide-react";
import type { HubDispatchQueueResponse, HubExceptionListResponse, InboundReceiptQueueResponse, SortingQueueResponse } from "@fosholhaat/types";
import { apiFetch } from "../../lib/api-client";
import { NotificationMenu, type NotificationItem } from "../_components/notification-menu";
import styles from "./hub-shell.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/hub", icon: LayoutDashboard },
  { label: "Inbound", href: "/hub/inbound", icon: ArrowDown },
  { label: "Sorting", href: "/hub/sorting", icon: GitMerge },
  { label: "Dispatch", href: "/hub/dispatch", icon: ArrowUp },
  { label: "Exceptions", href: "/hub/exceptions", icon: AlertTriangle },
  { label: "Coordination", href: "/hub/coordination", icon: Truck },
] as const;

type HubProfile = {
  fullName?: string;
  businessName?: string;
  role?: string;
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<HubProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    apiFetch<HubProfile>("/api/auth/me").then(setProfile).catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    Promise.allSettled([
      apiFetch<InboundReceiptQueueResponse>("/api/hub/inbound"),
      apiFetch<SortingQueueResponse>("/api/hub/sorting"),
      apiFetch<HubDispatchQueueResponse>("/api/hub/dispatch"),
      apiFetch<HubExceptionListResponse>("/api/hub/exceptions"),
    ]).then(([inbound, sorting, dispatch, exceptions]) => {
      const items: NotificationItem[] = [];
      if (inbound.status === "fulfilled") {
        inbound.value.receipts
          .filter((receipt) => receipt.status === "PENDING" || receipt.status === "DISCREPANCY")
          .forEach((receipt) => items.push({
            id: receipt.id,
            title: receipt.status === "DISCREPANCY" ? "Inbound discrepancy" : "Inbound receipt pending",
            body: `${receipt.commodity} · ${receipt.expectedQuantity} ${receipt.unit}`,
            href: `/hub/inbound/${receipt.id}`,
            tone: receipt.status === "DISCREPANCY" ? "urgent" : "info",
          }));
      }
      if (sorting.status === "fulfilled") {
        sorting.value.batches
          .filter((batch) => ["READY", "IN_PROGRESS", "HOLD"].includes(batch.status))
          .forEach((batch) => items.push({
            id: batch.batchId,
            title: batch.status === "HOLD" ? "Sorting hold" : "Sorting batch update",
            body: `${batch.commodityLabel} · ${batch.nextActionLabel}`,
            href: `/hub/sorting/${batch.batchId}`,
            tone: batch.status === "HOLD" ? "urgent" : "info",
          }));
      }
      if (dispatch.status === "fulfilled") {
        dispatch.value.loads
          .filter((load) => load.status !== "departed")
          .forEach((load) => items.push({
            id: load.loadId,
            title: load.status === "ready" ? "Dispatch ready" : "Dispatch staging",
            body: `${load.routeName} · ${load.parcelCount} parcels · ${load.assignmentState}`,
            href: `/hub/dispatch/${load.loadId}`,
            tone: load.status === "ready" ? "urgent" : "info",
          }));
      }
      if (exceptions.status === "fulfilled") {
        exceptions.value.exceptions
          .filter((exception) => exception.statusTab !== "resolved")
          .forEach((exception) => items.push({
            id: exception.exceptionId,
            title: exception.severity === "critical" ? "Critical exception" : "Hub exception",
            body: `${exception.title} · ${exception.recommendedActionLabel}`,
            href: `/hub/exceptions/${exception.exceptionId}`,
            tone: exception.severity === "critical" ? "urgent" : "info",
          }));
      }
      setNotifications(items);
    });
  }, []);

  const profileName = profile?.businessName || profile?.fullName || "Hub manager";
  const profileRole = profile?.role ? profile.role.replace("_", " ") : "Operations hub";

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
            <NotificationMenu label="Hub notifications" items={notifications} />
            <button type="button" className={styles.iconBtn} aria-label="Help">
              <HelpCircle size={18} strokeWidth={2} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Settings">
              <Settings size={18} strokeWidth={2} />
            </button>
            <details className={styles.profileMenu}>
              <summary className={styles.hubUser} aria-label="Hub manager profile">
              <div className={styles.hubUserInfo}>
                <div className={styles.hubUserName}>{profileName}</div>
                <div className={styles.hubUserShift}>{profileRole}</div>
              </div>
              <div className={styles.hubAvatar}>
                <User size={16} strokeWidth={2} />
              </div>
              </summary>
              <section className={styles.profilePanel}>
                <strong>{profileName}</strong>
                <span>{profileRole}</span>
                <a href="/support">Support desk</a>
                <form action="/api/auth/logout" method="post">
                  <button type="submit">Logout</button>
                </form>
              </section>
            </details>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
