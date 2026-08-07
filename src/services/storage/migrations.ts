import type { IdolDataFile } from "../../types/idol";

export const CURRENT_SCHEMA_VERSION = 1;

export function migrateData(data: IdolDataFile): IdolDataFile {
  if (data.version === CURRENT_SCHEMA_VERSION) {
    return data;
  }

  if (data.version < CURRENT_SCHEMA_VERSION) {
    return {
      ...data,
      version: CURRENT_SCHEMA_VERSION,
    };
  }

  throw new Error(
    `Unsupported data version: ${data.version}`,
  );
}