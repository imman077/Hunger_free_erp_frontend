import React from "react";

// --- Types ---
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  onClick?: () => void;
}

// --- Arrow Icons ---
const ArrowUpIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// --- StatCard Component ---
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  onClick,
}) => {
  const getChangeStyles = () => {
    switch (changeType) {
      case "positive":
        return {
          textColor: "text-hf-green",
          icon: <ArrowUpIcon />,
        };
      case "negative":
        return {
          textColor: "text-red-500",
          icon: <ArrowDownIcon />,
        };
      default:
        return {
          textColor: "var(--text-muted)",
          icon: null,
        };
    }
  };

  const changeStyles = getChangeStyles();

  return (
    <div
      className="rounded-sm border p-6 transition-all duration-200 cursor-pointer group hover:border-emerald-500/30"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
      onClick={onClick}
    >
      {/* Header: Title and Icon */}
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400/80 leading-tight pr-4">
          {title}
        </h4>
        {icon && (
          <div
            className="p-2.5 rounded-sm border transition-colors"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-4">
        <p
          className="text-3xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
      </div>

      {/* Change Indicator */}
      {change && (
        <div className="flex items-center gap-1.5">
          {changeStyles.icon && (
            <span className={changeStyles.textColor}>{changeStyles.icon}</span>
          )}
          <span
            className={`text-xs font-black tracking-wide ${changeStyles.textColor}`}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

// --- StatCardGrid Component ---
export interface StatCardGridProps {
  cards: StatCardProps[];
  columns?: 2 | 3 | 4;
}

const StatCardGrid: React.FC<StatCardGridProps> = ({ cards, columns = 4 }) => {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export { StatCard, StatCardGrid };
export default StatCard;
