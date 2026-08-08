import { IdolCard } from "../components/idol/IdolCard";
import { useIdolContext } from "../hooks/useIdolContext";
import styles from "./IdolsPage.module.css";

export function IdolsPage() {
  const { idols } = useIdolContext();

  return (
    <section
      className={styles.page}
      aria-labelledby="idols-page-title"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>PROFILE</p>

        <h1 id="idols-page-title">
          Idols
        </h1>

        <p className={styles.count}>
          {idols.length}{" "}
          {idols.length === 1 ? "idol" : "idols"}
        </p>
      </header>

      {idols.length === 0 ? (
        <p className={styles.empty}>
          No idols yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {idols.map((idol) => (
            <IdolCard
              key={idol.id}
              idol={idol}
            />
          ))}
        </div>
      )}
    </section>
  );
}