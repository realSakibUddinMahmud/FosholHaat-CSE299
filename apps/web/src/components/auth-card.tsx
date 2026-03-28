import styles from './auth-card.module.css';

export function AuthCard({ children }: { children: React.ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}
