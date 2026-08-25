import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/AiPanels";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SAMMY Wellness Spa AI Assistant" },
      {
        name: "description",
        content: "Manage spa profile details and Sammy AI assistant preferences.",
      },
      { property: "og:title", content: "Settings — SAMMY Wellness Spa AI Assistant" },
      {
        property: "og:description",
        content: "Spa profile, assistant tone and responsible AI preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const toggles = [
    { label: "Show responsible AI notice on every AI page", checked: true },
    { label: "Require review before copying AI content", checked: true },
    { label: "Email notifications for daily plan summary", checked: false },
  ];

  return (
    <AppShell title="Settings" subtitle="Manage your spa profile and Sammy AI preferences.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft p-6">
          <h2 className="text-lg font-semibold">Spa profile</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Spa name</Label>
              <Input defaultValue="SAMMY Wellness Spa" />
            </div>
            <div className="space-y-2">
              <Label>Contact email</Label>
              <Input defaultValue="hello@sammywellnessspa.com" />
            </div>
            <div className="space-y-2">
              <Label>Manager</Label>
              <Input defaultValue="Sammy" />
            </div>
          </div>
        </section>

        <section className="card-soft p-6">
          <h2 className="text-lg font-semibold">Assistant preferences</h2>
          <div className="mt-4 space-y-4">
            {toggles.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-4">
                <span className="text-sm">{t.label}</span>
                <Switch defaultChecked={t.checked} />
              </div>
            ))}
          </div>
        </section>

        <div className="lg:col-span-2">
          <ResponsibleAiNotice />
        </div>
      </div>
    </AppShell>
  );
}
