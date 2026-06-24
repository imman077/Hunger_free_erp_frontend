import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import type { TimeValue } from "../types";

interface ResuableTimePickerProps {
  label?: string;
  value: string; // HH:mm format
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  align?: "left" | "center" | "right";
}

const ResuableTimePicker: React.FC<ResuableTimePickerProps> = ({
  label,
  value,
  onChange,
  className = "",
  required = false,
  align = "center",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const PRIMARY_EMERALD = "#22c55e";

  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  // Internal conversion from HH:mm to TimeValue
  const getTimeValue = (val: string): TimeValue => {
    if (!val) {
      const now = new Date();
      let h = now.getHours();
      const p = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return { hour: h, minute: now.getMinutes(), period: p };
    }
    const [h24, m] = val.split(":").map(Number);
    const period = h24 >= 12 ? "PM" : "AM";
    const hour = h24 % 12 || 12;
    return { hour, minute: m || 0, period };
  };

  const timeValue = getTimeValue(value);

  // Internal conversion from TimeValue to HH:mm string
  const formatToString = (time: TimeValue): string => {
    let h24 = time.hour;
    if (time.period === "PM" && h24 < 12) h24 += 12;
    if (time.period === "AM" && h24 === 12) h24 = 0;
    return `${h24.toString().padStart(2, "0")}:${time.minute
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeValueChange = (newTime: TimeValue) => {
    onChange(formatToString(newTime));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProgrammaticScroll = useRef(false);

  const scrollToValue = (h: number, m: number) => {
    isProgrammaticScroll.current = true;
    const scrollToActive = (
      ref: React.RefObject<HTMLDivElement | null>,
      val: number,
    ) => {
      const active = ref.current?.querySelector(`[data-value="${val}"]`);
      if (active && ref.current) {
        const container = ref.current;
        const activeElement = active as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        const scrollOffset =
          activeRect.top -
          containerRect.top -
          container.clientHeight / 2 +
          activeElement.clientHeight / 2;
        container.scrollTop += scrollOffset;
      }
    };
    scrollToActive(hourScrollRef, h);
    scrollToActive(minuteScrollRef, m);
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 150);
  };

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 320; // Estimated height of the picker

      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }

      const timer = setTimeout(() => {
        scrollToValue(timeValue.hour, timeValue.minute);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleHourClick = (h: number) => {
    handleTimeValueChange({ ...timeValue, hour: h });
    setTimeout(() => scrollToValue(h, timeValue.minute), 50);
  };

  const handleMinuteClick = (m: number) => {
    handleTimeValueChange({ ...timeValue, minute: m });
    setTimeout(() => scrollToValue(timeValue.hour, m), 50);
  };

  const handleScroll = (type: "hour" | "minute") => {
    if (isProgrammaticScroll.current) return;
    const ref = type === "hour" ? hourScrollRef : minuteScrollRef;
    if (!ref.current) return;

    const container = ref.current;
    const containerCenter = container.getBoundingClientRect().top + container.clientHeight / 2;

    const buttons = Array.from(container.querySelectorAll("button"));
    let closestVal = null;
    let minDiff = Infinity;

    buttons.forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      const btnCenter = rect.top + rect.height / 2;
      const diff = Math.abs(btnCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestVal = Number(btn.getAttribute("data-value"));
      }
    });

    if (closestVal !== null) {
      if (type === "hour" && timeValue.hour !== closestVal) {
        onChange(formatToString({ ...timeValue, hour: closestVal }));
      } else if (type === "minute" && timeValue.minute !== closestVal) {
        onChange(formatToString({ ...timeValue, minute: closestVal }));
      }
    }
  };

  const handleNow = () => {
    const now = new Date();
    let h = now.getHours();
    const p = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const m = now.getMinutes();
    handleTimeValueChange({ hour: h, minute: m, period: p });
    setTimeout(() => scrollToValue(h, m), 50);
  };

  const displayTime = `${timeValue.hour
    .toString()
    .padStart(2, "0")}:${timeValue.minute.toString().padStart(2, "0")} ${
    timeValue.period
  }`;

  return (
    <div className={`w-full ${alignClass} ${className}`}>
      {label && (
        <label
          className="text-[8px] font-black uppercase tracking-widest block mb-1 px-1"
          style={{ color: "var(--text-muted)" }}
        >
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-3 px-4 border rounded-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-hf-green/5 ${alignClass}`}
          style={{
            borderColor: isOpen ? "#22c55e" : "var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <span
            className={`flex-1 font-semibold text-[13px] tabular-nums text-left`}
            style={{
              color: value ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            {value ? displayTime : "Select Time"}
          </span>
          <Clock
            className={`w-4 h-4 flex-shrink-0 transition-colors ${
              isOpen ? "text-hf-green" : "text-slate-400"
            }`}
          />
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`absolute left-0 z-[9999] w-64 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border shadow-xl ${
              placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="p-4 relative bg-white"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="grid grid-cols-3 mb-3 px-1">
                <span className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  HOUR
                </span>
                <span className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  MIN
                </span>
                <span className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  PERIOD
                </span>
              </div>

              <div className="relative grid grid-cols-3 h-28 items-center">
                <div
                  className="absolute top-1/2 left-0 right-0 h-9 -translate-y-1/2 rounded-sm pointer-events-none mx-1.5 border"
                  style={{
                    backgroundColor: `${PRIMARY_EMERALD}10`,
                    borderColor: `${PRIMARY_EMERALD}20`,
                  }}
                ></div>

                <div
                  ref={hourScrollRef}
                  onScroll={() => handleScroll("hour")}
                  className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                >
                  <div className="h-[38px]" />
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <button
                      key={h}
                      data-value={h}
                      type="button"
                      onClick={() => handleHourClick(h)}
                      className={`w-full h-9 flex items-center justify-center text-base font-bold transition-all snap-center ${
                        timeValue.hour === h
                          ? "scale-110"
                          : "text-slate-300 hover:text-slate-400"
                      }`}
                      style={
                        timeValue.hour === h ? { color: PRIMARY_EMERALD } : {}
                      }
                    >
                      {h.toString().padStart(2, "0")}
                    </button>
                  ))}
                  <div className="h-[38px]" />
                </div>

                <div
                  ref={minuteScrollRef}
                  onScroll={() => handleScroll("minute")}
                  className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
                >
                  <div className="h-[38px]" />
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <button
                      key={m}
                      data-value={m}
                      type="button"
                      onClick={() => handleMinuteClick(m)}
                      className={`w-full h-9 flex items-center justify-center text-base font-bold transition-all snap-center ${
                        timeValue.minute === m
                          ? "scale-110"
                          : "text-slate-300 hover:text-slate-400"
                      }`}
                      style={
                        timeValue.minute === m ? { color: PRIMARY_EMERALD } : {}
                      }
                    >
                      {m.toString().padStart(2, "0")}
                    </button>
                  ))}
                  <div className="h-[38px]" />
                </div>

                <div
                  className="h-full flex flex-col items-center justify-center gap-2 transition-transform duration-200"
                  style={{
                    transform:
                      timeValue.period === "AM"
                        ? "translateY(22px)"
                        : "translateY(-22px)",
                  }}
                >
                  {["AM", "PM"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        handleTimeValueChange({
                          ...timeValue,
                          period: p as "AM" | "PM",
                        })
                      }
                      className={`w-14 h-9 rounded-xl flex items-center justify-center text-[10px] font-black tracking-widest transition-all duration-300 ${
                        timeValue.period === p
                          ? "text-white z-10 shadow-md"
                          : "text-slate-300 hover:text-slate-500"
                      }`}
                      style={
                        timeValue.period === p
                          ? { backgroundColor: PRIMARY_EMERALD }
                          : {}
                      }
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={handleNow}
                  className="text-[10px] font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-70 px-2 py-1.5 rounded-xl"
                  style={{ color: PRIMARY_EMERALD }}
                >
                  NOW
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#1e293b] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-black active:scale-95 transition-all shadow-md"
                >
                  SET
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ResuableTimePicker;
