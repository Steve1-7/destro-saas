import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/driver/earnings")({
  head: () => ({ meta: [{ title: "Earnings — Omni-Commute" }] }),
  component: DriverEarnings,
});

type EarningRow = {
  id: string;
  amount: number;
  platform_fee: number;
  net_amount: number;
  period: string;
  created_at: string;
};

function DriverEarnings() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("weekly");

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("driver_earnings")
      .select("*")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setEarnings((data as EarningRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = earnings.filter((e) => {
    if (view === "daily") return e.period.length === 10;
    if (view === "monthly") return e.period.length === 7;
    return true;
  });

  const totalNet = filtered.reduce((s, e) => s + e.net_amount, 0);
  const totalGross = filtered.reduce((s, e) => s + e.amount, 0);
  const totalFees = filtered.reduce((s, e) => s + e.platform_fee, 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">Driver</div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Earnings</h1>
      </div>

      {/* Period toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
        {(["daily", "weekly", "monthly"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === v
                ? "bg-gradient-primary text-primary-foreground glow-primary"
                : "text-muted-foreground"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DollarSign className="h-4 w-4" /> Gross
          </div>
          <div className="mt-2 font-display text-2xl font-semibold">${totalGross.toFixed(2)}</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-4 w-4" /> Net
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-primary">
            ${totalNet.toFixed(2)}
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" /> Fees
          </div>
          <div className="mt-2 font-display text-2xl font-semibold">${totalFees.toFixed(2)}</div>
        </div>
      </div>

      {/* Earnings list */}
      {loading ? (
        <div className="text-sm text-muted-foreground font-mono">Loading earnings…</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No earnings yet. Complete rides to start earning.
          </p>
        </div>
      ) : (
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Breakdown</h3>
          <div className="space-y-2">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">{e.period}</div>
                  <div className="text-xs text-muted-foreground">
                    Fee: ${e.platform_fee.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    ${e.net_amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">of ${e.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
