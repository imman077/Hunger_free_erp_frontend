import { useState, useMemo, useCallback, useEffect } from "react";
import { Building, Filter, X, ChevronDown, Plus } from "lucide-react";
import { Avatar, Spinner } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import ReusableTable from "../../../../global/components/resuable-components/table";
import type { ColumnDef } from "../../../../global/components/resuable-components/table";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import { useUsers } from "../hooks/useUsers";
import type { UserItem } from "../store/user-schemas";

const ROLE_OPTIONS = ["Donor", "NGO", "Volunteer", "Admin"];
const STATUS_OPTIONS = ["Active", "New", "Pending"];

const UsersPage = () => {
  const { users, fetchUsers, isLoading } = useUsers();
  const USERS = users;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const toggleFilter = (filterType: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterType)
        ? prev.filter((f) => f !== filterType)
        : [...prev, filterType],
    );
    if (filterType === "role") setRoleFilter("all");
    if (filterType === "status") setStatusFilter("all");
  };

  const columns: ColumnDef[] = useMemo(
    () => [
      { name: "User", uid: "name", sortable: true, align: "start" },
      { name: "Role", uid: "role", sortable: true },
      { name: "Type", uid: "type", sortable: true },
      { name: "Status", uid: "status", sortable: true, align: "center" },
      { name: "Join Date", uid: "date", sortable: true },
      { name: "Email", uid: "email", sortable: true },
      { name: "Phone", uid: "phone" },
      { name: "Location", uid: "location", sortable: true },
      { name: "Points", uid: "totalPoints", sortable: true },
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    return USERS.filter((user) => {
      const matchRole =
        !activeFilters.includes("role") ||
        roleFilter === "all" ||
        user.role === roleFilter;
      const matchStatus =
        !activeFilters.includes("status") ||
        statusFilter === "all" ||
        user.status === statusFilter;
      return matchRole && matchStatus;
    });
  }, [USERS, activeFilters, roleFilter, statusFilter]);

  const renderCell = useCallback((user: UserItem, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof UserItem];

    switch (columnKey) {
      case "name":
        const roleAvatarColors: Record<string, string> = {
          Donor: "bg-gradient-to-br from-amber-400 to-orange-600",
          NGO: "bg-gradient-to-br from-indigo-400 to-blue-600",
          Volunteer: "bg-gradient-to-br from-emerald-400 to-green-600",
        };
        const avatarBg = roleAvatarColors[user.role] || "bg-slate-400";

        return (
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-full border w-fit min-w-0 group"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {user.avatar ? (
              <Avatar
                src={user.avatar as any}
                name={user.name}
                className="w-7 h-7 text-[10px] shrink-0"
                showFallback
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0 ${avatarBg}`}
              >
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <span
              className="font-bold text-xs whitespace-nowrap truncate max-w-[140px] pr-1 group-hover:text-hf-green transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {user.name}
            </span>
          </div>
        );
      case "role":
        const roleColors: Record<
          string,
          { bg: string; text: string; border: string }
        > = {
          Donor: {
            bg: "rgba(251, 191, 36, 0.1)",
            text: "#fbbf24",
            border: "rgba(251, 191, 36, 0.2)",
          },
          NGO: {
            bg: "rgba(129, 140, 248, 0.1)",
            text: "#818cf8",
            border: "rgba(129, 140, 248, 0.2)",
          },
          Volunteer: {
            bg: "rgba(52, 211, 153, 0.1)",
            text: "#34d399",
            border: "rgba(52, 211, 153, 0.2)",
          },
        };
        const roleStyle = roleColors[user.role] || {
          bg: "var(--bg-secondary)",
          text: "var(--text-muted)",
          border: "var(--border-color)",
        };
        return (
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
            style={{
              backgroundColor: roleStyle.bg,
              color: roleStyle.text,
              borderColor: roleStyle.border,
            }}
          >
            {user.role.toUpperCase()}
          </span>
        );
      case "type":
        return (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {user.organization}
          </span>
        );
      case "status":
        const statusColors: Record<
          string,
          { bg: string; text: string; border: string }
        > = {
          Active: {
            bg: "rgba(16, 185, 129, 0.1)",
            text: "#10b981",
            border: "rgba(16, 185, 129, 0.2)",
          },
          New: {
            bg: "rgba(59, 130, 246, 0.1)",
            text: "#3b82f6",
            border: "rgba(59, 130, 246, 0.2)",
          },
          Pending: {
            bg: "rgba(245, 158, 11, 0.1)",
            text: "#f59e0b",
            border: "rgba(245, 158, 11, 0.2)",
          },
        };
        const statusStyle = statusColors[user.status] || {
          bg: "var(--bg-secondary)",
          text: "var(--text-muted)",
          border: "var(--border-color)",
        };
        return (
          <div className="flex items-center justify-center gap-1.5 w-full">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                borderColor: statusStyle.border,
              }}
            >
              {user.status.toUpperCase()}
            </span>
          </div>
        );
      case "phone":
        return (
          <span
            className="text-xs whitespace-nowrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {String(cellValue)}
          </span>
        );
      case "totalPoints":
        const pointsColors: Record<string, string> = {
          Donor: "text-emerald-600",
          NGO: "text-indigo-600",
          Volunteer: "text-emerald-600",
        };
        return (
          <span
            className={`font-black text-xs ${
              pointsColors[user.role] || "text-slate-600"
            }`}
          >
            {cellValue as number}
          </span>
        );
      default:
        return (
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {String(cellValue)}
          </span>
        );
    }
  }, []);

  const userStats = [
    {
      label: "Total Users",
      val: USERS.length.toString(),
      trend: "All registered users",
      color: "bg-[#22c55e]",
    },
    {
      label: "Active Users",
      val: USERS.filter((u) => u.status === "Active").length.toString(),
      trend: "Currently active on platform",
      color: "bg-[#22c55e]",
    },
    {
      label: "New Users",
      val: USERS.filter((u) => u.status === "New").length.toString(),
      trend: "Joined recently",
      color: "bg-[#22c55e]",
    },
  ];

  const additionalFilters = (
    <div className="flex items-center gap-2 flex-wrap">
      <Dropdown placement="bottom">
        <DropdownTrigger>
          <Button
            variant="flat"
            className="border rounded-sm h-10 px-4 flex-shrink-0 text-[11px] font-bold transition-all shadow-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-muted)",
            }}
            startContent={
              <Filter size={14} style={{ color: "var(--text-muted)" }} />
            }
            endContent={
              <Plus size={14} style={{ color: "var(--text-muted)" }} />
            }
          >
            <span className="hidden sm:inline ml-1">ADD FILTER</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Add Filter Options"
          onAction={(key) => toggleFilter(key as string)}
          items={[
            { key: "role", label: "Role", icon: <Building size={14} /> },
            { key: "status", label: "Status", icon: <Filter size={14} /> },
          ]}
          classNames={{
            base: "border rounded-sm min-w-[180px] p-1 shadow-2xl",
          }}
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
          itemClasses={{
            base: [
              "text-[11px] font-bold uppercase tracking-tight",
              "data-[hover=true]:bg-[var(--bg-secondary)] data-[hover=true]:text-hf-green",
              "rounded-sm",
              "px-3",
              "py-2.5",
              "transition-colors duration-200",
            ].join(" "),
            title: "text-[var(--text-secondary)]",
          }}
        >
          {(item: any) => (
            <DropdownItem
              key={item.key}
              isDisabled={activeFilters.includes(item.key)}
              startContent={item.icon}
            >
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>

      {activeFilters.includes("role") && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="border border-hf-green/20 bg-hf-green/10 rounded-sm h-10 px-3 text-[11px] font-black text-hf-green hover:bg-hf-green/20 transition-all shadow-none"
              endContent={<ChevronDown size={14} />}
            >
              ROLE: {roleFilter.toUpperCase()}
              <div
                className="ml-2 hover:bg-hf-green/20 rounded-full p-0.5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFilter("role");
                }}
              >
                <X size={12} />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Role Filter Choices"
            selectionMode="single"
            selectedKeys={[roleFilter]}
            onSelectionChange={(keys) =>
              setRoleFilter(Array.from(keys)[0] as string)
            }
            items={[
              { key: "all", label: "All Roles" },
              ...ROLE_OPTIONS.map((role) => ({ key: role, label: role })),
            ]}
            classNames={{
              base: "bg-white border border-slate-200 rounded-sm min-w-[160px] p-1",
            }}
            itemClasses={{
              base: [
                "text-slate-600 text-[11px] font-bold uppercase tracking-tight",
                "data-[hover=true]:bg-slate-50 data-[hover=true]:text-hf-green",
                "data-[selected=true]:bg-emerald-50 data-[selected=true]:text-hf-green",
                "rounded-sm",
                "px-3",
                "py-2.5",
                "transition-colors duration-200",
              ].join(" "),
              selectedIcon: "text-hf-green w-4 h-4 ml-auto",
            }}
          >
            {(item: any) => (
              <DropdownItem key={item.key}>{item.label}</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      )}

      {activeFilters.includes("status") && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="border border-blue-500/20 bg-blue-500/10 rounded-sm h-10 px-3 text-[11px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all shadow-none"
              endContent={<ChevronDown size={14} />}
            >
              STATUS: {statusFilter.toUpperCase()}
              <div
                className="ml-2 hover:bg-blue-500/20 rounded-full p-0.5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFilter("status");
                }}
              >
                <X size={12} />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Status Filter Choices"
            selectionMode="single"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(Array.from(keys)[0] as string)
            }
            items={[
              { key: "all", label: "All Statuses" },
              ...STATUS_OPTIONS.map((status) => ({
                key: status,
                label: status,
              })),
            ]}
            classNames={{
              base: "bg-white border border-slate-200 rounded-sm min-w-[160px] p-1",
            }}
            itemClasses={{
              base: [
                "text-slate-600 text-[11px] font-bold uppercase tracking-tight",
                "data-[hover=true]:bg-slate-50 data-[hover=true]:text-hf-green",
                "data-[selected=true]:bg-emerald-50 data-[selected=true]:text-hf-green",
                "rounded-sm",
                "px-3",
                "py-2.5",
                "transition-colors duration-200",
              ].join(" "),
              selectedIcon: "text-hf-green w-4 h-4 ml-auto",
            }}
          >
            {(item: any) => (
              <DropdownItem key={item.key}>{item.label}</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );

  return (
    <div
      className="w-full space-y-6 p-4 md:p-6 min-h-screen relative"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-50">
          <Spinner color="success" size="lg" label="Updating from SQL..." />
        </div>
      )}
      <div className="w-full flex flex-col text-left">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words"
          style={{ color: "var(--text-primary)" }}
        >
          User Management
        </h1>
        <p
          className="mt-1 md:mt-2 text-xs md:text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Manage and track all system users and their roles
        </p>
      </div>

      <ImpactCards data={userStats} />

      <ReusableTable
        data={filteredUsers}
        columns={columns}
        renderCell={renderCell}
        variant="compact"
        enableFilters={false}
        additionalFilters={additionalFilters}
        initialVisibleColumns={[
          "name",
          "role",
          "status",
          "date",
          "phone",
          "totalPoints",
        ]}
      />
    </div>
  );
};

export default UsersPage;
