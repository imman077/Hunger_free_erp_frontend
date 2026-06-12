import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import { X } from "lucide-react";

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
        base: `rounded-none w-full ${sizeClasses[size as keyof typeof sizeClasses] || "sm:max-w-md"} shadow-none thin-scrollbar`,
        backdrop: "bg-black/40 backdrop-blur-sm",
        header: `${hideHeaderBorder ? "border-none shadow-none" : "border-b border-[var(--border-color)]"} p-0`,
        body: "p-0 overflow-hidden",
        footer: "border-t border-[var(--border-color)] p-5",
      }}
      style={{
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <DrawerContent
        className="thin-scrollbar"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        {() => (
          <>
            <DrawerHeader className="px-6 py-5 flex flex-row items-start justify-between gap-4 border-none shadow-none">
              <div className="flex flex-col gap-0.5">
                <div
                  className="text-[19px] font-bold tracking-tight text-slate-800"
                >
                  {title}
                </div>
                {subtitle && (
                  <div
                    className="text-[11px] font-medium text-slate-400"
                  >
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
