import {
  Trophy,
  Shield,
  Zap,
  ChevronLeft,
  Sparkles,
  Award,
  TrendingUp,
  Building2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NGOBenefits = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Beginner",
      points: "0 - 1,000",
      bonus: 0,
      color: "from-slate-400 to-slate-500",
      icon: <Sparkles className="text-slate-400" size={32} />,
      perks: [
        "Apply for basic grants",
        "See your stats easily",
        "Chat with our team",
        "Track how much you help",
      ],
    },
    {
      name: "Partner",
      points: "1,001 - 5,000",
      bonus: 5,
      color: "from-emerald-500 to-emerald-600",
      icon: <Building2 className="text-emerald-500" size={32} />,
      perks: [
        "Verified 'Partner' badge",
        "Get 5% extra grant money",
        "We're here for you 24/7",
        "Your requests handled first",
      ],
    },
    {
      name: "Elite",
      points: "5,001 - 15,000",
      bonus: 15,
      color: "from-blue-500 to-blue-600",
      icon: <Shield className="text-blue-500" size={32} />,
      perks: [
        "Elite member status",
        "Get 15% extra grant money",
        "Show up on the app home",
        "Money for health camps",
      ],
    },
    {
      name: "Master",
      points: "15,001 - 35,000",
      bonus: 30,
      color: "from-purple-500 to-purple-600",
      icon: <Zap className="text-purple-500" size={32} />,
      perks: [
        "Official 'Master' license",
        "Get 30% extra grant money",
        "Apply for Mega Grants",
        "Your own support person",
      ],
    },
    {
      name: "Legend",
      points: "35,001 - 75,000",
      bonus: 50,
      color: "from-amber-500 to-amber-600",
      icon: <Award className="text-amber-500" size={32} />,
      perks: [
        "'Legend' member status",
        "Get 50% extra grant money",
        "Special tech grants",
        "Go to national summits",
      ],
    },
    {
      name: "Titan",
      points: "75,001+",
      bonus: 75,
      color: "from-red-500 to-red-600",
      icon: <Trophy className="text-red-500" size={32} />,
      perks: [
        "Carbon Titan reward",
        "Get 75% extra grant money",
        "Join the Global Council",
        "Partner with big brands",
        "Special lifetime trophy",
      ],
    },
  ];

  const [previewTier, setPreviewTier] = useState<string>("Titan");

  return (
    <div
      className="p-6 md:p-10 min-h-screen space-y-10 max-w-[1600px] mx-auto"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="space-y-6">
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors group -ml-1"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back to Rewards
            </span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
            <div className="space-y-1 text-left">
              <h1
                className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                NGO Benefits
              </h1>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#22c55e]">
                Unlock bigger help as you help others
              </p>
            </div>

            <div
              className="px-8 py-6 border rounded-sm flex items-center gap-6"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="text-start">
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Highest Level
                </p>
                <h4
                  className="text-xl font-black uppercase"
                  style={{ color: "var(--text-primary)" }}
                >
                  Titan
                </h4>
              </div>
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center border"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.08)",
                  borderColor: "rgba(34, 197, 94, 0.2)",
                  color: "#22c55e",
                }}
              >
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Points System Info Section */}
      <div
        className="border rounded-sm p-8 flex flex-col lg:flex-row items-center justify-between gap-10"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="space-y-3 max-w-md w-full text-left">
          <h2
            className="text-2xl font-black uppercase tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {previewTier} Level Benefits
          </h2>
          <p
            className="text-sm font-medium leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {previewTier === "Beginner"
              ? "Start helping people and earn points for every donation you receive."
              : `Get a permanent ${tiers.find((t) => t.name === previewTier)?.bonus}% extra money for your grants as a ${previewTier} member.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {[
            { label: "Donation Received", base: 100 },
            { label: "Person Helped", base: 50 },
            { label: "Weekly Update", base: 500 },
          ].map((item, idx) => {
            const bonusPercent =
              tiers.find((t) => t.name === previewTier)?.bonus || 0;
            const multipliedPoints = Math.floor(
              item.base * (1 + bonusPercent / 100),
            );

            return (
              <div
                key={idx}
                className="flex-1 rounded-sm p-5 min-w-[200px] border"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <p
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.label}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-black tabular-nums ${previewTier !== "Beginner" ? "text-emerald-600" : "text-slate-900"}`}
                  >
                    {multipliedPoints}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    PTS
                  </span>
                </div>
                {bonusPercent > 0 && (
                  <p className="text-[9px] font-black text-emerald-600/70 uppercase tracking-tighter mt-1">
                    +{bonusPercent}% {previewTier} Payout
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 text-left">
        {tiers.map((tier, idx) => (
          <div
            key={tier.name}
            onClick={() => setPreviewTier(tier.name)}
            className="cursor-pointer border hover:border-[#22c55e]/30 rounded-sm p-8 transition-all duration-200 relative overflow-hidden group shadow-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Background Decorative Element */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tier.color} opacity-[0.03] rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110`}
            />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between">
                <div
                  className="p-4 rounded-sm border"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {tier.icon}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
                    Target
                  </p>
                  <p
                    className="text-sm font-black tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {tier.points} PTS
                  </p>
                </div>
              </div>

              <div className="space-y-1 mt-6">
                <h3
                  className="text-2xl font-black uppercase tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tier.name}
                </h3>
                <div
                  className={`h-1 w-12 bg-gradient-to-r ${tier.color} rounded-full`}
                />
              </div>

              <div className="pt-6 mt-8 border-t border-slate-50">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${tier.color}`}
                  >
                    +{tier.bonus}%
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    More Funding
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 mt-2 leading-tight">
                  Unlock permanent status and get your digital badge.
                </p>
              </div>
            </div>

            {/* Tier Rank Indicator */}
            <div className="absolute bottom-6 right-8 text-[40px] font-black opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
              0{idx + 1}
            </div>
          </div>
        ))}

        <div className="bg-slate-900 border border-slate-800 rounded-sm p-8 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
            <Users size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              Global Council
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              For our top performing NGOs
            </p>
          </div>
          <p className="text-xs font-bold text-slate-400 max-w-[200px]">
            Help us decide how we grow and help more people.
          </p>
          <div className="px-4 py-2 border border-slate-700 rounded-sm">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              By Invitation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOBenefits;
