import { useState } from "react";
import { CalendarPage } from "../pages/CalendarPage";
import { IdolsPage } from "../pages/IdolsPage";
import { SettingsPage } from "../pages/SettingsPage.tsx";
import { TabBar } from "../components/navigation/TabBar";
import { IdolContextProvider } from "../context/IdolContextProvider";
import { ThemeContextProvider } from "../context/ThemeContextProvider";

export type Page = "calendar" | "idols" | "settings";

export function App() {
  const [page, setPage] = useState<Page>("calendar");
  const [idolsViewKey, setIdolsViewKey] = useState(0);

  const handleNavigate = (nextPage: Page) => {
    if (nextPage === "idols") {
      setIdolsViewKey((key) => key + 1);
    }

    setPage(nextPage);
  };

  return (
    <ThemeContextProvider>
      <IdolContextProvider>
        <div className="app-shell">

          <div className="page-scroll">
            <main>
              {page === "calendar" && <CalendarPage />}

              {page === "idols" && (
                <IdolsPage key={idolsViewKey} />
              )}

              {page === "settings" && <SettingsPage />}
            </main>
          </div>

          <TabBar
            page={page}
            onNavigate={handleNavigate}
          />

        </div>
      </IdolContextProvider>
    </ThemeContextProvider>
  );
}