import React, { useState, useEffect } from "react";
import { useRewardsStore } from "../store/rewards-store";
import { Spinner } from "@heroui/react";
import {
  Check,
  X,
  Eye,
  BarChart3,
  FileDown,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import { toast } from "sonner";
import type { ColumnDef } from "../../../../global/components/resuable-components/table";
import ReusableTable from "../../../../global/components/resuable-components/table";
import ResuableButton from "../../../../global/components/resuable-components/button";
import ResuableDrawer from "../../../../global/components/resuable-components/drawer";

const redemptionColumns: ColumnDef[] = [
  { name: "REQ ID", uid: "id", sortable: true, align: "start" },
  { name: "USER/ENTITY", uid: "user", sortable: true, align: "start" },
  { name: "CATEGORY", uid: "category", sortable: true, align: "center" },
  { name: "REWARD ITEM", uid: "item", sortable: true, align: "center" },
  { name: "VALUE", uid: "amount", sortable: true, align: "center" },
  { name: "DATE", uid: "date", sortable: true, align: "center" },
  { name: "STATUS", uid: "status", sortable: true, align: "center" },
  { name: "ACTIONS", uid: "actions", sortable: false, align: "center" },
];

const RedemptionsView: React.FC = () => {
  const { redemptions, fetchRewards, approveRedemption, rejectRedemption, isLoading } = useRewardsStore();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const {
    isOpen: isSummaryOpen,
    onOpen: onSummaryOpen,
    onClose: onSummaryClose,
  } = useDisclosure();

  const toggleFilter = (filterType: string) => {
    if (filterType === "category") setCategoryFilter("All");
    if (filterType === "status") setStatusFilter("All");
  };

  const exportToCSV = () => {
    const headers = ["Request ID", "User", "Role", "Category", "Item", "Amount", "Points", "Date", "Status"];
    const csvRows = redemptions.map((req: any) => [
      req.id, req.userName, req.userType, req.category || 'N/A', req.rewardName, 'Value', req.pointsDeducted, req.date, req.status
    ]);
    const csvContent = [headers.join(","), ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `redemption_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
    toast.success(`CSV report exported successfully!`);
  };

  const renderRedemptionCell = (req: any, columnKey: React.Key) => {
    const value = req[columnKey as string];
    switch (columnKey) {
      case "item": return <span className="font-bold text-xs truncate max-w-[150px] block">{req.rewardName}</span>;
      case "id": return <span className="font-black text-slate-400 text-[10px] tracking-widest">{req.id}</span>;
      case "user":
        return (
          <div className="flex items-center gap-2 px-2 py-1 rounded-full border bg-[var(--bg-secondary)] border-[var(--border-color)]">
             <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-slate-400">
              {req.userName?.[0] || 'U'}
            </div>
            <div className="flex flex-col text-start min-w-0">
              <span className="font-bold text-xs truncate max-w-[140px] text-[var(--text-primary)]">{req.userName}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">{req.userType}</span>
            </div>
          </div>
        );
      case "status":
        return (
          <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider
            ${req.status === "Pending" ? "bg-amber-100/10 text-amber-500 border-amber-500/20" : ""}
            ${req.status === "Approved" ? "bg-emerald-100/10 text-emerald-500 border-emerald-500/20" : ""}
            ${req.status === "Rejected" ? "bg-red-100/10 text-red-500 border-red-500/20" : ""}
          `}>
            {req.status}
          </div>
        );
      case "actions":
        return (
          <Button isIconOnly size="sm" variant="flat" onPress={() => { setSelectedRequest(req); setIsDetailOpen(true); }} className="!bg-transparent text-slate-600 hover:text-hf-green">
            <Eye size={14} />
          </Button>
        );
      default: return <span className="font-bold text-xs text-[var(--text-secondary)]">{value}</span>;
    }
  };

  const filteredData = redemptions.filter((req: any) => {
    const categoryMatch = categoryFilter === "All" || req.category === categoryFilter;
    const statusMatch = statusFilter === "All" || req.status === statusFilter;
    return categoryMatch && statusMatch;
  });

  const additionalFilters = (
    <div className="flex items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="ghost" className="h-10 px-4 text-[11px] font-bold">
            ADD FILTER
          </Button>
        </DropdownTrigger>
        <DropdownMenu onAction={(key) => toggleFilter(key as string)}>
          <DropdownItem key="category">CATEGORY</DropdownItem>
          <DropdownItem key="status">STATUS</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );

  return (
    <div className="space-y-8 text-start relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Syncing Redemptions..." />
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase text-[var(--text-primary)]">Redemption Hub</h1>
          <p className="text-sm text-[var(--text-muted)]">Authorize reward payouts</p>
        </div>
        <ResuableButton onClick={onSummaryOpen} startContent={<BarChart3 size={16} />}>Payout Summary</ResuableButton>
      </div>

      <ReusableTable
        data={filteredData}
        columns={redemptionColumns}
        renderCell={renderRedemptionCell}
        additionalFilters={additionalFilters}
      />

      <ResuableDrawer isOpen={isSummaryOpen} onClose={onSummaryClose} title="Payout Summary">
        <div className="p-5 space-y-4">
           {/* Summary Stats would go here */}
           <ResuableButton onClick={exportToCSV} className="w-full h-11" startContent={<FileDown size={16}/>}>Export Report</ResuableButton>
        </div>
      </ResuableDrawer>

      <ResuableDrawer isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Request Details">
        {selectedRequest && (
          <div className="p-5 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-sm border border-[var(--border-color)]">
                <div>
                  <h3 className="font-black text-lg text-[var(--text-primary)]">{selectedRequest.userName}</h3>
                  <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{selectedRequest.userType}</p>
                </div>
                <div className="text-xl font-black text-hf-green">{selectedRequest.pointsDeducted} PTS</div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Reward Requested</span>
                <p className="font-bold text-[var(--text-secondary)]">{selectedRequest.rewardName}</p>
              </div>
            </div>

            {selectedRequest.status === "Pending" && (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <ResuableButton onClick={() => { approveRedemption(selectedRequest.id); setIsDetailOpen(false); toast.success("Request approved"); }} className="!bg-emerald-500 hover:!bg-emerald-600 text-white font-black" startContent={<Check size={16}/>}>APPROVE</ResuableButton>
                <ResuableButton onClick={() => { rejectRedemption(selectedRequest.id); setIsDetailOpen(false); toast.error("Request rejected"); }} className="!bg-red-500 hover:!bg-red-600 text-white font-black" startContent={<X size={16}/>}>REJECT</ResuableButton>
              </div>
            )}
          </div>
        )}
      </ResuableDrawer>
    </div>
  );
};

export default RedemptionsView;
