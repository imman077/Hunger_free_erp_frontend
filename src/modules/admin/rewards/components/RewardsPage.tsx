import { Outlet } from "react-router-dom";

const RewardsPage: React.FC = () => {
  return (
    <div
      className="p-3 sm:p-4 lg:p-5 w-full mx-auto animate-in slide-in-from-bottom-4 duration-700 text-start min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="transition-all duration-500">
        <Outlet />  
      </div>
    </div>
  ); 
};

export default RewardsPage;
