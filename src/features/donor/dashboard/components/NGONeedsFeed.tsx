import { useEffect, useState } from "react";
import { Package, ArrowRight, Heart, Users, ShieldCheck, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_NEEDS } from "../api/needs/needs_api";
import { toast } from "sonner";
import { motion } from "framer-motion";

import type { NGONeed } from "../api/needs/needs_output_model";
import { getCategoryImage } from "../../../../global/constants/donation_config";


const NGONeedsFeed = () => {
  const [needs, setNeeds] = useState<NGONeed[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { data: graphqlData, loading: graphqlLoading, error: graphqlError } = useQuery(GET_NEEDS, {
    variables: { status: "Open" },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (graphqlLoading) {
      setLoading(true);
      return;
    }

    if (graphqlError) {
      toast.error("Failed to load community needs");
      setLoading(false);
      return;
    }

    if (graphqlData?.needs) {
      const mappedNeeds = graphqlData.needs.map((need: any) => {
        let urgencyVal = "Medium";
        if (need.urgency) {
          if (need.urgency.toLowerCase().includes("high")) {
            urgencyVal = "High";
          } else if (need.urgency.toLowerCase().includes("medium")) {
            urgencyVal = "Medium";
          } else if (need.urgency.toLowerCase().includes("low")) {
            urgencyVal = "Low";
          } else if (need.urgency.toLowerCase().includes("urgent")) {
            urgencyVal = "High";
          }
        }

        const quantityRequired = `${need.quantity || 0} ${need.unit || "Units"}`;

        return {
          id: need.id,
          ngo: need.ngo,
          ngo_name: need.ngoName || "Authorized NGO",
          title: need.itemName || "",
          description: need.description || "",
          category: need.category || "",
          quantity_required: quantityRequired,
          urgency: urgencyVal,
          status: need.status || "Open",
          created_at: need.createdAt || new Date().toISOString(),
          beneficiaries: "120 People",
          location: need.distributionAddress || "Service Zone",
          pickup_by: need.requiredBy ? new Date(need.requiredBy).toLocaleDateString() : "Flexible"
        };
      });

      if (mappedNeeds.length === 0) {
        setNeeds([
          {
            id: 1,
            ngo: 101,
            ngo_name: "Green Harvest NGO",
            title: "Fresh Vegetables & Fruits for Shelter",
            description: "Seeking donations of seasonal vegetables and fruits.",
            category: "Perishables",
            quantity_required: "50 KG",
            urgency: "High",
            status: "Active",
            created_at: new Date().toISOString(),
            beneficiaries: "120 People",
            location: "Koramangala, Bengaluru",
            pickup_by: "Today, 6:00 PM"
          } as any,
          {
            id: 2,
            ngo: 102,
            ngo_name: "Hope Shelter",
            title: "Cooked Meals for Night Shift Workers",
            description: "Looking for cooked meal portions.",
            category: "Cooked Food",
            quantity_required: "100 PORTIONS",
            urgency: "Medium",
            status: "Active",
            created_at: new Date().toISOString(),
            beneficiaries: "80 People",
            location: "Jayanagar, Bengaluru",
            pickup_by: "Tomorrow, 10:00 AM"
          } as any
        ]);
      } else {
        setNeeds(mappedNeeds);
      }
      setLoading(false);
    }
  }, [graphqlData, graphqlLoading, graphqlError]);

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "High":
        return {
          bg: "bg-[#fff1f2]",
          text: "text-[#e11d48]",
          border: "border-[#fecdd3]",
          dot: "bg-[#e11d48]",  
          iconBg: "bg-[#fff1f2]",
          iconColor: "#e11d48"
        };
      case "Medium":
        return {
          bg: "bg-[#fff7ed]",
          text: "text-[#ea580c]",
          border: "border-[#ffedd5]",
          dot: "bg-[#ea580c]",
          iconBg: "bg-[#fff7ed]",
          iconColor: "#ea580c"
        };
      default:
        return {
          bg: "bg-[#f0f9ff]",
          text: "text-[#0284c7]",
          border: "border-[#e0f2fe]",
          dot: "bg-[#0284c7]",
          iconBg: "bg-[#f0f9ff]",
          iconColor: "#0284c7"
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-md bg-slate-200/50 dark:bg-slate-800/50 border border-transparent"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <Heart size={16} className="text-red-500 fill-red-500/10" />
          </div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800">
            Urgent NGO Requests
          </h2>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {needs.length} Active Needs
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {needs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
            <div className="relative w-48 h-40 mb-6">
              <img 
                src="/empty_food.png" 
                alt="No active requests" 
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>
            
            <div className="text-center space-y-2 mb-10">
              <h3 className="text-xl font-black text-slate-800">
                No active urgent requests
              </h3>
              <p className="text-[11px] font-medium text-slate-400 max-w-[280px] leading-relaxed mx-auto">
                Great news! There are no urgent requests right now. Check back later to help more communities.
              </p>
            </div>

            <button 
              onClick={() => navigate('/donor/donations/needs')}
              className="group relative px-8 py-3.5 bg-[#16a34a] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#15803d] transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl shadow-green-500/10 overflow-hidden"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <img src="/giving.png" className="w-4 h-4 object-contain invert brightness-0" alt="Icon" />
              </div>
              <span className="relative z-10">View all requests</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {needs.map((need: any) => {
              const styles = getUrgencyStyles(need.urgency);
              
              return (
                <motion.div
                  key={need.id}
                  whileHover={{ y: -1 }}
                  className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/40 cursor-pointer"
                >
                  <div className="flex items-stretch min-h-[140px]">
                    <div className="flex-1 flex p-3.5 gap-5">
                      {/* Left Column: Category & Priority - Compact */}
                      <div className="flex flex-col items-center gap-2.5 shrink-0 w-24 pr-4 justify-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${styles.bg} ${styles.text} border ${styles.border}`}>
                          <div className={`w-0.5 h-0.5 rounded-full ${styles.dot}`} />
                          {need.urgency}
                        </div>
                        
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${styles.iconBg} overflow-hidden border border-slate-50 shadow-sm transition-all duration-300 group-hover:scale-110`}>
                          <img 
                            src={getCategoryImage(need.category)} 
                            alt={need.category}
                            className="w-11 h-11 object-contain"
                          />
                        </div>

                        <div className="text-center">
                          <p className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest mb-0.5">CATEGORY</p>
                          <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-tight leading-none">{need.category}</h4>
                        </div>
                      </div>

                      {/* Middle Column: Details */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="mb-2.5">
                          <h3 className="text-[15px] font-black text-slate-800 tracking-tight leading-tight mb-1 group-hover:text-green-600 transition-colors truncate">
                            {need.title}
                          </h3>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center">
                                <Users size={10} className="text-slate-400" />
                              </div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{need.ngo_name}</span>
                            </div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                              <ShieldCheck size={9} className="fill-green-600/10" />
                              <span className="text-[7.5px] font-black uppercase tracking-widest">Verified</span>
                            </div>
                          </div>
                        </div>

                        {/* Goal & Impact Card - Unified with Urgency Color */}
                        <div className={`flex items-center rounded-lg p-2 mb-2.5 ${styles.bg}`}>
                          <div className="flex-1 flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border bg-white ${styles.border}`}>
                              <Package size={16} className={styles.text.replace('text-', 'text-')} />
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Goal</p>
                              <p className={`text-[10px] font-black leading-none ${styles.text}`}>{need.quantity_required}</p>
                            </div>
                          </div>
                          <div className="w-px h-6 bg-slate-200/50 mx-3" />
                          <div className="flex-1 flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border bg-white ${styles.border}`}>
                              <Users size={16} className={styles.text.replace('text-', 'text-')} />
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Impact</p>
                              <p className={`text-[10px] font-black leading-none ${styles.text}`}>{need.beneficiaries || "120 People"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Location & Time Footer - Compact */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <MapPin size={12} className="stroke-[2.5]" />
                            <span className="text-[9px] font-black uppercase tracking-tight">{need.location || "Koramangala, Bengaluru"}</span>
                          </div>
                          <div className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-400 stroke-[2.5]" />
                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-400">
                              Pickup: <span className={styles.text}>{need.pickup_by || "Today, 6:00 PM"}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Actions - Scaled Down */}
                      <div className="flex flex-col justify-center gap-2 shrink-0 w-28 pl-4">
                        <button
                          onClick={() => navigate(`/donor/donations/create?need_id=${need.id}&ngo_id=${need.ngo}`)}
                          className="w-full h-8.5 bg-[#22c55e] hover:bg-[#1eb054] text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 group/btn"
                        >
                          Respond
                          <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-1" />
                        </button>
                        <button className="w-full h-8.5 bg-white hover:bg-slate-50 text-[#22c55e] border border-[#22c55e]/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGONeedsFeed;
