import { useState } from "react";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { BellIcon, CheckCheck, User, LogOut } from "lucide-react";
import { useSidebar } from "../contexts/SidebarContext";
import { formatDistanceToNow } from "date-fns";
import ThemeToggle from "./ThemeToggle";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./resuable-components/Icon";

/* ---------------- Interfaces ---------------- */

interface Notification {
  id: number;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
  icon: string;
  avatar?: string;
  user?: string;
}

// Professional Notification Data
const notificationData: Notification[] = [
  {
    id: 1,
    type: "success",
    user: "Isaiah Rivera",
    avatar: "https://i.pravatar.cc/150?u=1",
    title: "has registered",
    message: "New donation profile created successfully",
    time: new Date(Date.now() - 2 * 60 * 1000),
    isRead: false,
    icon: "check",
  },
  {
    id: 2,
    type: "info",
    user: "Samuel Young",
    avatar: "https://i.pravatar.cc/150?u=2",
    title: "has registered",
    message: "New volunteer application received",
    time: new Date(Date.now() - 20 * 60 * 1000),
    isRead: false,
    icon: "info",
  },
  {
    id: 3,
    type: "warning",
    user: "Christian Brooks",
    avatar: "https://i.pravatar.cc/150?u=3",
    title: "request for KYC verifications",
    message: "Supporting documents pending review",
    time: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
    icon: "alert",
  },
  {
    id: 4,
    type: "success",
    user: "Levi Collins",
    avatar: "https://i.pravatar.cc/150?u=4",
    title: "has registered",
    message: "NGO partnership verified",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    icon: "check",
  },
  {
    id: 5,
    type: "info",
    user: "Isabella Anderson",
    avatar: "https://i.pravatar.cc/150?u=5",
    title: "has registered",
    message: "Donor account active",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: false,
    icon: "info",
  },
];

