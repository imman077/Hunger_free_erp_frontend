import React, { useState } from "react";
import { ArrowRight, Check, Building2, Eye, EyeOff } from "lucide-react";
import { useAuthApiStore } from "../store/auth_store";

// ─── AuthInput Component ───────────────────────────────────────────────────
interface AuthInputProps {
  label: string;
  name?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-black uppercase tracking-[0.15em]"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3.5 text-sm font-medium rounded-sm border transition-all duration-200 outline-none placeholder:text-[var(--text-muted)] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Role Config ────────────────────────────────────────────────────────────
type Role = "donor" | "ngo" | "volunteer" | "admin";

const roleConfig: Record<
  Role,
  {
    label: string;
    emoji: string;
    tagline: string;
    redirectTo: string;
    color: string;
  }
> = {
  donor: {
    label: "Donor",
    emoji: "💚",
    tagline: "Make an impact with every contribution",
    redirectTo: "/donor/dashboard",
    color: "#22c55e",
  },
  ngo: {
    label: "NGO",
    emoji: "🏛️",
    tagline: "Coordinate food relief at scale",
    redirectTo: "/ngo/dashboard",
    color: "#22c55e",
  },
  volunteer: {
    label: "Volunteer",
    emoji: "🚴",
    tagline: "Drive change one delivery at a time",
    redirectTo: "/volunteer/dashboard",
    color: "#22c55e",
  },
  admin: {
    label: "Admin",
    emoji: "⚙️",
    tagline: "Manage the entire HungerFree network",
    redirectTo: "/admin/dashboard",
    color: "#22c55e",
  },
};

// ─── AuthPage Component ──────────────────────────────────────────────────────
export const AuthPage = () => {
  const [activeRole, setActiveRole] = useState<Role>("donor");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Controlled inputs state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { isLoading } = useAuthApiStore();

  return (
    <div
      className="h-screen w-screen flex overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ── Left Panel (decorative) ── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[#22c55e]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#22c55e]/5 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <img src="/HungerFree.svg" className="h-14 w-auto" alt="HungerFree" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="mb-10">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-black uppercase tracking-[0.2em] mb-6"
              style={{
                borderColor: "rgba(34,197,94,0.3)",
                backgroundColor: "rgba(34,197,94,0.05)",
                color: "#22c55e",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Hunger Free ERP
            </span>
            <h1
              className="text-5xl xl:text-6xl font-black tracking-tighter leading-[1.05] uppercase mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Fight Hunger,
              <br />
              <span className="text-[#22c55e]">Feed Lives.</span>
            </h1>
            <p
              className="text-base font-medium leading-relaxed max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              A unified platform connecting donors, NGOs, and volunteers to
              eliminate food insecurity across communities.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-col gap-3">
            {[
              "Real-time donation tracking",
              "Multi-role access control",
              "NGO & volunteer coordination",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-sm bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-[#22c55e]" strokeWidth={3} />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stat strip */}
        <div
          className="relative z-10 flex items-center gap-8 pt-8 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          {[
            { value: "12K+", label: "Meals Delivered" },
            { value: "340+", label: "NGO Partners" },
            { value: "5K+", label: "Volunteers" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span
                className="text-2xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {s.value}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src="/HungerFree.svg" className="h-10 w-auto" alt="HungerFree" />
        </div>

        <div className="w-full max-w-[400px] flex flex-col justify-center h-full">
          {/* Header */}
          <div className="mb-4">
            <h2
              className="text-2xl font-black tracking-tighter uppercase leading-tight mb-0.5"
              style={{ color: "var(--text-primary)" }}
            >
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p
              className="text-[11px] font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              {activeTab === "login"
                ? "Sign in to your portal"
                : "Join the HungerFree network"}
            </p>
          </div>

          {/* ─── Role Selector ─── */}
          <div className="mb-4">
            <p
              className="text-[8px] font-black uppercase tracking-[0.2em] mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Select your role
            </p>
            <div
              className="grid grid-cols-4 gap-1 p-1 rounded-sm border"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const isActive = activeRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setActiveRole(r)}
                    className="flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-sm transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? "var(--bg-primary)"
                        : "transparent",
                      border: isActive
                        ? "1px solid var(--border-color)"
                        : "1px solid transparent",
                    }}
                  >
                    <span className="text-lg leading-none">
                      {roleConfig[r].emoji}
                    </span>
                    <span
                      className="text-[8px] font-black uppercase tracking-widest leading-none"
                      style={{
                        color: isActive ? "#22c55e" : "var(--text-muted)",
                      }}
                    >
                      {roleConfig[r].label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Hidden Input to submit the role in FormData */}
            <input type="hidden" name="role" value={activeRole} />
          </div>

          {/* ─── Tab Switch ─── */}
          <div
            className="flex gap-1 p-1 rounded-sm border mb-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 text-[9px] font-black uppercase tracking-[0.15em] rounded-sm transition-all duration-200"
                style={{
                  backgroundColor:
                    activeTab === tab ? "var(--bg-primary)" : "transparent",
                  border:
                    activeTab === tab
                      ? "1px solid var(--border-color)"
                      : "1px solid transparent",
                  color: activeTab === tab ? "#22c55e" : "var(--text-muted)",
                }}
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* ─── Form / Signup Message ─── */}
          {activeTab === "login" ? (
            <div className="flex flex-col gap-4">
              <AuthInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={setLoginEmail}
              />

              <AuthInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={setLoginPassword}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="rememberMe" />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-[#22c55e] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full flex items-center justify-center gap-2.5 py-4 rounded-sm text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#22c55e" }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              className="relative overflow-hidden px-6 py-6 rounded-sm border flex flex-col gap-4 animate-in fade-in zoom-in-98 duration-500"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              {/* Icon & Heading */}
              <div className="flex flex-col items-center text-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20 shadow-[0_4px_12px_-4px_rgba(34,197,94,0.3)]">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3
                    className="text-lg font-black uppercase tracking-tight mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Create an Account
                  </h3>
                  <p
                    className="text-[10px] font-semibold leading-relaxed max-w-[260px] mx-auto"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    To join us, please head over to our main website to fill in
                    your details and upload your documents.
                  </p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="flex flex-col gap-2 py-3 border-y border-dashed border-[var(--border-color)]">
                {[
                  "See what we do",
                  "Upload your documents",
                  "Register in 2 minutes",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#22c55e]/10 flex items-center justify-center shrink-0">
                      <Check
                        size={8}
                        className="text-[#22c55e]"
                        strokeWidth={4}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex flex-col gap-2 relative z-10">
                <a
                  href="https://hungerfree-showcase.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-sm text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ backgroundColor: "#22c55e", color: "white" }}
                >
                  Go to Signup Website
                  <ArrowRight size={14} strokeWidth={2.5} />
                </a>
                <p className="text-center text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  Please have your documents ready
                </p>
              </div>
            </div>
          )}

          {/* ─── Divider ─── */}
          <div className="flex items-center gap-3 my-4">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border-color)" }}
            />
            <span
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border-color)" }}
            />
          </div>

          {/* ─── Google SSO ─── */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-sm border text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:border-[#22c55e]/40 active:scale-[0.98]"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};
