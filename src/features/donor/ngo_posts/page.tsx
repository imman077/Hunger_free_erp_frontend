import { useEffect } from "react";
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
    (state) => state.getNeedsApiData?.needs || []
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

    const matchesCategory =
      categoryFilter === "ALL" || need.category === categoryFilter;
    const isOpen =
      need.status === "Open" || need.status === "Fulfilling" || !need.status;

    return matchesSearch && matchesCategory && isOpen;
  });

  return (
    <div className="w-full min-h-full flex flex-col space-y-6 max-w-[1600px] mx-auto p-6 md:p-10 bg-transparent pb-32">
      <div
        className="rounded-xl border shadow-sm relative overflow-hidden shrink-0"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-emerald-500 opacity-[0.03] blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full" />
        </div>

        <NgoPostsHeader />
        <NgoPostsControls />
      </div>

      <div className="w-full space-y-8">
        {viewMode === "table" ? (
          <NgoPostsTable filteredNeeds={filteredNeeds} />
        ) : (
          <NgoPostsGrid filteredNeeds={filteredNeeds} />
        )}
      </div>

      <NgoPostsModals />
    </div>
  );
}
