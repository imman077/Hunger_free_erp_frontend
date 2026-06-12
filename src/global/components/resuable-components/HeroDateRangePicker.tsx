import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Check, RotateCcw } from "lucide-react";

interface HeroDateRangePickerProps {
  onRangeSelect: (start: string | null, end: string | null) => void;
  onClose: () => void;
  initialStart: string | null;
  initialEnd: string | null;
}

const HeroDateRangePicker: React.FC<HeroDateRangePickerProps> = ({
  onRangeSelect,
  onClose,
  initialStart,
  initialEnd,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 2, 1));
  const [selection, setSelection] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: initialStart ? new Date(initialStart) : null,
    end: initialEnd ? new Date(initialEnd) : null,
  });

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: clickedDate, end: null });
    } else {
      if (clickedDate < selection.start) {
        setSelection({ start: clickedDate, end: selection.start });
      } else {
        setSelection({ ...selection, end: clickedDate });
      }
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return (
      selection.start?.toDateString() === date.toDateString() ||
      selection.end?.toDateString() === date.toDateString()
    );
  };

  const isInRange = (day: number) => {
    if (!selection.start || !selection.end) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return date > selection.start && date < selection.end;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  };

  const formatDateString = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
  };

  return (
    <div
      className="absolute right-0 mt-2 w-[300px] rounded-xl shadow-2xl border p-5 z-[100] animate-in fade-in zoom-in-95 duration-200"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 transition-colors rounded-xl"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronLeft size={18} />
        </button>
        <h4
          className="text-sm font-black tracking-tight uppercase"
          style={{ color: "var(--text-primary)" }}
        >
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h4>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 transition-colors rounded-xl"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div
            key={d}
            className="text-[10px] font-black uppercase py-1"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth(currentMonth) }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
          const day = i + 1;
          const selected = isSelected(day);
          const range = isInRange(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`
                h-9 w-9 text-[11px] font-bold rounded-xl transition-all relative flex items-center justify-center
                ${selected ? "bg-[#22c55e] text-white z-10 scale-110" : ""}
                ${range ? "rounded-none" : ""}
                ${!selected && !range ? "hover:bg-hf-green/10" : ""}
              `}
              style={{
                backgroundColor: selected
                  ? "#22c55e"
                  : range
                    ? "rgba(34, 197, 94, 0.1)"
                    : "transparent",
                color: selected
                  ? "white"
                  : range
                    ? "#22c55e"
                    : "var(--text-secondary)",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div
        className="pt-5 border-t space-y-4"
        style={{ borderTopColor: "var(--border-color)" }}
      >
        <div
          className="flex items-center justify-between px-3 rounded-lg py-3 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-[8px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Start
            </span>
            <span
              className="text-[10px] font-black"
              style={{ color: "var(--text-primary)" }}
            >
              {selection.start ? formatDateString(selection.start) : "None"}
            </span>
          </div>
          <div
            className="w-8 h-[1px]"
            style={{ backgroundColor: "var(--border-color)" }}
          />
          <div className="flex flex-col items-end">
            <span
              className="text-[8px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              End
            </span>
            <span
              className="text-[10px] font-black"
              style={{ color: "var(--text-primary)" }}
            >
              {selection.end ? formatDateString(selection.end) : "None"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSelection({ start: null, end: null });
              onRangeSelect(null, null);
            }}
            className="flex-1 py-2.5 border rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onRangeSelect(
                formatDateString(selection.start),
                formatDateString(selection.end),
              );
              onClose();
            }}
            className="flex-1 py-2.5 bg-hf-green text-white rounded-sm font-bold text-[10px] uppercase tracking-widest shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: "#22c55e" }}
          >
            <Check size={12} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroDateRangePicker;
