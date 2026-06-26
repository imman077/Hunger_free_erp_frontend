import React from "react";
import { Star, ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode; // For actions on the right
  showUnderline?: boolean;
  greenLastWord?: boolean;
  showHeart?: boolean;
  showPointsCard?: boolean;
  points?: number;
  pointsCardIcon?: React.ReactNode;
  pointsCardTitle?: string;
  pointsCardUnit?: string;
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  buttonOnClick?: () => void;
  showArrow?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  className = "",
  children,
  showUnderline = true,
  greenLastWord = false,
  showHeart = true,
  showPointsCard = false,
  points,
  pointsCardIcon,
  pointsCardTitle = "YOUR IMPACT POINTS",
  pointsCardUnit = "PTS",
  buttonIcon,
  buttonText,
  buttonOnClick,
  showArrow = false,
}) => {
  const words = title.split(" ");
  const firstWord = words[0] || "";
  const remainingWords = words.slice(1);
  const lastWord = words.length > 1 ? remainingWords[remainingWords.length - 1] : "";
  const middleWords = words.length > 2 ? remainingWords.slice(0, -1) : [];

  const renderFirstWord = () => {
    if (!firstWord) return null;
    if (showUnderline) {
      const firstChar = firstWord.charAt(0);
      const restOfFirstWord = firstWord.slice(1);
      return (
        <span className="mr-3">
          <span className="relative">
            {firstChar}
            <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#22c55e] rounded-full opacity-80" />
          </span>
          {restOfFirstWord}
        </span>
      );
    }
    return <span className="mr-3">{firstWord}</span>;
  };

  const heartDeco = showHeart && (
    <img
      src="/heart_dec1.png"
      className="absolute left-full -bottom-1 w-12 h-auto md:w-14 animate-in fade-in zoom-in duration-700"
      alt="Heart Decoration"
    />
  );

  const defaultIcon = <Star className="text-green-500" size={24} fill="currentColor" />;

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 ${className}`}>
      <div className="text-start space-y-2">
        <h1
          className="text-4xl md:text-5xl font-black tracking-tighter leading-none flex items-center"
          style={{ color: "var(--text-primary)" }}
        >
          {words.length === 1 ? (
            <span className={`relative mr-12 md:mr-14 ${greenLastWord ? "text-[#22c55e]" : ""}`}>
              {renderFirstWord()}
              {heartDeco}
            </span>
          ) : (
            <>
              {renderFirstWord()}
              {middleWords.map((word, i) => (
                <span key={i} className="mr-3">{word}</span>
              ))}
              {lastWord && (
                <span className={`relative mr-12 md:mr-14 ${greenLastWord ? "text-[#22c55e]" : ""}`}>
                  {lastWord}
                  {heartDeco}
                </span>
              )}
            </>
          )}
        </h1>
        {subtitle && (
          <p
            className="text-[12px] md:text-[13px] mt-1 font-medium tracking-normal opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {(showPointsCard || children || buttonText) && (
        <div className="w-full sm:w-auto flex items-center gap-4 flex-wrap sm:flex-nowrap shrink-0">
          {showPointsCard && typeof points === "number" && (
            <div className="flex items-center gap-4 border border-[var(--border-color)] bg-[var(--bg-primary)] p-3 px-5 rounded-md text-left relative overflow-hidden shrink-0">
              <div className="w-12 h-12 bg-green-500/8 border border-green-500/20 rounded-[14px] flex items-center justify-center shrink-0">
                {pointsCardIcon !== undefined ? pointsCardIcon : defaultIcon}
              </div>
              <div className="text-start">
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70 leading-none">
                    {pointsCardTitle}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tabular-nums leading-none text-[var(--text-primary)]">
                    {points.toLocaleString()}
                  </span>
                  <span className="text-xs font-black text-green-500 uppercase tracking-wide">
                    {pointsCardUnit}
                  </span>
                </div>
              </div>
            </div>
          )}
          {buttonText && (
            <button
              onClick={buttonOnClick}
              className="flex items-center justify-between gap-4 border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-hover)] p-2 sm:p-2.5 px-4 rounded-lg text-left relative overflow-hidden shrink-0 transition-all active:scale-95 shadow-sm group"
            >
              <div className="flex items-center gap-3">
                {buttonIcon && (
                  <div className="w-9 h-9 bg-green-500/8 border border-green-500/20 rounded-[10px] flex items-center justify-center shrink-0">
                    {buttonIcon}
                  </div>
                )}
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">{buttonText}</span>
              </div>
              {showArrow && (
                <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-500 transition-all duration-200" />
              )}
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
