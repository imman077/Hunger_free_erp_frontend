import React, { useState } from "react";
import { Icon } from "./reusable-components/Icon";
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
      className={`group relative flex items-center transition-all duration-300 cursor-pointer mb-2 px-4 py-2.5 rounded-2xl
        ${
          (isActive || isSubItemActive) && expanded
            ? "bg-emerald-50 text-emerald-600 font-bold"
            : expanded
              ? "text-slate-600 hover:bg-slate-50 hover:text-emerald-500"
              : isActive || isSubItemActive
                ? "w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl justify-center mx-auto"
                : "w-12 h-12 text-slate-400 hover:bg-slate-50 hover:text-emerald-500 rounded-2xl justify-center mx-auto"
        }`}
      onClick={handleClick}
    >
      <div className={`flex items-center justify-center shrink-0 ${expanded ? "w-6 h-6" : ""}`}>
        <Icon
          name={
            typeof icon === "string"
              ? icon
              : (icon as any).props.name || label.toLowerCase()
          }
          className={`w-5 h-5 transition-all duration-300 ${
            isActive || isSubItemActive
              ? "text-emerald-600 opacity-100"
              : "opacity-40 group-hover:opacity-100"
          }`}
        />
      </div>
      {expanded && (
        <div className="flex items-center flex-1 ml-3 animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="text-[15px] tracking-tight">{label}</span>
          {subItems && (
            <Icon
              name="chevron-down"
              className={`w-4 h-4 transition-transform duration-300 ml-auto ${isOpen ? "rotate-180" : "opacity-40"}`}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full relative">
      {to && !subItems ? (
        <Link to={to} onClick={onNavigate}>
          {content}
        </Link>
      ) : (
        content
      )}

      {subItems && expanded && isOpen && (
        <div className="relative ml-[35px] mt-1 space-y-1">
          {/* Vertical Connector Line */}
          <div
            className="absolute left-0 top-[-15px] bottom-4 w-[1px] bg-slate-200"
          />

          {subItems.map((item) => {
            const isSubActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={`relative flex items-center pl-6 pr-4 py-2 text-[14px] transition-all duration-300 rounded-xl
                  ${
                    isSubActive
                      ? "text-emerald-600 font-semibold bg-emerald-50/50"
                      : "text-slate-400 hover:text-emerald-600 hover:bg-slate-50/30"
                  }`}
              >
                {/* Horizontal Tick for Connector */}
                <div
                  className="absolute left-0 w-4 h-[1px] bg-slate-200 top-1/2 -translate-y-1/2"
                />
                <span className="truncate">{item.label}</span>
                {isSubActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}

        </div>
      )}
    </div>
  );
};


const DonorSidebar: React.FC = () => {
  const { expanded, setExpanded, mobileOpen, setMobileOpen } = useSidebar();
  const { onOpenChange } = useDisclosure();

  const donationsSubItems: SubItem[] = [
    { label: "My Donations", to: "/donor/donations" },
    { label: "Create Donation", to: "/donor/donations/create" },
    { label: "NGO Posts", to: "/donor/donations/marketplace" },
  ];

  const rewardsSubItems: SubItem[] = [
    { label: "My Rewards", to: "/donor/rewards" },
    { label: "Benefits", to: "/donor/rewards/benefits" },
    { label: "Lucky Prize", to: "/donor/lucky-prize" },
  ];

  const profileSubItems: SubItem[] = [
    { label: "My Profile", to: "/donor/profile" },
    { label: "Payment Methods", to: "/donor/profile/payments" },
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
        className={`flex-1 overflow-y-auto no-scrollbar py-4 ${
          inDrawer ? "px-6" : expanded ? "px-6" : "px-3"
        }`}
      >
        <div className="space-y-2">
          <SidebarItem
            icon={<Icon name="dashboard" />}
            label="Dashboard"
            to="/donor/dashboard"
            expanded={inDrawer ? true : expanded}
            onNavigate={onNavigate}
          />
          <SidebarItem
            icon={<Icon name="donations" />}
            label="Donations"
            expanded={inDrawer ? true : expanded}
            subItems={donationsSubItems}
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
            icon={<Icon name="user" />}
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
          backgroundColor: "white",
          borderRight: "1px solid #f1f5f9",
        }}
      >
        <div 
          className="h-20 flex items-center justify-center flex-shrink-0 border-b transition-all duration-300 w-full overflow-hidden"
          style={{ 
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)" 
          }}
        >
          {expanded ? (
            <div
              className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 w-full h-full"
              onClick={() => setExpanded(!expanded)}
            >
              <img
                src="/project_logo1.png"
                className="w-full h-full object-contain px-1"
                alt="HungerFree Logo"
              />
            </div>
          ) : (


            <div className="flex justify-center w-full">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 transition-all hover:bg-emerald-50 hover:border-emerald-100 group"
              >
                <Icon name="menu" className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
              </button>
            </div>
          )}
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
                className="h-16 flex items-center justify-center flex-shrink-0 w-full overflow-hidden border-b"
                style={{ 
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)" 
                }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    src="/project_logo1.png"
                    className="w-full h-full object-contain px-1"
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

export default DonorSidebar;
