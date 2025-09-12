import React from "react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <label>Tema:</label>
      <select value={theme} onChange={e => setTheme(e.target.value as any)}>
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="blue">Azul</option>
        <option value="green">Verde</option>
      </select>
    </div>
  );
};