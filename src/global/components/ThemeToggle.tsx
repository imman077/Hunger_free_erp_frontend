import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import IconButton from "@mui/material/IconButton";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        padding: "0",
        width: { xs: "36px", md: "40px" },
        height: { xs: "36px", md: "40px" },
        backgroundColor: "var(--bg-tertiary)",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        "&:hover": {
          backgroundColor: "var(--bg-hover)",
          transform: "translateY(-1px)",
        },
        transition: "all 0.2s ease-in-out",
      }}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon size={18} className="text-slate-600 dark:text-slate-300" />
      ) : (
        <Sun size={18} className="text-slate-600 dark:text-slate-300" />
      )}
    </IconButton>
  );
};

export default ThemeToggle;
