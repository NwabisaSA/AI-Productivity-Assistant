import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/AiPanels";
import { useSpaStore } from "@/lib/spa-store";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Recent Activity — SAMMY Wellness Spa AI" },
      {
        name: "description",
        content: "A log of recent AI emails, chats, plans and completed spa tasks.",
      },
      { property: "og:title", content: "Recent Activity — SAMMY Wellness Spa AI" },
      {
        property: "og:description",
        content: "Track what you and Sammy AI have worked on today.",
      },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { activity } = useSpaStore();

  return (
    <AppShell
      title="Recent Activity"
      subtitle="A running log of what you and Sammy AI have worked on."
    >
      <div className="space-y-6">
        <ul className="card-soft divide-y divide-border">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start gap-4 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                <Clock className="size-4 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{a.label}</p>
                <p className="text-sm text-muted-foreground">{a.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{a.at}</span>
            </li>
          ))}
        </ul>
        <ResponsibleAiNotice />
      </div>
    </AppShell>
  );
}
