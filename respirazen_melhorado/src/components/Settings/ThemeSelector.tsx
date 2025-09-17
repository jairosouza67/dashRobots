import React from "react";
import { useTheme } from "@/context/ImprovedThemeContext";

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <label>Tema:</label>
      <select value={theme} onChange={e => setTheme(e.target.value as "light" | "dark")}>
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
      </select>
    </div>
  );
};