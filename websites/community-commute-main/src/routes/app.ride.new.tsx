import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/ride/new")({
  head: () => ({ meta: [{ title: "Request a Ride — Omni-Commute" }] }),
  component: RequestRide,
});

function RequestRide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupLat, setPickupLat] = useState(0);
  const [pickupLng, setPickupLng] = useState(0);
  const [dropoffLat, setDropoffLat] = useState(0);
  const [dropoffLng, setDropoffLng] = useState(0);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locateMe = async (target: "pickup" | "dropoff") => {
    setLocating(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }),
      );
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      if (target === "pickup") {
        setPickupLat(lat);
        setPickupLng(lng);
        setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } else {
        setDropoffLat(lat);
        setDropoffLng(lng);
        setDropoff(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch {
      setError("Could not get your location. Please enter manually.");
    }
    setLocating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    if (!pickupLat || !pickupLng) {
      setError("Please set a pickup location.");
      return;
    }
    if (!dropoffLat || !dropoffLng) {
      setError("Please set a drop-off location.");
      return;
    }

    setSubmitting(true);
    const { data, error: insertErr } = await supabase
      .from("ride_requests")
      .insert({
        rider_id: user.id,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        pickup_address: pickup,
        dropoff_lat: dropoffLat,
        dropoff_lng: dropoffLng,
        dropoff_address: dropoff,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr) {
      setError(insertErr.message);
      setSubmitting(false);
      return;
    }

    // Create a conversation for this ride request
    // First find an available driver (we'll match later when accepted)
    // For now, navigate to a waiting screen
    setSubmitting(false);
    navigate({ to: "/app" });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">Ride</div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Request a Ride</h1>
        <p className="text-muted-foreground mt-1">
          Enter your pickup and drop-off to find a nearby driver.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 space-y-6">
        {/* Pickup */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Pickup Location
            </div>
            <button
              type="button"
              onClick={() => locateMe("pickup")}
              disabled={locating}
              className="text-xs text-primary hover:underline disabled:opacity-50"
            >
              {locating ? "Locating..." : "Use my location"}
            </button>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup address or coordinates"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
        </div>

        {/* Dropoff */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Drop-off Location
            </div>
            <button
              type="button"
              onClick={() => locateMe("dropoff")}
              disabled={locating}
              className="text-xs text-primary hover:underline disabled:opacity-50"
            >
              {locating ? "Locating..." : "Use current"}
            </button>
          </div>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter drop-off address or coordinates"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
        </div>

        {/* Manual coordinate entry */}
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground transition">
            Enter coordinates manually
          </summary>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input
              type="number"
              step="any"
              placeholder="Pickup lat"
              value={pickupLat || ""}
              onChange={(e) => setPickupLat(parseFloat(e.target.value) || 0)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition"
            />
            <input
              type="number"
              step="any"
              placeholder="Pickup lng"
              value={pickupLng || ""}
              onChange={(e) => setPickupLng(parseFloat(e.target.value) || 0)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition"
            />
            <input
              type="number"
              step="any"
              placeholder="Dropoff lat"
              value={dropoffLat || ""}
              onChange={(e) => setDropoffLat(parseFloat(e.target.value) || 0)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition"
            />
            <input
              type="number"
              step="any"
              placeholder="Dropoff lng"
              value={dropoffLng || ""}
              onChange={(e) => setDropoffLng(parseFloat(e.target.value) || 0)}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition"
            />
          </div>
        </details>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 transition disabled:opacity-60"
        >
          {submitting ? "Finding driver..." : "Request Ride"} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
