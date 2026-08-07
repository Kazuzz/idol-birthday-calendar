import { useContext } from "react";

import { IdolContext } from "../context/IdolContext";

export function useIdolContext() {
  const context = useContext(IdolContext);

  if (!context) {
    throw new Error(
      "useIdolContext must be used inside IdolContextProvider.",
    );
  }

  return context;
}