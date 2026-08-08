import { useIdolContext } from "../../hooks/useIdolContext";
import {
  formatBirthday,
  formatCountdown,
} from "../../utils/dates/birthday";
import styles from "./UpcomingList.module.css";

const MAX_VISIBLE = 6;

export function UpcomingList() {
  const { upcomingBirthdays } = useIdolContext();

  const visibleBirthdays = upcomingBirthdays.slice(
    0,
    MAX_VISIBLE,
  );

  return (
    <section
      className={styles.section}
      aria-labelledby="upcoming-heading"
    >
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Calendar</p>
          <h2 id="upcoming-heading" className={styles.title}>
            Upcoming Birthdays
          </h2>
        </div>

        {upcomingBirthdays.length > MAX_VISIBLE && (
          <button
            type="button"
            className={styles.seeAll}
          >
            See all
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      {visibleBirthdays.length === 0 ? (
        <div className={styles.empty}>
          <p>No upcoming birthdays.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {visibleBirthdays.map((idol) => (
            <article
              key={idol.id}
              className={styles.item}
            >
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
                  <p className={styles.group}>
                    {idol.group}
                  </p>
                )}

                <p className={styles.date}>
                  {formatBirthday(idol.birthday)}
                </p>
              </div>

              <span className={styles.countdown}>
                {formatCountdown(idol.daysUntil)}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
