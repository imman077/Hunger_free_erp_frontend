import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface Coords {
  lat: number;
  lng: number;
}

interface LiveGPSMapProps {
  pickupCoords?: Coords | null;
  deliveryCoords?: Coords | null;
  volunteerLocation?: Coords | null;
  volunteerName?: string;
}

export const LiveGPSMap: React.FC<LiveGPSMapProps> = ({
  pickupCoords,
  deliveryCoords,
  volunteerLocation,
  volunteerName = "Volunteer",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const volunteerMarkerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
        if (pickupCoords && deliveryCoords) {
          const L = (window as any).L;
          const pLat = pickupCoords.lat || 19.0760;
          const pLng = pickupCoords.lng || 72.8777;
          const dLat = deliveryCoords.lat || 19.1300;
          const dLng = deliveryCoords.lng || 72.8900;
          const vLat = volunteerLocation?.lat || pLat;
          const vLng = volunteerLocation?.lng || pLng;
          const group = L.featureGroup([
            L.marker([pLat, pLng]),
            L.marker([dLat, dLng]),
            L.marker([vLat, vLng]),
          ]);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, leafletLoaded, pickupCoords, deliveryCoords, volunteerLocation]);

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Clean up stylesheets if needed (optional, keeping it cached is fine)
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;

    // Use default coordinates if none provided
    const pLat = pickupCoords?.lat || 19.0760;
    const pLng = pickupCoords?.lng || 72.8777;
    const dLat = deliveryCoords?.lat || 19.1300;
    const dLng = deliveryCoords?.lng || 72.8900;
    const vLat = volunteerLocation?.lat || pLat;
    const vLng = volunteerLocation?.lng || pLng;

    // Destroy existing map instance to avoid re-init error
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([pLat, pLng], 13);
    mapInstanceRef.current = map;

    // Add CartoDB Voyager Tile Layer (modern, clean, minimal maps)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
    }).addTo(map);

    // Add Custom Leaflet Zoom Control to bottom-right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Custom SVG DivIcon for Pickup (Green Pin)
    const pickupIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
        </div>
      `,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Custom SVG DivIcon for Delivery (Blue Pin)
    const deliveryIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      `,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Custom SVG DivIcon for Volunteer (Pulsing Red Delivery Vehicle)
    const volunteerIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-12 h-12">
          <div class="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
          <div class="absolute w-8 h-8 rounded-full bg-rose-500/20 animate-ping"></div>
          <div class="w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
        </div>
      `,
      className: "",
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    // Add Markers
    L.marker([pLat, pLng], { icon: pickupIcon })
      .addTo(map)
      .bindPopup("<b>Pickup Address</b><br/>Food source location");

    L.marker([dLat, dLng], { icon: deliveryIcon })
      .addTo(map)
      .bindPopup("<b>NGO Destination</b><br/>Food distribution center");

    const volunteerMarker = L.marker([vLat, vLng], { icon: volunteerIcon })
      .addTo(map)
      .bindPopup(`<b>${volunteerName}</b><br/>En route / Live tracking`);
    volunteerMarkerRef.current = volunteerMarker;

    // Draw route connecting lines
    const pathCoordinates: [number, number][] = [
      [pLat, pLng],
      [vLat, vLng],
      [dLat, dLng],
    ];

    // Glow background line (semi-transparent)
    L.polyline(pathCoordinates, {
      color: "#22c55e",
      weight: 8,
      opacity: 0.15,
      lineCap: "round",
    }).addTo(map);

    // Main dashed progress line
    L.polyline(pathCoordinates, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.85,
      dashArray: "10, 8",
      lineCap: "round",
    }).addTo(map);

    // Fit bounds to show all markers
    const group = L.featureGroup([
      L.marker([pLat, pLng]),
      L.marker([dLat, dLng]),
      volunteerMarker,
    ]);
    map.fitBounds(group.getBounds().pad(0.15));

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, pickupCoords, deliveryCoords, volunteerLocation, volunteerName]);

  // Dynamically update volunteer position when prop coordinates update
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !volunteerMarkerRef.current || !volunteerLocation) return;
    const { lat, lng } = volunteerLocation;
    volunteerMarkerRef.current.setLatLng([lat, lng]);

    // Pan map to driver location
    mapInstanceRef.current.panTo([lat, lng]);
  }, [volunteerLocation, leafletLoaded]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-50 w-full transition-all duration-300 ${
        isFullscreen
          ? "h-full w-full rounded-none"
          : "rounded-[2rem] border border-slate-100/80 shadow-md h-[220px]"
      }`}
    >
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-100 shadow-lg text-slate-600 hover:text-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Dynamic Overlay HUD HUD Info */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-100 shadow-lg flex flex-col gap-0.5 pointer-events-none">
        <span className="text-[9px] font-black uppercase text-emerald-600 tracking-wider flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live GPS
        </span>
        <span className="text-[12px] font-black text-slate-800 tracking-tight">
          {volunteerName}
        </span>
        <span className="text-[9px] font-bold text-slate-400">
          Tracking Active • 1 Hz
        </span>
      </div>
    </div>
  );
};
