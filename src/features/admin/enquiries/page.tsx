import { useEffect } from "react";
import { Bell, Zap, Info } from "lucide-react";
import { Spinner } from "@heroui/react";
import { useEnquiries } from "./controller/enquiries_controller";
import { ActionQueue } from "./components/enquiries_components";

const EnquiriesHub = () => {
  const { fetchEnquiries, isLoading } = useEnquiries();

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  return (
    <div className="w-full space-y-8 p-4 md:p-8 relative animate-in fade-in duration-700">
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Syncing with SQL..." />
        </div>
      )}
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hf-green/10 flex items-center justify-center text-hf-green border border-hf-green/20">
            <Bell size={20} />
          </div>
          <h1
            className="text-4xl font-black uppercase tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Action Dashboard
          </h1>
        </div>
        <p
          className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 pl-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Review and approve pending requests
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="text-hf-green" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-hf-green">
            Active Tasks
          </span>
        </div>
        <ActionQueue />
      </div>

      {/* Info Footer */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl bg-slate-500/5 border border-dashed text-[10px] font-bold uppercase tracking-widest opacity-60"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Info size={14} className="text-hf-green" />
        <span>Tap a card to view more details and take action.</span>
      </div>
    </div>
  );
};

export default EnquiriesHub;
