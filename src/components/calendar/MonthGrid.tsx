import { useState } from "react";
import { DayCell } from "./DayCell";
import { DayDetail } from "./DayDetail";
import styles from "./MonthGrid.module.css";
import type { Idol } from "../../types/idol";
import { useIdolContext } from "../../hooks/useIdolContext";
import { getBirthdaysForMonth } from "../../utils/dates/birthday";

interface MonthGridProps {
  currentMonth: Date;
}

const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function getCalendarDays(month: Date): Date[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);
  const firstWeekday = firstDay.getDay();

  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();

  const previousMonthLastDay = new Date(
    year,
    monthIndex,
    0,
  ).getDate();

  const days: Date[] = [];

  // Previous month's trailing days
  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    days.push(
      new Date(
        year,
        monthIndex - 1,
        previousMonthLastDay - i,
      ),
    );
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  // Next month's leading days
  const remainingDays = 42 - days.length;

  for (let day = 1; day <= remainingDays; day += 1) {
    days.push(new Date(year, monthIndex + 1, day));
  }

  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function MonthGrid({
  currentMonth,
}: MonthGridProps) {
    const { idols } = useIdolContext();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    const monthBirthdays = getBirthdaysForMonth(
    idols,
    currentMonth.getMonth() + 1,
    );
    const days = getCalendarDays(currentMonth);
    const today = new Date();
    const birthdaysByDay = new Map<number, Idol[]>();

    for (const idol of monthBirthdays) {
        const existing = birthdaysByDay.get(
            idol.birthday.day,
        );

        if (existing) {
            existing.push(idol);
        } else {
            birthdaysByDay.set(
            idol.birthday.day,
            [idol],
            );
        }
    }

    const selectedDayIdols = selectedDate
    ? birthdaysByDay.get(selectedDate.getDate()) ?? []
    : [];

    return (
    <section aria-label="Calendar">
        <div className={styles.weekdays} role="row">
        {WEEKDAYS.map((weekday) => (
            <div key={weekday} role="columnheader">
            {weekday}
            </div>
        ))}
        </div>

        <div className={styles.grid}>
        {days.map((date) => {
            const isCurrentMonth =
            date.getMonth() === currentMonth.getMonth() &&
            date.getFullYear() === currentMonth.getFullYear();

            return (
                <DayCell
                key={date.toISOString()}
                date={date}
                isCurrentMonth={isCurrentMonth}
                isToday={isSameDay(date, today)}
                isSelected={
                  selectedDate !== null &&
                  isSameDay(date, selectedDate)
                }
                birthdayIdols={
                    isCurrentMonth
                    ? birthdaysByDay.get(date.getDate()) ?? []
                    : []
                }
                onClick={() => {
                  setSelectedDate(date);
                }}
                />
            );
        })}
        </div>

        {selectedDate && (
          <DayDetail
            date={selectedDate}
            idols={selectedDayIdols}
            onClose={() => setSelectedDate(null)}
          />
        )}
    </section>
    );
}