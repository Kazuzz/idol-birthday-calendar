import { useEffect } from "react";
import { useIdolContext } from "../../hooks/useIdolContext";
import type { IdolWithComputed } from "../../types/idol";
import { formatCountdown } from "../../utils/dates/birthday";
import styles from "./IdolProfileModal.module.css";

interface IdolProfileModalProps {
  idol: IdolWithComputed;
  onClose: () => void;
}

function formatBirthday(idol: IdolWithComputed): string {
  const year =
    idol.birthYear?.toString().padStart(4, "0") ?? "----";

  const month = idol.birthday.month
    .toString()
    .padStart(2, "0");

  const day = idol.birthday.day
    .toString()
    .padStart(2, "0");

  return `${year}/${month}/${day}`;
}

function formatNextBirthday(
  nextBirthday: Date,
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(nextBirthday);
}

export function IdolProfileModal({
  idol,
  onClose,
}: IdolProfileModalProps) {
  const { toggleFavorite } = useIdolContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="idol-profile-name"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close profile"
        >
          ×
        </button>

        <div className={styles.scrollContent}>
          <div className={styles.imageWrapper}>
            {idol.image ? (
              <img
                src={idol.image}
                alt={idol.name}
                className={styles.image}
              />
            ) : (
              <div className={styles.fallback}>
                {idol.name.charAt(0)}
              </div>
            )}
          </div>

          <div className={styles.content}>
            <header className={styles.header}>
              <h2
                id="idol-profile-name"
                className={styles.name}
              >
                {idol.name}
              </h2>

              <p className={styles.romanizedName}>
                {idol.romanizedName}
              </p>
            </header>

            <dl className={styles.details}>
              <div className={styles.row}>
                <dt>生年月日</dt>
                <dd>{formatBirthday(idol)}</dd>
              </div>

              {idol.group && (
                <div className={styles.row}>
                  <dt>グループ</dt>
                  <dd>{idol.group}</dd>
                </div>
              )}
            </dl>

            <div className={styles.birthdayCard}>
              <div className={styles.birthdayCardHeader}>
                <span className={styles.birthdayCardLabel}>
                  Next Birthday
                </span>
              </div>

              <div className={styles.birthdayCardContent}>
                <strong className={styles.nextBirthday}>
                  {formatNextBirthday(idol.nextBirthday)}
                </strong>

                <span className={styles.countdown}>
                  {formatCountdown(idol.daysUntil)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.favoriteButton}
          onClick={() => toggleFavorite(idol.id)}
          aria-label={
            idol.favorite
              ? `Remove ${idol.name} from favorites`
              : `Add ${idol.name} to favorites`
          }
          aria-pressed={idol.favorite}
        >
          {idol.favorite ? "♥" : "♡"}
        </button>
      </section>
    </div>
  );
}