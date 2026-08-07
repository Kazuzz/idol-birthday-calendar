import type { Page } from "../../app/App";

interface TopBarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export function TopBar({ page, onNavigate }: TopBarProps) {
  return (
    <header className="top-bar">
      <button
        type="button"
        className="brand"
        onClick={() => onNavigate("calendar")}
        aria-label="Go to calendar"
      >
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>

        <span className="brand-name">Idol Calendar</span>
      </button>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <button
          type="button"
          className={page === "calendar" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("calendar")}
        >
          Calendar
        </button>

        <button
          type="button"
          className={page === "idols" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("idols")}
        >
          Idols
        </button>

        <button
          type="button"
          className={page === "settings" ? "nav-link active" : "nav-link"}
          onClick={() => onNavigate("settings")}
        >
          Settings
        </button>
      </nav>
    </header>
  );
}