import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnalyticsOverview, AnalyticsReportsPage } from "./components/analytics_components";

const AnalyticsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Sync tab active key with route pathname
  const activeTab = location.pathname.endsWith("/reports") ? "reports" : "overview";

  const handleTabChange = (key: React.Key) => {
    if (key === "reports") {
      navigate("/admin/analytics/reports");
    } else {
      navigate("/admin/analytics");
    }
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 w-full mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-700 text-start min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4">
        <div className="text-start max-w-2xl">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Impact Analytics
          </h1>
          <p
            className="font-medium mt-2 text-sm sm:text-base leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Track donations, distribution, and community impact metrics.
          </p>
        </div>
      </header>

      {/* HeroUI Tabs */}
      <div className="w-full">
        <Tabs
          aria-label="Analytics Options"
          variant="underlined"
          selectedKey={activeTab}
          onSelectionChange={handleTabChange}
          classNames={{
            base: "w-full",
            tabList:
              "gap-6 sm:gap-8 w-full relative rounded-none p-0 border-b border-[var(--border-color)] overflow-x-auto no-scrollbar",
            cursor: "bg-hf-green h-0.5",
            tab: "max-w-fit px-0 h-12 whitespace-nowrap",
            tabContent:
              "group-data-[selected=true]:text-hf-green font-black uppercase tracking-widest text-[10px]",
          }}
        >
          <Tab key="overview" title="Overview">
            <div className="mt-6">
              <AnalyticsOverview />
            </div>
          </Tab>
          <Tab key="reports" title="Distribution Reports">
            <div className="mt-6">
              <AnalyticsReportsPage hideHeader />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;
