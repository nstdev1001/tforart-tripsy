import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";

export type ColorSchemeMode = "light" | "dark" | "system";

export const useColorScheme = () => {
  const [mode, setMode] = useLocalStorage<ColorSchemeMode>({
    key: "tforart-tripsy-color-scheme",
    defaultValue: "system",
  });

  const getResolvedColorScheme = (): "light" | "dark" => {
    if (mode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return mode;
  };

  const resolvedColorScheme = getResolvedColorScheme();

  useEffect(() => {
    if (mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setMode("system");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, setMode]);

  const toggleColorScheme = () => {
    const newMode: ColorSchemeMode =
      mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
    setMode(newMode);
  };

  const setColorScheme = (newMode: ColorSchemeMode) => {
    setMode(newMode);
  };

  return {
    mode,
    resolvedColorScheme,
    toggleColorScheme,
    setColorScheme,
  };
};
