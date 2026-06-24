import React, { type ReactNode } from "react";

interface DonationActivityCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  status: string;
  date: string;
  compact?: boolean;
  actionLabel?: string;
  onActionClick?: () => void;
}

const DonationActivityCard: React.FC<DonationActivityCardProps> = ({
  icon,
  title,
  subtitle,
  status,
  date,
  compact = false,
  actionLabel,
  onActionClick,
}) => {
  const isCollected = status === "Collected";

  return (
    <div
      onClick={onActionClick}
      className={`group/item relative flex flex-col items-start text-left transition-all duration-300 border font-sans rounded-2xl cursor-pointer
        ${
          compact
            ? "p-4 gap-3"
            : "p-6 gap-5 hover:border-hf-green/40 hover:bg-slate-500/5 hover:shadow-xl hover:shadow-hf-green/5"
        }
      `}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Status Badge - Floating */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <span
          className={`font-black uppercase tracking-widest px-2.5 py-1 rounded-lg
            ${compact ? "text-[7px]" : "text-[9px]"}
            ${
              isCollected
                ? "text-hf-green bg-hf-green/10 border border-hf-green/20"
                : "text-blue-500 bg-blue-500/10 border border-blue-500/20"
            }
          `}
        >
          {status}
        </span>
      </div>

      {/* Refined Icon Container */}
      <div
        className={`flex items-center justify-center transition-all duration-500 rounded-2xl shrink-0 group-hover/item:scale-110
          ${compact ? "w-10 h-10" : "w-14 h-14"}
          ${
            isCollected
              ? "bg-hf-green text-white shadow-lg shadow-hf-green/20"
              : "bg-blue-500 text-white shadow-lg shadow-blue-500/10"
          }
        `}
      >
        <div className={compact ? "scale-75" : "scale-100"}>{icon}</div>
      </div>

      {/* Content Group */}
      <div className="space-y-1.5 w-full pr-12">
        <h3
          className={`font-black uppercase tracking-tight truncate transition-colors duration-300 group-hover/item:text-hf-green
          ${compact ? "text-xs" : "text-sm md:text-base"}
        `}
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>

        <div className="flex flex-col items-start gap-1">
          <p
            className={`font-black uppercase tracking-[0.2em] opacity-40
            ${compact ? "text-[7px]" : "text-[9px]"}
          `}
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </p>
          <p
            className={`font-bold opacity-30
            ${compact ? "text-[7px]" : "text-[9px]"}
          `}
            style={{ color: "var(--text-secondary)" }}
          >
            {date}
          </p>
        </div>
      </div>

      {actionLabel && (
        <div
          className={`mt-2 flex items-center gap-2 font-black uppercase tracking-[0.2em] transition-all
            text-[#22c55e] opacity-0 group-hover/item:opacity-100 translate-y-2 group-hover/item:translate-y-0
            ${compact ? "text-[8px]" : "text-[10px]"}
          `}
        >
          {actionLabel}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-0.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default DonationActivityCard;
