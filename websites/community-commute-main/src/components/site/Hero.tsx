import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Activity } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-hero pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-ring" />
            Now in private beta — for neighborhoods, not strangers
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
            Carpooling with <span className="text-gradient-primary">contracts</span>,
            <br className="hidden sm:block" /> not chaos.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl">
            Omni-Commute turns your daily ride with neighbors and colleagues into a verified,
            legally-binding agreement — with GPS-logged trips, automated billing, and a community
            safety net you can actually trust.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium glow-primary hover:opacity-95 transition"
            >
              Create your Circle <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass text-foreground hover:bg-white/5 transition"
            >
              View live dashboard
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Stat
              icon={<ShieldCheck className="h-4 w-4 text-primary" />}
              label="ID + Device verified"
            />
            <Stat
              icon={<MapPin className="h-4 w-4 text-primary" />}
              label="Geofenced auto-logging"
            />
            <Stat
              icon={<Activity className="h-4 w-4 text-primary" />}
              label="Live community alerts"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-16"
        >
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-[2rem]" />
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-elevated">
            <img
              src={heroImg}
              alt="Omni-Commute live dispatch dashboard with geofenced ride routes"
              width={1920}
              height={1080}
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
  );
}
