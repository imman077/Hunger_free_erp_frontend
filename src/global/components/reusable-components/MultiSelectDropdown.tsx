import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectDropdownProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select items",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeItem = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  const getLabel = (val: string) => {
    return options.find((opt) => opt.value === val)?.label || val;
  };

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label
          className="text-[8px] font-black uppercase tracking-widest block mb-1.5 px-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Modern Integrated Selection Box */}
        <div
          onClick={(e) => {
            // Only toggle if not clicking a chip's remove button
            if (!(e.target as HTMLElement).closest(".chip-remove-btn")) {
              setIsOpen(!isOpen);
            }
          }}
          className="w-full border p-2 rounded-none transition-all cursor-pointer"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: isOpen ? "#22c55e" : "var(--border-color)",
          }}
        >
          <div className="flex flex-wrap gap-2 min-h-[24px] mb-2">
            {value.length > 0 ? (
              value.map((val) => (
                <div
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-black border group/chip"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <span>{getLabel(val)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(val);
                    }}
                    className="chip-remove-btn rounded-full p-0.5 transition-colors hover:bg-emerald-500/10"
                    disabled={disabled}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest py-1">
                {placeholder}
              </span>
            )}
          </div>

          <div
            className="flex items-center justify-between pt-2 border-t"
            style={{ borderTopColor: "var(--border-color)" }}
          >
            <span
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {value.length > 0 ? `${value.length} Selected` : "No selections"}
            </span>
            <Plus
              size={16}
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-45" : ""
              }`}
              style={{ color: isOpen ? "#22c55e" : "var(--text-muted)" }}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 border rounded-none z-[9999] max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            {options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOption(opt.value)}
                  className="relative w-full px-4 py-3 text-xs font-semibold transition-all border-b last:border-none flex items-center gap-3 group"
                  style={{
                    borderBottomColor: "var(--border-color)",
                    backgroundColor: isSelected
                      ? "rgba(34, 197, 94, 0.05)"
                      : "transparent",
                    color: isSelected ? "#22c55e" : "var(--text-secondary)",
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? "#22c55e"
                        : "var(--bg-secondary)",
                      borderColor: isSelected
                        ? "#22c55e"
                        : "var(--border-color)",
                    }}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <span className="flex-1 text-left">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
