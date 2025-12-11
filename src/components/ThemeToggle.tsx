import {
  ActionIcon,
  Menu,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { Monitor, Moon, Sun } from "lucide-react";
import { useColorScheme, type ColorSchemeMode } from "../hooks/useColorScheme";

interface ThemeToggleProps {
  variant?: "icon" | "menu";
}

export const ThemeToggle = ({ variant = "menu" }: ThemeToggleProps) => {
  const { mode, setColorScheme } = useColorScheme();
  const { setColorScheme: setMantineColorScheme } = useMantineColorScheme();

  const handleSetMode = (newMode: ColorSchemeMode) => {
    setColorScheme(newMode);
    if (newMode === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setMantineColorScheme(systemPreference);
    } else {
      setMantineColorScheme(newMode);
    }
  };

  const getIcon = () => {
    switch (mode) {
      case "light":
        return <Sun size={18} />;
      case "dark":
        return <Moon size={18} />;
      case "system":
        return <Monitor size={18} />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case "light":
        return "Light Mode";
      case "dark":
        return "Dark Mode";
      case "system":
        return "System";
    }
  };

  if (variant === "icon") {
    return (
      <Tooltip label={getLabel()}>
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={() => {
            const newMode: ColorSchemeMode =
              mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
            handleSetMode(newMode);
          }}
        >
          {getIcon()}
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Menu shadow="md" width={160}>
      <Menu.Target>
        <Tooltip label="Theme">
          <ActionIcon variant="subtle" size="lg">
            {getIcon()}
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Theme</Menu.Label>
        <Menu.Item
          leftSection={<Sun size={16} />}
          onClick={() => handleSetMode("light")}
          className={mode === "light" ? "bg-blue-50" : ""}
        >
          Light
        </Menu.Item>
        <Menu.Item
          leftSection={<Moon size={16} />}
          onClick={() => handleSetMode("dark")}
          className={mode === "dark" ? "bg-blue-50" : ""}
        >
          Dark
        </Menu.Item>
        <Menu.Item
          leftSection={<Monitor size={16} />}
          onClick={() => handleSetMode("system")}
          className={mode === "system" ? "bg-blue-50" : ""}
        >
          System
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
