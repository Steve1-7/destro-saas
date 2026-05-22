import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Mic, Radio, ShieldCheck, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/safety")({
  component: SafetyPage,
});

type Alert = {
  id: string;
  user_id: string;
  current_lat: number | null;
  current_lng: number | null;
  is_resolved: boolean;
  created_at: string;
};

function SafetyPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("panic_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setAlerts((data as Alert[]) ?? []);
  };

  useEffect(() => {
    load();
  }, [user]);

  const trigger = async () => {
    if (!user) return;
    let lat: number | null = null,
      lng: number | null = null;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 }),
      );
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch {
      // Geolocation unavailable or denied - proceed without location
    }
    await supabase
      .from("panic_alerts")
      .insert({ user_id: user.id, current_lat: lat, current_lng: lng });
    setTriggered(true);
    setConfirming(false);
    load();
    setTimeout(() => setTriggered(false), 3500);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-destructive mb-2">
          Safety Center
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">
          Your community safety net
        </h1>
        <p className="text-muted-foreground mt-1">
          One tap alerts every Guardian and every Circle member.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panic */}
        <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden border border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent">
          <div className="absolute inset-0 opacity-30 grid-bg pointer-events-none" />
          <div className="relative flex flex-col items-center text-center">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-destructive">
              PRIORITY · LIVE
            </div>
            <button
              onClick={() => setConfirming(true)}
              className="mt-6 h-44 w-44 rounded-full bg-gradient-danger grid place-items-center pulse-danger glow-danger active:scale-95 transition"
            >
              <div className="text-center">
                <AlertTriangle className="h-10 w-10 text-destructive-foreground mx-auto" />
                <div className="mt-2 font-display font-semibold text-destructive-foreground">
                  PANIC
                </div>
              </div>
            </button>
            <div className="mt-8 grid grid-cols-3 gap-3 w-full">
              <Pill icon={<Mic className="h-4 w-4" />} label="Audio recording" />
              <Pill icon={<Radio className="h-4 w-4" />} label="GPS to Guardians" />
              <Pill icon={<AlertTriangle className="h-4 w-4" />} label="Circle warning" />
            </div>
            {triggered && (
              <div className="mt-6 px-4 py-2 rounded-xl bg-destructive/15 border border-destructive/40 text-xs text-destructive font-mono">
                ALERT BROADCAST · GUARDIANS NOTIFIED
              </div>
            )}
          </div>
        </div>

        {/* Permanent ban */}
        <div className="rounded-3xl p-6 sm:p-8 glass-strong">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/15 grid place-items-center border border-destructive/30">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <h3 className="font-display text-2xl font-semibold">Permanent Blacklist</h3>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Confirmed safety breaches are tied to verified ID + device fingerprint. Once banned,
            that identity can never re-enter any Circle in the neighborhood.
          </p>
          <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/5 p-6 text-center">
            <ShieldCheck className="h-8 w-8 text-primary mx-auto" />
            <div className="text-sm font-medium mt-3">Your network is clean</div>
            <div className="text-xs text-muted-foreground mt-1">No active bans in your area.</div>
          </div>
        </div>
      </div>

      {/* Alert log */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Alert log</h3>
        {alerts.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No panic alerts triggered. Stay safe.
          </div>
        ) : (
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-2 last:border-0"
              >
                <div className="min-w-0">
                  <div className="text-sm">Alert #{a.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground font-mono break-all">
                    {a.current_lat && a.current_lng
                      ? `${a.current_lat.toFixed(4)}, ${a.current_lng.toFixed(4)}`
                      : "GPS unavailable"}{" "}
                    · {new Date(a.created_at).toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider border rounded-full px-2 py-0.5 self-start sm:self-auto whitespace-nowrap ${a.is_resolved ? "text-muted-foreground border-white/10" : "text-destructive border-destructive/40"}`}
                >
                  {a.is_resolved ? "RESOLVED" : "ACTIVE"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setConfirming(false)}
        >
          <div
            className="glass-strong rounded-3xl p-8 max-w-md w-full text-center border border-destructive/40"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
            <h3 className="font-display text-xl font-semibold mt-4">Trigger emergency alert?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              All Guardians and your active Circle members will be notified instantly. Audio
              recording will start.
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 px-4 py-2.5 rounded-xl glass"
              >
                Cancel
              </button>
              <button
                onClick={trigger}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-danger text-destructive-foreground font-medium glow-danger"
              >
                Confirm panic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl glass px-3 py-2 text-xs flex items-center gap-2 justify-center text-muted-foreground">
      {icon} <span>{label}</span>
    </div>
  );
}
