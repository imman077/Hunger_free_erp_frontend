import {
  Heart,
  Package,
  Trophy,
  Zap,
  Target,
  Award,
  Shield,
  Crown,
  Star,
  Flame,
  Globe,
  ZapOff,
  Users,
  ShieldCheck,
  Gem,
} from "lucide-react";



export const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Heart":
      return Heart;
    case "Package":
      return Package;
    case "Trophy":
      return Trophy;
    case "Zap":
      return Zap;
    case "Target":
      return Target;
    case "Award":
      return Award;
    case "Shield":
      return Shield;
    case "Crown":
      return Crown;
    case "Star":
      return Star;
    case "Flame":
      return Flame;
    case "Globe":
      return Globe;
    case "ZapOff":
      return ZapOff;
    case "Users":
      return Users;
    case "ShieldCheck":
      return ShieldCheck;
    case "Gem":
      return Gem;
    default:
      return Award;
  }
};

export const getWavyCirclePath = (cx = 28, cy = 28, r0 = 22, amp = 2.5, waves = 12) => {
  const points = [];
  const steps = 96;
  for (let i = 0; i < steps; i++) {
    const theta = (i * Math.PI * 2) / steps;
    const r = r0 + amp * Math.cos(waves * theta);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  points.push("Z");
  return points.join(" ");
};

export const getScallopedCirclePath = (cx = 28, cy = 28, rIn = 19, rArc = 6.5, waves = 12) => {
  const path = [];
  const angleStep = (Math.PI * 2) / waves;

  for (let i = 0; i < waves; i++) {
    const angleStart = (i - 0.5) * angleStep;
    const angleEnd = (i + 0.5) * angleStep;

    const xStart = cx + rIn * Math.cos(angleStart);
    const yStart = cy + rIn * Math.sin(angleStart);
    const xEnd = cx + rIn * Math.cos(angleEnd);
    const yEnd = cy + rIn * Math.sin(angleEnd);

    if (i === 0) {
      path.push(`M ${xStart.toFixed(2)} ${yStart.toFixed(2)}`);
    }
    path.push(`A ${rArc} ${rArc} 0 0 1 ${xEnd.toFixed(2)} ${yEnd.toFixed(2)}`);
  }
  path.push("Z");
  return path.join(" ");
};


