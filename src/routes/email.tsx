import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import { AiBadge, CopyButton, Panel, ResponsibleAiNotice, ThinkingState } from "@/components/AiPanels";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EMAIL_PURPOSES,
  RECIPIENTS,
  TONES,
  emailToText,
  generateEmail,
  think,
  type GeneratedEmail,
} from "@/lib/sammy-ai";
import { spaStore } from "@/lib/spa-store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — SAMMY Wellness Spa AI" },
      {
        name: "description",
        content:
          "Generate professional spa client, staff and supplier emails in seconds with SAMMY AI.",
      },
      { property: "og:title", content: "Smart Email Generator — SAMMY Wellness Spa AI" },
      {
        property: "og:description",
        content: "Choose a purpose, recipient and tone, then review your AI-generated email.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState<string>(EMAIL_PURPOSES[1]);
  const [recipient, setRecipient] = useState<string>(RECIPIENTS[0]);
  const [tone, setTone] = useState<string>(TONES[1]);
  const [details, setDetails] = useState(
    "Create a friendly appointment reminder for a client visiting SAMMY Wellness Spa tomorrow.",
  );
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  async function run() {
    setLoading(true);
    setEditing(false);
    const result = await think(generateEmail({ purpose, recipient, tone, details }));
    setEmail(result);
    setDraft(emailToText(result));
    setLoading(false);
    spaStore.countEmail(purpose);
  }

  return (
    <AppShell
      title="Smart Email Generator"
      subtitle="Create professional client and business emails in seconds."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel label="Your Request" title="Email details">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email Purpose">
                <Picker value={purpose} onChange={setPurpose} options={[...EMAIL_PURPOSES]} />
              </Field>
              <Field label="Recipient">
                <Picker value={recipient} onChange={setRecipient} options={[...RECIPIENTS]} />
              </Field>
            </div>
            <Field label="Tone">
              <Picker value={tone} onChange={setTone} options={[...TONES]} />
            </Field>
            <Field label="Key Information">
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={7}
                placeholder="Client name, treatment, date and time, anything else the email should mention..."
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={loading} className="w-full sm:w-auto">
                <Wand2 className="size-4" /> Generate Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmail(null);
                  setDetails("");
                }}
                className="w-full sm:w-auto"
              >
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>
          </div>
        </Panel>

        <Panel
          label="SAMMY AI Response"
          title="AI-Generated Email"
          tone="output"
          actions={
            email && !loading ? (
              <>
                <CopyButton text={draft} />
                <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
                  {editing ? "Preview" : "Edit"}
                </Button>
                <Button variant="outline" size="sm" onClick={run}>
                  <RefreshCw className="size-4" /> Regenerate
                </Button>
              </>
            ) : null
          }
        >
          {loading ? (
            <ThinkingState />
          ) : !email ? (
            <p className="rounded-2xl bg-background/70 px-4 py-10 text-center text-sm text-muted-foreground">
              Fill in your request and select <strong>Generate Email</strong> — your AI-generated
              email will appear here for review.
            </p>
          ) : editing ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={18}
              className="bg-background"
            />
          ) : (
            <div className="space-y-4">
              <AiBadge />
              <div className="rounded-2xl bg-background p-5 text-sm leading-relaxed whitespace-pre-wrap">
                <p className="font-semibold">Subject: {email.subject}</p>
                <p className="mt-4">{email.greeting}</p>
                <p className="mt-3">{email.body}</p>
                <p className="mt-4">{email.closing}</p>
              </div>
            </div>
          )}
          <ResponsibleAiNotice className="mt-5" />
        </Panel>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Picker({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
