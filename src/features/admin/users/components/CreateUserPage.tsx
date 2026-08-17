import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Heart, Sparkles } from "lucide-react";
import CreateDonorPage from "./CreateDonorPage";
import CreateNgoPage from "./CreateNgoPage";
import CreateVolunteerPage from "./CreateVolunteerPage";

type UserRoleTab = "donor" | "ngo" | "volunteer";

export const CreateUserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const typeParam = searchParams.get("type")?.toLowerCase();
  const initialTab: UserRoleTab =
    typeParam === "ngo" ? "ngo" : typeParam === "volunteer" ? "volunteer" : "donor";

  const [activeTab, setActiveTab] = useState<UserRoleTab>(initialTab);

  useEffect(() => {
    if (typeParam && (typeParam === "donor" || typeParam === "ngo" || typeParam === "volunteer")) {
      setActiveTab(typeParam as UserRoleTab);
    }
  }, [typeParam]);

  const handleTabChange = (tab: UserRoleTab) => {
    setActiveTab(tab);
    setSearchParams({ type: tab });
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Top Header Bar with Tab Switcher */}
      <div
        className="sticky top-0 z-40 w-full border-b transition-all backdrop-blur-md px-4 md:px-8 py-4"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-primary), transparent 15%)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-7xl mx-auto">
          {/* Left Title & Back Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
              title="Back to User Management"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Create New Account
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                  Admin Portal
                </span>
              </div>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mt-0.5 opacity-60"
                style={{ color: "var(--text-secondary)" }}
              >
                Register Donors, NGO Partners, or Delivery Volunteers
              </p>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div
            className="flex items-center gap-1 p-1 rounded-2xl border shrink-0 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <button
              type="button"
              onClick={() => handleTabChange("donor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "donor"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10 border border-emerald-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Heart size={15} className={activeTab === "donor" ? "text-emerald-500" : ""} />
              <span>Donor Form</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("ngo")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "ngo"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Building2 size={15} className={activeTab === "ngo" ? "text-indigo-500" : ""} />
              <span>NGO Partner Form</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("volunteer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "volunteer"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-md shadow-amber-500/10 border border-amber-500/20"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <User size={15} className={activeTab === "volunteer" ? "text-amber-500" : ""} />
              <span>Volunteer Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 w-full">
        {activeTab === "donor" && <CreateDonorPage />}
        {activeTab === "ngo" && <CreateNgoPage />}
        {activeTab === "volunteer" && <CreateVolunteerPage />}
      </div>
    </div>
  );
};

export default CreateUserPage;
