import {
  useEffect,
  useRef,
} from "react";
import type { Idol } from "../../types/idol";
import { formatBirthday } from "../../utils/dates/birthday";
import styles from "./DayDetail.module.css";

interface DayDetailProps {
  date: Date;
  idols: Idol[];
  onClose: () => void;
}

export function DayDetail({
  date,
  idols,
  onClose,
}: DayDetailProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const focusableSelector = [
      "button",
      "a[href]",
      "input",
      "select",
      "textarea",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const getFocusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          focusableSelector,
        ),
      );

    const firstFocusable = getFocusableElements()[0];

    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last =
        focusableElements[
          focusableElements.length - 1
        ];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose]);

  const dateLabel = date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
    },
  );

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
        ref={dialogRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-detail-title"
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              Birthdays
            </p>

            <h2 id="day-detail-title">
              {dateLabel}
            </h2>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        {idols.length === 0 ? (
          <p className={styles.empty}>
            No birthdays on this day.
          </p>
        ) : (
          <div className={styles.list}>
            {idols.map((idol) => (
              <article
                key={idol.id}
                className={styles.idol}
              >
                <div className={styles.avatar}>
                  {idol.image ? (
                    <img
                      src={idol.image}
                      alt=""
                    />
                  ) : (
                    <span aria-hidden="true">
                      {idol.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={styles.info}>
                  <h3>{idol.name}</h3>

                  {idol.group && (
                    <p>{idol.group}</p>
                  )}

                  <span>
                    {formatBirthday(idol.birthday)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}