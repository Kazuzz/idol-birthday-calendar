import { useState } from "react";
import { CalendarPage } from "../pages/CalendarPage";
import { IdolsPage } from "../pages/IdolsPage";
import { SettingsPage } from "../pages/SettingsPage.tsx";
import { TopBar } from "../components/navigation/TopBar";
import { TabBar } from "../components/navigation/TabBar";
import { IdolContextProvider } from "../context/IdolContextProvider";
import { ThemeContextProvider } from "../context/ThemeContextProvider";

export type Page = "calendar" | "idols" | "settings";

export function App() {
  const [page, setPage] = useState<Page>("calendar");

  return (
    <ThemeContextProvider>
      <IdolContextProvider>
        <div className="app-shell">
          <TopBar page={page} onNavigate={setPage} />

          <main>
            {page === "calendar" && <CalendarPage />}
            {page === "idols" && <IdolsPage />}
            {page === "settings" && <SettingsPage />}
          </main>

          <TabBar page={page} onNavigate={setPage} />
        </div>
      </IdolContextProvider>
    </ThemeContextProvider>
  );
}