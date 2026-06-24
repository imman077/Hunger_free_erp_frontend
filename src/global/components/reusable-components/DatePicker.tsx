import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

interface ResuableDatePickerProps {
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  align?: "left" | "center" | "right";
}

export const ResuableDatePicker: React.FC<ResuableDatePickerProps> = ({
  label,
  value,
  onChange,
  className = "",
  required = false,
  align = "left",
}) => {
  // Helper to parse YYYY-MM-DD strings in local time to avoid UTC shifts
  const parseValue = (val: string | null) => {
    if (!val) return new Date();
    const [year, month, day] = val.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to format Date to YYYY-MM-DD in local time
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize viewDate based on value or today
  const [viewDate, setViewDate] = useState(() => {
    const initialDate = parseValue(value);
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });

  // Sync viewDate when value changes from outside (optional, but improves UX)
  useEffect(() => {
    if (value && !isOpen) {
      const newDate = parseValue(value);
      setViewDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  }, [value, isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle smart positioning (Upward vs Downward)
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 340; // Calibrated height
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Auto-close on scroll or resize to maintain UI stability
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatDate(selected));
    setIsOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const current = parseValue(value);
    return (
      current.getDate() === day &&
      current.getMonth() === viewDate.getMonth() &&
      current.getFullYear() === viewDate.getFullYear()
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const days = [];
  const startOffset = firstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth(),
  );
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`pad-${i}`} className="h-8 w-8" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleSelectDay(d)}
        className={`h-8 w-8 text-[11px] font-bold rounded-sm flex items-center justify-center transition-all ${
          isSelected(d)
            ? "text-white"
            : isToday(d)
              ? "border-emerald-500/30"
              : "hover:bg-hf-green/10"
        }`}
        style={{
          backgroundColor: isSelected(d)
            ? "#22c55e"
            : isToday(d)
              ? "rgba(34, 197, 94, 0.1)"
              : "transparent",
          color: isSelected(d)
            ? "white"
            : isToday(d)
              ? "#22c55e"
              : "var(--text-secondary)",
          borderColor: isToday(d)
            ? "var(--color-emerald-light)"
            : "transparent",
        }}
      >
        {d}
      </button>,
    );
  }

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <div
      className={`space-y-1.5 ${alignClass} ${className}`}
      ref={containerRef}
    >
      {label && (
        <label
          className="text-[8px] font-black uppercase tracking-widest block mb-1 px-1"
          style={{ color: "var(--text-muted)" }}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 border px-3 py-3 rounded-sm text-[13px] font-semibold transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <span className={`flex-1 ${alignClass}`}>
            {value || "Select Date"}
          </span>
          <span
            className={`transition-colors ${isOpen ? "text-[#22c55e]" : ""}`}
            style={{ color: isOpen ? "#22c55e" : "var(--text-muted)" }}
          >
            <Icon name="calendar" className="w-3.5 h-3.5" />
          </span>
        </button>

        {isOpen && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 border rounded-sm z-[9999] p-4 w-64 animate-in fade-in zoom-in-95 duration-200 ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </h4>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevMonth}
                  type="button"
                  className="p-1 rounded-sm transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Icon name="chevron-down" className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={handleNextMonth}
                  type="button"
                  className="p-1 rounded-sm transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Icon name="chevron-down" className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="h-8 w-8 flex items-center justify-center text-[9px] font-black uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  {d}
                </div>
              ))}
              {days}
            </div>

            <div
              className="flex items-center justify-between pt-3 border-t mt-2"
              style={{ borderTopColor: "var(--border-color)" }}
            >
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  onChange(formatDate(today));
                  setIsOpen(false);
                }}
                className="text-[9px] font-bold text-[#22c55e] uppercase tracking-widest hover:underline"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[9px] font-bold uppercase tracking-widest transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResuableDatePicker;
