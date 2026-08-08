import { useState } from "react";
import { MonthNav } from "../components/calendar/MonthNav";
import { MonthGrid } from "../components/calendar/MonthGrid";
import { TodayPanel } from "../components/calendar/TodayPanel";
import { UpcomingList } from "../components/birthday/UpcomingList";
import styles from "./CalendarPage.module.css";

export function CalendarPage() {

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(),
  );

  function goToPreviousMonth() {
    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1,
        ),
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1,
        ),
    );
  }

  function goToToday() {
    setCurrentMonth(new Date());
  }

  return (
    <div className={styles.page}>
      <div className={styles.topGrid}>
        <h1>Calendar</h1>

        <MonthNav
          currentMonth={currentMonth}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
        />

        <TodayPanel />
        <section className={styles.calendarSection}>
          <MonthGrid currentMonth={currentMonth} />
        </section>
      </div>

        <UpcomingList />

    </div>
  );
}