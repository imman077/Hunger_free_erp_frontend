import type { ColumnDef } from "../../../../global/components/resuable-components/table";

export const NGO_ENQUIRY_COLUMNS: ColumnDef[] = [
  { uid: "id", name: "ID", sortable: true },
  { uid: "name", name: "NGO NAME", sortable: true },
  { uid: "type", name: "TYPE" },
  { uid: "city", name: "LOCATION" },
  { uid: "priority", name: "PRIORITY" },
  { uid: "time", name: "APPLIED" },
  { uid: "actions", name: "ACTION" },
];

export const VOLUNTEER_ENQUIRY_COLUMNS: ColumnDef[] = [
  { uid: "id", name: "ID", sortable: true },
  { uid: "name", name: "VOLUNTEER NAME", sortable: true },
  { uid: "type", name: "ENQUIRY TYPE" },
  { uid: "idType", name: "DOC TYPE" },
  { uid: "city", name: "LOCATION" },
  { uid: "priority", name: "PRIORITY" },
  { uid: "time", name: "APPLIED" },
  { uid: "actions", name: "ACTION" },
];

export const DONOR_ENQUIRY_COLUMNS: ColumnDef[] = [
  { uid: "id", name: "ID", sortable: true },
  { uid: "name", name: "DONOR NAME", sortable: true },
  { uid: "type", name: "TYPE" },
  { uid: "city", name: "LOCATION" },
  { uid: "priority", name: "PRIORITY" },
  { uid: "time", name: "APPLIED" },
  { uid: "actions", name: "ACTION" },
];

export const REWARD_ENQUIRY_COLUMNS: ColumnDef[] = [
  { name: "REQ ID", uid: "id", sortable: true },
  { name: "REWARD ITEM", uid: "name", sortable: true },
  { name: "USER", uid: "user" },
  { name: "POINTS", uid: "points" },
  { name: "PRIORITY", uid: "priority" },
  { name: "TIME", uid: "time" },
  { name: "ACTION", uid: "actions" },
];
