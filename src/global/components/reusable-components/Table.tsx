import { Calendar as CalendarIcon } from "lucide-react";
import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import type { SortDescriptor, Selection } from "@heroui/react";
import HeroDateRangePicker from "./HeroDateRangePicker";
import {
  Eye,
  Mail,
  CheckCircle,
  Ban,
  Trash2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  MapPin,
  Heart,
  Utensils,
  MoreVertical,
  ChevronsUpDown,
} from "lucide-react";

// --- Types ---
export interface ColumnDef {
  uid: string;
  name: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
}

export interface ActionConfig<T = any> {
  showView?: boolean;
  showMessage?: boolean;
  showApprove?: boolean;
  showDeactivate?: boolean;
  showDelete?: boolean;
  onView?: (item: T) => void;
  onMessage?: (item: T) => void;
  onApprove?: (item: T) => void;
  onDeactivate?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export interface TableChipProps {
  text: string;
  icon?: React.ReactNode;
  initials?: string;
  onClick?: (e?: React.MouseEvent) => void;
  maxWidth?: string;
  className?: string;
  iconClassName?: string;
}

export const TableChip: React.FC<TableChipProps> = ({
  text,
  icon,
  initials,
  onClick,
  maxWidth = "max-w-[150px]",
  className = "",
  iconClassName = "bg-hf-green",
}) => {
  return (
    <div
      className={`flex items-center gap-2.5 px-2 py-1 rounded-full border transition-all ${
        onClick ? "cursor-pointer" : ""
      } group w-fit min-w-0 ${className}`}
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
      onClick={(e) => onClick?.(e)}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0 overflow-hidden ${iconClassName}`}
      >
        {icon || initials}
      </div>
      <span
        className={`font-bold text-xs whitespace-nowrap truncate ${maxWidth} pr-1 group-hover:text-hf-green transition-colors`}
        style={{ color: "var(--text-primary)" }}
      >
        {text}
      </span>
    </div>
  );
};

// --- Reusable Helper Cell Components ---

export interface TableStatusBadgeProps {
  status: string;
  className?: string;
}

export const TableStatusBadge: React.FC<TableStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const norm = status?.toLowerCase() || "";
  let config = {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    label: status || "Approved",
  };

  if (
    norm.includes("pending") ||
    norm.includes("draft") ||
    norm.includes("waiting")
  ) {
    config = {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200/60 dark:border-amber-800/60",
      dot: "bg-amber-500",
      label: status,
    };
  } else if (
    norm.includes("approved") ||
    norm.includes("delivered") ||
    norm.includes("active")
  ) {
    config = {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200/60 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      label: status,
    };
  } else if (
    norm.includes("completed") ||
    norm.includes("in progress") ||
    norm.includes("assigned") ||
    norm.includes("picked")
  ) {
    config = {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-200/60 dark:border-indigo-800/60",
      dot: "bg-indigo-500",
      label: status,
    };
  } else if (
    norm.includes("rejected") ||
    norm.includes("cancelled") ||
    norm.includes("failed") ||
    norm.includes("deactivated")
  ) {
    config = {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-200/60 dark:border-rose-800/60",
      dot: "bg-rose-500",
      label: status,
    };
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="capitalize">{config.label}</span>
    </div>
  );
};

export interface TableUserAvatarProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
}

export const TableUserAvatar: React.FC<TableUserAvatarProps> = ({
  name,
  email,
  avatarUrl,
  initials,
}) => {
  const computedInitials =
    initials ||
    (name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "U");
  return (
    <div className="flex items-center gap-3 text-start">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200/50">
          {computedInitials}
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
          {name}
        </span>
        {email && (
          <span className="text-[11px] text-slate-400 font-medium truncate">
            {email}
          </span>
        )}
      </div>
    </div>
  );
};

export interface TableItemBoxProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const TableItemBox: React.FC<TableItemBoxProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <div className="flex items-center gap-2.5 text-start">
      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100/80 dark:border-emerald-900/50">
        {icon || <Utensils size={16} />}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
          {title}
        </span>
        {subtitle && (
          <span className="text-[11px] text-slate-400 font-medium truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export interface TableLocationBadgeProps {
  location: string;
  distance?: string;
}

export const TableLocationBadge: React.FC<TableLocationBadgeProps> = ({
  location,
  distance,
}) => {
  return (
    <div className="flex items-center gap-2 text-start">
      <MapPin size={15} className="text-emerald-500 shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
          {location}
        </span>
        {distance && (
          <span className="text-[11px] text-slate-400 font-medium truncate">
            {distance}
          </span>
        )}
      </div>
    </div>
  );
};

export interface TableDateBadgeProps {
  date: string;
  time?: string;
}

export const TableDateBadge: React.FC<TableDateBadgeProps> = ({
  date,
  time,
}) => {
  return (
    <div className="flex flex-col text-start min-w-0">
      <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
        {date}
      </span>
      {time && (
        <span className="text-[11px] text-slate-400 font-medium truncate">
          {time}
        </span>
      )}
    </div>
  );
};

export interface TableQuantityBadgeProps {
  quantity: string | number;
  unit?: string;
}

export const TableQuantityBadge: React.FC<TableQuantityBadgeProps> = ({
  quantity,
  unit,
}) => {
  return (
    <div className="flex flex-col text-start min-w-0">
      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
        {quantity}
      </span>
      {unit && (
        <span className="text-[11px] text-slate-400 font-medium capitalize">
          {unit}
        </span>
      )}
    </div>
  );
};

// --- Table Main Props ---
interface ERPGridTableProps {
  data: any[];
  columns: ColumnDef[];
  renderCell: (item: any, columnKey: React.Key) => React.ReactNode;
  initialVisibleColumns?: string[];
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableFilters?: boolean;
  enableDateFilter?: boolean;
  showColumnSettings?: boolean;
  onDateRangeChange?: (
    range: { start: string | null; end: string | null } | null,
  ) => void;
  title?: string;
  description?: string;
  titleIcon?: React.ReactNode;
  entityName?: string;
  actionConfig?: ActionConfig;
  topContent?: React.ReactNode;
  variant?: "default" | "compact";
  enableSorting?: boolean;
  additionalFilters?: React.ReactNode;
  onRowClick?: (item: any) => void;
  renderCard?: (item: any) => React.ReactNode;
  defaultViewMode?: "table" | "cards";
  sortOptions?: { key: string; label: string }[];
  onSortChange?: (sortKey: string) => void;
  enableViewToggle?: boolean;
}

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

// --- Default Smart Card Renderer ---
const DefaultCardItem: React.FC<{
  item: any;
  columns: ColumnDef[];
  renderCell: (item: any, columnKey: React.Key) => React.ReactNode;
  actionConfig?: ActionConfig;
  onRowClick?: (item: any) => void;
}> = ({ item, columns, renderCell, actionConfig, onRowClick }) => {
  const userCol = columns.find((c) =>
    ["donor", "user", "name", "username", "customer"].includes(
      c.uid.toLowerCase(),
    ),
  );
  const itemCol = columns.find((c) =>
    ["items", "items donated", "itemname", "foodtype", "title", "category"].includes(
      c.uid.toLowerCase(),
    ),
  );
  const dateCol = columns.find((c) =>
    ["date", "createdat", "time"].includes(c.uid.toLowerCase()),
  );
  const statusCol = columns.find((c) =>
    ["status"].includes(c.uid.toLowerCase()),
  );
  const qtyCol = columns.find((c) =>
    ["quantity", "count", "amount"].includes(c.uid.toLowerCase()),
  );
  const locCol = columns.find((c) =>
    ["location", "address", "pickupaddress"].includes(c.uid.toLowerCase()),
  );

  return (
    <div
      onClick={onRowClick ? () => onRowClick(item) : undefined}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 ${
        onRowClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Top Row: User & Actions */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        {userCol ? (
          renderCell(item, userCol.uid)
        ) : (
          <TableUserAvatar
            name={item.donor || item.name || item.username || "User"}
            email={item.email}
          />
        )}
        {actionConfig && (
          <div className="flex items-center gap-1">
            {actionConfig.showView !== false && actionConfig.onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actionConfig.onView?.(item);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Eye size={16} />
              </button>
            )}
            {actionConfig.showDelete && actionConfig.onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actionConfig.onDelete?.(item);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-2.5 my-1">
        {itemCol ? (
          renderCell(item, itemCol.uid)
        ) : (
          <TableItemBox
            title={
              item.foodType ||
              item.itemName ||
              item.title ||
              "Donation Item"
            }
            subtitle={item.category || item.description}
          />
        )}

        <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-medium pt-1">
          {(dateCol || item.date) && (
            <div className="flex items-center gap-2">
              <CalendarIcon size={14} className="text-emerald-500 shrink-0" />
              <span>
                {item.date || (dateCol ? renderCell(item, dateCol.uid) : "")}
              </span>
            </div>
          )}
          {(locCol || item.pickupAddress || item.location) && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-emerald-500 shrink-0" />
              <span className="truncate">
                {item.pickupAddress ||
                  item.location ||
                  (locCol ? renderCell(item, locCol.uid) : "")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Status & Quantity */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          {statusCol ? (
            renderCell(item, statusCol.uid)
          ) : (
            <TableStatusBadge status={item.status || "Pending"} />
          )}
        </div>
        <div className="text-end font-extrabold text-xs text-slate-800 dark:text-slate-100">
          {qtyCol ? (
            renderCell(item, qtyCol.uid)
          ) : (
            <span>{item.quantity || ""}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main ReusableTable Component ---
const ReusableTable: React.FC<ERPGridTableProps> = ({
  data,
  columns,
  renderCell,
  initialVisibleColumns,
  enableSearch = true,
  enablePagination = true,
  enableFilters = true,
  enableDateFilter = false,
  showColumnSettings = true,
  onDateRangeChange,
  title,
  description,
  titleIcon,
  entityName = "donations",
  actionConfig,
  topContent: customTopContent,
  variant = "compact",
  enableSorting = true,
  additionalFilters,
  onRowClick,
  renderCard,
  defaultViewMode = "table",
  sortOptions,
  onSortChange,
  enableViewToggle = true,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"table" | "cards">(defaultViewMode);
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    initialVisibleColumns
      ? new Set(initialVisibleColumns)
      : new Set(columns.map((c) => c.uid)),
  );

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: columns[0]?.uid || "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (enableSearch && hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filterValue.toLowerCase()),
        ),
      );
    }

    if (
      enableFilters &&
      selectedStatus !== "all" &&
      data.length > 0 &&
      data[0].status
    ) {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus,
      );
    }

    return filteredData;
  }, [
    data,
    filterValue,
    selectedStatus,
    enableSearch,
    enableFilters,
    hasSearchFilter,
  ]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    if (!enablePagination) return filteredItems;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage, enablePagination]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as string];
      const second = b[sortDescriptor.column as string];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const statusOptions = useMemo(() => {
    if (data.length === 0) return ["all"];
    const statusSet = new Set(
      data.map((item) => item.status).filter(Boolean),
    );
    return ["all", ...Array.from(statusSet)];
  }, [data]);

  // Default Action Buttons Renderer
  const renderDefaultActions = useCallback(
    (item: any) => {
      if (!actionConfig) return null;

      const {
        showView = true,
        showMessage,
        showApprove,
        showDeactivate,
        showDelete,
        onView,
        onMessage,
        onApprove,
        onDeactivate,
        onDelete,
      } = actionConfig;

      return (
        <div className="flex items-center justify-center gap-1.5">
          {showView && onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(item);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-sm"
              title="View details"
            >
              <Eye size={15} />
            </button>
          )}
          {showMessage && onMessage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMessage?.(item);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
              title="Send message"
            >
              <Mail size={15} />
            </button>
          )}
          {showApprove && onApprove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove?.(item);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
              title="Approve"
            >
              <CheckCircle size={15} />
            </button>
          )}
          {showDeactivate && onDeactivate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate?.(item);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-amber-600 hover:bg-amber-50 transition-all shadow-sm"
              title="Deactivate"
            >
              <Ban size={15} />
            </button>
          )}
          {showDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onView) onView(item);
            }}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 transition-all shadow-sm"
            title="More actions"
          >
            <MoreVertical size={15} />
          </button>
        </div>
      );
    },
    [actionConfig],
  );

  // Top Header Content
  const topHeader = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-t-2xl">
        {/* Title & Controls Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              {titleIcon || <Heart size={20} className="fill-emerald-500/20" />}
            </div>
            <div className="flex flex-col text-start">
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title || "Recent Contributions"}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {description || "Track and manage all recent food donations"}
              </p>
            </div>
          </div>

          {/* Action & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 justify-start lg:justify-end">
            {/* Search Box */}
            {enableSearch && (
              <div className="relative w-full sm:w-56 md:w-64">
                <Input
                  isClearable
                  placeholder={`Search ${entityName}...`}
                  startContent={
                    <Search size={15} className="text-slate-400 shrink-0" />
                  }
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
                  classNames={{
                    base: "w-full",
                    inputWrapper: [
                      "border border-slate-200 dark:border-slate-700",
                      "bg-white dark:bg-slate-800",
                      "rounded-xl",
                      "!shadow-none",
                      "h-10",
                      "transition-all duration-200",
                      "data-[hover=true]:border-emerald-500/50",
                      "group-data-[focus=true]:border-emerald-500",
                    ].join(" "),
                    input:
                      "text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 pl-1",
                  }}
                />
              </div>
            )}

            {/* Status Filter */}
            {enableFilters && statusOptions.length > 1 && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[130px] justify-between"
                    endContent={<ChevronDown size={12} className="text-slate-400 shrink-0 ml-1.5" />}
                  >
                    <div className="flex flex-col text-left justify-center leading-tight">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">STATUS</span>
                      <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 capitalize mt-0.5">
                        {selectedStatus === "all" ? "All Statuses" : selectedStatus}
                      </span>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Status filter"
                  selectionMode="single"
                  selectedKeys={[selectedStatus]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) {
                      setSelectedStatus(selected);
                      setPage(1);
                    }
                  }}
                  classNames={{
                    base: "border border-slate-200 dark:border-slate-700 rounded-xl min-w-[160px] p-1 shadow-xl bg-white dark:bg-slate-800",
                  }}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem
                      key={status}
                      className="text-xs font-bold uppercase tracking-tight py-2 rounded-lg data-[hover=true]:bg-emerald-50 data-[hover=true]:text-emerald-600"
                    >
                      {status === "all" ? "All Statuses" : status}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Sort Dropdown */}
            {enableSorting && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[130px] justify-between"
                    endContent={<ChevronDown size={12} className="text-slate-400 shrink-0 ml-1.5" />}
                  >
                    <div className="flex flex-col text-left justify-center leading-tight">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">SORT BY</span>
                      <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                        {selectedSort === "newest"
                          ? "Newest First"
                          : selectedSort === "oldest"
                          ? "Oldest First"
                          : selectedSort}
                      </span>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort options"
                  selectionMode="single"
                  selectedKeys={[selectedSort]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) {
                      setSelectedSort(selected);
                      if (onSortChange) onSortChange(selected);
                    }
                  }}
                  classNames={{
                    base: "border border-slate-200 dark:border-slate-700 rounded-xl min-w-[160px] p-1 shadow-xl bg-white dark:bg-slate-800",
                  }}
                >
                  {sortOptions && sortOptions.length > 0 ? (
                    sortOptions.map((opt) => (
                      <DropdownItem key={opt.key} className="text-xs font-bold">
                        {opt.label}
                      </DropdownItem>
                    ))
                  ) : (
                    <>
                      <DropdownItem key="newest" className="text-xs font-bold">
                        Newest First
                      </DropdownItem>
                      <DropdownItem key="oldest" className="text-xs font-bold">
                        Oldest First
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Columns Dropdown */}
            {showColumnSettings && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl h-10 px-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all"
                    endContent={<ChevronDown size={14} className="text-slate-400" />}
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                  classNames={{
                    base: "border border-slate-200 dark:border-slate-700 rounded-xl min-w-[180px] p-1 shadow-xl bg-white dark:bg-slate-800",
                  }}
                >
                  {columns.map((column) => (
                    <DropdownItem key={column.uid} className="text-xs font-bold">
                      {column.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Date Range Picker */}
            {enableFilters && enableDateFilter && (
              <div className="relative" ref={pickerRef}>
                <button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="flex items-center gap-2 px-3.5 h-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all"
                >
                  <CalendarIcon size={14} className="text-emerald-500 shrink-0" />
                  <span>
                    {!dateRange.start && !dateRange.end
                      ? "SELECT RANGE"
                      : `${dateRange.start || "..."} — ${dateRange.end || "..."}`}
                  </span>
                </button>
                {showPicker && (
                  <HeroDateRangePicker
                    initialStart={dateRange.start}
                    initialEnd={dateRange.end}
                    onRangeSelect={(start, end) => {
                      const newRange = { start, end };
                      setDateRange(newRange);
                      if (onDateRangeChange) onDateRangeChange(newRange);
                    }}
                    onClose={() => setShowPicker(false)}
                  />
                )}
              </div>
            )}

            {/* Additional Filters slot */}
            {additionalFilters}

            {/* Cards vs Table View Toggle Switch */}
            {enableViewToggle && (
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 shrink-0 ml-1">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "cards"
                      ? "bg-[#22c55e] text-white shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid size={15} />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "table"
                      ? "bg-[#22c55e] text-white shadow-sm font-extrabold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <TableIcon size={15} />
                  <span>Table</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    title,
    description,
    titleIcon,
    entityName,
    enableSearch,
    filterValue,
    onSearchChange,
    onClear,
    enableFilters,
    statusOptions,
    selectedStatus,
    enableSorting,
    selectedSort,
    onSortChange,
    showColumnSettings,
    visibleColumns,
    columns,
    enableDateFilter,
    showPicker,
    dateRange,
    onDateRangeChange,
    additionalFilters,
    enableViewToggle,
    viewMode,
  ]);

  const finalTopContent =
    customTopContent !== undefined ? customTopContent : topHeader;

  // Pagination Footer Controls
  const paginationFooter = useMemo(() => {
    if (!enablePagination) return null;

    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, filteredItems.length);
    const totalItems = filteredItems.length;

    // Helper to render pagination range (e.g. 1 2 3 ... 5)
    const renderPageNumbers = () => {
      const pageList: (number | string)[] = [];
      if (pages <= 5) {
        for (let i = 1; i <= pages; i++) pageList.push(i);
      } else {
        if (page <= 3) {
          pageList.push(1, 2, 3, "...", pages);
        } else if (page >= pages - 2) {
          pageList.push(1, "...", pages - 2, pages - 1, pages);
        } else {
          pageList.push(1, "...", page, "...", pages);
        }
      }

      return pageList.map((p, idx) => {
        if (typeof p === "string") {
          return (
            <span
              key={`dots-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400"
            >
              ...
            </span>
          );
        }
        const isActive = page === p;
        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${
              isActive
                ? "bg-[#22c55e] text-white shadow-sm scale-105"
                : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {p}
          </button>
        );
      });
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">
        {/* Left: Showing range text */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="font-extrabold text-slate-800 dark:text-slate-200">{totalItems === 0 ? 0 : startItem}</span> to{" "}
          <span className="font-extrabold text-slate-800 dark:text-slate-200">{endItem}</span> of{" "}
          <span className="font-extrabold text-slate-800 dark:text-slate-200">{totalItems}</span> {entityName}
        </div>

        {/* Center: Pagination numbers & buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPreviousPage}
            disabled={page === 1}
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1">{renderPageNumbers()}</div>

          <button
            onClick={onNextPage}
            disabled={page >= pages}
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Per page selector */}
        <div className="flex items-center gap-2">
          <select
            className="outline-none text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer hover:border-emerald-500 transition-all"
            onChange={onRowsPerPageChange}
            value={rowsPerPage}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    );
  }, [
    enablePagination,
    page,
    rowsPerPage,
    filteredItems.length,
    entityName,
    pages,
    onPreviousPage,
    onNextPage,
    onRowsPerPageChange,
  ]);

  return (
    <div className="w-full flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
      {/* Top Header Controls */}
      {finalTopContent}

      {/* Main View Area */}
      <div className="w-full">
        {viewMode === "cards" ? (
          /* --- Cards View Grid --- */
          <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-950/20">
            {sortedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  No records found
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your search query or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {sortedItems.map((item: any) =>
                  renderCard ? (
                    <React.Fragment key={item.id || item.uid || Math.random().toString()}>
                      {renderCard(item)}
                    </React.Fragment>
                  ) : (
                    <DefaultCardItem
                      key={item.id || item.uid || Math.random().toString()}
                      item={item}
                      columns={headerColumns}
                      renderCell={renderCell}
                      actionConfig={actionConfig}
                      onRowClick={onRowClick}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        ) : (
          /* --- Table View --- */
          <div className="w-full overflow-x-auto">
            <Table
              isCompact={variant === "compact"}
              isHeaderSticky
              aria-label={title || "Master Audit Table"}
              classNames={{
                base: "w-full border-collapse bg-transparent",
                table: "w-full bg-transparent min-w-[700px]",
                wrapper:
                  "p-0 no-scrollbar rounded-none border-none shadow-none bg-transparent",
                th: [
                  "bg-slate-100/90 dark:bg-slate-800/90",
                  "text-[11px]",
                  "font-black",
                  "uppercase",
                  "tracking-wider",
                  "text-slate-700 dark:text-slate-200",
                  "whitespace-nowrap",
                  "py-4 px-4",
                  "border-b-2 border-slate-200/80 dark:border-slate-700",
                ].join(" "),
                td: [
                  "py-3.5 px-4",
                  "border-b border-slate-100 dark:border-slate-800/60",
                  "group-hover:bg-slate-50/80 dark:group-hover:bg-slate-800/40",
                  "transition-colors duration-150",
                  "text-slate-700 dark:text-slate-200",
                  "text-xs font-semibold",
                  "whitespace-nowrap",
                ].join(" "),
                tr: "group cursor-pointer transition-colors duration-150 bg-transparent",
              }}
              selectedKeys={undefined}
              selectionMode="none"
              sortDescriptor={enableSorting ? sortDescriptor : undefined}
              onSortChange={enableSorting ? setSortDescriptor : undefined}
            >
              <TableHeader columns={headerColumns}>
                {(column: ColumnDef) => (
                  <TableColumn
                    key={column.uid}
                    align={column.align || "start"}
                    allowsSorting={enableSorting && column.sortable}
                    className={`${
                      column.align === "center"
                        ? "text-center px-4"
                        : column.align === "end"
                        ? "text-end px-4"
                        : "text-start px-4"
                    } whitespace-nowrap`}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <span>{column.name}</span>
                      {column.sortable && (
                        <ChevronsUpDown size={13} className="text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Search size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      No records found
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search query or filters.
                    </p>
                  </div>
                }
                items={sortedItems}
              >
                {(item: any) => (
                  <TableRow
                    key={item.id || item.uid || item.name || Math.random().toString()}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {(columnKey) => {
                      const column = headerColumns.find((c) => c.uid === columnKey);
                      const alignClass =
                        column?.align === "center"
                          ? "text-center px-4"
                          : column?.align === "end"
                          ? "text-end px-4"
                          : "text-start px-4";

                      return (
                        <TableCell className={`${alignClass} whitespace-nowrap`}>
                          {columnKey === "actions" && actionConfig
                            ? renderDefaultActions(item)
                            : renderCell(item, columnKey)}
                        </TableCell>
                      );
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Footer Pagination Bar */}
      {paginationFooter}
    </div>
  );
};

export const RowIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ReusableTable;
