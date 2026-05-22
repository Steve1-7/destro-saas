import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Power,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  TrendingUp,
  Car,
  ArrowRight,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/driver")({
  head: () => ({ meta: [{ title: "Driver Dashboard — Omni-Commute" }] }),
  component: DriverDashboard,
});

type RideRequest = {
  id: string;
  rider_id: string;
  pickup_lat: number;
  pickup_lng: number;
  pickup_address: string | null;
  dropoff_lat: number;
  dropoff_lng: number;
  dropoff_address: string | null;
  fare: number | null;
  estimated_duration_min: number | null;
  created_at: string;
  status: string;
};

type DriverProfile = {
  is_online: boolean;
  verification_status: string;
  rating: number;
  total_trips: number;
  total_earnings: number;
};

type EarningsSummary = {
  today: number;
  thisWeek: number;
  thisMonth: number;
};

function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [pendingRequests, setPendingRequests] = useState<RideRequest[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: dp } = await supabase
      .from("driver_profiles")
      .select("is_online, verification_status, rating, total_trips, total_earnings")
      .eq("id", user.id)
      .maybeSingle();
    setDriverProfile(dp as DriverProfile | null);

    if (dp?.is_online && dp.verification_status === "approved") {
      const { data: reqs } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(10);
      setPendingRequests((reqs as RideRequest[]) ?? []);
    }

    // Earnings
    const today = new Date().toISOString().slice(0, 10);
    const weekStart = getWeekStart();
    const monthStart = today.slice(0, 7);
    const { data: eData } = await supabase
      .from("driver_earnings")
      .select("amount, period")
      .eq("driver_id", user.id);
    const rows = (eData as { amount: number; period: string }[]) ?? [];
    const todayE = rows.filter((r) => r.period === today).reduce((s, r) => s + r.amount, 0);
    const weekE = rows.filter((r) => r.period >= weekStart).reduce((s, r) => s + r.amount, 0);
    const monthE = rows
      .filter((r) => r.period.startsWith(monthStart))
      .reduce((s, r) => s + r.amount, 0);
    setEarnings({ today: todayE, thisWeek: weekE, thisMonth: monthE });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Subscribe to new ride requests when online
  useEffect(() => {
    if (!driverProfile?.is_online || driverProfile.verification_status !== "approved") return;
    const channel = supabase
      .channel("driver-ride-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ride_requests", filter: "status=eq.pending" },
        (payload) => {
          setPendingRequests((prev) => [payload.new as RideRequest, ...prev].slice(0, 10));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ride_requests" },
        (payload) => {
          const updated = payload.new as RideRequest;
          if (updated.status !== "pending") {
            setPendingRequests((prev) => prev.filter((r) => r.id !== updated.id));
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverProfile?.is_online, driverProfile?.verification_status]);

  const toggleOnline = async () => {
    if (!user || !driverProfile) return;
    const newVal = !driverProfile.is_online;
    const updates: {
      is_online: boolean;
      current_lat?: number;
      current_lng?: number;
      location_updated_at?: string;
    } = { is_online: newVal };
    if (newVal) {
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }),
        );
        updates.current_lat = pos.coords.latitude;
        updates.current_lng = pos.coords.longitude;
        updates.location_updated_at = new Date().toISOString();
      } catch {
        // Location unavailable - proceed without toggle
      }
    }
    await supabase.from("driver_profiles").update(updates).eq("id", user.id);
    setDriverProfile({ ...driverProfile, is_online: newVal });
  };

  const handleRequest = async (requestId: string, accept: boolean) => {
    if (!user) return;
    setProcessingId(requestId);
    const status = accept ? "accepted" : "rejected";
    await supabase
      .from("ride_requests")
      .update({
        status,
        driver_id: accept ? user.id : null,
        accepted_at: accept ? new Date().toISOString() : null,
      })
      .eq("id", requestId);
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-sm text-muted-foreground font-mono">Loading driver dashboard…</div>
      </div>
    );
  }

  // Not a driver yet
  if (!driverProfile) {
    return (
      <div className="space-y-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
            Driver
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Become a Driver</h1>
          <p className="text-muted-foreground mt-1">
            Start earning by driving your community. Complete onboarding to get started.
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/app/driver/onboarding" })}
          className="group glass-strong rounded-3xl p-6 hover:border-primary/40 transition relative overflow-hidden w-full text-left"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-15 blur-xl transition pointer-events-none" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-primary">
                Get started
              </div>
              <h3 className="font-display text-2xl font-semibold mt-1">Driver Onboarding</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Verify your identity, upload your license, register your vehicle, and start
                accepting rides.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition" />
          </div>
        </button>
      </div>
    );
  }

  // Verification pending
  if (driverProfile.verification_status === "pending") {
    return (
      <div className="space-y-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
            Driver
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Verification Pending</h1>
        </div>
        <div className="glass rounded-3xl p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-xl font-semibold">Your application is under review</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're reviewing your documents. This usually takes 24–48 hours. You'll be notified once
            approved.
          </p>
        </div>
      </div>
    );
  }

  // Rejected
  if (driverProfile.verification_status === "rejected") {
    return (
      <div className="space-y-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
            Driver
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">
            Verification Not Approved
          </h1>
        </div>
        <div className="glass rounded-3xl p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 border border-destructive/30">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-semibold">Application was not approved</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your driver application was not approved. Please review your documents and reapply.
          </p>
          <button
            onClick={() => navigate({ to: "/app/driver/onboarding" })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 transition"
          >
            Reapply <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Approved driver — full dashboard
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
            Driver
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold">Driver Dashboard</h1>
        </div>
        <button
          onClick={toggleOnline}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition ${
            driverProfile.is_online
              ? "bg-primary/15 text-primary border border-primary/30 glow-primary"
              : "bg-white/[0.03] border border-white/10 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Power className={`h-4 w-4 ${driverProfile.is_online ? "text-primary" : ""}`} />
          {driverProfile.is_online ? "Online" : "Go Online"}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi
          icon={<DollarSign className="h-4 w-4" />}
          label="Today"
          value={`$${earnings.today.toFixed(2)}`}
          hint="Earnings today"
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="This Week"
          value={`$${earnings.thisWeek.toFixed(2)}`}
          hint="Weekly earnings"
        />
        <Kpi
          icon={<Car className="h-4 w-4" />}
          label="Total Trips"
          value={String(driverProfile.total_trips)}
          hint="All-time"
        />
        <Kpi
          icon={<Star className="h-4 w-4" />}
          label="Rating"
          value={driverProfile.rating.toFixed(1)}
          hint={`${driverProfile.total_trips} trips`}
          tone="ok"
        />
      </div>

      {/* Pending ride requests */}
      {driverProfile.is_online && (
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Ride Requests</h3>
            <span className="text-xs font-mono text-primary animate-pulse">● Live</span>
          </div>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No pending requests. Stay online — new rides will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {req.pickup_address ??
                          `${req.pickup_lat.toFixed(4)}, ${req.pickup_lng.toFixed(4)}`}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        →{" "}
                        {req.dropoff_address ??
                          `${req.dropoff_lat.toFixed(4)}, ${req.dropoff_lng.toFixed(4)}`}
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        {req.fare != null && <span>${req.fare.toFixed(2)}</span>}
                        {req.estimated_duration_min != null && (
                          <span>~{req.estimated_duration_min} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRequest(req.id, true)}
                      disabled={processingId === req.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/15 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/25 transition disabled:opacity-50"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => handleRequest(req.id, false)}
                      disabled={processingId === req.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-muted-foreground text-sm font-medium hover:text-destructive hover:border-destructive/30 transition disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/app/driver/trips"
          className="group glass rounded-2xl p-5 hover:border-primary/40 border border-transparent transition"
        >
          <Navigation className="h-5 w-5 text-primary mb-2" />
          <h4 className="font-display font-semibold">Trip History</h4>
          <p className="text-xs text-muted-foreground mt-1">View all completed rides</p>
        </Link>
        <Link
          to="/app/driver/earnings"
          className="group glass rounded-2xl p-5 hover:border-primary/40 border border-transparent transition"
        >
          <DollarSign className="h-5 w-5 text-primary mb-2" />
          <h4 className="font-display font-semibold">Earnings</h4>
          <p className="text-xs text-muted-foreground mt-1">Detailed breakdown</p>
        </Link>
        <Link
          to="/app/driver/onboarding"
          className="group glass rounded-2xl p-5 hover:border-primary/40 border border-transparent transition"
        >
          <Car className="h-5 w-5 text-primary mb-2" />
          <h4 className="font-display font-semibold">Vehicle & Docs</h4>
          <p className="text-xs text-muted-foreground mt-1">Update your info</p>
        </Link>
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone?: "ok";
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`mt-2 font-display text-2xl font-semibold ${tone === "ok" ? "text-primary" : ""}`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}
