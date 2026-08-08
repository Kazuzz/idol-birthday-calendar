import styles from "./MonthNav.module.css";

interface MonthNavProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function MonthNav({
  currentMonth,
  onPrevious,
  onNext,
  onToday,
}: MonthNavProps) {
  const monthLabel = currentMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <nav
      className={styles.nav}
      aria-label="Calendar navigation"
    >
      <div className={styles.monthControls}>
        <button
          type="button"
          className={styles.arrowButton}
          onClick={onPrevious}
          aria-label="Previous month"
        >
          <span aria-hidden="true">←</span>
        </button>

        <h2 className={styles.monthLabel}>
          {monthLabel}
        </h2>

        <button
          type="button"
          className={styles.arrowButton}
          onClick={onNext}
          aria-label="Next month"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <button
        type="button"
        className={styles.todayButton}
        onClick={onToday}
      >
        Today
      </button>
    </nav>
  );
}