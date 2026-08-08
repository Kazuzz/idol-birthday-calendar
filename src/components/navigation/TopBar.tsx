import type { Page } from "../../app/App";
import styles from "./TopBar.module.css";

interface TopBarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function TopBar({
  page,
  onNavigate,
}: TopBarProps) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.brand}
        onClick={() => onNavigate("calendar")}
        aria-label="Go to calendar"
      >
        <span className={styles.brandIcon} aria-hidden="true">
          ✦
        </span>

        <span className={styles.brandName}>
          Idol Calendar
        </span>
      </button>

      <nav
        className={styles.desktopNav}
        aria-label="Primary navigation"
      >
        <button
          type="button"
          className={`${styles.navLink} ${
            page === "calendar" ? styles.active : ""
          }`}
          onClick={() => onNavigate("calendar")}
        >
          Calendar
        </button>

        <button
          type="button"
          className={`${styles.navLink} ${
            page === "idols" ? styles.active : ""
          }`}
          onClick={() => onNavigate("idols")}
        >
          Idols
        </button>

        <button
          type="button"
          className={`${styles.navLink} ${
            page === "settings" ? styles.active : ""
          }`}
          onClick={() => onNavigate("settings")}
        >
          Settings
        </button>
      </nav>
    </header>
  );
}