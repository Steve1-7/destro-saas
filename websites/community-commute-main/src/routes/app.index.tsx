import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TrendingUp, Users, Wallet, MapPinned, ArrowRight, AlertTriangle, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ circles: 0, rides: 0, pending: 0 });
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [{ data: profile }, { count: circles }, { count: rides }] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        supabase
          .from("circle_members")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase.from("rides").select("*", { count: "exact", head: true }),
      ]);
      if (!cancelled) {
        setDisplayName(profile?.display_name ?? "neighbor");
        setStats({ circles: circles ?? 0, rides: rides ?? 0, pending: 0 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
          Dashboard
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">
          Good day, {displayName}.
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's moving in your neighborhood today.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="My Circles"
          value={String(stats.circles)}
          hint="Active memberships"
        />
        <Kpi
          icon={<MapPinned className="h-4 w-4" />}
          label="Rides logged"
          value={String(stats.rides)}
          hint="All-time"
        />
        <Kpi
          icon={<Wallet className="h-4 w-4" />}
          label="Pending settlement"
          value="$0.00"
          hint="No dues yet"
        />
        <Kpi
          icon={<TrendingUp className="h-4 w-4" />}
          label="Trust score"
          value="100"
          hint="Verified"
          tone="ok"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Link
          to="/app/circles"
          className="lg:col-span-2 group glass-strong rounded-3xl p-6 hover:border-primary/40 transition relative overflow-hidden"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-15 blur-xl transition" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-primary">
                Get started
              </div>
              <h3 className="font-display text-2xl font-semibold mt-1">Create your first Circle</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Invite neighbors or colleagues, lock in a route, and let Omni handle billing &
                verification.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <div className="space-y-4">
          <Link
            to="/app/ride/new"
            className="group glass rounded-3xl p-6 hover:border-primary/40 border border-transparent transition relative overflow-hidden block"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-15 blur-xl transition" />
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mt-4">Request a Ride</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Get picked up by a nearby driver. Real-time tracking included.
              </p>
            </div>
          </Link>

          <Link
            to="/app/safety"
            className="group glass rounded-3xl p-6 hover:border-destructive/40 border border-transparent transition relative overflow-hidden block"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-danger opacity-0 group-hover:opacity-15 blur-xl transition" />
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-destructive/15 border border-destructive/30 grid place-items-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-display text-lg font-semibold mt-4">Safety Center</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Panic alerts, guardians, and community safety.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Recent activity</h3>
          <span className="text-xs font-mono text-muted-foreground">live</span>
        </div>
        <div className="text-center py-12 text-sm text-muted-foreground">
          No activity yet. Create a Circle to start logging trips.
        </div>
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
