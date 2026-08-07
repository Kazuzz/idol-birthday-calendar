import type { Birthday, Idol, IdolWithComputed } from "../../types/idol";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getCelebrationDay(birthday: Birthday, year: number): number {
  if (birthday.month === 2 && birthday.day === 29 && !isLeapYear(year)) {
    return 28;
  }

  return birthday.day;
}

function createBirthdayDate(birthday: Birthday, year: number): Date {
  return new Date(
    year,
    birthday.month - 1,
    getCelebrationDay(birthday, year),
  );
}

export function getNextBirthday(
  birthday: Birthday,
  from: Date = new Date(),
): Date {
  const today = startOfDay(from);
  const currentYearBirthday = createBirthdayDate(
    birthday,
    today.getFullYear(),
  );

  if (currentYearBirthday >= today) {
    return currentYearBirthday;
  }

  return createBirthdayDate(birthday, today.getFullYear() + 1);
}

export function getDaysUntilBirthday(
  birthday: Birthday,
  from: Date = new Date(),
): number {
  const today = startOfDay(from);
  const nextBirthday = getNextBirthday(birthday, today);

  return Math.round(
    (nextBirthday.getTime() - today.getTime()) / MS_PER_DAY,
  );
}

export function isBirthdayToday(
  birthday: Birthday,
  from: Date = new Date(),
): boolean {
  return getDaysUntilBirthday(birthday, from) === 0;
}

export function calculateAge(
  birthYear: number,
  birthday: Birthday,
  from: Date = new Date(),
): number {
  const currentYear = from.getFullYear();

  const birthdayThisYear = createBirthdayDate(birthday, currentYear);

  let age = currentYear - birthYear;

  if (startOfDay(from) < birthdayThisYear) {
    age -= 1;
  }

  return age;
}

export function formatBirthday(birthday: Birthday): string {
  const date = new Date(2000, birthday.month - 1, birthday.day);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatCountdown(daysUntil: number): string {
  if (daysUntil === 0) {
    return "Today";
  }

  if (daysUntil === 1) {
    return "Tomorrow";
  }

  return `In ${daysUntil} days`;
}

export function getBirthdaysForMonth(
  idols: Idol[],
  month: number,
): Idol[] {
  return idols.filter((idol) => idol.birthday.month === month);
}

export function sortByNextBirthday(
  idols: Idol[],
  from: Date = new Date(),
): IdolWithComputed[] {
  return idols
    .map((idol) => {
      const daysUntil = getDaysUntilBirthday(idol.birthday, from);

      return {
        ...idol,
        nextBirthday: getNextBirthday(idol.birthday, from),
        daysUntil,
        age: idol.birthYear
          ? calculateAge(idol.birthYear, idol.birthday, from)
          : undefined,
        isBirthdayToday: daysUntil === 0,
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
}