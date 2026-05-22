import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { AgreementEngine } from "@/components/site/AgreementEngine";
import { SafetySuite } from "@/components/site/SafetySuite";
import { Logistics } from "@/components/site/Logistics";
import { DashboardPreview } from "@/components/site/DashboardPreview";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Omni-Commute — Carpooling with contracts, not chaos" },
      {
        name: "description",
        content:
          "Community-first carpooling for neighbors and colleagues. Custom agreements, GPS-verified trips, automated billing, and a built-in safety net.",
      },
      { property: "og:title", content: "Omni-Commute — Carpooling with contracts" },
      {
        property: "og:description",
        content: "Verified rides, signed agreements, community safety.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <main>
        <Hero />
        <AgreementEngine />
        <SafetySuite />
        <Logistics />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
}
