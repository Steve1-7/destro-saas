import { AlertTriangle, Mic, Radio, UserX } from "lucide-react";
import { SectionHeader } from "./AgreementEngine";

export function SafetySuite() {
  return (
    <section id="safety" className="relative py-28 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Safety & Accountability"
          title="A panic button that wakes the whole neighborhood."
          desc="When something feels wrong, Omni-Commute doesn't just call a stranger — it alerts every Guardian and every Circle member in the area at once."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          {/* Panic button */}
          <div className="relative rounded-3xl p-10 overflow-hidden border border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent">
            <div className="absolute inset-0 opacity-30 grid-bg pointer-events-none" />
            <div className="relative flex flex-col items-center text-center">
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-destructive">
                PRIORITY · LIVE
              </div>
              <button className="mt-6 h-44 w-44 rounded-full bg-gradient-danger grid place-items-center pulse-danger glow-danger">
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
            </div>
          </div>

          {/* Permanent ban */}
          <div className="rounded-3xl p-8 glass-strong">
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

            <div className="mt-6 space-y-3">
              <BannedRow name="Anonymous · ID #44782" reason="Aggressive driving · 3 reports" />
              <BannedRow name="Anonymous · ID #19023" reason="Unpaid lien · 60 days" />
              <BannedRow name="Anonymous · ID #88114" reason="Identity falsification" />
            </div>

            <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/5 p-4 text-xs text-muted-foreground">
              <span className="font-mono text-primary">SHA-256:</span> ban records are
              cryptographically signed and shared across the neighborhood graph.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl glass px-3 py-2 text-xs flex items-center gap-2 justify-center text-muted-foreground">
      {icon} <span>{label}</span>
    </div>
  );
}

function BannedRow({ name, reason }: { name: string; reason: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 grayscale opacity-70">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{reason}</div>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-wider text-destructive border border-destructive/40 rounded-full px-2 py-0.5">
        BANNED
      </span>
    </div>
  );
}
