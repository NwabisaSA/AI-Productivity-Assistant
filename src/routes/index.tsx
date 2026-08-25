import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, CheckSquare, ClipboardList, Mail, MessageSquare, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ResponsibleAiNotice } from "@/components/AiPanels";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSpaStore } from "@/lib/spa-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAMMY Wellness Spa AI Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Your intelligent virtual assistant for managing your wellness spa: AI emails, chat and daily task planning.",
      },
      { property: "og:title", content: "SAMMY Wellness Spa AI Assistant" },
      {
        property: "og:description",
        content: "AI email generator, spa chatbot and task planner in one calm dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    emoji: "💌",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Create professional client and business emails in seconds.",
    cta: "Generate Email",
    to: "/email",
  },
  {
    emoji: "🤖",
    icon: Bot,
    title: "AI Chatbot",
    text: "Ask your virtual assistant questions and get helpful AI-generated responses.",
    cta: "Chat with Sammy AI",
    to: "/chatbot",
  },
  {
    emoji: "📋",
    icon: ClipboardList,
    title: "AI Task Planner",
    text: "Organise your spa's daily and weekly priorities with AI.",
    cta: "Plan My Day",
    to: "/planner",
  },
] as const;

function Dashboard() {
  const { tasks, emailsGenerated, conversations, activity } = useSpaStore();
  const completed = tasks.filter((t) => t.done).length;

  const stats = [
    { label: "Tasks Planned", value: tasks.length, icon: ClipboardList },
    { label: "Tasks Completed", value: completed, icon: CheckSquare },
    { label: "Emails Generated", value: emailsGenerated, icon: Mail },
    { label: "AI Conversations", value: conversations, icon: MessageSquare },
  ];

  return (
    <AppShell
      title="SAMMY Wellness Spa AI Assistant"
      subtitle="Your intelligent virtual assistant for managing your wellness spa."
    >
      <div className="space-y-8">
        <section className="card-soft flex flex-col gap-4 bg-primary-soft/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              <Sparkles className="size-3.5" /> Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              A calm, organised day at the spa starts here.
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Choose an AI tool below, enter your details, and review the AI-generated response
              before you use or send it.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link to="/planner">Plan My Day</Link>
          </Button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card-soft flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-xl">
                  {f.emoji}
                </span>
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="flex-1 text-sm text-muted-foreground">{f.text}</p>
              <Button asChild className="w-full">
                <Link to={f.to}>{f.cta}</Link>
              </Button>
            </article>
          ))}
        </section>

        <section className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-soft p-5">
              <s.icon className="size-5 text-primary" />
              <p className="mt-3 text-2xl font-semibold sm:text-3xl">{s.value}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="card-soft p-6">
            <h3 className="text-lg font-semibold">Today's progress</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {completed} of {tasks.length} tasks completed
            </p>
            <Progress value={(completed / Math.max(tasks.length, 1)) * 100} className="mt-4" />
            <Button asChild variant="outline" className="mt-5">
              <Link to="/planner">Open task planner</Link>
            </Button>
          </div>
          <div className="card-soft p-6">
            <h3 className="text-lg font-semibold">Recent activity</h3>
            <ul className="mt-4 space-y-3">
              {activity.slice(0, 4).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{a.label}</p>
                    <p className="text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.at}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ResponsibleAiNotice />
      </div>
    </AppShell>
  );
}
