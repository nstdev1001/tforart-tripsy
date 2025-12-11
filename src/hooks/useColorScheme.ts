import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";

export type ColorSchemeMode = "light" | "dark" | "system";

export const useColorScheme = () => {
  const [mode, setMode] = useLocalStorage<ColorSchemeMode>({
    key: "tripsy-color-scheme",
    defaultValue: "system",
  });

  // Get actual color scheme based on mode and system preference
  const getResolvedColorScheme = (): "light" | "dark" => {
    if (mode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return mode;
  };

  const resolvedColorScheme = getResolvedColorScheme();

  // Listen to system preference changes
  useEffect(() => {
    if (mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // Force re-render when system preference changes
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
