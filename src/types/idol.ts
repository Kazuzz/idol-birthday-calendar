export interface Birthday {
  month: number;
  day: number;
}

export interface Idol {
  id: string;
  name: string;
  romanizedName: string;
  birthday: Birthday;
  birthYear?: number;
  group?: string;
  image?: string;
  color?: string;
  tags: string[];
  notes?: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdolWithComputed extends Idol {
  nextBirthday: Date;
  daysUntil: number;
  age?: number;
  isBirthdayToday: boolean;
}

export interface IdolDataFile {
  version: number;
  idols: Idol[];
  exportedAt: string;
}