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
      root.style.setProperty("--bg", "#F8FAFC");
      root.style.setProperty("--surface", "#FFFFFF");
      root.style.setProperty("--surface-translucent", "rgba(255, 255, 255, 0.88)");
      root.style.setProperty("--text-primary", "#0F172A");
      root.style.setProperty("--text-secondary", "#334155");
      root.style.setProperty("--text-muted", "#64748B");
      root.style.setProperty("--accent", "#059669");
      root.style.setProperty("--accent-hover", "#047857");
      root.style.setProperty("--accent-dim", "rgba(5, 150, 105, 0.12)");
      root.style.setProperty("--border-subtle", "rgba(15, 23, 42, 0.08)");
      root.style.setProperty("--card-shadow", "0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 20px 40px -15px rgba(5, 150, 105, 0.06)");
      document.body.style.backgroundColor = "#F8FAFC";
      document.body.style.color = "#0F172A";
    } else {
      root.classList.remove("light");
      root.style.setProperty("--bg", "#07070A");
      root.style.setProperty("--surface", "#0D0D14");
      root.style.setProperty("--surface-translucent", "rgba(13, 13, 20, 0.82)");
      root.style.setProperty("--text-primary", "#FFFFFF");
      root.style.setProperty("--text-secondary", "#94A3B8");
      root.style.setProperty("--text-muted", "#64748B");
      root.style.setProperty("--accent", "#4FFFB0");
      root.style.setProperty("--accent-hover", "#6FFFBF");
      root.style.setProperty("--accent-dim", "rgba(79, 255, 176, 0.16)");
      root.style.setProperty("--border-subtle", "rgba(255, 255, 255, 0.07)");
      root.style.setProperty("--card-shadow", "0 12px 40px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(79, 255, 176, 0.04)");
      document.body.style.backgroundColor = "#07070A";
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

