import type { Idol } from "../../types/idol";
import styles from "./IdolCard.module.css";

interface IdolCardProps {
  idol: Idol;
  onClick?: () => void;
}

export function IdolCard({
  idol,
  onClick,
}: IdolCardProps) {
  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.imageButton}
        onClick={onClick}
        aria-label={`View ${idol.name} profile`}
      >
        <div className={styles.imageWrapper}>
          {idol.image ? (
            <img
              src={idol.image}
              alt={idol.name}
              className={styles.image}
            />
          ) : (
            <span
              className={styles.fallback}
              aria-hidden="true"
            >
              {idol.name.charAt(0)}
            </span>
          )}
        </div>
      </button>

      <div className={styles.info}>
        <h2 className={styles.name}>
          {idol.name}
        </h2>

        <p className={styles.romanizedName}>
          {idol.romanizedName}
        </p>
      </div>
    </article>
  );
}