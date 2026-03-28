"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, Truck } from "lucide-react";
import type { LoginResponse } from "@fosholhaat/types";
import { getSharedAuthCopy } from "@fosholhaat/types";
import { LanguageSwitch } from "../../components/language-switch";
import { SharedAuthShell } from "../../components/shared-auth-shell";
import { useBrowserLocale } from "../../lib/locale";
import styles from "../shared-auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { locale, setLocale } = useBrowserLocale();
  const copy = getSharedAuthCopy(locale);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      setError(copy.login.missingCredentials);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          locale,
        }),
      });

      if (!res.ok) {
        setError(copy.login.invalidCredentials);
        return;
      }

      const data: LoginResponse = await res.json();
      if (data.nextRoute) {
        router.push(data.nextRoute);
      } else {
        setError(copy.login.missingDestination);
      }
    } catch {
      setError(copy.login.connectionFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedAuthShell
      stageClassName={styles.loginStage}
      heroPanelClassName={styles.loginHeroPanel}
      panelClassName={styles.loginPanelSurface}
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
        <div className={styles.loginLeft}>
          <span className={styles.loginOverline}>{copy.login.heroOverline}</span>
          <h1 className={styles.loginTitle}>
            {copy.login.heroTitleLead}
            <br />
            <span className={styles.loginTitleGradient}>{copy.login.heroTitleAccent}</span>
          </h1>
          <p className={styles.loginSubtitle}>{copy.login.heroSubtitle}</p>

          <div className={styles.loginStats}>
            <div className={styles.loginStatCard}>
              <span className={styles.loginStatIcon} aria-hidden="true">
                <Truck size={18} strokeWidth={2.2} />
              </span>
              <div className={styles.loginStatValue}>{copy.login.sourceCorridor}</div>
              <div className={styles.loginStatLabel}>{copy.login.sourceLabel}</div>
            </div>
            <div className={styles.loginStatCard}>
              <span className={styles.loginStatIcon} aria-hidden="true">
                <Leaf size={18} strokeWidth={2.2} />
              </span>
              <div className={styles.loginStatValue}>{copy.login.destination}</div>
              <div className={styles.loginStatLabel}>{copy.login.destinationLabel}</div>
            </div>
          </div>
        </div>
      }
      panel={
        <div className={styles.loginRight}>
          <div className={styles.loginCard}>
            <div className={styles.loginCardBgBlur} />
            <div className={styles.loginCardInner}>
              <h2 className={styles.loginCardTitle}>{copy.login.cardTitle}</h2>
              <p className={styles.loginCardSubtitle}>{copy.login.cardSubtitle}</p>

              {error ? (
                <div className={styles.loginError} role="alert">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className={styles.loginFormGroup}>
                  <div className={styles.loginLabelRow}>
                    <label className={styles.loginLabel} htmlFor="identifier">
                      {copy.login.identifierLabel}
                    </label>
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    className={styles.loginInput}
                    placeholder={copy.login.identifierPlaceholder}
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.loginFormGroup}>
                  <div className={styles.loginLabelRow}>
                    <label className={styles.loginLabel} htmlFor="password">
                      {copy.login.passwordLabel}
                    </label>
                    <span className={styles.loginForgot}>{copy.login.forgot}</span>
                  </div>

                  <div className={styles.loginPasswordWrap}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`${styles.loginInput} ${styles.loginPasswordInput}`}
                      placeholder={copy.login.passwordPlaceholder}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className={styles.loginToggle}
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? copy.login.hidePassword : copy.login.showPassword
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={2.2} />
                      ) : (
                        <Eye size={18} strokeWidth={2.2} />
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className={styles.continueButton} disabled={loading}>
                  {loading ? copy.login.submitLoading : copy.login.submit}
                </button>
              </form>
            </div>
          </div>

          <p className={styles.loginFooterText}>
            {copy.login.createAccountPrompt}
            <Link href="/signup/role">{copy.login.createAccountLink}</Link>
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
