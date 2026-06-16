import type { ColumnDef } from "../../../../global/components/resuable-components/table";

export const DONATION_COLUMNS: ColumnDef[] = [
  { uid: "id", name: "#", sortable: true },
  { uid: "donor", name: "Donor", sortable: true, align: "start" },
  { uid: "foodType", name: "Food Type", sortable: true },
  { uid: "quantity", name: "Qty", sortable: true },
  { uid: "pickupTime", name: "Pickup Time", sortable: true },
  { uid: "status", name: "Status", sortable: false, align: "center" },
  { uid: "actions", name: "Actions", sortable: false, align: "center" },
];

export const FOOD_TYPE_OPTIONS = [
  "Prepared Meals",
  "Raw Ingredients",
  "Baked Goods",
  "Produce",
];

export const STATUS_OPTIONS = [
  "Pending",
  "Assigned",
  "In Progress",
  "Completed",
];
