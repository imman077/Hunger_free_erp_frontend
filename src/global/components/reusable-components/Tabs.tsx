import React from "react";

export interface Tab {
  label: string;
  value: string;
  count?: number;
  showCount?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  variant?: "default" | "outlined" | "pills";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  activeColor?: string;
  activeHoverColor?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  variant = "default",
  size = "md",
  fullWidth = false,
  activeColor = "#22c55e",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  // Variant classes
  const getTabClasses = (isActive: boolean) => {
    const baseClasses = `font-medium transition-all duration-200 ${sizeClasses[size]}`;

    switch (variant) {
      case "outlined":
        return isActive
          ? `${baseClasses} border-2 rounded-md shadow-sm`
          : `${baseClasses} border rounded-md hover:opacity-80`;

      case "pills":
        return isActive
          ? `${baseClasses} rounded-full shadow-sm`
          : `${baseClasses} rounded-full hover:opacity-80`;

      case "default":
      default:
        return isActive
          ? `${baseClasses} rounded-md shadow-sm`
          : `${baseClasses} border rounded-md hover:opacity-80`;
    }
  };

  const getActiveStyles = (isActive: boolean): React.CSSProperties => {
    if (isActive) {
      return {
        backgroundColor: activeColor,
        color: "white",
        borderColor: activeColor,
      };
    }
    // Inactive tabs
    return {
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-secondary)",
      borderColor: "var(--border-color)",
    };
  };

  return (
    <div
      className={`flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 md:pb-0 ${fullWidth ? "w-full" : ""} ${className}`}
      role="tablist"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`${getTabClasses(isActive)} whitespace-nowrap flex items-center justify-center shrink-0 ${
              fullWidth ? "flex-1" : ""
            }`}
            style={getActiveStyles(isActive)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.value}`}
          >
            {tab.label}
            {tab.showCount && tab.count !== undefined && (
              <span className="ml-2 text-xs opacity-90">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
