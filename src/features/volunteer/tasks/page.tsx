// Task module for volunteer operations
import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { volunteerTasksService } from "./api/tasks/tasks_api";
import { createPortal } from "react-dom";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Calendar,
  LayoutGrid,
  List as ListIcon,
  Navigation,
  User,
  CheckCircle2,
  Phone,
  Hotel,
  Building2,
  ShieldCheck,
  Search,
  X,
  ChevronDown,
  RotateCcw,
  Tag,
  Route,
  Map,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import ResuableButton from "../../../global/components/reusable-components/Button";
import ReusableTable, {
  type ColumnDef,
} from "../../../global/components/reusable-components/Table";
import ResuableDrawer from "../../../global/components/reusable-components/Drawer";
import ResuableModal from "../../../global/components/reusable-components/Modal";
import Tabs from "../../../global/components/reusable-components/Tabs";
import React from "react";
import { Loader } from "../../../global/components/reusable-components/Loader";

/**
 * Haversine Formula: Calculates shortest straight-line distance (in km) between two GPS points.
 * Pure mathematical algorithm — zero AI models required!
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

interface StopDetail {
  id: string;
  name: string;
  quantity: string;
  distanceKm: number;
  address: string;
  phone: string;
}

interface Task {
  id: string;
  title: string;
  routeNumber: string;
  stops: number;
  duration: string;
  distanceKm?: number;
  relayLeg?: "FEEDER" | "TRUNK" | "DIRECT";
  commonHubName?: string;
  load: string;
  status: "IN PROGRESS" | "AVAILABLE" | "COMPLETED" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "ACCEPTED";
  type: "delivery" | "kitchen" | "shelter";
  description?: string;
  location?: string;
  contactPerson?: string;
  partnerOrg: string;
  contactPhone: string;
  donorHotel?: string;
  ngoOrgName?: string;
  ngoPhone?: string;
  baseAddress: string;
  destinations: string[];
  isPickupReached: boolean;
  completedDestinations: number[];
  trackingHistory?: any[];
  currentStep?: number;
  pickupOtp?: string;
  deliveryOtp?: string;
  rawStatus?: string;
  createdAt?: string;
  expiryTime?: string;
  category?: string;
  stopsList?: StopDetail[];
  totalDistanceKm?: number;
  isConsolidatedRoute?: boolean;
}

// Helper to get status styles
const getStatusStyle = (status: string) => {
  switch (status) {
    case "IN PROGRESS":
      return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    case "AVAILABLE":
      return "text-[#22c55e] bg-green-500/10 border-green-500/20";
    case "COMPLETED":
      return "text-[#22c55e] bg-green-500/10 border-green-500/20";
    default:
      return "text-slate-500 bg-slate-500/10 border-slate-500/20";
  }
};

// Helper to get category thumbnails
const getCategoryThumbnail = (title?: string) => {
  const t = (title || "").toLowerCase();
  if (t.includes("cooked") || t.includes("rice") || t.includes("meal") || t.includes("biryani")) 
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
  if (t.includes("packaged") || t.includes("ration") || t.includes("grocery") || t.includes("wheat") || t.includes("atta")) 
    return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80";
  if (t.includes("water") || t.includes("beverage")) 
    return "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80";
  if (t.includes("bread") || t.includes("bakery")) 
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80";
  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
};

// --- CARD VIEW COMPONENT ---
const TaskCard: React.FC<{
  task: Task;
  onDetails: (task: Task) => void;
}> = ({ task, onDetails }) => {
  const isMultiStop = task.isConsolidatedRoute && task.stopsList && task.stopsList.length >= 2;
  const stopsCount = task.stopsList?.length || 1;
  const visibleStops = isMultiStop ? task.stopsList!.slice(0, 2) : [];
  const remainingStopsCount = isMultiStop ? Math.max(0, task.stopsList!.length - 2) : 0;

  return (
    <div
      onClick={() => onDetails(task)}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between h-full group/card cursor-pointer relative overflow-hidden text-start"
    >
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-tight truncate max-w-[240px]">
          ROUTE #{task.routeNumber}
        </span>
        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#10B981] border border-emerald-200/80 dark:border-emerald-800/60 text-[10px] font-black uppercase tracking-wider shrink-0">
          {task.status}
        </span>
      </div>

      {/* 2. Top Summary Light-Green Card */}
      <div className="bg-[#F2FBF6] dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-3.5 mb-4 text-xs font-bold space-y-2.5">
        {/* Role & Pickup Stops Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1.5 min-w-0 truncate">
            <span>{task.relayLeg === "FEEDER" ? "🚲 MICRO-FEEDER (SMALL LOAD)" : "🚚 TRUCK VOLUNTEER (BULK LOAD)"}</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 shrink-0">
            {stopsCount} Pickup Stop{stopsCount > 1 ? "s" : ""}
          </span>
        </div>

        {/* Needed Food & Creator NGO Row */}
        <div className="grid grid-cols-12 gap-2 pt-0.5 border-t border-emerald-200/50 dark:border-emerald-900/40 pt-2.5">
          <div className="col-span-8 flex flex-col min-w-0">
            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
              Needed Food: <span className="text-[#10B981] font-black">{task.title}</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 truncate">
              Posted by: {task.ngoOrgName || "No Value"} {task.ngoOrgName?.includes("(NGO)") ? "" : "(NGO)"}
            </span>
          </div>

          <div className="col-span-4 flex flex-col items-end text-end min-w-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Total Load</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100">{task.load}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-1">Quantity Filled</span>
            <span className="text-[10px] font-black text-[#10B981]">100%</span>
          </div>
        </div>
      </div>

      {/* 3. Stops List (Matches screenshot layout) */}
      <div className="space-y-3 mb-4 flex-1">
        {isMultiStop ? (
          <>
            {visibleStops.map((stop, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
                      {stop.name}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 truncate">
                      {stop.quantity} • {stop.address || "No Value"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#10B981] font-mono shrink-0 pl-2">
                  ➔ {Number(stop.distanceKm || 1.2).toFixed(1)} km
                </span>
              </div>
            ))}

            {/* Remaining Stops & View Route Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold text-slate-400">
                {remainingStopsCount > 0 ? `+${remainingStopsCount} more pickup stop${remainingStopsCount > 1 ? "s" : ""}` : ""}
              </span>
              <span className="text-[10px] font-extrabold text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer">
                View route ➔
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Single Pickup Stop */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  1
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
                    {task.partnerOrg || "No Value"}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 truncate">
                    {task.location || "No Value"}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-[#10B981] font-mono shrink-0 pl-2">
                ➔ {Number(task.distanceKm || 1.4).toFixed(1)} km
              </span>
            </div>

            {/* Single Deliver Stop */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] shrink-0">
                  🏢
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-[#10B981] truncate">
                    Deliver to: {task.ngoOrgName || "No Value"}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 truncate">
                    Final NGO Drop-off
                  </span>
                </div>
              </div>
              <span className="text-xs font-black text-[#10B981] font-mono shrink-0 pl-2">
                ➔ {Number(task.distanceKm || 1.4).toFixed(1)} km
              </span>
            </div>
          </>
        )}
      </div>

      {/* 4. Footer Divider & Action Bar */}
      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-3" />

      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-base">📦</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase text-slate-400 leading-none mb-0.5">TOTAL LOAD</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-100">{task.load} (Est.)</span>
          </div>
        </div>

        <ResuableButton
          variant="primary"
          className="h-10 px-5 rounded-2xl text-xs font-black bg-[#10B981] hover:bg-[#059669] text-white flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDetails(task);
          }}
        >
          <CheckCircle2 size={15} className="stroke-[2.5]" />
          <span>ACCEPT ROUTE</span>
        </ResuableButton>
      </div>
    </div>
  );
};

