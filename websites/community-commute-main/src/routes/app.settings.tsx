import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bio, setBio] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setNeighborhood(data.neighborhood ?? "");
        setBio(data.bio ?? "");
        setVerified(data.id_verified ?? false);
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        neighborhood,
        bio,
      })
      .eq("id", user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-sm text-muted-foreground font-mono">Loading…</div>;

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">
          Profile
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Settings</h1>
      </div>

      <form onSubmit={save} className="glass-strong rounded-3xl p-8 space-y-5 max-w-2xl">
        <Field label="Display name" value={displayName} onChange={setDisplayName} />
        <Field
          label="Neighborhood"
          value={neighborhood}
          onChange={setNeighborhood}
          placeholder="Riverside"
        />
        <Field label="Bio" value={bio} onChange={setBio} multiline />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary"
          >
            Save changes
          </button>
          {saved && <span className="text-xs font-mono text-primary">SAVED</span>}
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">ID Verification</div>
              <div className="text-xs text-muted-foreground">
                {verified ? "Verified" : "Not verified"}
              </div>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Device fingerprint</div>
              <div className="text-xs text-muted-foreground font-mono">
                {user?.id?.slice(0, 12)}…
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const className =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}
