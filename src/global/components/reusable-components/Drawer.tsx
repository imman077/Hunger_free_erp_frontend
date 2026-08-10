import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { X, FileText } from "lucide-react";

interface ResuableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
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
  headerExtra?: React.ReactNode;
  hideHeaderBorder?: boolean;
  headerVariant?: "default" | "green";
  headerIcon?: React.ReactNode;
}

const ResuableDrawer = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  headerExtra,
  hideHeaderBorder = true,
  headerVariant = "green",
  headerIcon,
}: ResuableDrawerProps) => {
  const sizeClasses = {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    full: "sm:max-w-full",
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size={size as any}
      placement="right"
      backdrop="blur"
      hideCloseButton={true}
      classNames={{
        base: `rounded-t-[1.75rem] overflow-hidden w-full ${sizeClasses[size as keyof typeof sizeClasses] || "sm:max-w-md"} shadow-2xl thin-scrollbar`,
        backdrop: "bg-black/40 backdrop-blur-sm",
        header: `${hideHeaderBorder ? "border-none shadow-none" : "border-b border-[var(--border-color)]"} p-0`,
        body: "p-0 overflow-y-auto thin-scrollbar",
        footer: "border-t border-[var(--border-color)] p-5",
      }}
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <DrawerContent
        className="thin-scrollbar overflow-hidden rounded-t-[1.75rem]"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {() => (
          <>
            {headerVariant === "green" ? (
              <div className="relative w-full bg-white">
                {/* Layer 1: Underlay #B4E9C4 curved shape */}
                <div
                  className="absolute inset-x-0 top-0 h-[135px] bg-[#B4E9C4] z-0"
                  style={{
                    clipPath: "ellipse(140% 100% at 50% 0%)",
                  }}
                />

                {/* Layer 2: Main Dark Green #056839 curved header container */}
                <div
                  className="relative z-10 w-full bg-[#056839] text-white pt-6 pb-11 px-6 shadow-md"
                  style={{
                    clipPath: "ellipse(135% 90% at 50% 0%)",
                  }}
                >
                  {/* Background decorative watermark */}
                  <div className="absolute -right-6 -top-4 opacity-10 text-white pointer-events-none z-0">
                    <svg className="w-36 h-36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>

                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                        {headerIcon || <FileText size={20} strokeWidth={2} />}
                      </div>
                      <div className="min-w-0 flex-1 text-start">
                        <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight truncate">
                          {title}
                        </h2>
                        {subtitle && (
                          <div className="text-[12px] font-medium text-emerald-200 mt-0.5 truncate">
                            {subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      {headerExtra}
                      <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-slate-100 transition-all shadow-md shrink-0 cursor-pointer"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <DrawerHeader className="px-6 py-5 flex flex-row items-start justify-between gap-4 border-none shadow-none">
                <div className="flex flex-col gap-0.5">
                  <div className="text-[19px] font-bold tracking-tight text-slate-800">
                    {title}
                  </div>
                  {subtitle && (
                    <div className="text-[11px] font-medium text-slate-400">
                      {subtitle}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0 pt-0.5">
                  {headerExtra}
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-all duration-300 group"
                  >
                    <X
                      size={20}
                      className="text-slate-400 group-hover:text-slate-600 transition-colors"
                    />
                  </button>
                </div>
              </DrawerHeader>
            )}

            <DrawerBody
              className="py-1 px-0 overflow-y-auto transform-gpu will-change-transform thin-scrollbar flex-1 border-none shadow-none"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="">{children}</div>
            </DrawerBody>

            {footer && (
              <DrawerFooter
                className="px-6 py-3.5 flex items-center justify-end gap-3"
                style={{ backgroundColor: "var(--bg-primary)" }}
              >
                {footer}
              </DrawerFooter>
            )}
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ResuableDrawer;
