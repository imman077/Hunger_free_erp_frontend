import React, { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Leaf, TrendingUp, Users, Building2, Heart, Download, Package } from "lucide-react";
import { Spinner } from "@heroui/react";

import { ImpactCards } from "../../../../global/components/reusable-components/ImpactCards";
import { useAnalytics } from "../controller/analytics_controller";
import ReusableTable, {
  type ColumnDef,
} from "../../../../global/components/reusable-components/Table";

// ==========================================
// 1. Analytics Overview Component
// ==========================================

export const AnalyticsOverview: React.FC = () => {
  const {
    impactMetrics,
    donationTrends,
    categoryData,
    totalNGOs = "0",
    totalActiveUsers = "0",
    fetchAnalytics,
    isLoading,
  } = useAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-8 md:space-y-10 relative animate-in fade-in duration-500">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50 rounded-sm">
          <Spinner color="success" size="lg" label="Syncing with SQL..." />
        </div>
      )}

      {/* Highlights / Badges */}
      <div className="flex flex-wrap gap-3 justify-end w-full sm:w-auto">
        <div
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-sm border w-fit"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.05)",
            borderColor: "rgba(34, 197, 94, 0.1)",
          }}
        >
          <Leaf size={18} className="text-[#22c55e]" />
          <span className="text-sm font-black text-hf-green uppercase tracking-tight">
            95% Distribution Rate
          </span>
        </div>
      </div>

      {/* Impact Grid */}
      <div className="text-start">
        <ImpactCards data={impactMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
        {/* Main Graph - Donation Trends */}
        <div
          className="lg:col-span-8 p-4 sm:p-6 rounded-sm border shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-[#22c55e]" />
                <h3
                  className="font-black text-xl tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Donation Flow
                </h3>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Weekly comparison of donations received vs. distributed
              </p>
            </div>
          </div>
          <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationTrends}>
                <defs>
                  <linearGradient
                    id="colorDonations"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorDistributed"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border-color)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-lg)",
                    padding: "12px",
                  }}
                  itemStyle={{
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                  labelStyle={{
                    color: "var(--text-primary)",
                    fontWeight: "900",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="donations"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDonations)"
                  name="Donations Received"
                />
                <Area
                  type="monotone"
                  dataKey="distributed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDistributed)"
                  name="Distributed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div
          className="lg:col-span-4 p-4 sm:p-6 rounded-sm border shadow-sm flex flex-col"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} className="text-amber-500" />
            <h3
              className="font-black text-xl tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Food Categories
            </h3>
          </div>
          <p
            className="text-sm font-medium mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Distribution of donation types this month
          </p>

          <div className="flex-grow flex items-end h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-secondary)",
                    fontWeight: 800,
                    fontSize: 11,
                  }}
                  width={85}
                />
                <Tooltip
                  cursor={{ fill: "var(--bg-secondary)", opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "var(--bg-primary)",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div
              className="p-4 rounded-sm border shadow-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-blue-500" />
                <span
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Active Users
                </span>
              </div>
              <p
                className="text-lg font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {totalActiveUsers}
              </p>
            </div>
            <div
              className="p-4 rounded-sm border shadow-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={14} className="text-amber-500" />
                <span
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  NGOs
                </span>
              </div>
              <p
                className="text-lg font-black"
                style={{ color: "var(--text-primary)" }}
              >
                {totalNGOs}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Analytics Reports Component
// ==========================================

const donationLogs = [
  {
    id: "DON-2024-001",
    donor: "Chettinad Enterprises",
    ngo: "Anna Dhanam Trust",
    category: "Cooked Food",
    quantity: "50 meals",
    date: "Jan 22, 2024",
    status: "Delivered",
  },
  {
    id: "DON-2024-002",
    donor: "Hotel Saravana Bhavan",
    ngo: "Hunger Free Foundation",
    category: "Cooked Food",
    quantity: "120 meals",
    date: "Jan 21, 2024",
    status: "In Transit",
  },
  {
    id: "DON-2024-003",
    donor: "Fresh Farms Pvt Ltd",
    ngo: "Food For All NGO",
    category: "Fresh Produce",
    quantity: "75 kg",
    date: "Jan 21, 2024",
    status: "Delivered",
  },
  {
    id: "DON-2024-004",
    donor: "Reliance Fresh Store",
    ngo: "Akshaya Patra Foundation",
    category: "Packaged Items",
    quantity: "200 units",
    date: "Jan 20, 2024",
    status: "Delivered",
  },
  {
    id: "DON-2024-005",
    donor: "Chennai Caterers",
    ngo: "Robin Hood Army",
    category: "Cooked Food",
    quantity: "85 meals",
    date: "Jan 20, 2024",
    status: "Pending Pickup",
  },
  {
    id: "DON-2024-006",
    donor: "Aavin Dairy Outlet",
    ngo: "Feeding India",
    category: "Beverages",
    quantity: "100 liters",
    date: "Jan 19, 2024",
    status: "Delivered",
  },
];

const columns: ColumnDef[] = [
  { name: "DONATION ID", uid: "id", sortable: true, align: "start" },
  { name: "DONOR", uid: "donor", sortable: true, align: "start" },
  { name: "RECEIVING NGO", uid: "ngo", sortable: true, align: "start" },
  { name: "CATEGORY", uid: "category", sortable: true, align: "center" },
  { name: "QUANTITY", uid: "quantity", sortable: true, align: "center" },
  { name: "STATUS", uid: "status", sortable: true, align: "center" },
];

interface AnalyticsReportsPageProps {
  hideHeader?: boolean;
}

export const AnalyticsReportsPage: React.FC<AnalyticsReportsPageProps> = ({
  hideHeader = false,
}) => {
  const [dateFilter, setDateFilter] = React.useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });

  const filteredLogs = React.useMemo(() => {
    return donationLogs.filter((log) => {
      const logDate = new Date(log.date);
      const start = dateFilter.start
        ? new Date(dateFilter.start + "T00:00:00")
        : null;
      const end = dateFilter.end
        ? new Date(dateFilter.end + "T00:00:00")
        : null;

      const matchesDate =
        (!start || logDate >= start) && (!end || logDate <= end);

      return matchesDate;
    });
  }, [dateFilter]);

  const handleExport = () => {
    const BOM = "\uFEFF";
    const separator = ",";

    const headers = [
      "Donation ID",
      "Donor",
      "Receiving NGO",
      "Category",
      "Quantity",
      "Date",
      "Status",
    ];

    const csvContent = [
      `sep=${separator}`,
      headers.map((h) => `"${h}"`).join(separator),
      ...filteredLogs.map((log) =>
        [
          log.id,
          log.donor,
          log.ngo,
          log.category,
          log.quantity,
          log.date,
          log.status,
        ]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(separator),
      ),
    ].join("\r\n");

    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `donation-distribution-logs-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCell = React.useCallback((log: any, columnKey: React.Key) => {
    const cellValue = log[columnKey as string];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center transition-colors"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-muted)",
              }}
            >
              <Package size={16} />
            </div>
            <span
              className="font-black text-sm tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {log.id}
            </span>
          </div>
        );
      case "donor":
        return (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-sm border transition-all cursor-pointer group w-fit min-w-0"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.05)",
              borderColor: "rgba(245, 158, 11, 0.1)",
            }}
          >
            <div className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-bold text-white bg-amber-500 shadow-sm shrink-0">
              {log.donor
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <span className="font-bold text-xs whitespace-nowrap truncate max-w-[140px] pr-1 transition-colors text-amber-500">
              {log.donor}
            </span>
          </div>
        );
      case "ngo":
        return (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-sm border transition-all cursor-pointer group w-fit min-w-0"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.05)",
              borderColor: "rgba(16, 185, 129, 0.1)",
            }}
          >
            <div className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-bold text-white bg-hf-green shadow-sm shrink-0">
              {log.ngo
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <span
              className="font-bold text-xs whitespace-nowrap truncate max-w-[140px] pr-1 transition-colors"
              style={{ color: "#22c55e" }}
            >
              {log.ngo}
            </span>
          </div>
        );
      case "category":
        return (
          <span
            className="px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-muted)",
              borderColor: "var(--border-color)",
            }}
          >
            {log.category}
          </span>
        );
      case "quantity":
        return (
          <span
            className="font-black text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {log.quantity}
          </span>
        );
      case "status":
        return (
          <div className="flex items-center justify-center font-bold">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border w-fit"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  log.status === "Delivered"
                    ? "bg-emerald-500"
                    : log.status === "In Transit"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                }`}
              />
              <span
                className="text-[10px] uppercase tracking-wider whitespace-nowrap"
                style={{ color: "var(--text-secondary)" }}
              >
                {log.status}
              </span>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const exportButton = (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 h-10 rounded-sm font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-sm group active:scale-95 text-white"
      style={{
        backgroundColor: "#22c55e",
      }}
    >
      <Download
        size={14}
        className="group-hover:translate-y-0.5 transition-transform"
      />
      Export
    </button>
  );

  return (
    <div
      className={
        hideHeader
          ? "w-full space-y-8 text-start animate-in slide-in-from-bottom-4 duration-700"
          : "p-8 w-full mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 text-start min-h-screen"
      }
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {!hideHeader && (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1
              className="text-4xl font-black tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Distribution Logs
            </h1>
            <p
              className="font-semibold mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              Track all donation pickups and deliveries to partner NGOs.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-sm group active:scale-95"
              style={{
                backgroundColor: "#22c55e",
                color: "#ffffff",
              }}
            >
              <Download
                size={16}
                className="group-hover:translate-y-0.5 transition-transform"
              />
              Export Report
            </button>
          </div>
        </header>
      )}

      {/* Distribution Logs Table */}
      <ReusableTable
        data={filteredLogs}
        columns={columns}
        renderCell={renderCell}
        title="Donation Distribution Ledger"
        description="Complete history of donations from Donors to NGOs"
        enableDateFilter={true}
        onDateRangeChange={(range) => {
          setDateFilter(range || { start: null, end: null });
        }}
        additionalFilters={hideHeader ? exportButton : undefined}
      />
    </div>
  );
};
