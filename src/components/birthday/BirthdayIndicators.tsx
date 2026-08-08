import type { Idol } from "../../types/idol";
import styles from "./BirthdayIndicators.module.css";

interface BirthdayIndicatorsProps {
  idols: Idol[];
}

const MAX_VISIBLE = 3;

export function BirthdayIndicators({
  idols,
}: BirthdayIndicatorsProps) {
  if (idols.length === 0) {
    return null;
  }

  const visibleIdols = idols.slice(0, MAX_VISIBLE);
  const remainingCount = Math.max(
    idols.length - MAX_VISIBLE,
    0,
  );

  return (
    <div
      className={styles.container}
      aria-label={`${idols.length} birthday${
        idols.length === 1 ? "" : "s"
      }`}
    >
      <div className={styles.avatars}>
        {visibleIdols.map((idol) => (
          <span
            key={idol.id}
            className={styles.avatar}
            title={idol.name}
          >
            {idol.image ? (
              <img
                src={idol.image}
                alt=""
                className={styles.image}
              />
            ) : (
              <span
                className={styles.fallback}
                aria-hidden="true"
              >
                {idol.name.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
        ))}
      </div>

      {remainingCount > 0 && (
        <span
          className={styles.more}
          aria-label={`${remainingCount} more`}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}