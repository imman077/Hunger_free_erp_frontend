import { useEffect } from "react";
import { Heart } from "lucide-react";
import { onInit, onDestroy } from "./controller/ngo_posts_controller";
import { ngoPostsInputModel } from "./store/ngo_posts_store";
import { getNeedsApiOutputModel } from "./api/get_needs/get_needs_store";
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

  const viewMode = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.viewMode
  );
  const searchQuery = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.searchQuery
  );
  const categoryFilter = ngoPostsInputModel.useSelector(
    (state) => state.ngoPostsData.categoryFilter
  );

  const rawNeeds = getNeedsApiOutputModel.useSelector(
    (state) => state.getNeedsApiData?.data?.needs || EMPTY_ARRAY
  );
  const isLoading = getNeedsApiOutputModel.useSelector(
    (state) => state.getNeedsApiData?.loading
  );

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
    const isOpen =
      need.status === "Open" || need.status === "Fulfilling" || !need.status;

    return matchesSearch && matchesCategory && isOpen;
  });

  return (
    <div className="w-full min-h-full flex flex-col space-y-6 max-w-[1600px] mx-auto p-6 md:p-10 bg-transparent pb-32">
      <NgoPostsHeader />
      <NgoPostsControls />

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
          <div className="w-full flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-sm max-w-lg mx-auto py-16">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
              <Heart size={28} className="stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              No Active Requests Found
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm mt-2 leading-relaxed">
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
