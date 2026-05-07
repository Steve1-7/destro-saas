import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Users, MapPin, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/circles")({
  component: CirclesPage,
});

type Circle = {
  id: string;
  name: string;
  neighborhood: string;
  origin_label: string | null;
  destination_label: string | null;
  driver_id: string;
  is_active: boolean;
};

function CirclesPage() {
  const { user } = useAuth();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("circles")
      .select("*")
      .order("created_at", { ascending: false });
    setCircles((data as Circle[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
            Circles
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold">
            Your carpool network
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Recurring routes, shared with people you trust.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> New Circle
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground font-mono">Loading…</div>
      ) : circles.length === 0 ? (
        <EmptyState onCreate={() => setOpen(true)} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {circles.map((c) => (
            <CircleCard key={c.id} circle={c} />
          ))}
        </div>
      )}

      {open && <CreateCircleDialog onClose={() => setOpen(false)} onCreated={load} />}
    </div>
  );
}

function CircleCard({ circle }: { circle: Circle }) {
  return (
    <Link
      to="/app/contracts"
      className="group glass-strong rounded-3xl p-6 hover:border-primary/40 transition relative overflow-hidden block"
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-15 blur-xl transition" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ring" />
            {circle.is_active ? "ACTIVE" : "PAUSED"}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
        </div>
        <h3 className="font-display text-xl font-semibold mt-3">{circle.name}</h3>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
          <MapPin className="h-3 w-3" /> {circle.neighborhood}
        </div>
        {(circle.origin_label || circle.destination_label) && (
          <div className="mt-4 text-sm text-muted-foreground font-mono">
            {circle.origin_label} → {circle.destination_label}
          </div>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" /> 1 member
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass-strong rounded-3xl p-12 text-center">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center mx-auto">
        <Users className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold mt-4">No Circles yet</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
        A Circle is a recurring carpool with neighbors or colleagues. Create one to start.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary"
      >
        <Plus className="h-4 w-4" /> Create your first Circle
      </button>
    </div>
  );
}

function CreateCircleDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    const { data, error } = await supabase
      .from("circles")
      .insert({
        name,
        neighborhood,
        origin_label: origin,
        destination_label: destination,
        driver_id: user.id,
      })
      .select()
      .single();
    if (!error && data) {
      // auto-add driver as a member
      await supabase
        .from("circle_members")
        .insert({ circle_id: data.id, user_id: user.id, role: "driver", status: "active" });
      onCreated();
      onClose();
    } else {
      setError(error?.message ?? "Could not create circle");
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-2xl font-semibold">Start a new Circle</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You'll be the driver. Add members later.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <DialogField
            label="Circle name"
            value={name}
            onChange={setName}
            placeholder="Riverside Tech Park"
            required
          />
          <DialogField
            label="Neighborhood"
            value={neighborhood}
            onChange={setNeighborhood}
            placeholder="Riverside"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DialogField
              label="Origin"
              value={origin}
              onChange={setOrigin}
              placeholder="Maple Ave & 5th"
            />
            <DialogField
              label="Destination"
              value={destination}
              onChange={setDestination}
              placeholder="Tech Park Bldg C"
            />
          </div>
          {error && <div className="text-xs text-destructive">{error}</div>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl glass text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary"
            >
              {busy ? "Creating…" : "Create Circle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DialogField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
