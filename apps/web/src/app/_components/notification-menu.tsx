"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import styles from "./notification-menu.module.css";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  tone?: "urgent" | "info" | "success";
};

export function NotificationMenu({
  label,
  items,
}: {
  label: string;
  items: NotificationItem[];
}) {
  const count = items.length;
  return (
    <details className={styles.menu}>
      <summary className={styles.trigger} aria-label={`${label} (${count})`}>
        <Bell size={18} strokeWidth={2} />
        {count > 0 ? <span className={styles.badge}>{count}</span> : null}
      </summary>
      <section className={styles.panel} aria-label={label}>
        <div className={styles.head}>
          <strong>{label}</strong>
          <span>{count} open</span>
        </div>
        <div className={styles.list}>
          {items.length ? (
            items.slice(0, 6).map((item) => (
              <Link key={item.id} href={item.href} className={styles.item}>
                <span className={`${styles.dot} ${styles[item.tone ?? "info"]}`} />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.body}</small>
                </span>
              </Link>
            ))
          ) : (
            <p className={styles.empty}>No active notifications.</p>
          )}
        </div>
      </section>
    </details>
  );
}
