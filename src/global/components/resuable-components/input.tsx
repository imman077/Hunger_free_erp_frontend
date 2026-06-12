import React from "react";
import { Icon } from "./Icon";
import { Plus, Minus } from "lucide-react";

interface ResuableInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  align?: "left" | "center" | "right";
  info?: string | React.ReactNode;
  inputClassName?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const ResuableInput: React.FC<ResuableInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
  required = false,
  align = "left",
  info,
  inputClassName = "",
  startContent,
  endContent,
  min,
  max,
  step,
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
        {startContent && (
          <div className="absolute left-2.5 flex items-center pointer-events-none">
            {startContent}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`w-full border py-3 rounded-sm text-[13px] font-semibold focus:outline-none focus:ring-4 focus:ring-hf-green/5 focus:border-hf-green transition-all disabled:opacity-50 disabled:cursor-not-allowed ${alignClass} ${inputClassName} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          style={{
            backgroundColor: inputClassName.includes("bg-")
              ? undefined
              : "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            paddingLeft: startContent ? "2.75rem" : "1rem",
            paddingRight: type === "number" || endContent ? "4.5rem" : "1rem",
            caretColor: "var(--color-emerald)",
          }}
        />
        {(type === "number") && (
            <div className="absolute right-2 flex items-center gap-1">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        const current = parseInt(value) || 0;
                        const m = min !== undefined ? Number(min) : -Infinity;
                        if (current > m) onChange((current - 1).toString());
                    }}
                    className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors text-[var(--text-muted)] hover:text-emerald-500 border border-[var(--border-color)]"
                >
                    <Minus size={12} strokeWidth={3} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        const current = parseInt(value) || 0;
                        const mx = max !== undefined ? Number(max) : Infinity;
                        if (current < mx) onChange((current + 1).toString());
                    }}
                    className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded-md transition-colors text-[var(--text-muted)] hover:text-emerald-500 border border-[var(--border-color)]"
                >
                    <Plus size={12} strokeWidth={3} />
                </button>
            </div>
        )}
        {endContent && !type && (
          <div className="absolute right-2.5 flex items-center pointer-events-none">
            {endContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResuableInput;
