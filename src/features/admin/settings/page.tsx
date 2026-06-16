import React, { useState } from "react";
import { User, Shield, Bell, Monitor, Save, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  AccountProfile,
  SecurityAccess,
  NotificationSettings,
  AppearanceSettings,
} from "./components/settings_components";

type SettingTab = "profile" | "security" | "notifications" | "appearance";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>("profile");

  const tabs: { id: SettingTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Account Profile", icon: <User size={18} /> },
    { id: "security", label: "Security & Access", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Monitor size={18} /> },
  ];

  const handleSave = () => {
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="p-4 sm:p-8 w-full mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-700 font-inter max-w-[1200px]">
      <header className="text-start">
        <h1
          className="text-3xl sm:text-4xl font-black tracking-tight uppercase"
          style={{ color: "var(--text-primary)" }}
        >
          Admin Settings
        </h1>
        <p
          className="font-semibold mt-2 text-sm sm:text-base opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          Configure your administrative experience and security.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#22c55e]/10 text-[#22c55e] font-bold border border-[#22c55e]/20"
                  : "text-slate-500 hover:bg-slate-500/5 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span className="text-sm">{tab.label}</span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-transform duration-300 ${
                  activeTab === tab.id ? "rotate-90 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main
          className="lg:col-span-9 border rounded-xl overflow-hidden shadow-sm shadow-black/5"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="p-6 sm:p-8 space-y-8">
            {activeTab === "profile" && <AccountProfile />}
            {activeTab === "security" && <SecurityAccess />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "appearance" && <AppearanceSettings />}

            {/* Footer Actions */}
            <div className="pt-8 border-t border-[var(--border-color)] flex justify-end gap-3">
              <button className="px-6 py-3 rounded-lg text-[11px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Discard</button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[#22c55e] text-white rounded-lg text-[11px] font-black uppercase tracking-[0.15em] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
              >
                <Save size={16} />
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
