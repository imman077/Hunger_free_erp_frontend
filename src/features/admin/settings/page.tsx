import React, { useState } from "react";
import { User, Shield, Bell, Monitor, Save, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

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
            {activeTab === "profile" && (
              <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center border-2 border-dashed border-[#22c55e]/30">
                    <User size={32} className="text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Admin Avatar</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#22c55e] mt-1 hover:underline">Change Photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]">
                  <div className="space-y-1.5 flex flex-col items-start">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="System Admin"
                      className="w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] border-[var(--border-color)] text-sm font-semibold outline-none focus:border-[#22c55e] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col items-start">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Admin Email</label>
                    <input 
                      type="email" 
                      defaultValue="admin@hungerfree.org"
                      className="w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] border-[var(--border-color)] text-sm font-semibold outline-none focus:border-[#22c55e] transition-colors"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab === "security" && (
              <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                    <Shield className="text-amber-500 shrink-0 mt-1" size={20} />
                    <div className="text-start">
                      <h4 className="text-sm font-black text-amber-600 uppercase tracking-tight">Security Notice</h4>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-1">Changing your password will log you out from all other active sessions across your devices.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                     <div className="space-y-1.5 flex flex-col items-start">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] border-[var(--border-color)] text-sm font-semibold outline-none focus:border-[#22c55e] transition-colors"/>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 flex flex-col items-start">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">New Password</label>
                           <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] border-[var(--border-color)] text-sm font-semibold outline-none focus:border-[#22c55e] transition-colors"/>
                        </div>
                        <div className="space-y-1.5 flex flex-col items-start">
                           <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Confirm New Password</label>
                           <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] border-[var(--border-color)] text-sm font-semibold outline-none focus:border-[#22c55e] transition-colors"/>
                        </div>
                     </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "notifications" && (
                <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="divide-y divide-[var(--border-color)]">
                        {[
                            { title: "New NGO Registration", desc: "Get notified when a new NGO applies for membership.", enabled: true },
                            { title: "Point Redemption Requests", desc: "Alerts for new pending reward claims.", enabled: true },
                            { title: "System Alerts", desc: "Critical system errors or storage warnings.", enabled: false },
                            { title: "Newsletter & Updates", desc: "Receive internal updates about the ERP progress.", enabled: false }
                        ].map((item, i) => (
                            <div key={i} className="py-4 flex items-center justify-between gap-4">
                                <div className="text-start">
                                    <h4 className="text-sm font-black text-[var(--text-primary)] tracking-tight">{item.title}</h4>
                                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">{item.desc}</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${item.enabled ? 'bg-[#22c55e]' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${item.enabled ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {activeTab === "appearance" && (
                <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {['Default Light', 'Sleek Dark', 'System Auto'].map((theme, i) => (
                             <div key={theme} className={`relative p-4 rounded-xl border-2 cursor-pointer group transition-all ${i === 0 ? 'border-[#22c55e] bg-[#22c55e]/5' : 'border-[var(--border-color)] opacity-60 hover:opacity-100'}`}>
                                <div className={`w-full h-16 rounded-md mb-3 ${i === 1 ? 'bg-slate-900' : 'bg-white border'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-[#22c55e]' : 'text-[var(--text-muted)]'}`}>{theme}</span>
                                {i === 0 && <Check size={14} className="absolute top-2 right-2 text-[#22c55e]" />}
                             </div>
                        ))}
                    </div>
                </section>
            )}

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