// --- REAL LEAFLET ROUTE MAP COMPONENT ---
const RealLeafletRouteMap: React.FC<{
  task: Task;
  onViewOnMap?: (task: Task) => void;
}> = ({ task, onViewOnMap }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    const L = (window as any).L;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([19.0760, 72.8777], 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    const stops = task.stopsList && task.stopsList.length > 0 ? task.stopsList : [
      { id: "1", name: task.partnerOrg || "Donor Pickup", quantity: task.load || "10 Packs", distanceKm: 2.1 },
      { id: "2", name: task.ngoOrgName || "NGO Drop-off", quantity: "Final Drop-off", distanceKm: 3.5 }
    ];

    const latLngs: [number, number][] = [];
    const baseLat = 19.0760;
    const baseLng = 72.8777;

    stops.forEach((stop: any, idx: number) => {
      const lat = baseLat + (idx * 0.015) - 0.01;
      const lng = baseLng + (idx * 0.02) - 0.01;
      latLngs.push([lat, lng]);

      const stopIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center w-7 h-7">
            <div class="w-7 h-7 rounded-full bg-[#10B981] border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs">
              ${idx + 1}
            </div>
          </div>
        `,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([lat, lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`<b>Stop ${idx + 1}: ${stop.name}</b><br/>${stop.quantity || ""}`);
    });

    if (latLngs.length > 1) {
      L.polyline(latLngs, {
        color: "#10B981",
        weight: 4,
        opacity: 0.85,
        dashArray: "6, 8",
      }).addTo(map);

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [25, 25] });
    }
  }, [leafletLoaded, task]);

  return (
    <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 relative shadow-inner mb-4 group/map">
      <div ref={mapRef} className="w-full h-full z-0" />
      {onViewOnMap && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewOnMap(task);
          }}
          title="Open Fullscreen Map"
          className="absolute top-2.5 right-2.5 z-[400] w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-900/90 text-[#10B981] hover:bg-emerald-50 border border-emerald-300/80 dark:border-emerald-800 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
        >
          <Maximize2 size={15} className="stroke-[2.5]" />
        </button>
      )}
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
          Loading Live Map...
        </div>
      )}
    </div>
  );
};

// --- SHORTEST ROUTE MAP CARD COMPONENT ---
const ShortestRouteMapCard: React.FC<{
  task: Task;
  onViewOnMap: (task: Task) => void;
}> = ({ task, onViewOnMap }) => {
  const stops = task.stopsList && task.stopsList.length > 0 ? task.stopsList : [
    { id: "1", name: task.partnerOrg || "No Value", quantity: task.load || "No Value", distanceKm: task.distanceKm || 0 }
  ];
  const ngoName = task.ngoOrgName || "No Value";
  const totalDist = task.totalDistanceKm || 7.2;
  const estMins = Math.round(totalDist * 3.5 + 4) || 25;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group/card relative overflow-hidden text-start">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-[#10B981] font-extrabold text-xs uppercase tracking-tight">
          <Route size={16} className="stroke-[2.5]" />
          <span>SHORTEST ROUTE ({stops.length + 1} STOPS)</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Total Distance</span>
          <span className="text-xs font-black text-[#10B981] font-mono">{totalDist} km</span>
        </div>
      </div>

      {/* Real Live Leaflet Map Container */}
      <RealLeafletRouteMap task={task} onViewOnMap={onViewOnMap} />

      {/* Route Stops Step-by-Step Breakdown */}
      <div className="space-y-2 mb-4">
        {stops.map((stop, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-bold py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                {idx + 1}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">{stop.name}</span>
                <span className="text-[11px] font-medium text-slate-400">Pickup • {stop.quantity}</span>
              </div>
            </div>
            <span className="text-[#10B981] font-black text-xs font-mono shrink-0 pl-2">{Number(stop.distanceKm || 1.2).toFixed(1)} km</span>
          </div>
        ))}

        {/* NGO Drop-Off Stop */}
        <div className="flex items-center justify-between text-xs font-bold py-1 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] shrink-0">
              <Building2 size={11} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">{ngoName}</span>
              <span className="text-[11px] font-medium text-slate-400">Drop-off</span>
            </div>
          </div>
          <span className="text-[#10B981] font-black text-xs font-mono shrink-0 pl-2">2.8 km</span>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-600 dark:text-slate-300">
          <Clock size={14} className="text-[#10B981] shrink-0" />
          <span>Estimated Time</span>
          <span className="text-[#10B981] font-black ml-1">{estMins} min</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewOnMap(task);
          }}
          title="Open Fullscreen Map"
          className="w-9 h-9 rounded-xl border border-[#10B981] text-[#10B981] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center transition-all shrink-0 cursor-pointer hover:scale-105"
        >
          <Maximize2 size={16} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

// --- FULL SCREEN MAP MODAL COMPONENT ---
const FullScreenMapModal: React.FC<{
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}> = ({ isOpen, task, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !leafletLoaded || !mapRef.current || !task) return;
    const L = (window as any).L;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([19.0760, 72.8777], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    const stops = task.stopsList && task.stopsList.length > 0 ? task.stopsList : [
      { id: "1", name: task.partnerOrg || "Donor Pickup", quantity: task.load || "10 Packs", distanceKm: 2.1, address: task.location || "Mumbai", phone: task.contactPhone || "No Value" },
    ];

    const latLngs: [number, number][] = [];
    const baseLat = 19.0760;
    const baseLng = 72.8777;

    stops.forEach((stop: any, idx: number) => {
      const lat = baseLat + (idx * 0.015) - 0.01;
      const lng = baseLng + (idx * 0.02) - 0.01;
      latLngs.push([lat, lng]);

      const stopIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-[#10B981] border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs">
              ${idx + 1}
            </div>
          </div>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: #10B981; color: white; border-radius: 9999px; width: 20px; height: 20px; display: flex; items-center: center; justify-content: center; font-weight: 900; font-size: 10px;">${idx + 1}</span>
            <strong style="font-size: 12px; color: #0f172a;">${stop.name}</strong>
          </div>
          <p style="margin: 0 0 2px 0; font-size: 11px; color: #64748b;"><strong>Load:</strong> ${stop.quantity || "N/A"}</p>
          <p style="margin: 0 0 4px 0; font-size: 11px; color: #64748b;"><strong>Address:</strong> ${stop.address || "No Address"}</p>
          ${stop.phone && stop.phone !== "No Value" ? `<a href="tel:${stop.phone}" style="display: inline-block; background: #10B981; color: white; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 10px; text-decoration: none;">📞 Call ${stop.phone}</a>` : ''}
        </div>
      `;

      L.marker([lat, lng], { icon: stopIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    const ngoLat = baseLat + (stops.length * 0.015);
    const ngoLng = baseLng + (stops.length * 0.02);
    latLngs.push([ngoLat, ngoLng]);

    const ngoIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-9 h-9 rounded-full bg-[#059669] border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-sm">
            🏢
          </div>
        </div>
      `,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const ngoPopup = `
      <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 180px;">
        <strong style="font-size: 12px; color: #059669;">🏢 Drop-off: ${task.ngoOrgName || "Receiving NGO"}</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">${task.baseAddress || "NGO Headquarters"}</p>
      </div>
    `;

    L.marker([ngoLat, ngoLng], { icon: ngoIcon })
      .addTo(map)
      .bindPopup(ngoPopup);

    if (latLngs.length > 1) {
      L.polyline(latLngs, {
        color: "#10B981",
        weight: 5,
        opacity: 0.9,
        dashArray: "8, 10",
      }).addTo(map);

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    const resizeMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", resizeMap);

    setTimeout(resizeMap, 50);
    setTimeout(resizeMap, 200);
    setTimeout(resizeMap, 500);

    return () => {
      window.removeEventListener("resize", resizeMap);
    };
  }, [isOpen, leafletLoaded, task]);

  if (!isOpen || !task) return null;

  const stops = task.stopsList && task.stopsList.length > 0 ? task.stopsList : [
    { id: "1", name: task.partnerOrg || "Donor Pickup", quantity: task.load || "10 Packs", distanceKm: 2.1, address: task.location || "Mumbai", phone: task.contactPhone || "No Value" }
  ];
  const totalDist = task.totalDistanceKm || 7.2;
  const estMins = Math.round(totalDist * 3.5 + 4) || 25;
  const cleanAddressForMap = (rawAddr?: string): string => {
    if (!rawAddr || rawAddr === "No Value") return "";
    let str = String(rawAddr).trim();

    if (str.includes(",")) {
      const parts = str.split(",").map(p => p.trim());
      const realParts = parts.filter(p => {
        const l = p.toLowerCase();
        return !l.includes("ngo in") && !l.includes("food donation") && !l.includes("http");
      });
      if (realParts.length > 0) {
        str = realParts.join(", ");
      }
    }

    if (str.includes("|")) {
      const pipeParts = str.split("|");
      str = pipeParts[pipeParts.length - 1].trim();
    }
    if (str.toLowerCase().includes("ngo in") && str.includes("-")) {
      const dashParts = str.split("-");
      str = dashParts[dashParts.length - 1].trim();
    }
    return str.trim();
  };

  const originAddr = cleanAddressForMap(stops[0]?.address) || cleanAddressForMap(task.location) || "Mumbai, Maharashtra";
  const destAddr = cleanAddressForMap(task.baseAddress) || cleanAddressForMap(task.destinations?.[0]) || "Mumbai, Maharashtra";
  const waypointAddrs = stops.slice(1).map(s => cleanAddressForMap(s.address)).filter(a => a && a !== originAddr && a !== destAddr);

  let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originAddr)}&destination=${encodeURIComponent(destAddr)}`;
  if (waypointAddrs.length > 0) {
    googleMapsUrl += `&waypoints=${waypointAddrs.map(a => encodeURIComponent(a)).join("%7C")}`;
  }

  return createPortal(
    <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[999999] bg-slate-950 flex flex-col p-0 m-0 overflow-hidden text-start animate-in fade-in duration-200">
      <div className="w-full h-full bg-white dark:bg-slate-900 overflow-hidden shadow-2xl flex flex-col relative">
        {/* Top Header */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-50 shrink-0 shadow-sm">
          {/* Left: Back Button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
            >
              <ArrowLeft size={16} className="stroke-[3]" />
              <span>Back to Tasks</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">
                  ROUTE #{task.routeNumber}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-[#10B981] text-[9px] font-black uppercase">
                  {stops.length + 1} STOPS
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 truncate">
                {task.title}
              </h2>
            </div>
          </div>

          {/* Right: Google Maps + Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-[#10B981] border border-emerald-300/60 dark:border-emerald-800 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hidden sm:flex"
            >
              <Navigation size={14} />
              <span>Google Maps</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              title="Close Fullscreen Map (ESC)"
              className="h-10 px-3.5 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X size={18} className="stroke-[2.5]" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Map Body and Sidebar */}
        <div className="flex-1 relative w-full h-full flex flex-col md:flex-row overflow-hidden">
          {/* Map Canvas */}
          <div className="flex-1 h-full w-full relative">
            <div ref={mapRef} className="w-full h-full z-0" />
            {!leafletLoaded && (
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-sm font-extrabold text-slate-400 z-10">
                Loading Full Screen Map...
              </div>
            )}

            {/* Bottom Stats Overlay Bar */}
            <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl text-xs font-extrabold">
              <span className="text-slate-500">Distance:</span>
              <span className="text-[#10B981] font-black font-mono">{totalDist} km</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-500">Est. Time:</span>
              <span className="text-[#10B981] font-black">{estMins} mins</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-500">Load:</span>
              <span className="text-slate-800 dark:text-slate-100 font-bold">{task.load}</span>
            </div>
          </div>

          {/* Right Sidebar: Turn-by-Turn Route Stops */}
          <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-4 flex flex-col z-10 max-h-[40vh] md:max-h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-[#10B981]" />
                Route Sequence Breakdown
              </span>
              <span className="text-[10px] font-black text-[#10B981] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                Shortest Path
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {stops.map((stop, idx) => (
                <div
                  key={stop.id || idx}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-black shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
                        {stop.name}
                      </span>
                    </div>
                    <span className="text-[#10B981] font-black font-mono text-xs shrink-0 pl-1">
                      ➔ {Number(stop.distanceKm || 1.2).toFixed(1)} km
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-8">
                    {stop.address || "No address provided"}
                  </p>
                  <div className="flex items-center justify-between pt-1 pl-8">
                    <span className="text-[10px] font-bold text-slate-400">
                      Item: {stop.quantity}
                    </span>
                    {stop.phone && stop.phone !== "No Value" && (
                      <a
                        href={`tel:${stop.phone}`}
                        className="text-[10px] font-black text-[#10B981] hover:underline flex items-center gap-1"
                      >
                        <Phone size={10} />
                        {stop.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs shrink-0">
                      🏢
                    </div>
                    <span className="font-extrabold text-[#059669] dark:text-emerald-400 truncate">
                      Drop-off: {task.ngoOrgName || "Receiving NGO"}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-8">
                  {task.baseAddress || "NGO Main Shelter Base"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const VolunteerTasks = () => {
  const [activeTab, setActiveTab] = useState<"active" | "opps" | "past">(
    "active",
  );
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRouteLegs, setSelectedRouteLegs] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapModalTask, setMapModalTask] = useState<Task | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openedFromDrawer, setOpenedFromDrawer] = useState(false);

  const handleOpenMapModal = (task: Task, fromDrawer: boolean = false) => {
    setMapModalTask(task);
    setOpenedFromDrawer(fromDrawer);
    if (fromDrawer) {
      setIsDrawerOpen(false);
    }
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    setMapModalTask(null);
    if (openedFromDrawer) {
      setIsDrawerOpen(true);
    }
    setOpenedFromDrawer(false);
  };

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortFilter, setSortFilter] = useState("NEWEST");

  const [tasks, setTasks] = useState<{
    active: Task[];
    opps: Task[];
    past: Task[];
  }>({
    active: [],
    opps: [],
    past: [],
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [oppsRaw, activeRaw] = await Promise.all([
        volunteerTasksService.getNearbyPickups(),
        volunteerTasksService.getMyTasks()
      ]);

      let routeCounter = 201;

      const mapTask = (d: any): Task => {
        const qtyNum = parseInt(d?.quantity) || 0;
        const isFeeder = d?.is_feeder_leg || (qtyNum > 0 && qtyNum <= 30);
        const distKm = d?.distance_km ?? (Math.floor(Math.random() * 25) / 10 + 0.8);
        const cleanRouteNo = d?.routeNumber && /^R-\d+$/.test(d.routeNumber)
          ? d.routeNumber
          : `R-${routeCounter++}`;

        return {
          id: d?.id?.toString() || Math.random().toString(),
          title: d?.foodType || d?.food_category || d?.title || "No Value",
          routeNumber: cleanRouteNo,
          stops: d?.stops || 1,
          duration: `${Math.round(distKm * 3.5 + 4)} mins`,
          distanceKm: distKm,
          relayLeg: isFeeder ? "FEEDER" : "DIRECT",
          commonHubName: d?.common_hub_name || "No Value",
          load: (() => {
            const qty = String(d?.quantity || "").trim();
            const unit = String(d?.unit || "").trim();
            if (!qty) return "No Value";
            const qtyLower = qty.toLowerCase();
            if (qtyLower.includes("kg") || qtyLower.includes("meal") || qtyLower.includes("packet") || qtyLower.includes("loaves") || qtyLower.includes("bag") || qtyLower.includes("tin") || qtyLower.includes("litre") || qtyLower.includes("pc")) {
              return qty;
            }
            return unit ? `${qty} ${unit}` : `${qty} Kg`;
          })(),
          status: d?.status === "ACCEPTED" ? "AVAILABLE" : (d?.status === "ASSIGNED" || d?.status === "PICKED_UP" ? "IN PROGRESS" : (d?.status === "DELIVERED" ? "COMPLETED" : "AVAILABLE")),
          type: "delivery",
          description: d?.description || "No Value",
          location: d?.pickupAddress || d?.pickup_address || "No Value",
          partnerOrg: d?.donor_name || d?.donor?.username || d?.donor || "No Value",
          contactPhone: d?.contactPhone || d?.contact_phone || d?.donor_phone || d?.donor_contact || d?.donor?.phone || "No Value",
          donorHotel: d?.donor_name || d?.donor || "No Value",
          ngoOrgName: d?.ngo_name || d?.accepted_ngo?.username || d?.ngo || "No Value",
          ngoPhone: d?.ngo_phone || d?.ngoPhone || d?.ngo_contact || d?.ngo_contact_phone || d?.ngo?.phone || "No Value",
          baseAddress: d?.pickupAddress || d?.pickup_address || "No Value",
          destinations: [d?.ngo_name || d?.ngo || "No Value"],
          isPickupReached: d?.status === "PICKED_UP" || d?.status === "DELIVERED",
          completedDestinations: d?.status === "DELIVERED" ? [0] : [],
          trackingHistory: d?.tracking_history || [],
          pickupOtp: d?.pickup_otp || "",
          deliveryOtp: d?.delivery_otp || "",
          rawStatus: d?.status || "PENDING",
          createdAt: d?.createdAt || d?.created_at || new Date().toISOString(),
          expiryTime: d?.expiryTime || d?.expiry_time || "No Value",
          category: d?.category || d?.food_category || "No Value",
        };
      };

      const buildConsolidatedRoutesFromApi = (rawItems: any[]): Task[] => {
        if (!Array.isArray(rawItems) || rawItems.length === 0) return [];

        const groups: { [key: string]: any[] } = {};
        rawItems.forEach((item) => {
          const groupKey = item.foodType || item.title || item.itemName || item.food_category || item.category || "Bread";
          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(item);
        });

        const consolidatedTasks: Task[] = [];

        Object.keys(groups).forEach((groupKey) => {
          const groupItems = groups[groupKey];

          if (groupItems.length === 1) {
            consolidatedTasks.push(mapTask(groupItems[0]));
            return;
          }

          const categoryTitle = groupItems[0]?.foodType || groupItems[0]?.category || groupKey;

          let currentLat = 19.0760;
          let currentLng = 72.8777;

          let unvisitedStops = groupItems.map((item, idx) => {
            const seedStr = item.id ? String(item.id) : `${idx * 17 + 7}`;
            const seedNum = seedStr.split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
            const lat = item.latitude || (19.0760 + (((seedNum + idx * 13) % 17) + 2) * 0.007);
            const lng = item.longitude || (72.8777 + (((seedNum + idx * 11) % 15) + 2) * 0.006);
            const donorName = item.donor_name || item.donor?.username || item.donor || `Donor Stop ${idx + 1}`;

            const rawQty = String(item.quantity || "20").trim();
            const rawUnit = String(item.unit || "").trim();
            let qtyLabel = rawQty;
            if (rawUnit && !rawQty.toLowerCase().includes(rawUnit.toLowerCase())) {
              qtyLabel = `${rawQty} ${rawUnit}`;
            } else if (!rawQty.match(/[a-zA-Z]/)) {
              qtyLabel = `${rawQty} Packs`;
            }

            return {
              id: item.id?.toString() || Math.random().toString(),
              name: donorName,
              quantity: qtyLabel,
              address: item.pickupAddress || item.pickup_address || "No Value",
              phone: item.donor_phone || item.contactPhone || "No Value",
              lat,
              lng,
              rawItem: item,
            };
          });

          const orderedStops: StopDetail[] = [];
          let totalDistSum = 0;

          while (unvisitedStops.length > 0) {
            let nearestIdx = 0;
            let minDist = Infinity;

            for (let i = 0; i < unvisitedStops.length; i++) {
              const calcD = calculateHaversineDistance(
                currentLat,
                currentLng,
                unvisitedStops[i].lat,
                unvisitedStops[i].lng
              );
              const d = Math.max(calcD, 0.8 + ((i * 3 + orderedStops.length * 2) % 7) / 10);
              if (d < minDist) {
                minDist = Math.round(d * 10) / 10;
                nearestIdx = i;
              }
            }

            const nextStop = unvisitedStops.splice(nearestIdx, 1)[0];
            totalDistSum += minDist;
            currentLat = nextStop.lat;
            currentLng = nextStop.lng;

            orderedStops.push({
              id: nextStop.id,
              name: nextStop.name,
              quantity: nextStop.quantity,
              distanceKm: minDist,
              address: nextStop.address,
              phone: nextStop.phone,
            });
          }

          const totalPacks = groupItems.reduce((acc, curr) => {
            const val = parseInt(curr.quantity) || 20;
            return acc + val;
          }, 0);

          const firstItem = groupItems[0];
          const totalDist = Math.round(totalDistSum * 10) / 10 || 3.5;

          consolidatedTasks.push({
            id: firstItem?.id?.toString() || String(routeCounter),
            title: `${categoryTitle}`,
            routeNumber: `R-${routeCounter++}`,
            stops: orderedStops.length,
            duration: `${Math.round(totalDist * 3.5 + 4)} mins`,
            load: `${totalPacks} Packs`,
            status: firstItem?.status === "ACCEPTED" ? "AVAILABLE" : (firstItem?.status === "ASSIGNED" || firstItem?.status === "PICKED_UP" ? "IN PROGRESS" : "AVAILABLE"),
            type: "delivery",
            description: `Consolidated multi-stop shortest route across ${orderedStops.length} pickup points.`,
            location: orderedStops[0]?.address || "No Value",
            partnerOrg: orderedStops[0]?.name || "No Value",
            contactPhone: orderedStops[0]?.phone || "No Value",
            ngoOrgName: firstItem?.ngo_name || firstItem?.ngo || "No Value",
            ngoPhone: firstItem?.ngo_phone || "No Value",
            baseAddress: orderedStops[0]?.address || "No Value",
            destinations: [firstItem?.ngo_name || "No Value"],
            isPickupReached: firstItem?.status === "PICKED_UP" || firstItem?.status === "DELIVERED",
            completedDestinations: [],
            stopsList: orderedStops,
            totalDistanceKm: totalDist,
            isConsolidatedRoute: true,
            rawStatus: firstItem?.status || "PENDING",
            createdAt: firstItem?.createdAt || new Date().toISOString(),
          });
        });

        return consolidatedTasks;
      };

      const oppsConsolidated = Array.isArray(oppsRaw) && oppsRaw.length > 0
        ? buildConsolidatedRoutesFromApi(oppsRaw)
        : [];

      setTasks({
        active: Array.isArray(activeRaw) ? activeRaw.filter((d: any) => {
          const s = String(d?.status || "").toUpperCase();
          return s === "PICKED_UP" || s === "ASSIGNED" || s === "IN PROGRESS";
        }).map(mapTask) : [],
        opps: oppsConsolidated,
        past: Array.isArray(activeRaw) ? activeRaw.filter((d: any) => {
          const s = String(d?.status || "").toUpperCase();
          return s === "DELIVERED" || s === "COMPLETED";
        }).map(mapTask) : [],
      });
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger data fetch on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDetailsClick = (task: Task) => {
    setSelectedTask(task);
    const legIds = task.stopsList && task.stopsList.length > 0
      ? task.stopsList.map((s) => s.id)
      : [task.id];
    setSelectedRouteLegs(legIds);
    setIsDrawerOpen(true);
  };





  const performVerification = async (type: 'pickup' | 'delivery', code: string) => {
    console.log("🚀 performVerification started: type =", type, "code =", code, "selectedTask ID =", selectedTask?.id);
    if (!selectedTask) {
      toast.error("No task selected.");
      return;
    }

    const cleanCode = String(code || "").trim();
    if (!cleanCode || cleanCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setIsVerifying(true);
    try {
        if (type === "pickup") {
            await volunteerTasksService.markAsPickedUp(selectedTask.id, cleanCode);
            toast.success("Food picked up successfully! NGO address details and delivery input are now unlocked.");
            setSelectedTask(prev => prev ? {
              ...prev,
              rawStatus: "PICKED_UP",
              status: "IN PROGRESS",
              isPickupReached: true
            } : null);
        } else {
            await volunteerTasksService.markAsDelivered(selectedTask.id, cleanCode);
            toast.success("Delivery confirmed! Great job hero.");
            setSelectedTask(prev => prev ? {
              ...prev,
              rawStatus: "DELIVERED",
              status: "COMPLETED",
              isPickupReached: true
            } : null);
        }
        
        setOtpValue("");
        await fetchTasks(); // Refresh state from backend
        
        if (type === "delivery") {
            setIsDrawerOpen(false);
        }
    } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || "Invalid security code. Please check with the coordinator.");
    } finally {
        setIsVerifying(false);
    }
  };



  const handleConfirmClaim = async () => {
    if (!selectedTask) return;
    setIsClaiming(true);
    try {
      await volunteerTasksService.acceptPickup(selectedTask.id);
      toast.success("Task accepted and added to your dispatch!");
      setIsClaimModalOpen(false);
      setIsDrawerOpen(false); // Close details drawer
      setActiveTab("active"); // Redirect/switch to Active tasks tab
      fetchTasks(); // Refresh
    } catch (error) {
      toast.error("Failed to accept task. It might already be taken.");
    } finally {
      setIsClaiming(false);
    }
  };


  const getCurrentTasks = () => {
    let list: Task[] = [];
    switch (activeTab) {
      case "active":
        list = tasks.active;
        break;
      case "opps":
        list = tasks.opps;
        break;
      case "past":
        list = tasks.past;
        break;
      default:
        list = [];
    }

    // Apply Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => 
        t.title?.toLowerCase().includes(q) ||
        t.partnerOrg?.toLowerCase().includes(q) ||
        t.routeNumber?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.load?.toLowerCase().includes(q)
      );
    }

    // Apply Status Filter
    if (statusFilter !== "ALL") {
      const target = statusFilter.toUpperCase();
      list = list.filter((t) => t.status === target || t.rawStatus === target);
    }

    // Apply Category/Type Filter
    if (typeFilter !== "ALL") {
      const target = typeFilter.toLowerCase();
      list = list.filter((t) => t.type === target);
    }

    // Apply Sorting
    return list.sort((a, b) => {
      const isANum = a.id && !isNaN(Number(a.id));
      const isBNum = b.id && !isNaN(Number(b.id));
      
      if (sortFilter === "OLDEST") {
        if (isANum && isBNum) {
          return Number(a.id) - Number(b.id);
        }
        return String(a.id || "").localeCompare(String(b.id || ""));
      }
      // Default / NEWEST
      if (isANum && isBNum) {
        return Number(b.id) - Number(a.id);
      }
      return String(b.id || "").localeCompare(String(a.id || ""));
    });
  };

  const tableColumns: ColumnDef[] = [
    { uid: "id", name: "ID", sortable: true },
    { uid: "title", name: "Task Details", align: "start" },
    { uid: "source", name: "Route Hubs", align: "start" },
    { uid: "load", name: "Inventory", align: "start" },
    { uid: "duration", name: "Est. Duration", align: "start" },
    { uid: "status", name: "Status", align: "start" },
    { uid: "actions", name: "Actions", align: "end" },
  ];

  const renderCell = useCallback((task: Task, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return (
          <div className="text-start">
            <span className="text-[10px] font-black tracking-widest uppercase border px-2 py-1 rounded-lg bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              #{task.routeNumber}
            </span>
          </div>
        );
      case "title":
        return (
          <div className="flex items-center gap-3 text-start py-1.5">
            <img
              src={getCategoryThumbnail(task.title)}
              alt={task.title}
              className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800/80 shrink-0"
            />
            <div>
              <p
                className="text-xs font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {task.title}
              </p>
              <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest block mt-0.5">
                {task.type} Stop
              </span>
            </div>
          </div>
        );
      case "source":
        return (
          <div className="flex flex-col gap-1 text-start py-1">
            <div className="flex items-center gap-1.5">
              <Hotel size={12} className="text-[#22c55e] shrink-0" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5 select-none">From:</span>
              <span className="text-xs font-extrabold truncate max-w-[140px] text-[var(--text-primary)]">
                {task.partnerOrg || "Private Donor"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={12} className="text-blue-500 shrink-0" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5 select-none">To:</span>
              <span className="text-xs font-extrabold truncate max-w-[140px] text-[var(--text-primary)]">
                {task.ngoOrgName || "Receiving NGO"}
              </span>
            </div>
          </div>
        );
      case "load":
        return (
          <div className="text-start">
            <span className="px-2.5 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30 text-blue-600 dark:text-blue-400">
              {task.load}
            </span>
          </div>
        );
      case "duration":
        return (
          <div className="flex items-center gap-1.5 text-start py-1.5 text-xs font-black" style={{ color: "var(--text-secondary)" }}>
            <Clock size={13} className="text-[#22c55e]" />
            <span>{task.duration}</span>
          </div>
        );
      case "status":
        return (
          <div className="text-start py-1.5">
            <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg border shadow-sm bg-white/90 dark:bg-slate-950/90 ${getStatusStyle(task.status)}`}>
              {task.status}
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-2">
            <ResuableButton
              variant="primary"
              className="h-8 px-4 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm bg-[#22c55e] hover:bg-green-600 text-white"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleDetailsClick(task);
              }}
            >
              {task.status === "AVAILABLE"
                ? "Accept"
                : task.status === "IN PROGRESS"
                  ? "Update"
                  : "Details"}
            </ResuableButton>
          </div>
        );
      default:
        return null;
    }
  }, []);

  if (loading) {
    return <Loader text="Syncing Tasks..." minHeight="60vh" />;
  }

  const isNgoLocked = selectedTask ? (selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "ACCEPTED" || selectedTask.status === "AVAILABLE") : false;

  const getExpiryDateTime = () => {
    if (!selectedTask) return { date: "--", time: "--" };
    const createdStr = selectedTask.createdAt;
    let expiryDate = new Date();
    if (createdStr) {
      const parsedCreated = new Date(createdStr);
      if (!isNaN(parsedCreated.getTime())) {
        expiryDate = parsedCreated;
      }
    }
    // Add 6 hours default
    expiryDate.setHours(expiryDate.getHours() + 6);
    
    const expiryTimeStr = selectedTask.expiryTime;
    if (expiryTimeStr && expiryTimeStr !== "No Expiry") {
      const parsed = new Date(expiryTimeStr);
      if (!isNaN(parsed.getTime())) {
        expiryDate = parsed;
      }
    }
    
    return {
      date: expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: expiryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="w-full p-0 bg-transparent">
      {/* Header Section */}
      <div
        className="border-b shadow-sm relative"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-[#22c55e] opacity-[0.03] blur-[100px] rounded-full" />
        </div>
        <div className="px-4 md:px-8 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full mb-2">
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22c55e]/70">Central Dispatch</span>
              </div>
              <h1
                className="text-3xl font-[1000] uppercase tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Volunteer <span className="text-[#22c55e]">Terminal</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5" style={{ color: "var(--text-muted)" }}>
                Central dispatch operations and task tracking manager
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 shrink-0">
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-black/5 dark:bg-black/20"
                style={{
                  borderColor: "rgba(34, 197, 94, 0.2)",
                }}
              >
                <Navigation className="w-3.5 h-3.5 text-[#22c55e]" />
                <span className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest leading-none">
                  Mission Control Active
                </span>
              </div>
              <div
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                <Calendar size={14} className="text-[#22c55e]/40" />{" "}
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="px-4 md:px-8 pt-2 pb-6">
          <div className="relative z-10 p-4 sm:p-6 flex flex-col gap-4 border rounded-2xl shadow-sm w-full" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              {/* Search input */}
              <div className="relative w-full sm:w-[320px]">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks, capacity, route..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#22c55e]/20 transition-all shadow-sm border"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-red-500 transition-colors rounded-full"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* View Switcher using reusable Tabs */}
              <Tabs
                tabs={[
                  { id: "table", icon: ListIcon, label: "Table" },
                  { id: "grid", icon: LayoutGrid, label: "Cards" },
                ]}
                activeTab={viewMode}
                onTabChange={(v) => setViewMode(v as any)}
                layoutId="volunteerTasksViewMode"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                {
                  label: "STATUS",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    ["ALL", "All Statuses"],
                    ["AVAILABLE", "Available"],
                    ["IN PROGRESS", "In Progress"],
                    ["COMPLETED", "Completed"],
                  ],
                },
                {
                  label: "CATEGORY TYPE",
                  value: typeFilter,
                  onChange: setTypeFilter,
                  options: [
                    ["ALL", "All Types"],
                    ["delivery", "Delivery Stops"],
                    ["kitchen", "Kitchen Stops"],
                    ["shelter", "Shelter Stops"],
                  ],
                },
                {
                  label: "SORT BY",
                  value: sortFilter,
                  onChange: setSortFilter,
                  options: [
                    ["NEWEST", "Newest First"],
                    ["OLDEST", "Oldest First"],
                  ],
                },
              ].map(({ label, value, onChange, options }) => (
                <div key={label} className="relative inline-flex items-center shrink-0">
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl h-[46px] px-4 shadow-sm hover:border-emerald-500/60 transition-all cursor-pointer relative min-w-[140px] border"
                    style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}
                  >
                    <div className="flex flex-col text-left justify-center leading-tight">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 select-none">{label}</span>
                      <span className="text-[12px] font-bold select-none mt-0.5" style={{ color: "var(--text-primary)" }}>
                        {(options.find(([v]) => v === value) || options[0])[1]}
                      </span>
                    </div>
                    <ChevronDown size={12} className="text-slate-400 pointer-events-none ml-1.5 shrink-0" />
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
              ))}

              {/* Reset Button */}
              {(searchQuery !== "" || statusFilter !== "ALL" || typeFilter !== "ALL" || sortFilter !== "NEWEST") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setTypeFilter("ALL");
                    setSortFilter("NEWEST");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 border border-red-200/80 transition-all shadow-sm ml-auto cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs switch section (Active / Available / History) */}
      <div className="px-4 md:px-8 pt-6 pb-1 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50/90 dark:bg-slate-900/90 border-slate-200/80 shadow-sm">
          {[
            { id: "active", label: "Active", count: tasks.active.length, icon: "⚡" },
            { id: "opps", label: "Available", count: tasks.opps.length, icon: "🌐" },
            { id: "past", label: "History", count: tasks.past.length, icon: "✅" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const btnColor = tab.id === "opps" ? "bg-[#22c55e]" : tab.id === "active" ? "bg-amber-500" : "bg-blue-500";
            const shadowColor = tab.id === "opps" ? "shadow-emerald-500/20" : tab.id === "active" ? "shadow-amber-500/20" : "shadow-blue-500/20";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  isActive ? `${btnColor} text-white shadow-sm ${shadowColor}` : "hover:text-[var(--text-primary)]"
                }`}
                style={{ color: isActive ? "white" : "var(--text-muted)" }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200/60 dark:bg-slate-800 text-slate-500"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline" style={{ color: "var(--text-muted)" }}>
          {activeTab === "active" ? "Showing active dispatch missions" : activeTab === "opps" ? "Showing nearby open pickup opportunities" : "Showing past completed missions"}
        </span>
      </div>

      {/* Main Content List */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-16">
        {getCurrentTasks().length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {viewMode === "table" ? (
              <div className="border rounded-md shadow-sm p-2 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
                <ReusableTable
                  data={getCurrentTasks()}
                  columns={tableColumns}
                  renderCell={renderCell}
                  onRowClick={(task: Task) => handleDetailsClick(task)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentTasks().map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDetails={handleDetailsClick}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 md:py-24 px-6 bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-60" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Illustration */}
              <div className="relative w-48 h-36 md:w-64 md:h-48 mb-8">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  src="/empty card.png"
                  alt="No Tasks Illustration"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="space-y-4 mb-10">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800">
                  No relevant tasks found
                </h3>
                <p className="text-[var(--text-muted)] text-sm md:text-base max-w-sm mx-auto font-medium leading-relaxed uppercase tracking-widest">
                  {activeTab === "active"
                    ? "You don't have any active tasks in progress."
                    : activeTab === "opps"
                      ? "Check back later for new pickup opportunities."
                      : "No past completed missions found."}
                </p>
              </div>

              {/* Button removed by user request */}
            </div>
          </motion.div>
        )}
      </div>
      <ResuableDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Task Details"
        subtitle={`Route #${selectedTask?.routeNumber} • Information`}
        size="md"
        footer={
          selectedTask && (
            <div className="w-full">
              {selectedTask.status === "AVAILABLE" && (
                <ResuableButton
                  variant="primary"
                  className="w-full bg-[#22c55e] h-11 !rounded-sm text-xs font-black uppercase tracking-widest"
                  onClick={() => setIsClaimModalOpen(true)}
                >
                  Claim Task
                </ResuableButton>
              )}
              
              {selectedTask.rawStatus === "ASSIGNED" && (
                <div className="flex flex-col gap-2 w-full text-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#22c55e] leading-none mb-1">Enter Pickup Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-black tracking-widest text-lg h-11 outline-none focus:border-[#22c55e]/50 transition-all text-[var(--text-primary)] font-mono"
                      placeholder="------"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    />
                    <ResuableButton
                      variant="primary"
                      disabled={otpValue.length !== 6 || isVerifying}
                      className="h-11 px-6 bg-[#22c55e] text-xs text-white font-black uppercase tracking-widest"
                      onClick={() => performVerification('pickup', otpValue)}
                      loading={isVerifying}
                    >
                      Unlock
                    </ResuableButton>
                  </div>
                </div>
              )}

              {selectedTask.rawStatus === "PICKED_UP" && (
                <div className="flex flex-col gap-2 w-full text-start">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 leading-none mb-1">Enter Delivery Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-black tracking-widest text-lg h-11 outline-none focus:border-blue-500/50 transition-all text-[var(--text-primary)] font-mono"
                      placeholder="------"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    />
                    <ResuableButton
                      variant="primary"
                      disabled={otpValue.length !== 6 || isVerifying}
                      className="h-11 px-6 bg-blue-500 text-xs text-white font-black uppercase tracking-widest"
                      onClick={() => performVerification('delivery', otpValue)}
                      loading={isVerifying}
                    >
                      Verify
                    </ResuableButton>
                  </div>
                </div>
              )}
            </div>
          )
        }
      >
        {selectedTask && (
          <div className="space-y-6 p-6">
            {/* 1. Header Info Card */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-4 text-start">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100/50 dark:border-emerald-900/30">
                <Truck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                    Donation Dispatch
                  </h3>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusStyle(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-2">
                  ID: {selectedTask.id ? `TSK-${selectedTask.id}`.toUpperCase().substring(0, 24) : "TSK-TBD"}
                </p>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Created on {new Date(selectedTask.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(selectedTask.createdAt || new Date()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* 1.5 Route Overview & Leg Selector */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start space-y-4">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#10B981] shrink-0">
                    <Route size={16} className="stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Route Path & Leg Selector
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allIds = selectedTask.stopsList ? selectedTask.stopsList.map(s => s.id) : [selectedTask.id];
                    setSelectedRouteLegs(selectedRouteLegs.length === allIds.length ? [] : allIds);
                  }}
                  className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-wider cursor-pointer"
                >
                  {selectedRouteLegs.length === (selectedTask.stopsList?.length || 1) ? "Deselect All" : "Select All Legs"}
                </button>
              </div>

              {/* Clear FROM ➔ TO Summary Card */}
              <div className="p-4 rounded-2xl bg-[#F2FBF6] dark:bg-emerald-950/30 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#10B981] bg-emerald-100/80 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-md">
                    {selectedTask.relayLeg === "FEEDER" ? "🚲 Micro-Feeder Volunteer Role" : "🚚 Truck Volunteer Role (Bulk Load)"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {selectedTask.stopsList?.length || 1} Stops Total
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-emerald-200/50 dark:border-emerald-900/40">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">FROM (ORIGIN / PICKUP)</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{selectedTask.partnerOrg || "No Value"}</span>
                    <span className="text-[10px] font-semibold text-slate-400 truncate">{selectedTask.location || "No Value"}</span>
                  </div>
                  <div className="flex flex-col min-w-0 text-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">TO (DESTINATION NGO)</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{selectedTask.ngoOrgName || "No Value"}</span>
                    <span className="text-[10px] font-semibold text-slate-400 truncate">{selectedTask.baseAddress || "No Value"}</span>
                  </div>
                </div>
              </div>

              {/* Easy Step-by-Step Leg Checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  STEP-BY-STEP ROUTE PATHS TO ACCEPT ({selectedRouteLegs.length} SELECTED)
                </span>
                {selectedTask.stopsList && selectedTask.stopsList.length > 0 ? (
                  selectedTask.stopsList.map((stop, idx) => {
                    const isSelected = selectedRouteLegs.includes(stop.id);
                    return (
                      <div
                        key={stop.id}
                        onClick={() => {
                          setSelectedRouteLegs(prev =>
                            prev.includes(stop.id) ? prev.filter(id => id !== stop.id) : [...prev, stop.id]
                          );
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-[#10B981] shadow-xs"
                            : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#10B981] rounded-md cursor-pointer"
                          />
                          <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center font-black text-[9px] shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex flex-col min-w-0 text-xs font-extrabold text-slate-800 dark:text-slate-100">
                            <span>Pick up from: {stop.name}</span>
                            <span className="text-[10px] font-medium text-slate-400">{stop.address} • ({stop.quantity})</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#10B981] font-mono shrink-0 pl-2">➔ {stop.distanceKm} km</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 rounded-2xl border bg-emerald-50/60 dark:bg-emerald-950/30 border-[#10B981] flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">1</span>
                      <span>Direct Route: Pick up from {selectedTask.partnerOrg} ➔ Deliver to {selectedTask.ngoOrgName}</span>
                    </div>
                    <span className="text-[#10B981] font-black font-mono">➔ {selectedTask.distanceKm || 2.8} km</span>
                  </div>
                )}
              </div>

              {/* 1.6 Interactive Shortest Route Visual Map Card */}
              <div className="pt-2">
                <ShortestRouteMapCard
                  task={selectedTask}
                  onViewOnMap={(task) => handleOpenMapModal(task, true)}
                />
              </div>
            </div>

            {/* 2. Food Expiry Date & Time Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3 text-start">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <Calendar size={18} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-wider leading-none mb-1">Food Expiry Date</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {getExpiryDateTime().date}
                  </span>
                </div>
              </div>
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-3 text-start">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 shrink-0">
                  <Clock size={18} className="stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-wider leading-none mb-1">Food Expiry Time</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {getExpiryDateTime().time}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Task Progress Stepper */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-6 block">Task Progress</span>
              
              <div className="flex justify-between items-center w-full relative px-2">
                {[
                  { label: "Requested", status: true, icon: "📋" },
                  { label: "Accepted", status: ["ACCEPTED", "ASSIGNED", "PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") || selectedTask.status === "COMPLETED", icon: "✓" },
                  { label: "Dispatch", status: ["ASSIGNED", "PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") || selectedTask.status === "COMPLETED", icon: "🚚" },
                  { label: "Picked Up", status: ["PICKED_UP", "DELIVERED"].includes(selectedTask.rawStatus || "") || selectedTask.status === "COMPLETED", icon: "📦" },
                  { label: "Completed", status: selectedTask.rawStatus === "DELIVERED" || selectedTask.status === "COMPLETED", icon: "✓" }
                ].map((step, idx, arr) => {
                  const isCurrent = (idx === 0 && (selectedTask.rawStatus === "PENDING")) ||
                                   (idx === 1 && selectedTask.rawStatus === "ACCEPTED") ||
                                   (idx === 2 && selectedTask.rawStatus === "ASSIGNED") ||
                                   (idx === 3 && selectedTask.rawStatus === "PICKED_UP") ||
                                   (idx === 4 && (selectedTask.rawStatus === "DELIVERED" || selectedTask.status === "COMPLETED"));
                  
                  return (
                    <div key={idx} className="flex flex-col items-center relative flex-1">
                      {/* Connecting Line */}
                      {idx < arr.length - 1 && (
                        <div 
                          className="absolute h-[2px] w-[calc(100%-40px)] left-[calc(50%+20px)] top-[19px]"
                          style={{ 
                            backgroundColor: step.status && arr[idx+1]?.status 
                              ? "#22c55e" 
                              : "var(--border-color)",
                            opacity: step.status && arr[idx+1]?.status ? 0.8 : 0.2,
                          }}
                        />
                      )}
                      
                      {/* Circle Node */}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border transition-all duration-300 relative flex-shrink-0 ${
                          step.status 
                            ? "bg-[#22c55e] border-[#22c55e] text-white shadow-sm" 
                            : "bg-black/[0.03] border-slate-200 text-slate-400 dark:border-slate-800"
                        } ${isCurrent ? "ring-4 ring-[#22c55e]/15 !border-[#22c55e]/45" : ""}`}
                      >
                        {step.status ? (
                          <span className="font-black text-sm">{step.icon === "✓" ? "✓" : step.icon}</span>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full animate-ping bg-[#22c55e]/25" />
                        )}
                      </div>
                      
                      <span className={`mt-2 text-[8px] font-black uppercase tracking-tight leading-none ${
                        step.status ? "text-[#22c55e]" : "text-[var(--text-muted)]"
                      } ${isCurrent ? "text-[var(--text-primary)]" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Card 1: PICK-UP & DONATION DETAILS */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start">
              <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Package size={16} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">PICK-UP & DONATION DETAILS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                {/* Vertical Divider Line */}
                <div className="hidden sm:block absolute left-1/2 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800" />
                
                {/* Left Column: Pick-up Address */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-3 block">Pick-up Address</span>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={16} className="text-[#22c55e] shrink-0 mt-0.5" />
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{selectedTask.partnerOrg}</h4>
                    </div>
                    <p className="text-xs font-bold leading-relaxed text-slate-500 dark:text-slate-400 pl-6">
                      {selectedTask.location || "Main Entrance / Reception"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300 pl-6">
                    <Phone size={12} className="text-[#22c55e]" />
                    <a
                      href={`tel:${selectedTask.contactPhone && selectedTask.contactPhone !== "Contact via App" ? selectedTask.contactPhone : "+91 98401 23456"}`}
                      className="hover:text-[#22c55e] transition-colors"
                    >
                      {selectedTask.contactPhone && selectedTask.contactPhone !== "Contact via App" ? selectedTask.contactPhone : "+91 98401 23456"}
                    </a>
                  </div>
                </div>

                {/* Right Column: Donation Details */}
                <div className="flex flex-col justify-between sm:pl-4">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-3 block">Donation Details</span>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">
                      {selectedTask.title}
                    </h4>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Package size={13} className="text-slate-400 shrink-0" />
                        <span>{selectedTask.load}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>{selectedTask.expiryTime ? `Expires: ${selectedTask.expiryTime}` : "No Expiry"}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>Prepared on {new Date(selectedTask.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Tag size={13} className="text-slate-400 shrink-0" />
                        <span>Category: {selectedTask.category || "Dry Ration"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Card 2: TO DELIVER ADDRESS */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-5 bg-white dark:bg-slate-900 shadow-sm text-start relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#22c55e] shrink-0">
                  <MapPin size={16} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">TO DELIVER ADDRESS</span>
              </div>

              <div className="relative">
                <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all duration-300 ${isNgoLocked ? "filter blur-[2px] select-none pointer-events-none opacity-45" : ""}`}>
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mb-1">{selectedTask.ngoOrgName}</h4>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedTask.destinations[0] || "NGO Delivery Hub Center Address"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                        <Phone size={12} className="text-[#22c55e]" />
                        <a
                          href={`tel:${selectedTask.ngoPhone && selectedTask.ngoPhone !== "Contact via App" ? selectedTask.ngoPhone : "+91 98765 43210"}`}
                          className="hover:text-[#22c55e] transition-colors"
                        >
                          {selectedTask.ngoPhone && selectedTask.ngoPhone !== "Contact via App" ? selectedTask.ngoPhone : "+91 98765 43210"}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                        <User size={12} className="text-[#22c55e]" />
                        <span>Contact: Ravi Kumar</span>
                      </div>
                    </div>
                  </div>

                  {/* Building SVG Illustration */}
                  <div className="hidden sm:block">
                    <svg className="w-32 h-28 opacity-80 dark:opacity-60 shrink-0" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Clouds */}
                      <path d="M135 45a8 8 0 0 1 8 8 6 6 0 0 1 6 6 6 6 0 0 1-6 6h-20a6 6 0 0 1-6-6 8 8 0 0 1 8-8c1-4 5-6 10-6z" fill="#E2F2E9" />
                      <path d="M25 40a6 6 0 0 1 6 6 4 4 0 0 1 4 4 4 4 0 0 1-4 4H15a4 4 0 0 1-4-4 6 6 0 0 1 6-6c1-3 4-4 8-4z" fill="#E2F2E9" />
                      
                      {/* Trees */}
                      <circle cx="115" cy="85" r="10" fill="#69C894" />
                      <rect x="114" y="85" width="2" height="15" fill="#4AA072" />
                      <circle cx="123" cy="90" r="8" fill="#58B281" />
                      <rect x="122" y="90" width="2" height="10" fill="#4AA072" />

                      {/* Main NGO Building */}
                      <rect x="40" y="55" width="60" height="45" rx="4" fill="#A8DFBF" />
                      <rect x="50" y="45" width="40" height="15" rx="3" fill="#82CD9F" />
                      
                      {/* Heart on Building */}
                      <path d="M70 51.5c-1-1-2.5-1-3.5 0s-1 2.5 0 3.5l3.5 3.5 3.5-3.5c1-1 1-2.5 0-3.5s-2.5-1-3.5 0z" fill="#60B683" />
                      
                      {/* Windows */}
                      <rect x="48" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="60" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="72" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="84" y="65" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      
                      <rect x="48" y="78" width="8" height="8" rx="1.5" fill="#FFFFFF" />
                      <rect x="84" y="78" width="8" height="8" rx="1.5" fill="#FFFFFF" />

                      {/* Door */}
                      <rect x="62" y="76" width="16" height="24" rx="2" fill="#E8F8F0" />
                      <rect x="66" y="80" width="8" height="20" rx="1" fill="#69C894" />
                    </svg>
                  </div>
                </div>

                {isNgoLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 dark:bg-slate-900/20 z-10 text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-500 mb-1.5 shadow-sm border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xs">
                      <span>🔒</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Locked until food is picked up
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">Delivery Instructions</span>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "Please call before arrival. Deliver to the main office."
                </p>
              </div>
            </div>

            {/* 6. Dynamic OTP Handover Protocol display */}
            {selectedTask.status !== "COMPLETED" && selectedTask.rawStatus === "ASSIGNED" && (
              <div className="border border-slate-100 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 mb-3 border border-emerald-100/50 dark:border-emerald-900/30">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>

                <div className="flex items-center gap-1.5 mb-3 bg-emerald-500/[0.03] border border-emerald-500/10 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                    ENCRYPTED KEY PROTOCOL
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">
                  Secure Verification
                </h3>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 max-w-[280px] mx-auto mb-5">
                  {selectedTask.rawStatus === "ASSIGNED" 
                    ? "Enter the 6-digit code sent to confirm this action." 
                    : (selectedTask.rawStatus === "PICKED_UP" 
                        ? "Enter the 6-digit code sent to confirm this action." 
                        : "Awaiting next dispatch protocol stage")}
                </p>

                {/* OTP Digits boxes */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {(() => {
                    const otpStr = String(
                      selectedTask.rawStatus === "ASSIGNED" 
                        ? selectedTask.pickupOtp 
                        : (selectedTask.rawStatus === "PICKED_UP" ? selectedTask.deliveryOtp : "")
                    );
                    
                    if (otpStr && (selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "PICKED_UP")) {
                      return otpStr
                        .padStart(6, "0")
                        .split("")
                        .map((digit, i) => (
                          <div 
                            key={i} 
                            className={`w-10 h-12 rounded-xl bg-white dark:bg-slate-900 border-2 ${
                              i === 0 ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "border-slate-100 dark:border-slate-800"
                            } flex items-center justify-center text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tighter`}
                          >
                            {digit}
                          </div>
                        ));
                    }
                    
                    return (
                      <div className="text-2xl font-black tracking-[0.5em] text-slate-300 dark:text-slate-700 font-mono italic select-none">
                        PENDING
                      </div>
                    );
                  })()}
                </div>

                {/* Expiry line */}
                {(selectedTask.rawStatus === "ASSIGNED" || selectedTask.rawStatus === "PICKED_UP") && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Code expires in <span className="text-emerald-500 font-mono">04:59</span></span>
                  </div>
                )}
              </div>
            )}

            {/* 7. Instructions */}
            <div className="space-y-2 text-start pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">
                Instructions
              </h4>
              <div className="p-4 rounded-2xl border bg-amber-500/[0.02] border-amber-500/10">
                <p className="text-xs font-bold text-amber-600 leading-relaxed italic">
                  "{selectedTask.description || "Follow standard procedure. Please update the task status as you complete each step."}"
                </p>
              </div>
            </div>
          </div>
        )}
      </ResuableDrawer>


      {/* Accept Task Modal */}
      <ResuableModal
        isOpen={isClaimModalOpen}
        onOpenChange={setIsClaimModalOpen}
        title="Task Acceptance"
        subtitle="Confirm Acceptance"
        size="md"
        classNames={{
          base: "!rounded-[24px] overflow-hidden bg-white dark:bg-slate-900",
          header: "border-b border-slate-100 dark:border-slate-800 px-6 py-4",
          body: "p-6 bg-white dark:bg-slate-900",
          footer: "border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
        }}
        icon={
          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 size={14} className="stroke-[2.5]" />
          </div>
        }
        footer={
          <div className="flex gap-3 w-full justify-end">
            <ResuableButton
              variant="secondary"
              className="h-10 px-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300"
              onClick={() => setIsClaimModalOpen(false)}
            >
              Abort
            </ResuableButton>
            <ResuableButton
              variant="primary"
              className="h-10 px-6 bg-[#22c55e] hover:bg-green-600 rounded-xl text-xs font-black text-white flex items-center gap-1.5 justify-center"
              onClick={handleConfirmClaim}
              disabled={isClaiming}
            >
              {isClaiming ? (
                <span>Accepting...</span>
              ) : (
                <>
                  <CheckCircle2 size={14} className="stroke-[2.5]" />
                  <span>Confirm Acceptance</span>
                </>
              )}
            </ResuableButton>
          </div>
        }
      >
        {selectedTask && (
          <div className="text-center space-y-6">
            {/* Pulsing check circle illustration */}
            <div className="relative flex justify-center mt-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 size={20} className="stroke-[2.5]" />
                </div>
                <div className="absolute inset-0 rounded-full animate-ping bg-[#22c55e]/10 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 tracking-tight">
                Accept this task?
              </h3>
              <p className="text-xs font-bold leading-relaxed text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
                You are about to accept <span className="text-[#22c55e] font-black">"{selectedTask.title}"</span>. This task will be added to your active list.
              </p>
            </div>

            {/* Load and Duration Details Column Box */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/[0.3] dark:bg-slate-950/20 shadow-sm flex items-center justify-between text-start relative overflow-hidden">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100/50">
                  <Package size={14} className="stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">LOAD</span>
                  <span className="text-sm font-black text-slate-850 dark:text-slate-100">{selectedTask.load}</span>
                  <span className="text-[9px] font-bold text-slate-450 block mt-0.5">Approximate</span>
                </div>
              </div>

              {/* Mini vertical separator */}
              <div className="w-px h-10 bg-slate-100 dark:bg-slate-800 mx-4" />

              <div className="flex-1 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100/50">
                  <Clock size={14} className="stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">EST. TIME</span>
                  <span className="text-sm font-black text-slate-850 dark:text-slate-100">{selectedTask.duration}</span>
                  <span className="text-[9px] font-bold text-slate-450 block mt-0.5">Pickup & delivery</span>
                </div>
              </div>
            </div>

            {/* Guidelines Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-500/10 flex items-start gap-3 text-start">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                <CheckCircle2 size={10} className="stroke-[2.5]" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-normal">
                By accepting, you agree to follow the guidelines and ensure safe food handling and delivery.
              </p>
            </div>
          </div>
        )}
      </ResuableModal>

      {/* Full Screen Interactive Leaflet Route Map Modal */}
      <FullScreenMapModal
        isOpen={isMapModalOpen}
        task={mapModalTask}
        onClose={handleCloseMapModal}
      />
    </div>
  );
};

export default VolunteerTasks;
