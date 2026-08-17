import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";

interface LoaderProps {
  text?: string;
  minHeight?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  text = "Loading...", 
  minHeight = "60vh" 
}) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/animation_loader/Bag Handling1.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading Lottie animation:", err));
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center w-full gap-4"
      style={{ minHeight }}
    >
      {animationData ? (
        <div className="w-56 h-56 flex items-center justify-center">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            autoplay={true} 
            style={{ width: "100%", height: "100%" }} 
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      )}
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse mt-2">
        {text}
      </span>
    </div>
  );
};
