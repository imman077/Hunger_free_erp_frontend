import React from "react";

interface ThemeTextProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "muted";
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

const ThemeText: React.FC<ThemeTextProps> = ({
  children,
  variant = "primary",
  className = "",
  as: Component = "p",
}) => {
  const getColorVar = () => {
    switch (variant) {
      case "primary":
        return "var(--text-primary)";
      case "secondary":
        return "var(--text-secondary)";
      case "muted":
        return "var(--text-muted)";
      default:
        return "var(--text-primary)";
    }
  };

  return (
    <Component className={className} style={{ color: getColorVar() }}>
      {children}
    </Component>
  );
};

export default ThemeText;
