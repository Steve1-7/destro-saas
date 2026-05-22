import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  FileSignature,
  Calendar,
  Fuel,
  Route as RouteIcon,
  Gavel,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/contracts")({
  component: ContractsPage,
});

type Cadence = "monthly" | "weekly" | "on_demand";
type Model = "flat_seat" | "fuel_split" | "per_km";
type ContractStatus = "proposed" | "active" | "pending_settlement" | "settled" | "defaulted";

type Circle = { id: string; name: string };
type Contract = {
  id: string;
  cadence: Cadence;
  model: Model;
  amount: number;
  lien_deposit: number;
  status: ContractStatus;
  circle_id: string;
  created_at: string;
};

function ContractsPage() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [wizard, setWizard] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const [{ data: cs }, { data: circ }] = await Promise.all([
      supabase.from("contracts").select("*").order("created_at", { ascending: false }),
      supabase.from("circles").select("id, name"),
    ]);
    setContracts((cs as Contract[]) ?? []);
    setCircles((circ as Circle[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
            Digital Handshakes
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold">Contracts</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Legally-binding agreements between drivers and passengers.
          </p>
        </div>
        <button
          onClick={() => setWizard(true)}
          disabled={circles.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary disabled:opacity-50 self-start sm:self-auto whitespace-nowrap"
        >
          <FileSignature className="h-4 w-4" /> New Contract
        </button>
      </div>

      {circles.length === 0 && (
        <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
          Create a Circle first before drafting a contract.
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center mx-auto">
            <FileSignature className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold mt-4">No contracts yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Use the Contract Wizard to draft your first agreement.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c) => (
            <ContractRow
              key={c.id}
              contract={c}
              circleName={circles.find((x) => x.id === c.circle_id)?.name ?? "—"}
            />
          ))}
        </div>
      )}

      {wizard && circles.length > 0 && (
        <ContractWizard circles={circles} onClose={() => setWizard(false)} onCreated={load} />
      )}
    </div>
  );
}

const statusStyle: Record<ContractStatus, string> = {
  proposed: "text-warning border-warning/40 bg-warning/10",
  active: "text-primary border-primary/40 bg-primary/10",
  pending_settlement: "text-warning border-warning/40 bg-warning/10",
  settled: "text-muted-foreground border-white/10 bg-white/5",
  defaulted: "text-destructive border-destructive/40 bg-destructive/10",
};

function ContractRow({ contract, circleName }: { contract: Contract; circleName: string }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground truncate">{circleName}</div>
        <div className="font-display text-base sm:text-lg font-semibold mt-0.5 break-words">
          ${Number(contract.amount).toFixed(2)} · {labelModel(contract.model)} ·{" "}
          {labelCadence(contract.cadence)}
        </div>
        <div className="text-xs text-muted-foreground mt-1 font-mono">
          Lien deposit: ${Number(contract.lien_deposit).toFixed(2)}
        </div>
      </div>
      <span
        className={`text-[10px] font-mono uppercase tracking-wider border rounded-full px-2.5 py-1 self-start sm:self-auto whitespace-nowrap ${statusStyle[contract.status]}`}
      >
        {contract.status.replace("_", " ")}
      </span>
    </div>
  );
}

function labelCadence(c: Cadence) {
  return c === "monthly" ? "Monthly" : c === "weekly" ? "Weekly" : "On-demand";
}
function labelModel(m: Model) {
  return m === "flat_seat" ? "Flat seat" : m === "fuel_split" ? "Fuel-split" : "Per-KM";
}

// =================== WIZARD ===================
function ContractWizard({
  circles,
  onClose,
  onCreated,
}: {
  circles: Circle[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [circleId, setCircleId] = useState(circles[0]?.id ?? "");
  const [cadence, setCadence] = useState<Cadence>("monthly");
  const [model, setModel] = useState<Model>("flat_seat");
  const [amount, setAmount] = useState("240");
  const [lien, setLien] = useState("120");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    // Driver = current user (creator = driver in this flow); passenger = self for now (placeholder)
    const { error } = await supabase.from("contracts").insert({
      circle_id: circleId,
      driver_id: user.id,
      passenger_id: user.id,
      cadence,
      model,
      amount: Number(amount),
      lien_deposit: Number(lien),
      status: "proposed",
    });
    if (error) setError(error.message);
    else {
      onCreated();
      onClose();
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-32 -right-32 h-64 w-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ring" /> CONTRACT_WIZARD ·
            STEP {step}/4
          </div>
          <h3 className="font-display text-2xl font-semibold mt-2">Draft a Digital Handshake</h3>

          <div className="mt-6">
            {step === 1 && (
              <Step title="Select Circle">
                <select
                  value={circleId}
                  onChange={(e) => setCircleId(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm"
                >
                  {circles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Step>
            )}
            {step === 2 && (
              <Step title="Billing cadence">
                <Choice
                  options={[
                    { value: "monthly", label: "Monthly", desc: "Auto-billed on the 1st" },
                    { value: "weekly", label: "Weekly", desc: "Settled every Friday" },
                    { value: "on_demand", label: "On-demand", desc: "Per verified trip" },
                  ]}
                  value={cadence}
                  onChange={(v) => setCadence(v as Cadence)}
                />
              </Step>
            )}
            {step === 3 && (
              <Step title="Pricing model & amount">
                <Choice
                  options={[
                    {
                      value: "flat_seat",
                      label: "Flat seat",
                      desc: "Fixed amount",
                      icon: Calendar,
                    },
                    {
                      value: "fuel_split",
                      label: "Fuel-split",
                      desc: "% of fuel cost",
                      icon: Fuel,
                    },
                    { value: "per_km", label: "Per-KM", desc: "Distance-based", icon: RouteIcon },
                  ]}
                  value={model}
                  onChange={(v) => setModel(v as Model)}
                />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <NumField label="Amount ($)" value={amount} onChange={setAmount} />
                  <NumField label="Lien deposit ($)" value={lien} onChange={setLien} />
                </div>
              </Step>
            )}
            {step === 4 && (
              <Step title="Review & sign">
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3">
                  <Row label="Circle" value={circles.find((c) => c.id === circleId)?.name ?? "—"} />
                  <Row label="Cadence" value={labelCadence(cadence)} />
                  <Row label="Model" value={labelModel(model)} />
                  <Row label="Amount" value={`$${Number(amount).toFixed(2)}`} />
                  <Row label="Lien deposit" value={`$${Number(lien).toFixed(2)}`} />
                </div>
                <div className="flex items-start gap-3 mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <Gavel className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    By creating this contract you accept the{" "}
                    <span className="text-foreground">Default Clause</span>: if a passenger misses
                    payments, the driver may exercise a Digital Lien on the deposit and restrict
                    access until resolved.
                  </p>
                </div>
                {error && <div className="mt-3 text-xs text-destructive">{error}</div>}
              </Step>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {step === 1 ? "Cancel" : "Back"}
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary"
              >
                <Check className="h-4 w-4" /> {busy ? "Signing…" : "Sign & Create"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{title}</div>
      {children}
    </div>
  );
}

function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: {
    value: T;
    label: string;
    desc: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map(({ value: v, label, desc, icon: Icon }) => (
        <button
          type="button"
          key={v}
          onClick={() => onChange(v)}
          className={`text-left rounded-xl p-4 border transition ${
            value === v
              ? "border-primary/60 bg-primary/10 glow-primary"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          {Icon && <Icon className="h-4 w-4 text-primary mb-2" />}
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground mt-1">{desc}</div>
        </button>
      ))}
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </div>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
