import type { ReactNode } from "react";

import { IdolContext } from "./IdolContext";
import { useIdols } from "../hooks/useIdols";

interface IdolContextProviderProps {
  children: ReactNode;
}

export function IdolContextProvider({
  children,
}: IdolContextProviderProps) {
  const value = useIdols();

  return (
    <IdolContext.Provider value={value}>
      {children}
    </IdolContext.Provider>
  );
}