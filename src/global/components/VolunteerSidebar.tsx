import React, { useState } from "react";
import { Icon } from "./resuable-components/Icon";
import { useSidebar } from "../contexts/SidebarContext";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";

type SubItem = {
  label: string;
  to: string;
};

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to?: string;
  expanded: boolean;
  subItems?: SubItem[];
  onNavigate?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  expanded,
  subItems,
  onNavigate,
}) => {
  const { setExpanded } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;
  const isSubItemActive = subItems?.some(
    (item) => location.pathname === item.to,
  );

  React.useEffect(() => {
    if (isSubItemActive) setIsOpen(true);
  }, [isSubItemActive]);

  const handleClick = () => {
    if (subItems) {
      if (!expanded) {
        setExpanded(true);
        setIsOpen(true);
      } else {
        setIsOpen(!isOpen);
      }
    }
  };

  const content = (
    <div
      className={`group relative flex items-center transition-all duration-200 cursor-pointer mb-1 mx-auto
        ${
          isActive || isSubItemActive
            ? expanded
              ? "w-full p-2.5 bg-emerald-50 text-emerald-600 font-semibold border-l-4 border-[#22c55e] rounded-xl"
              : "w-11 h-11 bg-emerald-50 text-emerald-600 font-semibold rounded-xl justify-center"
            : expanded
              ? "w-full p-2.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-500 rounded-xl"
              : "w-11 h-11 text-slate-400 hover:bg-slate-100 hover:text-emerald-500 rounded-xl justify-center"
        }`}
      onClick={handleClick}
    >
      <div
        className={`flex items-center justify-center shrink-0 ${expanded ? "w-7 h-7" : ""}`}
      >
        <Icon
          name={
            typeof icon === "string"
              ? icon
              : (icon as any).props.name || label.toLowerCase()
          }
          className={`w-5 h-5 transition-all duration-300 ${
            isActive || isSubItemActive
              ? "text-emerald-600 opacity-100"
              : "opacity-25 group-hover:opacity-60"
          }`}
        />
      </div>
      {expanded && (
        <div className="flex items-center flex-1 ml-2.5 animate-in fade-in slide-in-from-left-2 duration-300 min-w-0">
          <span className="text-[15px]">{label}</span>
          {subItems && (
            <Icon
              name="chevron-down"
              className={`w-4 h-4 transition-transform duration-300 ml-auto ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {to && !subItems ? (
        <Link to={to} onClick={onNavigate}>
          {content}
        </Link>
      ) : (
        content
      )}
      {subItems && expanded && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="ml-8 space-y-0.5 mt-0.5"
            style={{ borderLeft: "1px solid var(--border-color)" }}
          >
            {subItems.map((item) => {
              const isSubActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                    isSubActive
                      ? "text-emerald-600 font-semibold bg-emerald-500/10"
                      : "text-slate-500 hover:text-[#22c55e] hover:translate-x-1"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isSubActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const VolunteerSidebar: React.FC = () => {
  const { expanded, setExpanded, mobileOpen, setMobileOpen } = useSidebar();
  const { onOpenChange } = useDisclosure();

  const rewardsSubItems: SubItem[] = [
    { label: "My Rewards", to: "/volunteer/rewards" },
    { label: "Benefits", to: "/volunteer/rewards/benefits" },
  ];

  const profileSubItems: SubItem[] = [
    { label: "My Profile", to: "/volunteer/profile" },
    { label: "Payment Methods", to: "/volunteer/payments" },
  ];

  const NavContent = ({
    inDrawer = false,
    onNavigate,
  }: {
    inDrawer?: boolean;
    onNavigate?: () => void;
  }) => (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <nav
        className={`flex-1 overflow-y-auto no-scrollbar space-y-1 ${
          inDrawer ? "px-4" : expanded ? "px-4" : "px-2"
        }`}
      >
        <div className="space-y-1">
          <SidebarItem
            icon={<Icon name="dashboard" />}
            label="Dashboard"
            to="/volunteer/dashboard"
            expanded={inDrawer ? true : expanded}
            onNavigate={onNavigate}
          />
          <SidebarItem
            icon={<Icon name="users" />}
            label="Tasks"
            to="/volunteer/tasks"
            expanded={inDrawer ? true : expanded}
            onNavigate={onNavigate}
          />
          <SidebarItem
            icon={<Icon name="rewards" />}
            label="Rewards"
            expanded={inDrawer ? true : expanded}
            subItems={rewardsSubItems}
            onNavigate={onNavigate}
          />
          <SidebarItem
            icon={<Icon name="users" />}
            label="Profile"
            expanded={inDrawer ? true : expanded}
            subItems={profileSubItems}
            onNavigate={onNavigate}
          />
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex-col z-[50] ${
          expanded ? "w-[260px]" : "w-[70px]"
        }`}
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <div className="h-20 flex items-center flex-shrink-0 w-full overflow-hidden mb-4">
          <div className="w-full flex items-center justify-center">
            {expanded ? (
              <div
                className="w-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setExpanded(!expanded)}
              >
                <img
                  src="/HungerFree.svg"
                  className="h-[72px] w-auto object-contain mx-auto"
                  alt="HungerFree Logo"
                />
              </div>
            ) : (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all shadow-sm active:scale-95"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                <Icon name="menu" className="w-5 h-5 text-emerald-500" />
              </button>
            )}
          </div>
        </div>
        <NavContent />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <Drawer
        isOpen={mobileOpen}
        onOpenChange={(open) => {
          setMobileOpen(open);
          onOpenChange();
        }}
        shouldCloseOnInteractOutside={() => false}
        placement="left"
        size="xs"
        hideCloseButton
        backdrop="transparent"
        classNames={{
          base: "max-w-[280px] p-0 rounded-none",
          wrapper: "z-[9999]",
          header: "hidden",
          body: "p-0 flex flex-col overflow-hidden",
          footer: "hidden",
        }}
      >
        <DrawerContent
          style={{
            backgroundColor: "var(--bg-primary)",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          {() => (
            <DrawerBody
              className="p-0 m-0 flex flex-col overflow-hidden h-full"
              style={{ padding: 0, margin: 0 }}
            >
              <div
                className="h-20 flex items-center justify-between px-4 flex-shrink-0 w-full overflow-hidden border-b"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex-1 flex justify-center">
                  <img
                    src="/HungerFree.svg"
                    className="h-16 w-auto object-contain"
                    alt="HungerFree Logo"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <NavContent inDrawer onNavigate={() => setMobileOpen(false)} />
              </div>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VolunteerSidebar;
