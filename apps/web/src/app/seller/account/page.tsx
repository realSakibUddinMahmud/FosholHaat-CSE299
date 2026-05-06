"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Landmark, Mail, Package, Phone, UserRound, Wallet } from "lucide-react";
import type { SellerPayoutListResponse, SellerSupplyListResponse } from "@fosholhaat/types";
import { apiFetch } from "../../../lib/api-client";
import styles from "../supply/supply.module.css";

type SellerProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  locale: string;
  businessName?: string;
  corridor?: string;
  district?: string;
};

function value(text?: string | number | null) {
  return text === undefined || text === null || text === "" ? "Not saved" : String(text);
}

function corridorLabel(corridor?: string | null) {
  if (!corridor) return "Not saved";
  return corridor.replace(/-/g, " -> ");
}

function displayEmail(email?: string) {
  return email?.endsWith("@fosholhaat.local") ? "Not provided" : value(email);
}

export default function SellerAccountPage() {
  const [supply, setSupply] = useState<SellerSupplyListResponse | null>(null);
  const [payouts, setPayouts] = useState<SellerPayoutListResponse | null>(null);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<SellerProfile>("/api/auth/me"),
      apiFetch<SellerSupplyListResponse>("/api/seller/supply"),
      apiFetch<SellerPayoutListResponse>("/api/seller/payouts"),
    ])
      .then(([profileData, supplyData, payoutData]) => {
        setProfile(profileData);
        setSupply(supplyData);
        setPayouts(payoutData);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.heroKicker}>Seller profile</p>
          <h1 className={styles.heroTitle}>{profile?.businessName ?? profile?.fullName ?? "Seller account"}</h1>
          <p className={styles.heroSubtitle}>{profile?.fullName ? `Managed by ${profile.fullName}` : "Live seller account information."}</p>
        </div>
      </section>

      {error ? <section className={styles.supportCard}><p className={styles.helperText}>{error}</p></section> : null}

      <section className={styles.summaryCard}>
        <div className={styles.summaryTop}>
          <div className={styles.summaryChip}>
            <BadgeCheck size={14} strokeWidth={2.2} />
            Live account
          </div>
        </div>
        <div className={styles.summaryStats}>
          <article className={styles.summaryStat}>
            <p className={styles.summaryStatLabel}>Lots</p>
            <strong className={styles.summaryStatValue}>{supply?.listings.length ?? 0}</strong>
            <p className={styles.summaryStatHint}>From database</p>
          </article>
          <article className={styles.summaryStat}>
            <p className={styles.summaryStatLabel}>Pending payout</p>
            <strong className={styles.summaryStatValue}>{payouts?.summary.pending ?? 0}</strong>
            <p className={styles.summaryStatHint}>Order-line settlement</p>
          </article>
          <article className={styles.summaryStat}>
            <p className={styles.summaryStatLabel}>Completed</p>
            <strong className={styles.summaryStatValue}>{payouts?.summary.completed ?? 0}</strong>
            <p className={styles.summaryStatHint}>Paid orders</p>
          </article>
        </div>
      </section>

      <section className={styles.workspaceGrid}>
        <article className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Contact identity</h2>
            <UserRound size={17} strokeWidth={2.2} className={styles.railIcon} />
          </div>
          <p className={styles.supportBody}>Name: {value(profile?.fullName)}</p>
          <p className={styles.supportBody}>Phone: {value(profile?.phone)}</p>
          <p className={styles.supportBody}>Email: {displayEmail(profile?.email)}</p>
        </article>
        <article className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Business identity</h2>
            <Landmark size={17} strokeWidth={2.2} className={styles.railIcon} />
          </div>
          <p className={styles.supportBody}>Business: {value(profile?.businessName)}</p>
          <p className={styles.supportBody}>District: {value(profile?.district)}</p>
          <p className={styles.supportBody}>Corridor: {corridorLabel(profile?.corridor)}</p>
        </article>
        <article className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Supply identity</h2>
            <Package size={17} strokeWidth={2.2} className={styles.railIcon} />
          </div>
          <p className={styles.supportBody}>{supply?.workspace.marketLabel ?? "No live supply workspace loaded."}</p>
        </article>
        <article className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Settlement identity</h2>
            <Wallet size={17} strokeWidth={2.2} className={styles.railIcon} />
          </div>
          <p className={styles.supportBody}>{payouts?.records.length ?? 0} payout records from database.</p>
        </article>
        <article className={styles.supportCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Account login</h2>
            <Mail size={17} strokeWidth={2.2} className={styles.railIcon} />
          </div>
          <p className={styles.supportBody}>Role: {value(profile?.role)}</p>
          <p className={styles.supportBody}>Language: {value(profile?.locale)}</p>
          <div className={styles.supportAccent}>
            <Phone size={18} strokeWidth={2.2} />
            <span>Phone signup account</span>
          </div>
        </article>
      </section>
    </main>
  );
}
