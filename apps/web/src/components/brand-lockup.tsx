import Image from "next/image";
import styles from "./brand-lockup.module.css";

export function BrandLockup({
  subtitle,
  size = "compact",
}: {
  subtitle?: string;
  size?: "compact" | "large";
}) {
  return (
    <div className={styles.root}>
      <div
        className={`${styles.logoWrap} ${
          size === "large" ? styles.logoWrapLarge : styles.logoWrapCompact
        }`}
      >
        <Image
          src="/logo.png"
          alt="FosholHaat logo"
          width={96}
          height={96}
          className={styles.logo}
          priority={size === "large"}
        />
      </div>
      <div className={styles.copy}>
        <div className={styles.title}>FosholHaat</div>
        {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
      </div>
    </div>
  );
}
