import { useCallback, useMemo, useState } from "react";
import type { Idol, IdolWithComputed } from "../types/idol";
import { idolRepository } from "../services/storage/idolRepository";
import {
  isBirthdayToday,
  sortByNextBirthday,
} from "../utils/dates/birthday";

const FAVORITES_STORAGE_KEY = "idol-calendar:favorites:v1";

export interface UseIdolsResult {
  idols: Idol[];
  computedIdols: IdolWithComputed[];
  todayBirthdays: IdolWithComputed[];
  upcomingBirthdays: IdolWithComputed[];
  toggleFavorite: (id: string) => void;
}

function readFavoriteIds(): Set<string> {
  try {
    const raw = localStorage.getItem(
      FAVORITES_STORAGE_KEY,
    );

    if (!raw) {
      return new Set();
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(
      parsed.filter(
        (id): id is string => typeof id === "string",
      ),
    );
  } catch {
    return new Set();
  }
}

function saveFavoriteIds(ids: Set<string>): void {
  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify([...ids]),
  );
}

export function useIdols(): UseIdolsResult {
  const initial = useMemo(
    () => idolRepository.getAll(),
    [],
  );

  const initialIdols = useMemo(() => {
    if (initial.error) {
      console.error(initial.error);
    }

    const favoriteIds = readFavoriteIds();

    return initial.data.map((idol) => ({
      ...idol,
      favorite: favoriteIds.has(idol.id),
    }));
  }, [initial.data, initial.error]);

  const [idols, setIdols] = useState<Idol[]>(
    initialIdols,
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setIdols((currentIdols) => {
        const nextIdols = currentIdols.map((idol) =>
          idol.id === id
            ? {
                ...idol,
                favorite: !idol.favorite,
              }
            : idol,
        );

        const favoriteIds = new Set(
          nextIdols
            .filter((idol) => idol.favorite)
            .map((idol) => idol.id),
        );

        saveFavoriteIds(favoriteIds);

        return nextIdols;
      });
    },
    [],
  );

  const computedIdols = useMemo(
    () => sortByNextBirthday(idols),
    [idols],
  );

  const todayBirthdays = useMemo(
    () =>
      computedIdols.filter((idol) =>
        isBirthdayToday(idol.birthday),
      ),
    [computedIdols],
  );

  const upcomingBirthdays = useMemo(
    () =>
      computedIdols.filter(
        (idol) => !idol.isBirthdayToday,
      ),
    [computedIdols],
  );

  return {
    idols,
    computedIdols,
    todayBirthdays,
    upcomingBirthdays,
    toggleFavorite,
  };
}