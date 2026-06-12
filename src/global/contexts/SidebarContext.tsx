"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

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
