import { TrendingUp, Users, Wallet, MapPinned } from "lucide-react";
import { SectionHeader } from "./AgreementEngine";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-28 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="The Digital Ledger"
          title="One source of truth for every ride."
          desc="Geofence-verified trips flow into a single dashboard. Settle the month with one tap — or one Face ID."
        />

        <div className="mt-14 rounded-3xl glass-strong p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-primary/15 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Kpi
              icon={<MapPinned className="h-4 w-4" />}
              label="Trips this month"
              value="127"
              trend="+12%"
            />
            <Kpi
              icon={<Users className="h-4 w-4" />}
              label="Active members"
              value="8"
              trend="100%"
            />
            <Kpi
              icon={<Wallet className="h-4 w-4" />}
              label="Pending settlement"
              value="$1,840"
              trend="due Apr 30"
            />
            <Kpi
              icon={<TrendingUp className="h-4 w-4" />}
              label="On-time rate"
              value="98.2%"
              trend="+1.4%"
            />
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">Live ride · Circle #042</div>
                <span className="text-xs font-mono text-primary inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ring" /> GEOFENCE
                  LOCKED
                </span>
              </div>
              <div className="relative h-56 rounded-xl overflow-hidden bg-surface-1 border border-white/5">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 220"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="route" x1="0" x2="1">
                      <stop offset="0%" stopColor="oklch(0.86 0.21 145)" />
                      <stop offset="100%" stopColor="oklch(0.78 0.2 165)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20,180 C 100,160 140,80 220,90 S 360,40 380,30"
                    stroke="url(#route)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="180" r="6" fill="oklch(0.86 0.21 145)" />
                  <circle cx="220" cy="90" r="5" fill="oklch(0.86 0.21 145)" />
                  <circle cx="380" cy="30" r="6" fill="oklch(0.86 0.21 145)" />
                </svg>
                <div className="absolute bottom-3 left-3 text-xs text-muted-foreground font-mono">
                  ETA 09:14 · 4.2 km · auto-logged
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
              <div className="text-sm font-medium mb-4">Recent ledger entries</div>
              <ul className="space-y-3 text-sm">
                <Entry name="Maya R." amount="+$12.40" tag="Verified" />
                <Entry name="Kenji T." amount="+$12.40" tag="Verified" />
                <Entry name="Paolo M." amount="—" tag="Skipped" tone="muted" />
                <Entry name="Amal S." amount="+$12.40" tag="Verified" />
                <Entry name="Diego F." amount="−$120" tag="Lien held" tone="warn" />
              </ul>
              <button className="mt-5 w-full text-sm py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary">
                Settle month with Face ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-primary font-mono mt-1">{trend}</div>
    </div>
  );
}

function Entry({
  name,
  amount,
  tag,
  tone,
}: {
  name: string;
  amount: string;
  tag: string;
  tone?: "muted" | "warn";
}) {
  const tagClass =
    tone === "warn"
      ? "text-destructive border-destructive/40"
      : tone === "muted"
        ? "text-muted-foreground border-white/10"
        : "text-primary border-primary/40";
  return (
    <li className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
      <div>
        <div>{name}</div>
        <span
          className={`text-[10px] font-mono uppercase tracking-wider border rounded-full px-2 py-0.5 ${tagClass}`}
        >
          {tag}
        </span>
      </div>
      <span className="font-mono text-sm">{amount}</span>
    </li>
  );
}
