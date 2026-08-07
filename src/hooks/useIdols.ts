import { useCallback, useMemo, useState } from "react";
import type { Idol, IdolWithComputed } from "../types/idol";
import { idolRepository } from "../services/storage/idolRepository";
import { sampleIdols } from "../data/sampleIdols";
import {
  isBirthdayToday,
  sortByNextBirthday,
} from "../utils/dates/birthday";

export interface UseIdolsResult {
  idols: Idol[];
  todayBirthdays: IdolWithComputed[];
  upcomingBirthdays: IdolWithComputed[];
  addIdol: (idol: Idol) => void;
  updateIdol: (idol: Idol) => void;
  deleteIdol: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export function useIdols(): UseIdolsResult {
  const initial = useMemo(() => idolRepository.getAll(), []);

  const initialIdols = useMemo(() => {
    if (initial.data.length > 0) {
      return initial.data;
    }

    idolRepository.saveAll(sampleIdols);
    return sampleIdols;
  }, [initial.data]);

  const [idols, setIdols] = useState<Idol[]>(initialIdols);

  const updateState = useCallback(
    (nextIdols: Idol[]) => {
      setIdols(nextIdols);
      idolRepository.saveAll(nextIdols);
    },
    [],
  );

  const addIdol = useCallback(
    (idol: Idol) => {
      updateState([...idols, idol]);
    },
    [idols, updateState],
  );

  const updateIdol = useCallback(
    (idol: Idol) => {
      updateState(
        idols.map((existing) =>
          existing.id === idol.id ? idol : existing,
        ),
      );
    },
    [idols, updateState],
  );

  const deleteIdol = useCallback(
    (id: string) => {
      updateState(idols.filter((idol) => idol.id !== id));
    },
    [idols, updateState],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      updateState(
        idols.map((idol) =>
          idol.id === id
            ? {
                ...idol,
                favorite: !idol.favorite,
                updatedAt: new Date().toISOString(),
              }
            : idol,
        ),
      );
    },
    [idols, updateState],
  );

  const computed = useMemo(
    () => sortByNextBirthday(idols),
    [idols],
  );

  const todayBirthdays = useMemo(
    () => computed.filter((idol) => isBirthdayToday(idol.birthday)),
    [computed],
  );

  const upcomingBirthdays = useMemo(
    () => computed.filter((idol) => !idol.isBirthdayToday),
    [computed],
  );

  return {
    idols,
    todayBirthdays,
    upcomingBirthdays,
    addIdol,
    updateIdol,
    deleteIdol,
    toggleFavorite,
  };
}