const Header = () => {
  const { expanded, setMobileOpen } = useSidebar();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notificationExpanded, setNotificationExpanded] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<any>("all");

  const handleNotificationClick = () => {
    setNotificationDrawerOpen(true);
  };

  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.isRead).length;
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  return (
    <>
      <header
        className={
          "fixed top-0 right-0 h-16 md:h-20 z-40 flex items-center justify-between px-3 md:px-6 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-b " +
          (expanded ? "left-0 md:left-[260px]" : "left-0 md:left-[70px]")
        }
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Left section - hamburger on mobile only */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Right section - Notifications and avatar */}
        <div className="flex flex-row gap-2 md:gap-3 items-center">
          <ThemeToggle />
          {/* Bell Notification */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              padding: "0",
              width: { xs: "36px", md: "40px" },
              height: { xs: "36px", md: "40px" },
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "var(--bg-hover)",
                transform: "translateY(-1px)",
              },
            }}
          >
            <Badge
              overlap="circular"
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#3b82f6",
                  top: 2,
                  right: 2,
                  border: "2px solid white",
                },
              }}
            >
              <BellIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Badge>
          </IconButton>

          {/* Vertical Separator - hidden on mobile */}
          <div className="hidden sm:block h-8 w-px bg-slate-100 dark:bg-slate-800" />

          {/* Avatar Profile */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2.5 cursor-pointer group outline-none">
                <div className="relative">
                  <Avatar
                    alt="User"
                    src="https://mui.com/static/images/avatar/1.jpg"
                    sx={{
                      width: { xs: 36, md: 40 },
                      height: { xs: 36, md: 40 },
                      borderRadius: "12px",
                      border: "2px solid var(--border-color)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    }}
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-[2px] border-[var(--bg-primary)] rounded-full shadow-sm z-10" />
                </div>
                <div className="hidden sm:flex flex-col items-start -space-y-0.5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#22c55e] leading-none mb-0.5">
                    Online
                  </p>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-xs font-black tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Admin Hub
                    </span>
                    <Icon
                      name="chevron-down"
                      className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile actions"
              variant="flat"
              classNames={{
                base: "p-2 min-w-[220px] border rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200",
              }}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
              itemClasses={{
                base: [
                  "rounded-xl",
                  "text-slate-500",
                  "transition-all",
                  "duration-300",
                  "py-2.5",
                  "px-4",
                  "gap-3",
                ],
              }}
            >
              <DropdownItem
                key="profile-header"
                className="h-auto opacity-100 pointer-events-none mb-1.5 border-b border-dashed border-slate-200/60 dark:border-slate-800/60 rounded-none pb-3.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
                    <User size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                      Logged in as
                    </p>
                    <p className="font-bold text-sm text-[var(--text-primary)] leading-tight">
                      Master Admin
                    </p>
                  </div>
                </div>
              </DropdownItem>

              <DropdownItem
                key="view-profile"
                startContent={<User size={16} className="opacity-70" />}
                className="text-xs font-semibold data-[hover=true]:bg-emerald-500/5 data-[hover=true]:text-emerald-500"
                onPress={() => navigate("/admin/settings")}
              >
                View Profile
              </DropdownItem>

              <DropdownItem
                key="logout"
                className="mt-1.5 pt-3 border-t border-dashed border-slate-200/60 dark:border-slate-800/60 rounded-none data-[hover=true]:bg-rose-500/5 data-[hover=true]:text-rose-500"
                startContent={<LogOut size={16} className="opacity-70" />}
                onPress={() => navigate("/auth")}
              >
                <span className="text-xs font-semibold">Sign Out</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </header>

      {/* ---------------- NOTIFICATION CENTER (CUSTOM POPOVER) ---------------- */}
      {notificationDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => {
              setNotificationDrawerOpen(false);
              setNotificationExpanded(false);
            }}
          />

          {/* Notification Popover */}
          <div
            className={`fixed z-[9999] top-16 md:top-20 right-4 rounded-2xl border shadow-[0_42px_130px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              notificationExpanded
                ? "w-[calc(100vw-32px)] md:w-[1100px] h-[calc(100vh-100px)] md:h-[calc(100vh-140px)] md:right-8"
                : "w-[calc(100vw-32px)] md:w-[360px] h-[520px] max-h-[80vh] md:right-8"
            }`}
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Header */}
            <div
              className="flex-shrink-0 px-4 md:px-6 py-4 md:py-5 flex items-center justify-between border-b border-dashed"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 leading-none mb-1">
                  Alert Center
                </span>
                <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
                  Notifications
                </span>
              </div>
              <button
                onClick={() => {
                  setNotificationDrawerOpen(false);
                  setNotificationExpanded(false);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all duration-300 active:scale-90 shadow-sm"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Container */}
            <div
              className="flex-shrink-0 p-3"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div
                className="flex items-center gap-1 p-1 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {["all", "unread"].map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setSelectedTab(tabKey)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 relative ${
                      selectedTab === tabKey
                        ? "bg-white shadow-sm border text-emerald-600 z-10"
                        : "text-slate-500 opacity-60 hover:opacity-100"
                    }`}
                    style={{
                      borderColor:
                        selectedTab === tabKey
                          ? "var(--border-color)"
                          : "transparent",
                    }}
                  >
                    {tabKey}
                    {tabKey === "unread" && getUnreadCount() > 0 && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List - Scrollable */}
            <div
              className={`flex-1 overflow-y-auto thin-scrollbar px-3 py-2 ${
                notificationExpanded
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 content-start"
                  : "flex flex-col gap-3"
              }`}
            >
              {notifications.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-24 opacity-20"
                  style={{ color: "var(--text-primary)" }}
                >
                  <BellIcon size={48} className="stroke-[1] mb-5" />
                  <p className="text-[11px] font-bold uppercase tracking-wider">
                    Zero Alerts
                  </p>
                </div>
              ) : (
                notifications
                  .filter((n) => {
                    if (selectedTab === "unread") return !n.isRead;
                    return true;
                  })
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item.id === n.id ? { ...item, isRead: true } : item,
                          ),
                        );
                      }}
                      className={`group relative px-3.5 py-2.5 w-full transition-all duration-300 cursor-pointer flex items-center gap-3 rounded-xl border self-start
                        ${
                          !n.isRead
                            ? "bg-emerald-500/5 border-emerald-500/10 shadow-[0_4px_12px_-4px_rgba(34,197,94,0.1)]"
                            : "bg-white border-slate-200/60 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0 relative">
                        <Avatar
                          src={n.avatar}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "10px",
                            border: "1.5px solid var(--bg-primary)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                          }}
                        />
                        {!n.isRead && (
                          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm z-10" />
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0 pr-1 md:pr-1.5">
                        <div className="flex items-start justify-between mb-0.5">
                          <p className="font-bold text-[13px] text-[var(--text-primary)] truncate">
                            {n.user || "System"}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 ml-2">
                            {formatDistanceToNow(n.time, { addSuffix: false })}
                          </p>
                        </div>
                        <p className="text-[12px] leading-snug font-medium text-[var(--text-secondary)] line-clamp-1">
                          {n.title}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer - Fixed at Bottom */}
            <div
              className="flex-shrink-0 p-3 md:p-4 border-t border-dashed grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <button
                onClick={markAllAsRead}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-slate-200 text-emerald-600 text-xs font-bold uppercase tracking-wider transition-all hover:bg-emerald-50 hover:border-emerald-100 active:scale-95 shadow-sm"
              >
                <CheckCheck size={16} strokeWidth={2} />
                Mark Read
              </button>
              <button
                onClick={() => setNotificationExpanded(!notificationExpanded)}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
              >
                <Icon
                  name={notificationExpanded ? "chevron-up" : "chevron-down"}
                  className="w-4 h-4 opacity-70"
                />
                {notificationExpanded ? "Minimize" : "View All"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ---------------- MOBILE LEFT DRAWER REMOVED (HANDLED BY SIDEBAR) ---------------- */}
      <div />
    </>
  );
};

export default Header;
