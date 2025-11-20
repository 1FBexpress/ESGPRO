
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Full Bin</span>
            <span className={styles.logoSubtext}>ESG Pro</span>
          </div>
          <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>Home</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>Powered by <strong>Full Bin</strong></p>
        <p className={styles.footerSubtext}>ESG Compliance Made Simple</p>
      </footer>
    </div>
  );
}
