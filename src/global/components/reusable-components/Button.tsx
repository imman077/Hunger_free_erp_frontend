import React from "react";

// --- Types ---
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "link"
  | "dark"
  | "soft-success"
  | "soft-danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ResuableButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  [key: string]: any;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#22c55e] text-white hover:bg-[#1eb054] active:bg-[#198e44]",
  secondary: "hover:opacity-80 active:scale-95 transition-all duration-200",
  outline:
    "hover:bg-hf-green/5 active:bg-hf-green/10 transition-all duration-200",
  ghost:
    "hover:bg-hf-green/5 active:bg-hf-green/10 transition-all duration-200",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  success: "bg-[#22c55e] text-white hover:bg-[#1eb054] active:bg-[#198e44]",
  link: "text-blue-600 hover:underline active:opacity-70",
  dark: "bg-slate-900 text-white hover:bg-black active:scale-95",
  "soft-success":
    "hover:opacity-80 active:opacity-60 transition-all duration-200",
  "soft-danger":
    "hover:opacity-80 active:opacity-60 transition-all duration-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

// --- ResuableButton Component ---
const ResuableButton: React.FC<ResuableButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  startContent,
  endContent,
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "var(--text-secondary)",
        };
      case "soft-success":
        return {
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          color: "#22c55e",
        };
      case "soft-danger":
        return {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: "#22c55e",
          border: "1px solid #22c55e",
        };
      case "link":
        return {
          backgroundColor: "transparent",
        };
      case "dark":
        return {
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        };
      default:
        return {};
    }
  };

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={getVariantStyles()}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        rounded-sm
        font-medium
        transition-all
        duration-200
        inline-flex
        items-center
        justify-center
        gap-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        focus:outline-none
        focus:ring-2
        focus:ring-[#22c55e]
        focus:ring-offset-2
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && startContent}
      {children}
      {!loading && endContent}
    </button>
  );
};

export default ResuableButton;
