import { Calendar, Fuel, Route, FileSignature, Gavel } from "lucide-react";

const cadences = [
  { label: "Monthly", desc: "Fixed flat fee, auto-billed" },
  { label: "Weekly", desc: "Settled every Friday" },
  { label: "Pay-as-you-go", desc: "Per verified trip" },
];

const models = [
  { icon: Calendar, label: "Flat fee", value: "$240/mo" },
  { icon: Fuel, label: "Fuel-split", value: "32% share" },
  { icon: Route, label: "Per-KM", value: "$0.18/km" },
];

export function AgreementEngine() {
  return (
    <section id="engine" className="relative py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="The Agreement Engine"
          title="Custom contracts. Automatic ledgers."
          desc="Spin up a Circle in minutes with your own billing cadence, payment model, and a legally-binding PDF agreement signed by every member."
        />

        <div className="mt-14 grid lg:grid-cols-5 gap-6">
          {/* Contract wizard mock */}
          <div className="lg:col-span-3 glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-primary/20 blur-3xl rounded-full" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="h-2 w-2 rounded-full bg-primary pulse-ring" />
              CONTRACT_WIZARD.LIVE
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold">
              Riverside Tech Park · Circle #042
            </h3>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Billing cadence
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {cadences.map((c, i) => (
                  <div
                    key={c.label}
                    className={`rounded-xl p-4 border text-sm transition ${
                      i === 0
                        ? "border-primary/60 bg-primary/10 glow-primary"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="font-medium">{c.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Payment model
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {models.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={`rounded-xl p-4 border ${
                      i === 1 ? "border-primary/60 bg-primary/10" : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-primary mb-2" />
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground font-mono">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center shrink-0">
                  <FileSignature className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">Generate signed agreement (PDF)</div>
                  <div className="text-xs text-muted-foreground">
                    Includes Lien Clause · Biometric signature
                  </div>
                </div>
              </div>
              <button className="text-xs font-mono text-primary self-end sm:self-auto">
                SIGN →
              </button>
            </div>
          </div>

          {/* Lien clause */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 flex flex-col">
            <Gavel className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-display text-2xl font-semibold">Built-in Lien Clause</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Every contract includes an opt-in clause letting the driver hold a digital deposit if
              a passenger defaults. Enforceable, transparent, and fully auditable.
            </p>

            <div className="mt-auto pt-8 space-y-3">
              <Row label="Deposit held" value="$120.00" />
              <Row label="Trips logged" value="42 / 44" />
              <Row label="Last settlement" value="Mar 28, 2026" />
              <Row label="Default risk" value="Low" tone="ok" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "ok" }) {
  return (
    <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono ${tone === "ok" ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-3">
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground">{desc}</p>
    </div>
  );
}
