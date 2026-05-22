import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  User,
  CreditCard,
  Car,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/driver/onboarding")({
  head: () => ({ meta: [{ title: "Driver Onboarding — Omni-Commute" }] }),
  component: DriverOnboarding,
});

type Step = "personal" | "license" | "vehicle" | "submitted";

function DriverOnboarding() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("personal");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Personal
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  // License doc
  const [licenseDocUrl, setLicenseDocUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Vehicle
  const [vehicleType, setVehicleType] = useState<
    "sedan" | "suv" | "van" | "hatchback" | "motorcycle" | "other"
  >("sedan");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [regDocUrl, setRegDocUrl] = useState<string | null>(null);
  const [insDocUrl, setInsDocUrl] = useState<string | null>(null);

  const loadExisting = useCallback(async () => {
    if (!user) return;
    // Skip loading existing data for now - tables may not exist
  }, [user]);

  useEffect(() => {
    loadExisting();
  }, [loadExisting]);

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    setUploading(true);
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return null;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    setUploading(false);
    return publicUrl;
  };

  const submitPersonal = async () => {
    if (!user || !licenseNumber || !licenseExpiry) {
      setError("License number and expiry are required.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: upErr } = await supabase.from("driver_profiles").upsert({
      id: user.id,
      license_number: licenseNumber,
      license_expiry: licenseExpiry,
      license_document_url: licenseDocUrl,
      bank_account: bankAccount || null,
      verification_status: "pending",
    });
    if (upErr) setError(upErr.message);
    else setStep("license");
    setLoading(false);
  };

  const submitVehicle = async () => {
    if (!user || !make || !model || !year || !color || !plate) {
      setError("All vehicle fields are required.");
      return;
    }
    setLoading(true);
    setError(null);
    // Deactivate old vehicles
    await supabase.from("vehicles").update({ is_active: false }).eq("driver_id", user.id);
    const { error: vErr } = await supabase.from("vehicles").insert({
      driver_id: user.id,
      vehicle_type: vehicleType,
      make,
      model,
      year: parseInt(year),
      color,
      license_plate: plate,
      registration_document_url: regDocUrl,
      insurance_document_url: insDocUrl,
      verification_status: "pending",
    });
    if (vErr) setError(vErr.message);
    else setStep("submitted");
    setLoading(false);
  };

  const steps: { key: Step; label: string; icon: typeof User }[] = [
    { key: "personal", label: "Personal", icon: User },
    { key: "license", label: "License", icon: CreditCard },
    { key: "vehicle", label: "Vehicle", icon: Car },
    { key: "submitted", label: "Done", icon: CheckCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-2">Driver</div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Driver Onboarding</h1>
        <p className="text-muted-foreground mt-1">
          Complete each step to start driving with Omni-Commute.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {steps.map((s, i) => {
          const active = step === s.key;
          const done =
            steps.indexOf(steps.find((x) => x.key === step)!) > i || step === "submitted";
          return (
            <div
              key={s.key}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${
                active
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : done
                    ? "bg-primary/5 text-primary/60"
                    : "bg-white/[0.02] text-muted-foreground border border-white/5"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {step === "personal" && (
        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold">Personal Details</h2>
          <Field
            label="Driver's License Number"
            value={licenseNumber}
            onChange={setLicenseNumber}
            required
          />
          <Field
            label="License Expiry Date"
            type="date"
            value={licenseExpiry}
            onChange={setLicenseExpiry}
            required
          />
          <Field label="Bank Account (for payouts)" value={bankAccount} onChange={setBankAccount} />
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
              License Document
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.07] transition text-sm">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload License"}
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f && user) {
                    const url = await uploadFile(f, "driver-docs", `${user.id}/license`);
                    if (url) setLicenseDocUrl(url);
                  }
                }}
              />
            </label>
            {licenseDocUrl && <span className="ml-2 text-xs text-primary">✓ Uploaded</span>}
          </div>
          <button
            onClick={submitPersonal}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 transition disabled:opacity-60"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "license" && (
        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold">License Verification</h2>
          <p className="text-sm text-muted-foreground">
            Your license details have been saved. You can proceed to register your vehicle.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary">
            <Shield className="h-4 w-4" /> License info saved — pending verification
          </div>
          <button
            onClick={() => setStep("vehicle")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 transition"
          >
            Register Vehicle <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setStep("personal")}
            className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      )}

      {step === "vehicle" && (
        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="font-display text-xl font-semibold">Vehicle Registration</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Vehicle Type
              </div>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as typeof vehicleType)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
              >
                {["sedan", "suv", "van", "hatchback", "motorcycle", "other"].map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Make" value={make} onChange={setMake} required />
            <Field label="Model" value={model} onChange={setModel} required />
            <Field label="Year" type="number" value={year} onChange={setYear} required />
            <Field label="Color" value={color} onChange={setColor} required />
            <Field label="License Plate" value={plate} onChange={setPlate} required />
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Registration Doc
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.07] transition text-sm">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f && user) {
                      const url = await uploadFile(f, "driver-docs", `${user.id}/registration`);
                      if (url) setRegDocUrl(url);
                    }
                  }}
                />
              </label>
              {regDocUrl && <span className="ml-2 text-xs text-primary">✓</span>}
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Insurance Doc
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.07] transition text-sm">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f && user) {
                      const url = await uploadFile(f, "driver-docs", `${user.id}/insurance`);
                      if (url) setInsDocUrl(url);
                    }
                  }}
                />
              </label>
              {insDocUrl && <span className="ml-2 text-xs text-primary">✓</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={submitVehicle}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 transition disabled:opacity-60"
            >
              Submit Application <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => setStep("license")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>
      )}

      {step === "submitted" && (
        <div className="glass rounded-3xl p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-xl font-semibold">Application Submitted!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your driver application is under review. We'll notify you once it's approved. This
            usually takes 24–48 hours.
          </p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition"
      />
    </label>
  );
}
