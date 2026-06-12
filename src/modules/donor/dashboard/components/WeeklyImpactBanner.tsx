import { motion } from "framer-motion";
import { Utensils, Leaf, Users, Heart } from "lucide-react";

interface ImpactStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const ImpactStat = ({ icon, value, label, color }: ImpactStatProps) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className="bg-white p-3 px-4 rounded-xl flex items-center gap-3 shadow-[0_4px_15px_-10px_rgba(0,0,0,0.08)] border border-slate-50 min-w-[150px] h-[72px]"
  >
    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
      <div className="scale-[0.8] flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div className="flex flex-col justify-center gap-0.5">
      <div className="flex items-baseline gap-1 leading-none">
        <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">{value.split(' ')[0]}</span>
        {value.includes(' ') && <span className="text-[10px] font-black text-slate-900 leading-none opacity-80">{value.split(' ')[1]}</span>}
      </div>
      <span className="text-[7.5px] font-black uppercase tracking-[0.1em] text-slate-400 leading-tight mt-1">{label}</span>
    </div>
  </motion.div>
);

const WeeklyImpactBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-2xl p-5 md:p-6 overflow-hidden border border-[#eef7f1] bg-[#f9fdfb] mb-4"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Section: Illustration & CTA */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Illustration Container - Refined Scale */}
          <div className="relative w-44 h-32 shrink-0">
            <img 
              src="/banner2.png" 
              alt="Food Impact"
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </div>

          <div className="space-y-4 text-center md:text-left max-w-[280px]">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black tracking-tighter text-[#1a1a1a] leading-[1.1]">
                Reduce food waste. <br />
                Create a bigger impact.
              </h2>
              <p className="text-slate-400 font-black text-[9.5px] leading-tight uppercase tracking-[0.15em] opacity-80">
                Donate, support and help build a zero-hunger world.
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#00a348" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-6 py-2.5 bg-[#00b251] text-white rounded-lg font-black text-[9px] uppercase tracking-[0.25em] transition-all shadow-lg shadow-green-500/10 group"
            >
              MAKE A DONATION
              <Heart className="w-3 h-3 fill-white group-hover:scale-110 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* Right Section: Weekly Stats - Compact Grid */}
        <div className="flex flex-col gap-3 w-full lg:w-auto self-end lg:self-center">
          <p className="text-[8.5px] font-black text-[#00b251] tracking-[0.3em] uppercase ml-1 opacity-80">
            THIS WEEK'S IMPACT
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ImpactStat 
              icon={<Utensils className="w-6 h-6 text-[#00b251]" />}
              value="120"
              label="MEALS SAVED"
              color="bg-[#e8f9ee]"
            />
            <ImpactStat 
              icon={<Leaf className="w-6 h-6 text-[#00b251]" />}
              value="85 kg"
              label="FOOD RESCUED"
              color="bg-[#e8f9ee]"
            />
            <ImpactStat 
              icon={<Users className="w-6 h-6 text-[#00b251]" />}
              value="45"
              label="PEOPLE HELPED"
              color="bg-[#e8f9ee]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyImpactBanner;





