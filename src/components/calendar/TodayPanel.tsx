import { useIdolContext } from "../../hooks/useIdolContext";
import { formatBirthday, formatCountdown } from "../../utils/dates/birthday";
import styles from "./TodayPanel.module.css";

export function TodayPanel() {
  const {
    todayBirthdays,
    upcomingBirthdays,
  } = useIdolContext();

  const nextBirthday = upcomingBirthdays[0];

  return (
    <section className={styles.panel} aria-labelledby="today-heading">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Today</p>
          <h2 id="today-heading" className={styles.title}>
            {todayBirthdays.length > 0
              ? "Birthday Today"
              : "No birthdays today"}
          </h2>
        </div>
      </div>

      {todayBirthdays.length > 0 ? (
        <div className={styles.list}>
          {todayBirthdays.map((idol) => (
            <article key={idol.id} className={styles.birthdayCard}>
              <div className={styles.avatar}>
                {idol.image ? (
                  <img
                    src={idol.image}
                    alt=""
                    className={styles.image}
                  />
                ) : (
                  <span aria-hidden="true">
                    {idol.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className={styles.info}>
                <h3>{idol.name}</h3>

                {idol.group && (
                  <p className={styles.group}>{idol.group}</p>
                )}

                <p className={styles.birthday}>
                  {formatBirthday(idol.birthday)}
                  {idol.birthYear && (
                    <>
                      {" · "}
                      {idol.birthYear} birth
                    </>
                  )}
                </p>
              </div>

              <span className={styles.badge}>Today</span>
            </article>
          ))}
        </div>
      ) : nextBirthday ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>
            The next birthday is coming up.
          </p>

          <div className={styles.nextBirthday}>
            <div className={styles.smallAvatar}>
              {nextBirthday.image ? (
                <img
                  src={nextBirthday.image}
                  alt=""
                  className={styles.image}
                />
              ) : (
                <span aria-hidden="true">
                  {nextBirthday.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <strong>{nextBirthday.name}</strong>

              {nextBirthday.group && (
                <p>{nextBirthday.group}</p>
              )}

              <span>
                {formatBirthday(nextBirthday.birthday)}
                {" · "}
                {formatCountdown(nextBirthday.daysUntil)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>
            No birthdays coming up.
          </p>
          <p className={styles.emptyText}>
            Add some idols to start building your birthday calendar.
          </p>
        </div>
      )}
    </section>
  );
}
