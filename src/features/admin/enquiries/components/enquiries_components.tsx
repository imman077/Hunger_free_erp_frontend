import React from "react";
import {
  Building2,
  ShieldCheck,
  Gift,
  Clock,
  ClipboardCheck,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEnquiries } from "../controller/enquiries_controller";

export const ActionQueue: React.FC = () => {
  const navigate = useNavigate();
  const { registrations, rewards } = useEnquiries();

  const getIcon = (type: string) => {
    if (type.includes("NGO"))
      return <Building2 className="text-emerald-500" size={18} />;
    if (type.includes("Volunteer"))
      return <ShieldCheck className="text-blue-500" size={18} />;
    if (type.includes("Reward") || type === "Reward Claim")
      return <Gift className="text-purple-500" size={18} />;
    return <Building2 className="text-slate-500" size={18} />;
  };

  const pendingApprovals = [
    ...registrations.map((r) => ({ ...r, icon: getIcon(r.type) })),
    ...rewards.map((r) => ({
      id: r.id,
      name: r.user,
      type: "Reward Claim",
      status: "Review claim",
      time: r.time,
      priority: r.priority,
      icon: getIcon("Reward Claim"),
      link: "/admin/enquiries/rewards",
    })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pendingApprovals.map((item) => (
        <div
          key={item.id}
          onClick={() => item.link && navigate(item.link as string)}
          className="relative p-4 rounded-sm border cursor-pointer flex flex-col justify-between h-full bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="relative space-y-3">
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center border bg-slate-50"
                style={{ borderColor: "var(--border-color)" }}
              >
                {item.icon}
              </div>
              <span
                className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                  item.priority === "high"
                    ? "bg-red-50 border-red-100 text-red-500"
                    : item.priority === "medium"
                      ? "bg-amber-50 border-amber-100 text-amber-500"
                      : "bg-hf-green/5 border-hf-green/10 text-hf-green"
                }`}
              >
                {item.priority}
              </span>
            </div>

            <div>
              <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">
                {item.name}
              </h4>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {item.type}
              </p>
            </div>

            {/* Main Action Button Style */}
            <div className="flex items-center justify-center gap-2 p-2 rounded-sm bg-[#22c55e] transition-colors hover:bg-[#1eb054]">
              <ClipboardCheck size={14} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {item.status || "Check details"}
              </span>
            </div>
          </div>

          <div
            className="relative mt-4 pt-3 border-t border-dashed flex items-center justify-between"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {item.time}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-hf-green">
              Details
              <Zap size={10} fill="currentColor" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
