import type { Idol } from "../../types/idol";
import idolsData from "../../data/idols.json";

export interface RepositoryResult<T> {
  data: T;
  error?: string;
}

function readAll(): RepositoryResult<Idol[]> {
  try {
    return {
      data: idolsData as Idol[],
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load idol database.",
    };
  }
}

export const idolRepository = {
  getAll(): RepositoryResult<Idol[]> {
    return readAll();
  },
};