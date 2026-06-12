// DatePicker.tsx - Professional React + Tailwind CSS DatePicker
import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  disablePast?: boolean;
  className?: string;
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  disablePast = false,
  className = "",
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const selectDate = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthYear = `${
    months[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  const renderDays = () => {
    const days: React.ReactNode[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    // base: SMALL SQUARE cell, little rounding
    const baseCell =
      "h-4 rounded-md text-[11px] flex items-center justify-center " +
      "transition-colors duration-150";

    // empty cells before 1st day (no circles, just blank)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // current month days only
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isTodayFlag = isSameDay(date, today);
      const isPast = disablePast && date < today && !isTodayFlag;

      let stateClass = "text-gray-700 hover:bg-gray-100";
      if (isPast) {
        stateClass = "text-gray-300 cursor-not-allowed";
      } else if (isSelected) {
        stateClass = "bg-blue-500 text-white hover:bg-blue-600";
      } else if (isTodayFlag) {
        stateClass = "border border-yellow-300 bg-yellow-50 text-yellow-800";
      }

      days.push(
        <button
          key={day}
          onClick={() => !isPast && selectDate(day)}
          disabled={isPast}
          className={`${baseCell} ${stateClass}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // numeric dd / mm / yyyy
  const formatNumeric = (date: Date | null) => {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d} / ${m} / ${y}`;
  };

  console.log("selectedDate", selectedDate);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input Field (match MUI height) */}
      <div className="relative">
        <input
          type="text"
          value={selectedDate ? formatNumeric(selectedDate) : ""} // show dd / mm / yyyy
          onClick={() => {
            setIsOpen(true);
          }}
          placeholder="mm / dd / yyyy" // grey placeholder
          readOnly
          className="
    w-full h-10
    pl-3 pr-9 text-sm
    rounded-lg border border-gray-300
    bg-white text-gray-900 placeholder-gray-500
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    shadow-sm hover:shadow
    cursor-pointer
  "
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Calendar Popup (compact) */}
      {isOpen && (
        <div
          className="
      absolute top-[110%] left-0 z-50
      w-72 rounded-xl border border-gray-200 bg-white shadow-lg
      overflow-hidden
    "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <button
              type="button"
              onClick={prevMonth}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200 text-gray-600"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="text-sm font-semibold text-gray-900">
              {monthYear}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200 text-gray-600"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 px-3 pt-2 pb-1 text-[11px] font-medium text-gray-400">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="flex items-center justify-center h-5">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1 px-3 pb-3">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
