import { createContext } from "react";
import type { UseIdolsResult } from "../hooks/useIdols";

export const IdolContext =
  createContext<UseIdolsResult | null>(null);