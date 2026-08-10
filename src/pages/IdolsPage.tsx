import { useState } from "react";
import { IdolCard } from "../components/idol/IdolCard";
import { IdolProfileModal } from "../components/idol/IdolProfileModal";
import { useIdolContext } from "../hooks/useIdolContext";
import styles from "./IdolsPage.module.css";

export function IdolsPage() {
  const {
    idols,
    computedIdols,
  } = useIdolContext();

  const [selectedIdolId, setSelectedIdolId] =
    useState<string | null>(null);

  const selectedIdol = computedIdols.find(
    (idol) => idol.id === selectedIdolId,
  );

  const groupedIdols = idols.reduce<
    Record<string, typeof idols>
  >((groups, idol) => {
    const groupName = idol.group ?? "Other";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(idol);

    return groups;
  }, {});

  return (
    <section
      className={styles.page}
      aria-labelledby="idols-page-title"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Profile
        </p>

      </header>

      {idols.length === 0 ? (
        <p className={styles.empty}>
          No idols yet.
        </p>
      ) : (
        <div className={styles.groups}>
          {Object.entries(groupedIdols).map(
            ([groupName, groupIdols]) => (
              <section
                key={groupName}
                className={styles.groupSection}
              >
                <header className={styles.groupHeader}>
                  <h2 className={styles.groupTitle}>
                    {groupName}
                  </h2>
                </header>

                <div className={styles.grid}>
                  {groupIdols.map((idol) => (
                    <IdolCard
                      key={idol.id}
                      idol={idol}
                      onClick={() =>
                        setSelectedIdolId(idol.id)
                      }
                    />
                  ))}
                </div>
              </section>
            ),
          )}
        </div>
      )}

      {selectedIdol && (
        <IdolProfileModal
          idol={selectedIdol}
          onClose={() =>
            setSelectedIdolId(null)
          }
        />
      )}
    </section>
  );
}