import type { Idol } from "../../types/idol";
import { BirthdayIndicators } from "../birthday/BirthdayIndicators";
import styles from "./DayCell.module.css";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  birthdayIdols: Idol[];
  isSelected: boolean;
  onClick: () => void;
}

export function DayCell({
  date,
  isCurrentMonth,
  isToday,
  birthdayIdols,
  isSelected,
  onClick,
}: DayCellProps) {
  return (
    <button
      type="button"
      className={styles.cell}
      data-current-month={isCurrentMonth}
      data-today={isToday}
      data-selected={isSelected}
      onClick={onClick}
    >
      <span className={styles.date}>
        {date.getDate()}
      </span>

      <BirthdayIndicators idols={birthdayIdols} />
    </button>
  );
}