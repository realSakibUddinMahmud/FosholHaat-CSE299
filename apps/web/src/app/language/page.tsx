"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck, CircleHelp, ShieldCheck } from "lucide-react";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { LanguageSwitch } from "../../components/language-switch";
import { SharedAuthShell } from "../../components/shared-auth-shell";
import { useBrowserLocale } from "../../lib/locale";
import styles from "../shared-auth.module.css";

export default function LanguagePage() {
  const router = useRouter();
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);

  const handleContinue = async () => {
    try {
      await fetch("/api/auth/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
    } catch {
      // Browser storage remains authoritative for the client.
    }

    router.push("/login");
  };

  return (
    <SharedAuthShell
      stageClassName={styles.languageStage}
      heroPanelClassName={styles.languageHeroPanelShell}
      panelClassName={styles.languagePanelShell}
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
        <div className={styles.languageHeroFrame}>
          <div className={styles.panelLeftImage} />
          <div className={styles.panelLeftContent}>
            <div>
              <span className={`${styles.overline} ${styles.languageOverline}`}>
                {copy.language.heroOverline}
              </span>
              <h1 className={styles.heroTitle}>
                {copy.language.heroTitleLead ? (
                  <span className={styles.heroTitleLine}>{copy.language.heroTitleLead}</span>
                ) : null}
                {copy.language.heroTitleTail ? (
                  <span className={styles.heroTitleLine}>{copy.language.heroTitleTail}</span>
                ) : (
                  <span className={styles.heroTitleLine}>{copy.language.heroTitle}</span>
                )}
              </h1>
              <p className={styles.heroSubtitle}>{copy.language.heroSubtitle}</p>
            </div>

            <div className={styles.trustPanel}>
              <div className={styles.trustHeader}>
                <span className={styles.trustIconBox} aria-hidden="true">
                  <ShieldCheck size={18} strokeWidth={2.2} />
                </span>
                <p className={styles.trustTitle}>{copy.language.trustTitle}</p>
              </div>
              <div className={styles.trustList}>
                <div className={styles.trustItem}>
                  <span className={styles.trustDot} aria-hidden="true">
                    <CircleCheck size={14} strokeWidth={2.6} />
                  </span>
                  <span className={styles.trustText}>{copy.language.trustPointOne}</span>
                </div>
                <div className={styles.trustItem}>
                  <span className={styles.trustDot} aria-hidden="true">
                    <CircleCheck size={14} strokeWidth={2.6} />
                  </span>
                  <span className={styles.trustText}>{copy.language.trustPointTwo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      panel={
        <div className={styles.languagePanelFrame}>
          <div className={styles.stepHeader}>
            <span className={styles.stepIndicator}>{copy.language.stepLabel}</span>
            <h2 className={styles.stepTitle}>{copy.language.title}</h2>
            <p className={styles.stepSubtitle}>{copy.language.helper}</p>
          </div>

          <div className={styles.languageOptions}>
            <button
              type="button"
              className={`${styles.languageCard} ${locale === "en" ? styles.languageCardSelected : ""}`}
              onClick={() => setLocale("en")}
            >
              <span className={styles.languageCardContent}>
                <span className={`${styles.languageIconBox} ${styles.languageIconPrimary}`}>
                  EN
                </span>
                <span className={styles.languageText}>
                  <h3>{copy.language.englishTitle}</h3>
                  <p>{copy.language.englishHint}</p>
                </span>
              </span>
              <span
                className={`${styles.languageCheck} ${locale === "en" ? styles.languageCheckActive : ""}`}
                aria-hidden="true"
              >
                {locale === "en" ? <CircleCheck size={14} strokeWidth={2.5} /> : null}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.languageCard} ${locale === "bn" ? styles.languageCardSelected : ""}`}
              onClick={() => setLocale("bn")}
            >
              <span className={styles.languageCardContent}>
                <span className={`${styles.languageIconBox} ${styles.languageIconSecondary}`}>
                  {copy.common.bangla}
                </span>
                <span className={styles.languageText}>
                  <h3>{copy.language.banglaTitle}</h3>
                  <p>{copy.language.banglaHint}</p>
                </span>
              </span>
              <span
                className={`${styles.languageCheck} ${locale === "bn" ? styles.languageCheckActive : ""}`}
                aria-hidden="true"
              >
                {locale === "bn" ? <CircleCheck size={14} strokeWidth={2.5} /> : null}
              </span>
            </button>
          </div>

          <button type="button" className={styles.continueButton} onClick={handleContinue}>
            {copy.language.continue}
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>

          <div className={styles.supportFooter}>
            <div className={styles.supportIconWrapper}>
              <CircleHelp size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div className={styles.supportTextWrapper}>
              <p>{copy.language.supportText}</p>
              <p className={styles.languageSupportHint}>{copy.language.supportHint}</p>
            </div>
          </div>
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
