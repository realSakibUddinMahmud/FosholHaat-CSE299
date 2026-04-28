import styles from './workspace-shell.module.css';

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const nav = [
    ["Buyer", "/buyer"],
    ["Cart", "/buyer/cart"],
    ["Orders", "/buyer/orders"],
    ["Seller", "/seller/supply"],
    ["Seller orders", "/seller/orders"],
    ["Payouts", "/seller/payouts"],
    ["Hub", "/hub"],
    ["Inbound", "/hub/inbound"],
    ["Sorting", "/hub/sorting"],
    ["Exceptions", "/hub/exceptions"],
  ] as const;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/buyer">FosholHaat</a>
        <span className={styles.badge}>Bogura - Dhaka MVP</span>
        <form action="/api/auth/logout" method="post">
          <button className={styles.logout} type="submit">Logout</button>
        </form>
      </header>
      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Workspace navigation">
          {nav.map(([label, href]) => (
            <a key={href} className={styles.navLink} href={href}>{label}</a>
          ))}
        </aside>
        <div className={styles.content}>{children}</div>
      </div>
      <footer className={styles.footer}>Support corridor: Bogura - Dhaka</footer>
    </div>
  );
}
