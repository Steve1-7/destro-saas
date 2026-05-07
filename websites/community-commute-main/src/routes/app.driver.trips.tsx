import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Navigation, Clock, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/driver/trips")({
  head: () => ({ meta: [{ title: "Trip History — Omni-Commute" }] }),
  component: TripHistory,
});

type Trip = {
  id: string;
  created_at: string;
  scheduled_for: string;
  started_at: string | null;
  ended_at: string | null;
  distance_km: number | null;
  status: string;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
};

function TripHistory() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setTrips((data as Trip[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const statusColor = (s: string) => {
    if (s === "completed") return "text-primary";
    if (s === "in_progress") return "text-yellow-400";
    if (s === "disputed") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">Driver</div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Trip History</h1>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground font-mono">Loading trips…</div>
      ) : trips.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <Navigation className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No trips yet. Go online to start accepting rides.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((t) => (
            <div
              key={t.id}
              className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {new Date(t.created_at).toLocaleDateString()} ·{" "}
                    {new Date(t.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.distance_km != null ? `${t.distance_km} km` : "Distance N/A"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono uppercase ${statusColor(t.status)}`}>
                  {t.status.replace("_", " ")}
                </span>
                {t.status === "completed" && <CheckCircle className="h-4 w-4 text-primary" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
