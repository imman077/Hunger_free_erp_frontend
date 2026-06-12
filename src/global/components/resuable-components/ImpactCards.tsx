import React from "react";
import {
  type LucideIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export interface ImpactCardData {
  label: string;
  val: string;
  trend: string;
  color: string;
  icon?: LucideIcon;
  image?: string;
}

export interface ImpactCardsProps {
  data: ImpactCardData[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const ImpactCard: React.FC<
  ImpactCardData & { orientation: "horizontal" | "vertical" }
> = ({ label, val, trend, color, icon: Icon, image }) => {
  // Determine if it's a positive or alert state
  const isGreen =
    color.includes("emerald") ||
    color.includes("green") ||
    color.includes("#22c55e");
  const isRed =
    color.includes("red") ||
    color.includes("#ef4444") ||
    trend.toLowerCase().includes("attention");
  const isClear = trend.toLowerCase().includes("clear");

  return (
    <div
      className="group/impact p-6 md:p-8 rounded-2xl border-[0.5px] transition-all duration-500 flex flex-row items-center min-h-[140px] min-w-[280px] relative overflow-hidden bg-white hover:-translate-y-0.5"
      style={{
        borderColor: "var(--border-color, #f1f5f9)",
      }}
    >
      {/* Icon/Image Section */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500 group-hover/impact:scale-105 overflow-hidden
          ${isGreen ? "bg-green-50 text-green-500" : isRed ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}
      >
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-cover" />
        ) : Icon ? (
          <Icon size={24} strokeWidth={2.5} />
        ) : isGreen ? (
          <TrendingUp size={24} strokeWidth={2.5} />
        ) : (
          <AlertCircle size={24} strokeWidth={2.5} />
        )}
      </div>

      {/* Content Section */}
      <div className="ml-5 flex flex-col justify-center">
        <p
          className="text-[9px] font-black uppercase tracking-[0.15em] mb-1 opacity-40"
          style={{ color: "var(--text-secondary, #64748b)" }}
        >
          {label}
        </p>

        <h4
          className="text-2xl font-black tracking-tight tabular-nums leading-none mb-2"
          style={{ color: "var(--text-primary, #0f172a)" }}
        >
          {val}
        </h4>

        {/* Trend/Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit transition-all duration-500
          ${isGreen ? "bg-green-50/80 text-green-500" : isRed ? "bg-red-50/80 text-red-600" : isClear ? "bg-slate-50 text-slate-500" : "bg-blue-50 text-blue-600"}`}
        >
          <span className="text-[9px] font-black uppercase tracking-wider">
            {trend}
          </span>
        </div>
      </div>

      {/* Subtle Background Accent */}
      <div
        className={`absolute -right-4 -bottom-4 w-20 h-20 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700
        ${isGreen ? "bg-green-400" : isRed ? "bg-red-400" : "bg-blue-400"}`}
      />
    </div>
  );
};

export const ImpactCards: React.FC<ImpactCardsProps> = ({
  data,
  orientation = "horizontal",
  className = "",
}) => {
  return (
    <div
      className={`${
        orientation === "horizontal"
          ? `grid grid-cols-1 sm:grid-cols-2 ${data.length > 2 ? "xl:grid-cols-4" : ""} gap-4 md:gap-6`
          : "flex flex-col gap-4"
      } ${className}`}
    >
      {data.map((stat, i) => (
        <ImpactCard key={i} {...stat} orientation={orientation} />
      ))}
    </div>
  );
};

export default ImpactCards;
