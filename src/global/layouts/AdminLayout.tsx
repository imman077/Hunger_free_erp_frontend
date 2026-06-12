"use client";

import React from "react";
import Header from "../components/Header";
import SidebarIcons from "../components/Sidebar";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { Outlet } from "react-router-dom";

const AdminLayoutContent: React.FC = () => {
  const { expanded } = useSidebar();

  return (
    <>
      <Header />
      <SidebarIcons />

      <main
        className={
          "fixed top-16 md:top-20 bottom-0 right-0 no-scrollbar transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-auto " +
          (expanded ? "left-0 md:left-[260px]" : "left-0 md:left-[70px]")
        }
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <section className="p-0">
          <Outlet />
        </section>
      </main>
    </>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
