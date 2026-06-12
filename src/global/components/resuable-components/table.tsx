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
import { Eye, Mail, CheckCircle, Ban, Trash2 } from "lucide-react";
import ResuableButton from "./button";

// --- Icons ---

const ChevronDownIconSvg = ({ strokeWidth = 1.5, ...otherProps }: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

const SearchIconSvg = (props: any) => {
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
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

const FilterIcon = (props: any) => {
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
        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const RowIcon = (props: any) => {
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
  actionConfig?: ActionConfig;
  topContent?: React.ReactNode;
  variant?: "default" | "compact";
  enableSorting?: boolean;
  additionalFilters?: React.ReactNode;
  onRowClick?: (item: any) => void;
}

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

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
  actionConfig,
  topContent: customTopContent,
  variant = "compact",
  enableSorting = false,
  additionalFilters,
  onRowClick,
}) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
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
    const statusSet = new Set(data.map((item) => item.status).filter(Boolean));
    return ["all", ...Array.from(statusSet)];
  }, [data]);

  // Default action renderer
  const renderDefaultActions = useCallback(
    (item: any) => {
      if (!actionConfig) return null;

      const {
        showView,
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
        <div className="flex items-center justify-center gap-1">
          {showView && (
            <ResuableButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(item);
              }}
              className="!p-2 !min-w-0"
            >
              <Eye
                size={19}
                className="transition-transform group-active:scale-90"
                style={{ color: "var(--text-muted)" }}
              />
            </ResuableButton>
          )}
          {showMessage && (
            <ResuableButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMessage?.(item);
              }}
              className="!p-2 !min-w-0 hover:!bg-blue-50"
            >
              <Mail size={18} className="text-blue-600" />
            </ResuableButton>
          )}
          {showApprove && (
            <ResuableButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onApprove?.(item);
              }}
              className="!p-2 !min-w-0 hover:!bg-[#ecfdf5]"
            >
              <CheckCircle size={18} className="text-[#22c55e]" />
            </ResuableButton>
          )}
          {showDeactivate && (
            <ResuableButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate?.(item);
              }}
              className="!p-2 !min-w-0 hover:!bg-red-50"
            >
              <Ban size={18} className="text-red-600" />
            </ResuableButton>
          )}
          {showDelete && (
            <ResuableButton
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(item);
              }}
              className="!p-2 !min-w-0 hover:!bg-red-50"
            >
              <Trash2
                size={18}
                className="text-red-500 transition-transform group-active:scale-90"
              />
            </ResuableButton>
          )}
        </div>
      );
    },
    [actionConfig],
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-3 p-3 pb-0">
        {(title || description) && (
          <div className="flex flex-col gap-0.5">
            {title && (
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              {enableSearch && (
                <div className="relative w-full sm:max-w-xs min-w-[150px]">
                  <Input
                    isClearable
                    className="w-full"
                    placeholder="Search..."
                    startContent={
                      <SearchIconSvg style={{ color: "var(--text-muted)" }} />
                    }
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    classNames={{
                      base: "w-full",
                      inputWrapper: [
                        "border-[var(--border-color)]",
                        "bg-[var(--bg-secondary)]",
                        "rounded-sm",
                        "!shadow-none",
                        "h-10",
                        "transition-all duration-200",
                        "data-[hover=true]:border-hf-green/50",
                        "group-data-[focus=true]:border-hf-green",
                      ].join(" "),
                      input:
                        "text-sm font-medium pl-2 !text-[var(--text-primary)]",
                      clearButton:
                        "text-[var(--text-muted)] hover:text-[var(--text-primary)] !border-none !p-0 !bg-transparent",
                    }}
                  />
                </div>
              )}
              {showColumnSettings && (
                <Dropdown placement="bottom-start">
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="border rounded-sm h-10 px-4 flex-shrink-0 text-[11px] font-bold transition-all"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                      endContent={
                        <ChevronDownIconSvg
                          style={{ color: "var(--text-muted)" }}
                          className="text-[10px]"
                        />
                      }
                    >
                      <span className="hidden sm:inline">COLUMNS</span>
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
                      base: "border rounded-sm min-w-[180px] p-1 shadow-2xl",
                    }}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                    itemClasses={{
                      base: [
                        "text-[11px] font-bold uppercase tracking-tight",
                        "data-[hover=true]:bg-hf-green/10 data-[hover=true]:text-hf-green",
                        "data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-hf-green",
                        "rounded-sm",
                        "px-3",
                        "py-2.5",
                        "transition-all duration-200",
                      ].join(" "),
                      selectedIcon: "text-hf-green w-4 h-4 ml-auto",
                    }}
                  >
                    {columns.map((column) => (
                      <DropdownItem key={column.uid} showDivider={false}>
                        {column.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {additionalFilters}

              {enableFilters && statusOptions.length > 1 && (
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className={`border rounded-sm h-10 px-4 flex-shrink-0 text-[11px] font-bold transition-all ${
                        selectedStatus !== "all"
                          ? "border-hf-green/30 bg-hf-green/10 text-hf-green hover:bg-hf-green/20"
                          : "border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
                      }`}
                      startContent={
                        <FilterIcon
                          className={
                            selectedStatus !== "all"
                              ? "text-hf-green"
                              : "text-[var(--text-muted)]"
                          }
                          size={14}
                        />
                      }
                      endContent={
                        <ChevronDownIconSvg
                          className={`text-[10px] ${selectedStatus !== "all" ? "text-hf-green" : "text-[var(--text-muted)]"}`}
                        />
                      }
                    >
                      <span className="hidden sm:inline ml-1">
                        {selectedStatus === "all"
                          ? "STATUS: ALL"
                          : `STATUS: ${selectedStatus.toUpperCase()}`}
                      </span>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status filter"
                    selectionMode="single"
                    selectedKeys={[selectedStatus]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      // Prevent empty selection - if user clicks same item, keep it selected
                      if (selected && selected !== selectedStatus) {
                        setSelectedStatus(selected);
                        setPage(1);
                      }
                    }}
                    classNames={{
                      base: "border rounded-sm min-w-[160px] p-1 shadow-2xl",
                    }}
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                    }}
                    itemClasses={{
                      base: [
                        "text-[11px] font-bold uppercase tracking-tight",
                        "data-[hover=true]:bg-hf-green/10 data-[hover=true]:text-hf-green",
                        "data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-hf-green",
                        "rounded-sm",
                        "px-3",
                        "py-2.5",
                        "transition-colors duration-200",
                      ].join(" "),
                      selectedIcon: "text-hf-green w-4 h-4 ml-auto",
                    }}
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status}>
                        {status === "all" ? "All Status" : status}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              )}

              {enableFilters && enableDateFilter && (
                <div className="flex gap-3 relative" ref={pickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowPicker(!showPicker)}
                    className="flex items-center gap-2.5 px-4 h-10 border rounded-sm font-bold text-[11px] uppercase tracking-tight transition-all group/picker"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <CalendarIcon
                      size={14}
                      className="transition-colors"
                      style={{
                        color:
                          dateRange.start || dateRange.end
                            ? "var(--color-emerald)"
                            : "var(--text-muted)",
                      }}
                    />
                    <span className="min-w-[120px] text-left">
                      {!dateRange.start && !dateRange.end
                        ? "SELECT RANGE"
                        : `${dateRange.start || "..."} — ${
                            dateRange.end || "..."
                          }`}
                    </span>
                    <ChevronDownIconSvg
                      className={`text-[10px] transition-transform duration-300 ${
                        showPicker ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--text-muted)" }}
                    />
                  </button>

                  {showPicker && (
                    <HeroDateRangePicker
                      initialStart={dateRange.start}
                      initialEnd={dateRange.end}
                      onRangeSelect={(start, end) => {
                        const newRange = { start, end };
                        setDateRange(newRange);
                        if (onDateRangeChange) {
                          onDateRangeChange(newRange);
                        }
                      }}
                      onClose={() => setShowPicker(false)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className="flex flex-row items-center justify-between gap-2 px-3 py-2 rounded-sm border overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="hidden sm:inline">TOTAL </span>RECORDS:
              </span>
              <span
                className="text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded-sm border shadow-sm shrink-0"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                {data.length}
              </span>
            </div>
            {enablePagination && (
              <label
                className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="hidden sm:inline">SHOW </span>ROWS:
                <select
                  className="outline-none text-[10px] md:text-[11px] font-black cursor-pointer border rounded-sm px-2 py-0.5 transition-all shadow-sm shrink-0"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  onChange={onRowsPerPageChange}
                  value={rowsPerPage}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </label>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    data.length,
    filteredItems.length,
    onSearchChange,
    columns,
    enableSearch,
    enableFilters,
    showColumnSettings,
    rowsPerPage,
    title,
    description,
    statusOptions,
    selectedStatus,
    showPicker,
    dateRange,
    enableDateFilter,
    onDateRangeChange,
    enablePagination,
    onClear,
  ]);

  const finalTopContent = customTopContent || topContent;

  const bottomContent = useMemo(() => {
    if (!enablePagination) return null;

    return (
      <div
        className="px-6 py-4 border-t flex items-center justify-end"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderTopColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousPage}
            disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-sm border transition-all"
            style={{
              backgroundColor: page === 1 ? "transparent" : "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: page === 1 ? "var(--text-muted)" : "var(--text-primary)",
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            <ChevronDownIconSvg className="w-3.5 h-3.5 rotate-90" />
          </button>
          <div className="flex gap-1 px-1">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 flex items-center justify-center rounded-sm text-[10px] font-black transition-all ${
                  page === i + 1
                    ? "bg-hf-green text-white scale-105 shadow-sm"
                    : "border"
                }`}
                style={{
                  backgroundColor:
                    page === i + 1 ? "#22c55e" : "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                  color: page === i + 1 ? "white" : "var(--text-primary)",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={onNextPage}
            disabled={page >= pages}
            className="w-7 h-7 flex items-center justify-center rounded-sm border transition-all"
            style={{
              backgroundColor:
                page >= pages ? "transparent" : "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color:
                page >= pages ? "var(--text-muted)" : "var(--text-primary)",
              opacity: page >= pages ? 0.5 : 1,
            }}
          >
            <ChevronDownIconSvg className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </div>
      </div>
    );
  }, [
    page,
    pages,
    enablePagination,
    rowsPerPage,
    onRowsPerPageChange,
    onNextPage,
    onPreviousPage,
  ]);

  return (
    <div
      className="border rounded-sm flex flex-col relative gap-4 w-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <Table
        isCompact
        isHeaderSticky
        aria-label="Master Audit Ledger"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          base: "border-collapse bg-transparent",
          table: "bg-transparent",
          wrapper:
            "p-0 no-scrollbar rounded-none border-none shadow-none bg-transparent",
          th: [
            "bg-transparent",
            "text-[10px]",
            "font-bold",
            "uppercase",
            "tracking-[0.15em]",
            "text-[var(--text-muted)]",
            "whitespace-nowrap",
            variant === "compact" ? "py-2.5 px-3" : "py-4 px-5",
            "border-b",
            "border-[var(--border-color)]",
            "first:rounded-tl-sm",
            "last:rounded-tr-sm",
          ].join(" "),
          td: [
            variant === "compact" ? "py-2 px-3" : "py-4 px-5",
            "border-b",
            "border-[var(--border-color)]",
            "group-hover:bg-[var(--bg-secondary)]",
            "transition-all",
            "text-[var(--text-primary)]",
            "text-[13px]",
            "whitespace-nowrap",
          ].join(" "),
          tr: "group cursor-pointer transition-colors duration-200 bg-transparent",
        }}
        selectedKeys={undefined}
        selectionMode="none"
        sortDescriptor={enableSorting ? sortDescriptor : undefined}
        onSortChange={enableSorting ? setSortDescriptor : undefined}
        topContent={finalTopContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column: ColumnDef) => (
            <TableColumn
              key={column.uid}
              align={column.align || "center"}
              allowsSorting={enableSorting && column.sortable}
              className={`${
                column.align === "start"
                  ? "text-start px-4"
                  : column.align === "end"
                    ? "text-end px-4"
                    : "text-center px-4"
              } whitespace-nowrap`}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
              <SearchIconSvg className="w-10 h-10 text-[var(--text-muted)] mb-2" />
              <p className="text-[var(--text-muted)] font-bold uppercase text-[10px] tracking-widest">
                No records found
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
                const alignmentClass = `${
                  column?.align === "start"
                    ? "text-start px-4"
                    : column?.align === "end"
                      ? "text-end px-4"
                      : "text-center px-4"
                } whitespace-nowrap`;

                return (
                  <TableCell className={alignmentClass}>
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
  );
};

export { RowIcon };
export default ReusableTable;
