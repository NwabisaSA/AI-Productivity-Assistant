import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/AiPanels";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Wellness Services — SAMMY Wellness Spa" },
      {
        name: "description",
        content:
          "Overview of SAMMY Wellness Spa treatment categories used by the AI assistant for client wording.",
      },
      { property: "og:title", content: "Wellness Services — SAMMY Wellness Spa" },
      {
        property: "og:description",
        content: "Massage, facials, body rituals and more at SAMMY Wellness Spa.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    emoji: "💆",
    name: "Massage Therapy",
    text: "Swedish, deep tissue, hot stone and aromatherapy massage.",
    duration: "60 – 90 min",
  },
  {
    emoji: "✨",
    name: "Facials & Skincare",
    text: "Hydrating, deep-cleansing and rejuvenating facial rituals.",
    duration: "45 – 75 min",
  },
  {
    emoji: "🌿",
    name: "Body Treatments",
    text: "Exfoliating scrubs, nourishing wraps and detox rituals.",
    duration: "60 min",
  },
  {
    emoji: "💅",
    name: "Hands & Feet",
    text: "Manicures, pedicures and warm paraffin care.",
    duration: "45 min",
  },
  {
    emoji: "🧖",
    name: "Wellness Rituals",
    text: "Sauna, steam and guided relaxation sessions.",
    duration: "30 – 60 min",
  },
  {
    emoji: "🎁",
    name: "Spa Packages",
    text: "Curated half-day and full-day wellness journeys.",
    duration: "Half / full day",
  },
];

function ServicesPage() {
  return (
    <AppShell
      title="Wellness Services"
      subtitle="The treatment categories Sammy AI refers to when helping with client communication."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.name} className="card-soft p-6">
              <span className="text-2xl">{s.emoji}</span>
              <h2 className="mt-3 text-lg font-semibold">{s.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              <p className="mt-4 inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-accent-foreground">
                {s.duration}
              </p>
            </article>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Demo service list. Confirm treatments, durations and pricing against your own spa menu —
          Sammy AI does not invent prices, availability or policies.
        </p>
        <ResponsibleAiNotice />
      </div>
    </AppShell>
  );
}
