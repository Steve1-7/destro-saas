import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/ride/$rideId")({
  head: () => ({ meta: [{ title: "Live Ride — Omni-Commute" }] }),
  component: LiveRideTracker,
});

type LocationPoint = {
  lat: number;
  lng: number;
  recorded_at: string;
  heading: number | null;
  speed_kmh: number | null;
};

type RideData = {
  id: string;
  status: string;
  driver_id: string;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
};

function LiveRideTracker() {
  const { rideId } = Route.useParams();
  const { user } = useAuth();
  const [ride, setRide] = useState<RideData | null>(null);
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("rides").select("*").eq("id", rideId).maybeSingle();
    setRide(data as RideData | null);
    const { data: locs } = await supabase
      .from("ride_locations")
      .select("lat, lng, recorded_at, heading, speed_kmh")
      .eq("ride_id", rideId)
      .order("recorded_at", { ascending: true })
      .limit(200);
    setLocations((locs as LocationPoint[]) ?? []);
    setLoading(false);
  }, [rideId]);

  useEffect(() => {
    load();
  }, [load]);

  // Subscribe to real-time location updates
  useEffect(() => {
    const channel = supabase
      .channel(`ride-${rideId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ride_locations",
          filter: `ride_id=eq.${rideId}`,
        },
        (payload) => {
          const newLoc = payload.new as LocationPoint;
          setLocations((prev) => [...prev, newLoc]);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rides", filter: `id=eq.${rideId}` },
        (payload) => {
          setRide((prev) => (prev ? { ...prev, ...(payload.new as Partial<RideData>) } : null));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || loading) return;

    let cancelled = false;
    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] =
        ride?.start_lat && ride?.start_lng ? [ride.start_lat, ride.start_lng] : [-1.2921, 36.8219];

      const map = L.map(mapRef.current).setView(center, 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add pickup marker
      if (ride?.start_lat && ride?.start_lng) {
        L.marker([ride.start_lat, ride.start_lng]).addTo(map).bindPopup("Pickup").openPopup();
      }
      if (ride?.end_lat && ride?.end_lng) {
        L.marker([ride.end_lat, ride.end_lng]).addTo(map).bindPopup("Drop-off");
      }
    };

    initMap();
    return () => {
      cancelled = true;
    };
  }, [loading, ride?.start_lat, ride?.start_lng, ride?.end_lat, ride?.end_lng]);

  // Update driver marker on map
  useEffect(() => {
    if (!mapInstanceRef.current || locations.length === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    const map = mapInstanceRef.current as L.Map;
    const last = locations[locations.length - 1];

    if (markerRef.current) {
      (markerRef.current as L.Marker).setLatLng([last.lat, last.lng]);
    } else {
      const driverIcon = L.divIcon({
        className: "driver-marker",
        html: '<div style="background:#22c55e;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      markerRef.current = L.marker([last.lat, last.lng], { icon: driverIcon })
        .addTo(map)
        .bindPopup("Driver");
    }

    map.panTo([last.lat, last.lng]);
  }, [locations]);

  const latestLoc = locations[locations.length - 1];

  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-sm text-muted-foreground font-mono">Loading ride…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-1">
            Live Ride
          </div>
          <h1 className="font-display text-2xl font-semibold">Ride Tracking</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/messages"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm hover:bg-white/[0.07] transition"
          >
            <MessageSquare className="h-4 w-4" /> Chat
          </Link>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/25 transition">
            <Phone className="h-4 w-4" /> Call
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="glass rounded-3xl overflow-hidden">
        <div ref={mapRef} className="h-[400px] md:h-[500px] w-full" />
      </div>

      {/* Status bar */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${ride?.status === "in_progress" ? "bg-primary animate-pulse" : ride?.status === "completed" ? "bg-green-400" : "bg-yellow-400"}`}
          />
          <span className="text-sm font-medium capitalize">
            {ride?.status?.replace("_", " ") ?? "Unknown"}
          </span>
        </div>
        {latestLoc && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" />
              {latestLoc.speed_kmh != null ? `${latestLoc.speed_kmh.toFixed(0)} km/h` : "—"}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {latestLoc.lat.toFixed(4)}, {latestLoc.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
