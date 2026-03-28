"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, ChartColumnIncreasing, Package, ShoppingCart } from "lucide-react";
import type { SignupRole } from "@fosholhaat/types";
import { getSharedAuthCopy, getSignupRouteForRole } from "@fosholhaat/types";
import { LanguageSwitch } from "../../../components/language-switch";
import { SharedAuthShell } from "../../../components/shared-auth-shell";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../../shared-auth.module.css";

export default function SignupRolePage() {
  const router = useRouter();
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);
  const [role, setRole] = useState<SignupRole | null>(null);
  const [error, setError] = useState("");

  const handleContinue = async (nextRole: SignupRole) => {
    setRole(nextRole);
    setError("");
    const fallbackRoute = getSignupRouteForRole(nextRole);

    try {
      const response = await fetch("/api/auth/role-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole, locale }),
      });

      if (response.ok) {
        const data = (await response.json()) as { nextRoute?: string };
        router.push(data.nextRoute ?? fallbackRoute);
        return;
      }
    } catch {
      // Keep role selection usable even when the preview API is offline.
    }

    router.push(fallbackRoute);
  };

  return (
    <SharedAuthShell
      heroPanelClassName={styles.roleHeroPanel}
      headerCenter={
        <LanguageSwitch
          current={locale}
          onChange={setLocale}
          englishLabel={copy.common.english}
          banglaLabel={copy.common.bangla}
        />
      }
      headerAction={<span className={styles.supportAction}>{copy.common.support}</span>}
      hero={
        <div className={styles.roleLeftContent}>
          <span className={styles.roleOverline}>{copy.signupRole.heroOverline}</span>
          <h1 className={styles.roleTitle}>
            {copy.signupRole.heroTitleLead}{" "}
            <span className={styles.roleTitleHighlight}>{copy.signupRole.heroTitleAccent}</span>{" "}
            {copy.signupRole.heroTitleTail}
          </h1>
          <p className={styles.roleSubtitle}>{copy.signupRole.heroSubtitle}</p>

          <div className={styles.roleFeature}>
            <div className={styles.roleFeatureIcon} aria-hidden="true">
              <BadgeCheck size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className={styles.roleFeatureTitle}>{copy.signupRole.featureOneTitle}</h3>
              <p className={styles.roleFeatureDesc}>{copy.signupRole.featureOneDescription}</p>
            </div>
          </div>

          <div className={styles.roleFeature}>
            <div className={styles.roleFeatureIcon} aria-hidden="true">
              <ChartColumnIncreasing size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className={styles.roleFeatureTitle}>{copy.signupRole.featureTwoTitle}</h3>
              <p className={styles.roleFeatureDesc}>{copy.signupRole.featureTwoDescription}</p>
            </div>
          </div>
        </div>
      }
      panel={
        <div className={styles.roleRightContent}>
          <h2 className={styles.roleSelectionTitle}>{copy.signupRole.title}</h2>
          <p className={styles.roleSelectionSubtitle}>{copy.signupRole.subtitle}</p>

          {error ? (
            <div className={styles.loginError} role="alert">
              {error}
            </div>
          ) : null}

          <div className={styles.roleCards}>
            <button
              type="button"
              className={`${styles.roleCard} ${role === "buyer" ? styles.roleCardSelected : ""}`}
              onClick={() => handleContinue("buyer")}
            >
              <div className={styles.roleCardIcon}>
                <ShoppingCart size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div className={styles.roleCardContent}>
                <div className={styles.roleCardHeader}>
                  <h3 className={styles.roleCardTitle}>{copy.signupRole.buyerTitle}</h3>
                  <span className={styles.roleCardSelect}>{copy.signupRole.select}</span>
                </div>
                <p className={styles.roleCardDesc}>{copy.signupRole.buyerDescription}</p>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.roleCard} ${role === "seller" ? styles.roleCardSelected : ""}`}
              onClick={() => handleContinue("seller")}
            >
              <div className={styles.roleCardIcon}>
                <Package size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <div className={styles.roleCardContent}>
                <div className={styles.roleCardHeader}>
                  <h3 className={styles.roleCardTitle}>{copy.signupRole.sellerTitle}</h3>
                  <span className={styles.roleCardSelect}>{copy.signupRole.select}</span>
                </div>
                <p className={styles.roleCardDesc}>{copy.signupRole.sellerDescription}</p>
              </div>
            </button>
          </div>

          <p className={styles.roleFooterText}>
            {copy.signupRole.loginPrompt}
            <Link href="/login">{copy.signupRole.loginLink}</Link>
          </p>
        </div>
      }
      footer={copy.common.copyright}
      footerLinks={
        <>
          <span>{copy.common.privacy}</span>
          <span>{copy.common.terms}</span>
          <span>{copy.common.contact}</span>
        </>
      }
    />
  );
}
