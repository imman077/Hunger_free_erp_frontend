import React from "react";
import { Icon } from "./Icon";

interface ResuableTextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  align?: "left" | "center" | "right";
  info?: string | React.ReactNode;
}

const ResuableTextarea: React.FC<ResuableTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  disabled = false,
  required = false,
  align = "left",
  info,
}) => {
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <div className={`w-full ${alignClass} ${className}`}>
      {label && (
        <div
          className={`flex items-center gap-1.5 mb-1 px-1 ${
            align === "center" ? "justify-center" : ""
          } ${align === "right" ? "justify-end" : ""}`}
        >
          <label
            className="text-[8px] font-black uppercase tracking-widest block"
            style={{ color: "var(--text-muted)" }}
          >
            {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
          </label>
          {info && (
            <div className="group/info relative flex items-center">
              <Icon
                name="info"
                className="w-3.5 h-3.5 transition-colors cursor-help"
                style={{ color: "var(--text-muted)" }}
              />
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 min-w-[200px] max-w-[280px] p-3 backdrop-blur-sm text-[10px] font-medium leading-relaxed rounded-lg shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-[10000] pointer-events-none whitespace-pre-line border text-left"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {info}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent"
                  style={{ borderTopColor: "var(--bg-primary)" }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="relative flex items-center">
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`w-full border px-3 py-3 rounded-sm text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#22c55e]/50 focus:border-[#22c55e] transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none ${alignClass}`}
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            caretColor: "var(--color-emerald)",
          }}
        />
      </div>
    </div>
  );
};

export default ResuableTextarea;
