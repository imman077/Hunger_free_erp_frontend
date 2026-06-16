import React from "react";
import { User, Shield, Check } from "lucide-react";

export const AccountProfile: React.FC = () => {
  return (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center border-2 border-dashed border-[#22c55e]/30">
          <User size={32} className="text-[#22c55e]" />
        </div>
        <div className="text-start">
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
  );
};

export const SecurityAccess: React.FC = () => {
  return (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start gap-4 text-start">
          <Shield className="text-amber-500 shrink-0 mt-1" size={20} />
          <div>
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
  );
};

export const NotificationSettings: React.FC = () => {
  return (
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
  );
};

export const AppearanceSettings: React.FC = () => {
  return (
    <section className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {['Default Light', 'Sleek Dark', 'System Auto'].map((theme, i) => (
          <div key={theme} className={`relative p-4 rounded-xl border-2 cursor-pointer group transition-all text-start ${i === 0 ? 'border-[#22c55e] bg-[#22c55e]/5' : 'border-[var(--border-color)] opacity-60 hover:opacity-100'}`}>
            <div className={`w-full h-16 rounded-md mb-3 ${i === 1 ? 'bg-slate-900' : 'bg-white border'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-[#22c55e]' : 'text-[var(--text-muted)]'}`}>{theme}</span>
            {i === 0 && <Check size={14} className="absolute top-2 right-2 text-[#22c55e]" />}
          </div>
        ))}
      </div>
    </section>
  );
};
