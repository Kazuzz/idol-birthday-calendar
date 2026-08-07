import type { Idol, IdolDataFile } from "../../types/idol";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isValidBirthday(
  birthday: unknown,
): birthday is { month: number; day: number } {
  if (!birthday || typeof birthday !== "object") {
    return false;
  }

  const value = birthday as Record<string, unknown>;

  if (
    typeof value.month !== "number" ||
    typeof value.day !== "number"
  ) {
    return false;
  }

  if (
    !Number.isInteger(value.month) ||
    !Number.isInteger(value.day)
  ) {
    return false;
  }

  if (value.month < 1 || value.month > 12) {
    return false;
  }

  if (value.day < 1 || value.day > 31) {
    return false;
  }

  return true;
}

function isValidIdol(value: unknown): value is Idol {
  if (!value || typeof value !== "object") {
    return false;
  }

  const idol = value as Record<string, unknown>;

  return (
    typeof idol.id === "string" &&
    typeof idol.name === "string" &&
    idol.name.trim().length > 0 &&
    isValidBirthday(idol.birthday) &&
    Array.isArray(idol.tags) &&
    idol.tags.every((tag) => typeof tag === "string") &&
    typeof idol.favorite === "boolean" &&
    typeof idol.createdAt === "string" &&
    typeof idol.updatedAt === "string"
  );
}

export function validateDataFile(
  data: IdolDataFile,
): ValidationResult {
  const errors: string[] = [];

  if (typeof data.version !== "number") {
    errors.push("Missing or invalid schema version.");
  }

  if (!Array.isArray(data.idols)) {
    errors.push("Idols must be an array.");
    return {
      valid: false,
      errors,
    };
  }

  const ids = new Set<string>();

  data.idols.forEach((idol, index) => {
    if (!isValidIdol(idol)) {
      errors.push(`Invalid idol record at index ${index}.`);
      return;
    }

    if (ids.has(idol.id)) {
      errors.push(`Duplicate idol ID: ${idol.id}`);
      return;
    }

    ids.add(idol.id);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}