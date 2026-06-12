import React, { useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { Icon } from "./Icon";

interface ResuableModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: React.ReactNode;
  subtitle?: string;
  badge?: string;
  status?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  footerLeft?: React.ReactNode;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  backdrop?: "opaque" | "blur" | "transparent";
  scrollBehavior?: "normal" | "inside" | "outside";
  radius?: "none" | "sm" | "md" | "lg";
  placement?:
    | "auto"
    | "top"
    | "bottom"
    | "center"
    | "top-center"
    | "bottom-center";
  hideCloseButton?: boolean;
  className?: string;
  classNames?: {
    wrapper?: string;
    backdrop?: string;
    base?: string;
    header?: string;
    body?: string;
    footer?: string;
    closeButton?: string;
  };
  onClose?: () => void;
  headerContent?: React.ReactNode;
  // Trending Specific Props
  data?: any;
  showTrendingLayout?: boolean;
}

const ResuableModal: React.FC<ResuableModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  subtitle,
  badge,
  status,
  icon,
  children,
  footer,
  footerLeft,
  size = "md",
  backdrop = "blur",
  scrollBehavior = "normal",
  placement = "center",
  hideCloseButton = false,
  className = "",
  classNames = {},
  onClose,
  headerContent,
  data,
  showTrendingLayout = false,
  radius = "md",
}) => {
  const [activeTab, setActiveTab] = useState<"Profile" | "History">("Profile");

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onOpenChange(false);
  };

  // Trending Data from Props
  const displayName = title || data?.partner;
  const displayId = data?.id;
  const joinDate = data?.date;
  const email = data?.email;
  const phone = data?.phone;
  const history = data?.history || [];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={showTrendingLayout ? "4xl" : size}
      backdrop={backdrop}
      scrollBehavior={scrollBehavior}
      placement={placement}
      hideCloseButton={true}
      radius="none"
      className={className}
      classNames={{
        backdrop: `!fixed !inset-0 !w-screen !h-screen ${
          backdrop === "blur"
            ? "bg-black/50 backdrop-blur-md"
            : backdrop === "opaque"
              ? "bg-black/80"
              : "bg-transparent"
        } ${classNames.backdrop || ""}`,
        base: `!my-4 !mx-4 !border-none !outline-none !ring-0 !ring-transparent shadow-2xl overflow-hidden ${
          showTrendingLayout ? "max-w-[850px] lg:!h-[680px]" : ""
        } ${radius === "none" ? "rounded-none" : "rounded-2xl sm:rounded-[24px]"} ${classNames.base || ""}`,
        body: `p-0 ${classNames.body || ""}`,
        wrapper: `!fixed !inset-0 z-[9999] flex items-center justify-center ${
          placement === "top" ? "!items-start" : ""
        } ${classNames.wrapper || ""}`,
      }}
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <ModalContent className="p-0 bg-transparent border-none outline-none ring-0 focus:outline-none focus-visible:outline-none">
        {(onCloseInternal) => (
          <div
            className="flex flex-col w-full overflow-hidden rounded-sm border-none outline-none"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {/* Header */}
            <div
              className={`flex-shrink-0 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b z-20 ${
                classNames.header || ""
              }`}
              style={{
                backgroundColor: "var(--bg-primary)",
                borderBottomColor: "var(--border-color)",
              }}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {icon && (
                  <div
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-sm border shrink-0"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {icon}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                    <h2
                      className="text-lg sm:text-xl font-bold tracking-tight truncate max-w-full"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {displayName}
                    </h2>
                    <div className="flex items-center gap-2">
                      {(badge || (showTrendingLayout && !badge)) && (
                        <span className="px-2 py-0.5 bg-[#22c55e] text-white text-[9px] font-bold rounded-sm uppercase whitespace-nowrap">
                          {badge || "Partner"}
                        </span>
                      )}
                      {(status || (showTrendingLayout && !status)) && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#22c55e] rounded-sm" />
                          <span
                            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {status || "Live"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {subtitle && (
                    <p
                      className="text-[10px] sm:text-xs font-normal mt-0.5 truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
                {headerContent}
              </div>
              {!hideCloseButton && (
                <button
                  onClick={() => {
                    handleClose();
                    onCloseInternal();
                  }}
                  className={`p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-sm transition-all ml-2 shrink-0 ${
                    classNames.closeButton || ""
                  }`}
                  style={{ color: "var(--text-muted)" }}
                >
                  <Icon name="close" className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Body */}
            <div
              className={`flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar min-h-[120px] sm:min-h-[150px] ${
                classNames.body || ""
              }`}
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {showTrendingLayout ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="p-4 border rounded-sm flex justify-between items-start shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="space-y-1">
                        <span
                          className="text-[9px] font-bold uppercase tracking-widest"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Partner ID
                        </span>
                        <p
                          className="text-base font-black"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {displayId}
                        </p>
                      </div>
                      <Icon
                        name="stack"
                        className="w-4 h-4"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </div>
                    <div
                      className="p-4 border rounded-sm flex justify-between items-start shadow-sm"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="space-y-1">
                        <span
                          className="text-[9px] font-bold uppercase tracking-widest"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Last Sync
                        </span>
                        <p
                          className="text-base font-black"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {joinDate}
                        </p>
                      </div>
                      <Icon
                        name="calendar"
                        className="w-4 h-4"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </div>
                  </div>

                  {activeTab === "Profile" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4 duration-400">
                      <div className="space-y-4">
                        <h3
                          className="text-[10px] font-bold uppercase tracking-[0.2em] px-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Identity
                        </h3>
                        <div
                          className="p-8 border rounded-sm shadow-sm flex flex-col items-center"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div
                            className="w-24 h-24 rounded-sm mb-6 border flex items-center justify-center relative"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              borderColor: "var(--border-color)",
                            }}
                          >
                            <Icon
                              name="donations"
                              className="w-10 h-10"
                              style={{ color: "var(--border-color)" }}
                            />
                          </div>
                          <div className="w-full space-y-3">
                            <div
                              className="flex items-center gap-3 py-2 border-b"
                              style={{
                                borderBottomColor: "var(--border-color)",
                              }}
                            >
                              <Icon
                                name="mail"
                                className="w-4 h-4"
                                style={{ color: "var(--text-muted)" }}
                              />
                              <span
                                className="text-xs font-bold truncate"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {email}
                              </span>
                            </div>
                            <div
                              className="flex items-center gap-3 py-2 border-b"
                              style={{
                                borderBottomColor: "var(--border-color)",
                              }}
                            >
                              <Icon
                                name="phone"
                                className="w-4 h-4"
                                style={{ color: "var(--text-muted)" }}
                              />
                              <span
                                className="text-xs font-bold"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {phone}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 py-2">
                              <Icon
                                name="office"
                                className="w-4 h-4"
                                style={{ color: "var(--text-muted)" }}
                              />
                              <span
                                className="text-xs font-bold truncate"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {displayName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3
                          className="text-[10px] font-bold uppercase tracking-[0.2em] px-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Metrics
                        </h3>
                        <div
                          className="p-8 border rounded-sm shadow-sm flex flex-col"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="text-center mb-6">
                            <p
                              className="text-2xl font-black tracking-tighter"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {data?.activeLedgers || 0}
                            </p>
                            <span
                              className="text-[9px] font-bold uppercase tracking-widest mt-1 block"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Active Ledgers
                            </span>
                          </div>
                          <div className="space-y-4">
                            <h4
                              className="text-[9px] font-bold border-b pb-2 uppercase"
                              style={{
                                color: "var(--text-primary)",
                                borderBottomColor: "var(--border-color)",
                              }}
                            >
                              Log Events
                            </h4>
                            <div className="relative pl-5 space-y-6">
                              <div
                                className="absolute left-[5px] top-1 bottom-1 w-px"
                                style={{
                                  backgroundColor: "var(--border-color)",
                                }}
                              />
                              {(data?.logEvents || []).map(
                                (event: any, idx: number) => (
                                  <div key={idx} className="relative">
                                    <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-sm bg-[#22c55e]" />
                                    <p
                                      className="text-[11px] font-bold leading-none"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      {event.title}
                                    </p>
                                    <p
                                      className="text-[9px] font-medium uppercase mt-0.5"
                                      style={{ color: "var(--text-muted)" }}
                                    >
                                      {event.date}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-400">
                      <h3
                        className="text-[10px] font-bold uppercase tracking-[0.2em] px-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Transaction History
                      </h3>
                      <div
                        className="border rounded-sm shadow-sm overflow-hidden text-left"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          borderColor: "var(--border-color)",
                        }}
                      >
                        <table className="w-full text-left">
                          <thead>
                            <tr
                              className="border-b"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderBottomColor: "var(--border-color)",
                              }}
                            >
                              <th
                                className="px-6 py-4 text-[9px] font-black uppercase tracking-widest"
                                style={{ color: "var(--text-muted)" }}
                              >
                                ID
                              </th>
                              <th
                                className="px-6 py-4 text-[9px] font-black uppercase tracking-widest"
                                style={{ color: "var(--text-muted)" }}
                              >
                                Date
                              </th>
                              <th
                                className="px-6 py-4 text-[9px] font-black uppercase tracking-widest"
                                style={{ color: "var(--text-muted)" }}
                              >
                                Asset
                              </th>
                              <th
                                className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-center"
                                style={{ color: "var(--text-muted)" }}
                              >
                                Audit
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {history.map((item: any) => (
                              <tr
                                key={item.id}
                                className="transition-colors"
                                style={{
                                  borderBottomColor: "var(--border-color)",
                                }}
                              >
                                <td className="px-6 py-3.5">
                                  <span
                                    className="text-[10px] font-bold"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    {item.id}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span
                                    className="text-[11px] font-bold"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    {item.date}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5">
                                  <span
                                    className="text-[9px] font-bold uppercase tracking-tighter"
                                    style={{ color: "var(--text-secondary)" }}
                                  >
                                    {item.type}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-center">
                                  <div
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[8px] font-black uppercase border ${
                                      item.status === "Verified"
                                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}
                                  >
                                    {item.status}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div
                    className="p-1 rounded-sm flex items-center h-12 border shadow-inner"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <button
                      onClick={() => setActiveTab("Profile")}
                      className={`flex-1 h-full rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        activeTab === "Profile"
                          ? "shadow-sm border"
                          : "hover:text-slate-500"
                      }`}
                      style={{
                        backgroundColor:
                          activeTab === "Profile"
                            ? "var(--bg-primary)"
                            : "transparent",
                        borderColor:
                          activeTab === "Profile"
                            ? "var(--border-color)"
                            : "transparent",
                        color:
                          activeTab === "Profile"
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                      }}
                    >
                      System Profile
                    </button>
                    <button
                      onClick={() => setActiveTab("History")}
                      className={`flex-1 h-full rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        activeTab === "History"
                          ? "shadow-sm border"
                          : "hover:text-slate-500"
                      }`}
                      style={{
                        backgroundColor:
                          activeTab === "History"
                            ? "var(--bg-primary)"
                            : "transparent",
                        borderColor:
                          activeTab === "History"
                            ? "var(--border-color)"
                            : "transparent",
                        color:
                          activeTab === "History"
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                      }}
                    >
                      Ledger Audit
                    </button>
                  </div>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Footer */}
            {(footer || footerLeft || showTrendingLayout) && (
              <div
                className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 z-20 ${
                  classNames.footer || ""
                }`}
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderTopColor: "var(--border-color)",
                }}
              >
                <div className="w-full sm:flex-1">
                  {footerLeft ||
                    (showTrendingLayout && (
                      <button
                        className="w-full sm:w-auto px-4 py-2 border rounded-sm text-[9px] font-bold uppercase tracking-widest hover:opacity-70 transition-all"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-color)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Export JSON
                      </button>
                    ))}
                </div>
                <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-3">
                  {footer || (
                    <button
                      onClick={() => {
                        handleClose();
                        onCloseInternal();
                      }}
                      className="w-full sm:w-auto px-8 py-2 text-white rounded-sm text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95"
                      style={{ backgroundColor: "#22c55e" }}
                    >
                      {showTrendingLayout ? "Close Portal" : "Close"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ResuableModal;
