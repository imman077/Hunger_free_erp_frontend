import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

export type LucideIconType = React.ComponentType<{ size?: number | string; className?: string }>;

export interface TabItem {
  id?: string;
  value?: string;
  label: string;
  icon?: LucideIconType;
  count?: number;
  showCount?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  containerClassName?: string;
  variant?: "default" | "outlined" | "pills" | "segment";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  activeColor?: string;
  layoutId?: string;
  uppercase?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  containerClassName = "",
  size = "md",
  fullWidth = false,
  activeColor = "#22c55e",
  layoutId = "globalTabPill",
  uppercase = true,
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-[10px] gap-1.5 font-bold",
    md: "px-5 py-2.5 text-[11px] font-black gap-2",
    lg: "px-6 py-3 text-xs font-black gap-2.5",
  };

  const iconSizes = {
    sm: 13,
    md: 14,
    lg: 16,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const updatePillPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = tabRefs.current.get(activeTab);
    if (!activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setPillStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [activeTab]);

  useEffect(() => {
    updatePillPosition();
  }, [updatePillPosition]);

  useEffect(() => {
    const observer = new ResizeObserver(() => updatePillPosition());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updatePillPosition]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-1 p-1 rounded-2xl shadow-sm border shrink-0 bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 ${
        fullWidth ? "w-full" : "w-full sm:w-auto"
      } relative ${containerClassName} ${className}`}
      role="tablist"
    >
      {/* Sliding active pill */}
      <motion.div
        layoutId={layoutId}
        className="absolute top-1 bottom-1 rounded-xl z-0"
        style={{
          backgroundColor: activeColor,
          boxShadow: `0 3px 12px ${activeColor}35`,
        }}
        animate={{
          left: pillStyle.left,
          width: pillStyle.width,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
      />

      {tabs.map((tab, idx) => {
        const tabValue = tab.value || tab.id || String(idx);
        const isActive = activeTab === tabValue;
        const Icon = tab.icon;

        return (
          <button
            key={tabValue}
            ref={(el) => {
              if (el) tabRefs.current.set(tabValue, el);
            }}
            type="button"
            onClick={() => onTabChange(tabValue)}
            className={`relative flex items-center justify-center ${sizeClasses[size]} rounded-xl transition-colors cursor-pointer outline-none select-none z-10 ${
              uppercase ? "uppercase tracking-wider" : ""
            } ${fullWidth ? "flex-1" : "w-1/2 sm:w-auto"} ${
              isActive
                ? "text-white font-black"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
            role="tab"
            aria-selected={isActive}
          >
            {Icon && <Icon size={iconSizes[size]} className="shrink-0" />}
            <span>{tab.label}</span>
            {tab.showCount && tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
