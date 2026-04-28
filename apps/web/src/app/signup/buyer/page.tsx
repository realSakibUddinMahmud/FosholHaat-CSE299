"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MapPin, ShoppingCart, UserRound } from "lucide-react";
import { getSharedAuthCopy, type SignupResponse } from "@fosholhaat/types";
import { LanguageSwitch } from "../../../components/language-switch";
import { SharedAuthShell } from "../../../components/shared-auth-shell";
import { useBrowserLocale } from "../../../lib/locale";
import styles from "../../shared-auth.module.css";

export default function BuyerSignupPage() {
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
      const response = await fetch("/api/auth/signup/buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.get("businessName"),
          focus: form.get("businessType"),
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
        <form className={styles.signupCard} onSubmit={handleSubmit}>
          <div className={styles.signupCardInner}>
            {error ? <div className={styles.loginError}>{error}</div> : null}
            <div className={styles.signupSection}>
              <div className={styles.signupGrid}>
                <div className={styles.signupField}>
                  <label className={styles.signupFieldLabel} htmlFor="buyer-business-name">
                    {copy.buyerSignup.businessName}
                  </label>
                  <input
                    id="buyer-business-name"
                    name="businessName"
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
                    name="businessType"
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
                      name="contactName"
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
                      name="phone"
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
                      name="district"
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
                      name="password"
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
              <button type="submit" className={styles.signupPrimaryButton} disabled={loading}>
                {loading ? copy.login.submitLoading : copy.buyerSignup.submit}
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
