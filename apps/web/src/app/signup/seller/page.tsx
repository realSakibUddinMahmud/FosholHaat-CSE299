"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Package } from "lucide-react";
import { getSharedAuthCopy, type SignupResponse } from "@fosholhaat/types";
import { LanguageSwitch } from "../../../components/language-switch";
import { SharedAuthShell } from "../../../components/shared-auth-shell";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../../shared-auth.module.css";

export default function SellerSignupPage() {
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.get("businessName"),
          focus: form.get("focus"),
          contactName: form.get("contactName"),
          phone: form.get("phone"),
          district: form.get("district"),
          password: form.get("password"),
          locale,
        }),
      });

      if (!response.ok) {
        setError(copy.login.invalidCredentials);
        return;
      }

      const data: SignupResponse = await response.json();
      router.push(data.nextRoute);
    } catch {
      setError(copy.login.connectionFailed);
    } finally {
      setLoading(false);
    }
  };

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
              <Package size={16} strokeWidth={2.2} />
            </span>
            {copy.signupRole.sellerTitle}
          </span>
          <h1 className={styles.signupTitle}>{copy.sellerSignup.title}</h1>
          <p className={styles.signupSubtitle}>{copy.sellerSignup.subtitle}</p>

          <div className={styles.signupNotes}>
            <div className={styles.signupNote}>
              <div className={styles.signupNoteIcon} aria-hidden="true">
                <Package size={16} strokeWidth={2.2} />
              </div>
              <div>
                <span className={styles.signupNoteTitle}>{copy.sellerSignup.tradeFocus}</span>
                <p className={styles.signupNoteText}>{copy.sellerSignup.tradeFocusPlaceholder}</p>
              </div>
            </div>
            <div className={styles.signupNote}>
              <div className={styles.signupNoteIcon} aria-hidden="true">
                <Package size={16} strokeWidth={2.2} />
              </div>
              <div>
                <span className={styles.signupNoteTitle}>{copy.sellerSignup.collectionArea}</span>
                <p className={styles.signupNoteText}>
                  {copy.sellerSignup.collectionAreaPlaceholder}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      panel={
        <form className={styles.signupCard} onSubmit={handleSubmit}>
          <div className={styles.signupCardInner}>
            {error ? <div className={styles.loginError}>{error}</div> : null}
            <div className={styles.signupSection}>
              <div className={styles.signupGrid}>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="seller-business-name">
                    {copy.sellerSignup.businessName}
                  </label>
                  <input
                    id="seller-business-name"
                    name="businessName"
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
                    name="focus"
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
                    name="contactName"
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
                      name="phone"
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
                    name="district"
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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={styles.signupPasswordInput}
                      placeholder={copy.sellerSignup.passwordPlaceholder}
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
              <button type="submit" className={styles.signupPrimaryButton} disabled={loading}>
                {loading ? copy.login.submitLoading : copy.sellerSignup.submit}
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
        </form>
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
