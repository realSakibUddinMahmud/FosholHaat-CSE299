"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, MapPin, ShoppingCart, UserRound } from "lucide-react";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { LanguageSwitch } from "../../../components/language-switch";
import { SharedAuthShell } from "../../../components/shared-auth-shell";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../../shared-auth.module.css";

export default function BuyerSignupPage() {
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SharedAuthShell
      heroPanelClassName={styles.roleHeroPanel}
      panelClassName={styles.signupPanelSurface}
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
        <div className={styles.signupIntroCompact}>
          <span className={styles.signupKicker}>
            <span className={styles.signupKickerIcon} aria-hidden="true">
              <ShoppingCart size={16} strokeWidth={2.2} />
            </span>
            {copy.signupRole.buyerTitle}
          </span>
          <h1 className={styles.signupTitle}>{copy.buyerSignup.title}</h1>
          <p className={styles.signupSubtitle}>{copy.buyerSignup.subtitle}</p>

          <div className={styles.signupNotes}>
            <div className={styles.signupNote}>
              <div className={styles.signupNoteIcon} aria-hidden="true">
                <UserRound size={16} strokeWidth={2.2} />
              </div>
              <div>
                <span className={styles.signupNoteTitle}>{copy.buyerSignup.contactPerson}</span>
                <p className={styles.signupNoteText}>{copy.buyerSignup.contactPersonPlaceholder}</p>
              </div>
            </div>
            <div className={styles.signupNote}>
              <div className={styles.signupNoteIcon} aria-hidden="true">
                <MapPin size={16} strokeWidth={2.2} />
              </div>
              <div>
                <span className={styles.signupNoteTitle}>{copy.buyerSignup.location}</span>
                <p className={styles.signupNoteText}>{copy.buyerSignup.locationPlaceholder}</p>
              </div>
            </div>
          </div>
        </div>
      }
      panel={
        <div className={styles.signupCard}>
          <div className={styles.signupCardInner}>
            <div className={styles.signupSection}>
              <div className={styles.signupGrid}>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-business-name">
                    {copy.buyerSignup.businessName}
                  </label>
                  <input
                    id="buyer-business-name"
                    className={styles.signupInput}
                    placeholder={copy.buyerSignup.businessNamePlaceholder}
                  />
                </div>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-business-type">
                    {copy.buyerSignup.businessType}
                  </label>
                  <input
                    id="buyer-business-type"
                    className={styles.signupInput}
                    placeholder={copy.buyerSignup.businessTypePlaceholder}
                  />
                </div>
              </div>
            </div>

            <div className={styles.signupSection}>
              <div className={styles.signupGrid}>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-contact-name">
                    {copy.buyerSignup.contactPerson}
                  </label>
                  <div className={styles.signupIconInput}>
                    <span className={styles.signupInputIcon} aria-hidden="true">
                      <UserRound size={16} strokeWidth={2.2} />
                    </span>
                    <input
                      id="buyer-contact-name"
                      className={styles.signupPhoneInput}
                      placeholder={copy.buyerSignup.contactPersonPlaceholder}
                    />
                  </div>
                </div>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-phone">
                    {copy.buyerSignup.phoneNumber}
                  </label>
                  <div className={styles.signupPhone}>
                    <span className={styles.signupPhonePrefix}>+880</span>
                    <input
                      id="buyer-phone"
                      className={styles.signupPhoneInput}
                      placeholder="1XXX XXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.signupSection} ${styles.signupSectionMuted}`}>
              <div className={styles.signupGrid}>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-location">
                    {copy.buyerSignup.location}
                  </label>
                  <div className={styles.signupIconInput}>
                    <span className={styles.signupInputIcon} aria-hidden="true">
                      <MapPin size={16} strokeWidth={2.2} />
                    </span>
                    <input
                      id="buyer-location"
                      className={styles.signupPhoneInput}
                      placeholder={copy.buyerSignup.locationPlaceholder}
                    />
                  </div>
                </div>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-password">
                    {copy.buyerSignup.password}
                  </label>
                  <div className={styles.signupPassword}>
                    <input
                      id="buyer-password"
                      type={showPassword ? "text" : "password"}
                      className={styles.signupPasswordInput}
                      placeholder={copy.buyerSignup.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      className={styles.signupVisibilityButton}
                      aria-label={showPassword ? copy.login.hidePassword : copy.login.showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? (
                        <Eye size={18} strokeWidth={2.2} />
                      ) : (
                        <EyeOff size={18} strokeWidth={2.2} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.signupCtaRow}>
              <button type="button" className={styles.signupPrimaryButton}>
                {copy.buyerSignup.submit}
                <ShoppingCart size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <p className={styles.signupFooterText}>
                {copy.buyerSignup.loginPrompt}
                <Link href="/login" className={styles.signupFooterLink}>
                  {copy.buyerSignup.loginLink}
                </Link>
              </p>
            </div>
          </div>
        </div>
      }
      footer={copy.common.copyright}
      footerLinks={
        <>
          <span>{copy.common.privacy}</span>
          <span>{copy.common.terms}</span>
          <span>{copy.common.support}</span>
        </>
      }
    />
  );
}
