import type { Idol, IdolDataFile } from "../../types/idol";
import { CURRENT_SCHEMA_VERSION } from "./migrations";

export function serializeIdols(idols: Idol[]): string {
  const data: IdolDataFile = {
    version: CURRENT_SCHEMA_VERSION,
    idols,
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data);
}

export function deserializeIdols(raw: string): IdolDataFile {
  const parsed: unknown = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid data format.");
  }

  return parsed as IdolDataFile;
}