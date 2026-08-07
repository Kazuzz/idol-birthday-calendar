import type { Page } from "../../app/App";

interface TabBarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function TabBar({ page, onNavigate }: TabBarProps) {
  return (
    <nav className="mobile-tab-bar" aria-label="Mobile navigation">
      <button
        type="button"
        className={page === "calendar" ? "tab active" : "tab"}
        onClick={() => onNavigate("calendar")}
      >
        <span aria-hidden="true">◫</span>
        <span>Calendar</span>
      </button>

      <button
        type="button"
        className={page === "idols" ? "tab active" : "tab"}
        onClick={() => onNavigate("idols")}
      >
        <span aria-hidden="true">♡</span>
        <span>Idols</span>
      </button>

      <button
        type="button"
        className={page === "settings" ? "tab active" : "tab"}
        onClick={() => onNavigate("settings")}
      >
        <span aria-hidden="true">⚙</span>
        <span>Settings</span>
      </button>
    </nav>
  );
}