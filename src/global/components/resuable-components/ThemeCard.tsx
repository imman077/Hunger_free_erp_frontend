import React from "react";

interface ThemeCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`rounded-sm border transition-all duration-300 ${
        hover ? "hover:shadow-md" : ""
      } ${className}`}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
        color: "var(--text-primary)",
      }}
    >
      {children}
    </div>
  );
};

export default ThemeCard;
