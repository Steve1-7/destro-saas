import { Bell, PhoneCall, MessageSquareLock, Clock } from "lucide-react";
import { SectionHeader } from "./AgreementEngine";

export function Logistics() {
  return (
    <section id="logistics" className="relative py-28 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Smart Logistics"
          title="No more 6 a.m. group chats."
          desc="A 24-hour confirmation cycle and privacy-first communication keep everyone aligned without anyone sharing personal numbers."
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card icon={<Clock className="h-5 w-5 text-primary" />} title="24h Auto-Dispatch">
            We nudge passengers the night before. No confirmation? The driver skips that stop —
            saving fuel, time, and the awkward wait.
          </Card>
          <Card icon={<Bell className="h-5 w-5 text-primary" />} title="Smart Nudges">
            Confirmations adapt to weather, traffic, and your historical behavior. Less spam, better
            attendance.
          </Card>
          <Card
            icon={<MessageSquareLock className="h-5 w-5 text-primary" />}
            title="Masked Messaging"
          >
            Chat with neighbors through end-to-end encrypted threads. Real numbers stay private.
          </Card>
          <Card icon={<PhoneCall className="h-5 w-5 text-primary" />} title="VoIP Calling">
            One-tap calls routed through Omni numbers. Drivers and passengers stay anonymous.
          </Card>
          <Card icon={<Bell className="h-5 w-5 text-primary" />} title="Auto-Skip Logic">
            Riders who repeatedly no-show drop in priority and lose seat guarantees automatically.
          </Card>
          <Card icon={<Clock className="h-5 w-5 text-primary" />} title="Biometric Sign-off">
            FaceID/TouchID seals the daily log and the monthly settlement. Tamper-proof receipts.
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group glass rounded-2xl p-6 hover:border-primary/30 hover:bg-white/[0.04] transition relative overflow-hidden">
      <div className="absolute -inset-px rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition" />
      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center mb-4">
          {icon}
        </div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
