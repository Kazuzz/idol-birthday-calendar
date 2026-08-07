import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "idol-calendar:theme";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === "dark" || saved === "light") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) =>
      current === "light" ? "dark" : "light",
    );
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}