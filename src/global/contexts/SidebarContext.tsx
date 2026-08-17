import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const STORAGE_KEY = "sidebar_expanded";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expanded, setExpandedState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const setExpanded = (value: boolean | ((prev: boolean) => boolean)) => {
    setExpandedState((prev) => {
      const nextValue = typeof value === "function" ? value(prev) : value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
      } catch (err) {
        console.error("Failed to save sidebar state to localStorage:", err);
      }
      return nextValue;
    });
  };

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return ctx;
};
