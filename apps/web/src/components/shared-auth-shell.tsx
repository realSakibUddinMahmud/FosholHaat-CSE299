import { BrandLockup } from "./brand-lockup";
import styles from './shared-auth-shell.module.css';

type SharedAuthShellProps = {
  headerCenter?: React.ReactNode;
  headerAction?: React.ReactNode;
  hero: React.ReactNode;
  panel: React.ReactNode;
  footer?: React.ReactNode;
  footerLinks?: React.ReactNode;
  stageClassName?: string;
  heroPanelClassName?: string;
  panelClassName?: string;
};

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function SharedAuthShell({
  headerCenter,
  headerAction,
  hero,
  panel,
  footer,
  footerLinks,
  stageClassName,
  heroPanelClassName,
  panelClassName,
}: SharedAuthShellProps) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandContainer}>
          <BrandLockup />
        </div>
        <div className={styles.headerCenter}>{headerCenter}</div>
        <div className={styles.headerAction}>{headerAction}</div>
      </header>

      <section className={cx(styles.stage, stageClassName)}>
        <div className={cx(styles.heroPanel, heroPanelClassName)}>{hero}</div>
        <div className={cx(styles.panel, panelClassName)}>{panel}</div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerNote}>{footer}</div>
        <div className={styles.footerLinks}>{footerLinks}</div>
      </footer>
    </main>
  );
}
