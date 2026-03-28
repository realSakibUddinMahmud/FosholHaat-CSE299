"use client";

import Link from "next/link";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { AuthCard } from "../../components/auth-card";
import { LanguageSwitch } from "../../components/language-switch";
import { SharedAuthShell } from "../../components/shared-auth-shell";
import { WorkspaceShell } from "../../components/workspace-shell";
import { useBrowserLocale } from "../../lib/locale";
import styles from "../shared-auth.module.css";

export default function WelcomePage() {
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);
  const heroTitle = (
    <>
      {copy.welcome.heroTitleLead}{" "}
      <span className={styles.heroTitleAccent}>{copy.welcome.heroTitleAccent}</span>{" "}
      {copy.welcome.heroTitleTail}
    </>
  );

  return (
    <SharedAuthShell
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
        <div className={styles.heroStack}>
          <span className={styles.overline}>{copy.welcome.heroOverline}</span>
          <h1 className={`${styles.heroTitle} ${styles.heroTitleLarge}`}>{heroTitle}</h1>
          <p className={styles.heroDescription}>{copy.welcome.heroSubtitle}</p>
        </div>
      }
      panel={
        <WorkspaceShell>
          <AuthCard>
            <div className={styles.panelCard}>
              <div className={styles.panelHeading}>
                <span className={styles.panelEyebrow}>{copy.welcome.heroOverline}</span>
                <h2 className={styles.panelTitle}>{copy.welcome.title}</h2>
                <p className={styles.panelDescription}>{copy.welcome.helper}</p>
              </div>

              <div className={styles.stack}>
                <Link href="/login" className={styles.cta}>
                  {copy.welcome.login}
                </Link>
                <Link href="/signup/role" className={`${styles.cta} ${styles.ctaSecondary}`}>
                  {copy.welcome.createAccount}
                </Link>
              </div>

              <p className={styles.footerText}>
                <Link href="/language" className={styles.footerLink}>
                  {copy.welcome.chooseLanguage}
                </Link>
              </p>
            </div>
          </AuthCard>
        </WorkspaceShell>
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
