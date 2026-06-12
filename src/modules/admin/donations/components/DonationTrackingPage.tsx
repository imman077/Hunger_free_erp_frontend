import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import ImpactCards from "../../../../global/components/resuable-components/ImpactCards";
import {
  MapPin,
  TrendingUp,
  Users,
  Package,
  Crosshair,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

interface DonationMarker {
  id: string;
  name: string;
  coordinates: [number, number];
  amount: number;
  status: "active" | "pending" | "completed";
}

// Component to handle map centering
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const DonationTrackingPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // Leaflet needs to recalculate its size when the container changes
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      },
    );
  };

  // Sample donation locations
  const donations: DonationMarker[] = [
    {
      id: "1",
      name: "Chennai Hub",
      coordinates: [13.0827, 80.2707],
      amount: 450,
      status: "active",
    },
    {
      id: "2",
      name: "Mumbai Center",
      coordinates: [19.076, 72.8777],
      amount: 320,
      status: "completed",
    },
    {
      id: "3",
      name: "Delhi Distribution",
      coordinates: [28.7041, 77.1025],
      amount: 580,
      status: "active",
    },
    {
      id: "4",
      name: "Bangalore Hub",
      coordinates: [12.9716, 77.5946],
      amount: 290,
      status: "pending",
    },
    {
      id: "5",
      name: "Kolkata Center",
      coordinates: [22.5726, 88.3639],
      amount: 410,
      status: "active",
    },
  ];

  const stats = [
    {
      label: "Active Donations",
      val: "24",
      trend: "+12% from yesterday",
      color: "bg-emerald-500",
    },
    {
      label: "Total Weight",
      val: "2,050 KG",
      trend: "+340 KG today",
      color: "bg-emerald-500",
    },
    {
      label: "Hubs Active",
      val: "18",
      trend: "98% operational",
      color: "bg-slate-300",
    },
    {
      label: "Beneficiaries",
      val: "1,240",
      trend: "Meals served today",
      color: "bg-emerald-500",
    },
  ];

  const getMarkerIcon = (status: string) => {
    const color =
      status === "active"
        ? "#10b981"
        : status === "pending"
          ? "#f59e0b"
          : "#6b7280";

    return divIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1000;
          "></div>
          <div style="
            width: 48px;
            height: 48px;
            background-color: ${color};
            opacity: 0.3;
            border-radius: 50%;
            position: absolute;
            top: -8px;
            left: -8px;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  const getUserIcon = () => {
    return divIcon({
      className: "user-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 24px;
            height: 24px;
            background-color: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
            position: relative;
            z-index: 1000;
          "></div>
          <div style="
            width: 40px;
            height: 40px;
            background-color: #3b82f6;
            opacity: 0.2;
            border-radius: 50%;
            position: absolute;
            top: -8px;
            left: -8px;
            animation: pulse-blue 2s infinite;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div
      className={`p-4 md:p-6 space-y-6 ${isFullScreen ? "overflow-hidden" : ""}`}
    >
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes pulse-blue {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .user-marker {
          background: transparent;
          border: none;
        }
        .leaflet-container {
          z-index: 1;
        }
        .full-screen-map {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          margin: 0 !important;
          border-radius: 0 !important;
          background: var(--bg-primary) !important;
          padding: 0 !important;
          border: none !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 10px;
        }
      `}</style>

      {!isFullScreen && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1
                className="text-xl md:text-2xl font-black capitalize tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Live Tracking
              </h1>
              <p
                className="text-xs md:text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Real-time donation tracking across all hubs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-sm border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/10`}
                style={{
                  backgroundColor: "#22c55e",
                  borderColor: "var(--border-color)",
                  color: "white",
                }}
              >
                <Crosshair
                  className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`}
                />
                {isLocating ? "Locating..." : "Locate Me"}
              </button>
            </div>
          </div>

          <ImpactCards data={stats} />
        </>
      )}

      {/* Map and Activity Section */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${isFullScreen ? "block" : ""}`}
      >
        {/* Map */}
        <div
          className={`rounded-sm border transition-all duration-300 ${
            isFullScreen ? "full-screen-map" : "lg:col-span-2 p-4 md:p-6"
          }`}
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 ${isFullScreen ? "absolute top-4 left-4 right-4 z-[10000] p-4 bg-[var(--bg-primary)]/90 backdrop-blur-md rounded-sm border border-[var(--border-color)] shadow-2xl" : ""}`}
          >
            <div className="flex items-center gap-3">
              <h2
                className="text-sm md:text-base font-black uppercase tracking-widest"
                style={{ color: "var(--text-primary)" }}
              >
                Donation Locations
              </h2>
              <button
                onClick={toggleFullScreen}
                className="p-1.5 rounded-sm border hover:bg-[var(--bg-secondary)] transition-all bg-[var(--bg-primary)]"
                style={{ borderColor: "var(--border-color)" }}
                title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
              >
                {isFullScreen ? (
                  <Minimize2 className="w-4 h-4 text-[var(--text-primary)]" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[var(--text-primary)]" />
                )}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[9px] font-black uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span style={{ color: "var(--text-secondary)" }}>Me</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span style={{ color: "var(--text-secondary)" }}>Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span style={{ color: "var(--text-secondary)" }}>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-gray-400" />
                <span style={{ color: "var(--text-secondary)" }}>Done</span>
              </div>
              {isFullScreen && (
                <button
                  onClick={toggleFullScreen}
                  className="ml-auto sm:ml-4 flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-sm text-[10px] font-black uppercase tracking-widest active:scale-95"
                >
                  <X className="w-3 h-3" />
                  Close Map
                </button>
              )}
            </div>
          </div>

          <div
            className={`relative rounded-sm border overflow-hidden z-0 ${
              isFullScreen ? "h-screen w-screen" : "h-[350px] md:h-[500px]"
            }`}
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController center={userLocation} />

              {userLocation && (
                <Marker position={userLocation} icon={getUserIcon()}>
                  <Popup>
                    <div className="p-1">
                      <p className="text-xs font-bold text-gray-900 text-center">
                        You are here
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {donations.map((donation) => (
                <Marker
                  key={donation.id}
                  position={donation.coordinates}
                  icon={getMarkerIcon(donation.status)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">
                        {donation.name}
                      </h3>
                      <div className="space-y-1 text-xs">
                        <p className="text-gray-600">
                          Amount:{" "}
                          <span className="font-bold">
                            {donation.amount} KG
                          </span>
                        </p>
                        <p className="text-gray-600">
                          Status:{" "}
                          <span
                            className={`font-bold capitalize ${
                              donation.status === "active"
                                ? "text-emerald-600"
                                : donation.status === "pending"
                                  ? "text-amber-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {donation.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        {!isFullScreen && (
          <div
            className="rounded-sm border p-4 md:p-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <h2
              className="text-sm md:text-base font-black uppercase tracking-widest mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Live Activity
            </h2>
            <div className="space-y-6">
              {[
                {
                  time: "2 min ago",
                  action: "New donation received",
                  location: "Chennai Hub",
                  amount: "45 KG",
                  icon: Package,
                },
                {
                  time: "5 min ago",
                  action: "Distribution completed",
                  location: "Mumbai Center",
                  amount: "120 KG",
                  icon: TrendingUp,
                },
                {
                  time: "12 min ago",
                  action: "Volunteer assigned",
                  location: "Delhi Distribution",
                  amount: "3 volunteers",
                  icon: Users,
                },
                {
                  time: "18 min ago",
                  action: "Pickup scheduled",
                  location: "Bangalore Hub",
                  amount: "85 KG",
                  icon: MapPin,
                },
                {
                  time: "25 min ago",
                  action: "New donation received",
                  location: "Kolkata Center",
                  amount: "62 KG",
                  icon: Package,
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                  style={{ borderBottomColor: "var(--border-color)" }}
                >
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.08)" }}
                  >
                    <activity.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-black uppercase tracking-tight mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {activity.action}
                    </p>
                    <p
                      className="text-[10px] font-bold"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {activity.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] font-black text-emerald-600">
                        {activity.amount}
                      </span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationTrackingPage;
