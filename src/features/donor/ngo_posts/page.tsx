import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { onInit, onDestroy } from "./controller/ngo_posts_controller";
import { ngoPostsInputModel } from "./store/ngo_posts_store";
import { getNeedsApiOutputModel } from "./api/get_needs/get_needs_store";
import { useAuthStore } from "../../../global/store/auth-store";
import {
  NgoPostsHeader,
  NgoPostsControls,
  NgoPostsGrid,
  NgoPostsTable,
  NgoPostsModals,
} from "./components/ngo_posts_component";

const EMPTY_ARRAY: any[] = [];

export default function NgoPostsPage() {
  // onInit / onDestroy lifecycle hooks
  useEffect(() => {
    onInit();
    return () => {
      onDestroy();
    };
  }, []);

  const [subTab, setSubTab] = useState<"all" | "mine">("all");

  const viewMode = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.viewMode
  );
  const searchQuery = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.searchQuery
  );
  const categoryFilter = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.categoryFilter
  );
  const isFulfillModalOpen = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.isFulfillModalOpen
  );
  const isFulfilling = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.isFulfilling
  );

  const [wasFulfilling, setWasFulfilling] = useState(false);

  useEffect(() => {
    if (isFulfilling) {
      setWasFulfilling(true);
    }
  }, [isFulfilling]);

  useEffect(() => {
    if (wasFulfilling && !isFulfillModalOpen && !isFulfilling) {
      setSubTab("mine");
      setWasFulfilling(false);
    }
  }, [isFulfillModalOpen, isFulfilling, wasFulfilling]);

  const rawNeeds = getNeedsApiOutputModel.useSelector(
    (state) => state.getNeedsApiData?.data?.needs || EMPTY_ARRAY
  );
  const isLoading = getNeedsApiOutputModel.useSelector(
    (state) => state.getNeedsApiData?.loading
  );

  const { user } = useAuthStore();
  const currentUserId = user?.id || "";

  // Map needs to align with view requirements
  const needs = rawNeeds.map((need: any) => ({
    id: isNaN(Number(need.id)) ? need.id : Number(need.id),
    ngo: need.ngo,
    item_name: need.itemName || "",
    category: need.category || "",
    quantity: need.quantity || 0,
    unit: need.unit || "Units",
    urgency: need.urgency || "Medium Priority",
    required_by: need.requiredBy || "",
    ngo_name: need.ngoName || "Authorized NGO",
    description: need.description || "",
    status: need.status || "Open",
    fulfilled_quantity: need.fulfilledQuantity || 0,
    supporter_ids: need.supporterIds || [],
    created_at: need.createdAt || "",
    image: need.image || "",
    distribution_address: need.distributionAddress || "",
    supporters_details: need.supportersDetails || [],
    supporters: need.supporters || [],
  }));

  const filteredNeeds = needs.filter((need: any) => {
    const matchesSearch =
      need.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.ngo_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const normalizedUrgency = String(need.urgency || "").toUpperCase();
    const matchesCategory =
      categoryFilter === "ALL" ||
      (categoryFilter === "HIGH" && (normalizedUrgency === "HIGH" || normalizedUrgency === "URGENT")) ||
      (categoryFilter === "MEDIUM" && (normalizedUrgency === "MEDIUM" || normalizedUrgency.includes("MEDIUM"))) ||
      (categoryFilter === "LOW" && (normalizedUrgency === "LOW" || normalizedUrgency.includes("LOW")));

    if (subTab === "all") {
      const isOpen =
        need.status === "Open" || need.status === "Fulfilling" || need.status === "Fulfilled" || !need.status;
      const isSupported =
        need.supporter_ids.includes(currentUserId) ||
        need.supporter_ids.includes(String(currentUserId));
      return matchesSearch && matchesCategory && isOpen && !isSupported;
    } else {
      const isSupported =
        need.supporter_ids.includes(currentUserId) ||
        need.supporter_ids.includes(String(currentUserId));
      return matchesSearch && matchesCategory && isSupported;
    }
  });

  return (
    <div className="w-full min-h-full flex flex-col space-y-6 max-w-[1600px] mx-auto p-6 md:p-10 bg-transparent pb-32">
      <NgoPostsHeader />
      <NgoPostsControls />

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-3 mt-6 mb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border bg-[var(--bg-secondary)] border-[var(--border-color)] shadow-sm w-fit">
          <button
            onClick={() => setSubTab("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
              subTab === "all"
                ? "bg-white dark:bg-slate-800 text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span>🌐</span>
            All Requests ({needs.filter((n: any) => {
              const isOpen = n.status === "Open" || n.status === "Fulfilling" || n.status === "Fulfilled" || !n.status;
              const isSupported = n.supporter_ids.includes(currentUserId) || n.supporter_ids.includes(String(currentUserId));
              return isOpen && !isSupported;
            }).length})
          </button>
          <button
            onClick={() => setSubTab("mine")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
              subTab === "mine"
                ? "bg-[#22c55e] text-white shadow-sm shadow-emerald-500/20"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span>✅</span>
            My Records ({needs.filter((n: any) => n.supporter_ids.includes(currentUserId) || n.supporter_ids.includes(String(currentUserId))).length})
          </button>
        </div>
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          {subTab === "all"
            ? "Showing all active food requirements from local NGOs"
            : "Showing food requirements you have supported"}
        </span>
      </div>

      <div className="w-full space-y-8">
        {isLoading ? (
          viewMode === "table" ? (
            <div className="w-full h-64 flex items-center justify-center bg-white border border-slate-200 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading needs...</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-full border border-slate-100 rounded-[2.5rem] p-4 bg-white animate-pulse">
                  <div className="aspect-[16/10] rounded-[2rem] bg-slate-200 mb-4" />
                  <div className="px-1 space-y-4 mb-4 text-start">
                    <div className="h-6 w-2/3 bg-slate-200 rounded-lg" />
                    <div className="h-3.5 w-1/3 bg-slate-100 rounded-full" />
                    <div className="space-y-3 pt-2">
                      <div className="h-10 w-full bg-slate-100 rounded-2xl" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex gap-2.5">
                    <div className="h-10 flex-1 bg-slate-200 rounded-2xl" />
                    <div className="h-10 w-12 bg-slate-200 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          )
        ) : filteredNeeds.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center p-16 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2.5rem] text-center shadow-sm py-24">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
              <Heart size={28} className="stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
              No Active Requests Found
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium max-w-md mt-2 leading-relaxed">
              We couldn't find any urgent food requirements matching your current filters. Try searching for something else or adjusting your priority settings.
            </p>
          </div>
        ) : viewMode === "table" ? (
          <NgoPostsTable filteredNeeds={filteredNeeds} />
        ) : (
          <NgoPostsGrid filteredNeeds={filteredNeeds} />
        )}
      </div>

      <NgoPostsModals />
    </div>
  );
}
