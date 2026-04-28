"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, MapPin, ShieldCheck, User } from "lucide-react";
import styles from "./account.module.css";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  locale: string;
  businessName?: string;
  corridor?: string;
  district?: string;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(res => res.ok ? res.json() : null)
      .then((data: UserProfile | null) => {
        if (data) setProfile(data);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>My Account</h1>

      <section className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <User size={36} strokeWidth={1.5} />
          </div>
          <div className={styles.verifiedBadge}>
            <ShieldCheck size={14} /> Buyer Verified
          </div>
        </div>

        <div className={styles.infoSection}>
          {profile ? (
            <>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>{profile.fullName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{profile.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>{profile.role}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Language</span>
                <span className={styles.infoValue}>{profile.locale === "bn" ? "বাংলা" : "English"}</span>
              </div>
              {profile.businessName ? (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Business</span>
                  <span className={styles.infoValue}>{profile.businessName}</span>
                </div>
              ) : null}
              {profile.district ? (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    <MapPin size={14} /> Location
                  </span>
                  <span className={styles.infoValue}>{profile.district}, {profile.corridor || "bogura-dhaka"}</span>
                </div>
              ) : null}
            </>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <p className={styles.loading}>Loading profile...</p>
          )}
        </div>
      </section>

      <section className={styles.dangerZone}>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          <LogOut size={16} /> Log Out
        </button>
      </section>
    </main>
  );
}
