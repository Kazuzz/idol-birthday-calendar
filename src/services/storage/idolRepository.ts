import type { Idol } from "../../types/idol";
import { migrateData } from "./migrations";
import {
  deserializeIdols,
  serializeIdols,
} from "./serialization";
import { validateDataFile } from "./validation";

const STORAGE_KEY = "idol-calendar:data:v1";

export interface RepositoryResult<T> {
  data: T;
  error?: string;
}

function readAll(): RepositoryResult<Idol[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { data: [] };
    }

    const parsed = deserializeIdols(raw);
    const migrated = migrateData(parsed);
    const validation = validateDataFile(migrated);

    if (!validation.valid) {
      return {
        data: [],
        error: validation.errors.join(" "),
      };
    }

    return {
      data: migrated.idols,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load saved idols.",
    };
  }
}

function writeAll(idols: Idol[]): void {
  localStorage.setItem(
    STORAGE_KEY,
    serializeIdols(idols),
  );
}

export const idolRepository = {
  getAll(): RepositoryResult<Idol[]> {
    return readAll();
  },

  saveAll(idols: Idol[]): void {
    writeAll(idols);
  },

  add(idol: Idol): void {
    const result = readAll();

    if (result.error) {
      throw new Error(result.error);
    }

    writeAll([...result.data, idol]);
  },

  update(idol: Idol): void {
    const result = readAll();

    if (result.error) {
      throw new Error(result.error);
    }

    const updated = result.data.map((existing) =>
      existing.id === idol.id ? idol : existing,
    );

    writeAll(updated);
  },

  delete(id: string): void {
    const result = readAll();

    if (result.error) {
      throw new Error(result.error);
    }

    writeAll(
      result.data.filter((idol) => idol.id !== id),
    );
  },
};