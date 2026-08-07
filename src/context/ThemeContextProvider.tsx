import type { ReactNode } from "react";

import { ThemeContext } from "./ThemeContext";
import { useTheme } from "../hooks/useTheme";

interface ThemeContextProviderProps {
  children: ReactNode;
}

export function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const value = useTheme();

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}