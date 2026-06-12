import React from "react";
import { Download, Package } from "lucide-react";

import ReusableTable, {
  type ColumnDef,
} from "../../../../global/components/resuable-components/table";

// Donation distribution logs - mock data for UI
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

const AnalyticsReportsPage: React.FC = () => {
  const [dateFilter, setDateFilter] = React.useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });

  const filteredLogs = React.useMemo(() => {
    return donationLogs.filter((log) => {
      const logDate = new Date(log.date + "T00:00:00");
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
    // UTF-8 BOM for Excel compatibility
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

    // Create CSV content with explicit separator declaration for Excel
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

  return (
    <div
      className="p-8 w-full mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 text-start min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
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
      />
    </div>
  );
};

export default AnalyticsReportsPage;
