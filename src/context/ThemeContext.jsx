import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always default to dark mode on fresh land/refresh as requested by user
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.style.setProperty("--bg", "#F1F5F9");
      root.style.setProperty("--surface", "#FFFFFF");
      root.style.setProperty("--text-primary", "#0F172A");
      root.style.setProperty("--text-secondary", "#334155");
      root.style.setProperty("--accent", "#059669");
      root.style.setProperty("--accent-dim", "rgba(5, 150, 105, 0.14)");
      document.body.style.backgroundColor = "#F1F5F9";
      document.body.style.color = "#0F172A";
    } else {
      root.classList.remove("light");
      root.style.setProperty("--bg", "#0A0A0A");
      root.style.setProperty("--surface", "#111116");
      root.style.setProperty("--text-primary", "#FFFFFF");
      root.style.setProperty("--text-secondary", "#94A3B8");
      root.style.setProperty("--accent", "#4FFFB0");
      root.style.setProperty("--accent-dim", "rgba(79, 255, 176, 0.18)");
      document.body.style.backgroundColor = "#0A0A0A";
      document.body.style.color = "#FFFFFF";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext) || { theme: "dark", isDark: true, toggleTheme: () => {} };

