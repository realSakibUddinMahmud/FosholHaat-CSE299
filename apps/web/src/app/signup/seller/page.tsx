"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Package } from "lucide-react";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { LanguageSwitch } from "../../../components/language-switch";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../../shared-auth.module.css";

export default function SellerSignupPage() {
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.appContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>{copy.common.appName}</div>
        <div className={styles.navbarActions}>
          <LanguageSwitch
            current={locale}
            onChange={setLocale}
            englishLabel={copy.common.english}
            banglaLabel={copy.common.bangla}
          />
        </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.signupShell}>
          <section className={styles.signupIntro}>
            <div className={styles.signupIntroCompact}>
              <span className={styles.signupKicker}>
                <span className={styles.signupKickerIcon} aria-hidden="true">
                  <Package size={16} strokeWidth={2.2} />
                </span>
                {copy.signupRole.sellerTitle}
              </span>
              <h1 className={styles.signupTitle}>{copy.sellerSignup.title}</h1>
              <p className={styles.signupSubtitle}>{copy.sellerSignup.subtitle}</p>
            </div>
          </section>

          <section className={styles.signupCard}>
            <div className={styles.signupCardInner}>
              <div className={styles.signupSection}>
                <div className={styles.signupGrid}>
                  <div className={styles.signupField}>
                    <label className={styles.signupFieldLabel} htmlFor="seller-business-name">
                      {copy.sellerSignup.businessName}
                    </label>
                    <input
                      id="seller-business-name"
                      className={styles.signupInput}
                      placeholder={copy.sellerSignup.businessNamePlaceholder}
                    />
                  </div>

                  <div className={styles.signupField}>
                    <label className={styles.signupFieldLabel} htmlFor="seller-category">
                      {copy.sellerSignup.tradeFocus}
                    </label>
                    <input
                      id="seller-category"
                      className={styles.signupInput}
                      placeholder={copy.sellerSignup.tradeFocusPlaceholder}
                    />
                  </div>
                </div>
              </div>

              <div className={`${styles.signupSection} ${styles.signupSectionMuted}`}>
                <div className={styles.signupGrid}>
                  <div className={styles.signupField}>
                    <label className={styles.signupFieldLabel} htmlFor="seller-contact">
                      {copy.sellerSignup.contactPerson}
                    </label>
                    <input
                      id="seller-contact"
                      className={styles.signupInput}
                      placeholder={copy.sellerSignup.contactPersonPlaceholder}
                    />
                  </div>

                  <div className={styles.signupField}>
                    <label className={styles.signupFieldLabel} htmlFor="seller-mobile">
                      {copy.sellerSignup.phoneNumber}
                    </label>
                    <div className={styles.signupPhone}>
                      <span className={styles.signupPhonePrefix}>+880</span>
                      <input
                        id="seller-mobile"
                        className={styles.signupPhoneInput}
                        placeholder="17XX XXXXXX"
                      />
                    </div>
                  </div>

                  <div className={styles.signupField}>
                    <label className={styles.signupFieldLabel} htmlFor="seller-area">
                      {copy.sellerSignup.collectionArea}
                    </label>
                    <input
                      id="seller-area"
                      className={styles.signupInput}
                      placeholder={copy.sellerSignup.collectionAreaPlaceholder}
                    />
                  </div>

                  <div className={styles.signupField}>
                    <label className={styles.signupFieldLabel} htmlFor="seller-password">
                      {copy.sellerSignup.password}
                    </label>
                    <div className={styles.signupPassword}>
                      <input
                        id="seller-password"
                        type={showPassword ? "text" : "password"}
                        className={styles.signupPasswordInput}
                        placeholder={copy.sellerSignup.passwordPlaceholder}
                      />
                      <button
                        type="button"
                        className={styles.signupVisibilityButton}
                        aria-label={
                          showPassword
                            ? copy.login.hidePassword
                            : copy.login.showPassword
                        }
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
                  {copy.sellerSignup.submit}
                  <Package size={18} strokeWidth={2.2} aria-hidden="true" />
                </button>

                <p className={styles.signupFooterText}>
                  {copy.sellerSignup.loginPrompt}
                  <Link href="/login" className={styles.signupFooterLink}>
                    {copy.sellerSignup.loginLink}
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>{copy.common.copyright}</p>
          <div className={styles.footerLinks}>
            <span className={styles.footerLinkText}>{copy.common.privacy}</span>
            <span className={styles.footerLinkText}>{copy.common.terms}</span>
            <span className={styles.footerLinkText}>{copy.common.support}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
