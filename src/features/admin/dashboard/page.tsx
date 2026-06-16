"use client";

import { useEffect } from "react";
import { onInit, onDestroy } from "./controller/dashboard_controller";
import { DashboardMainField } from "./components/dashboard_components";

export default function AdminDashboardPage() {
  // Initialize page on mount
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  return (
    <div className="p-3 w-full mx-auto h-[calc(100vh-70px)] flex flex-col overflow-hidden box-border">
      {/* Title block or breadcrumb can go here if needed, but table already has its own title block */}
      <DashboardMainField />
    </div>
  );
}
