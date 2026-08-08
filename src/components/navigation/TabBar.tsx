import type { Page } from "../../app/App";
import styles from "./TabBar.module.css";

interface TabBarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function TabBar({
  page,
  onNavigate,
}: TabBarProps) {
  return (
    <nav
      className={styles.tabBar}
      aria-label="Mobile navigation"
    >
      <button
        type="button"
        className={`${styles.tab} ${
          page === "calendar" ? styles.active : ""
        }`}
        onClick={() => onNavigate("calendar")}
        aria-current={page === "calendar" ? "page" : undefined}
      >
        <span className={styles.icon} aria-hidden="true">
          ◫
        </span>
        <span>Calendar</span>
      </button>

      <button
        type="button"
        className={`${styles.tab} ${
          page === "idols" ? styles.active : ""
        }`}
        onClick={() => onNavigate("idols")}
        aria-current={page === "idols" ? "page" : undefined}
      >
        <span className={styles.icon} aria-hidden="true">
          ♡
        </span>
        <span>Idols</span>
      </button>

      <button
        type="button"
        className={`${styles.tab} ${
          page === "settings" ? styles.active : ""
        }`}
        onClick={() => onNavigate("settings")}
        aria-current={page === "settings" ? "page" : undefined}
      >
        <span className={styles.icon} aria-hidden="true">
          ⚙
        </span>
        <span>Settings</span>
      </button>
    </nav>
  );
}