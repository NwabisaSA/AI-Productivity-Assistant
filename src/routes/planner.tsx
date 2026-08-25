import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ListChecks, Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import { AiBadge, Panel, ResponsibleAiNotice, ThinkingState } from "@/components/AiPanels";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  PRIORITIES,
  generatePlan,
  think,
  type Plan,
  type Priority,
} from "@/lib/sammy-ai";
import { spaStore, useSpaStore } from "@/lib/spa-store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — SAMMY Wellness Spa" },
      {
        name: "description",
        content:
          "Organise your spa's daily and weekly priorities with an AI-prioritised schedule and productivity tips.",
      },
      { property: "og:title", content: "AI Task Planner — SAMMY Wellness Spa" },
      {
        property: "og:description",
        content: "Add spa tasks and let Sammy AI build today's priorities and weekly plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { tasks } = useSpaStore();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("High");
  const [deadline, setDeadline] = useState("");
  const [duration, setDuration] = useState("30 min");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [filter, setFilter] = useState("All");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const completed = tasks.filter((t) => t.done).length;
  const visible = tasks.filter(
    (t) =>
      filter === "All" ||
      (filter === "Open" && !t.done) ||
      (filter === "Completed" && t.done) ||
      t.priority === filter,
  );

  function add() {
    if (!title.trim()) return;
    spaStore.addTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      deadline,
      duration,
      category,
      done: false,
    });
    setTitle("");
    setDeadline("");
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...tasks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    spaStore.setTasks(next);
  }

  async function createPlan() {
    setLoading(true);
    const result = await think(generatePlan(tasks));
    setPlan(result);
    setLoading(false);
    spaStore.planned(tasks.length);
  }

  return (
    <AppShell
      title="AI Task Planner"
      subtitle="Organise your spa's daily and weekly priorities with AI."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel label="Your Request" title="Your spa tasks">
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs uppercase text-muted-foreground">Task</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm appointments"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Deadline</Label>
                <Input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. 15:00 or Friday"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground">Duration</Label>
                <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={add} variant="outline">
                <Plus className="size-4" /> Add task
              </Button>
              <Button onClick={createPlan} disabled={loading}>
                <Wand2 className="size-4" /> Create My Plan
              </Button>
            </div>

            <div className="space-y-2 rounded-2xl bg-secondary/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {completed} of {tasks.length} tasks completed
                </span>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "Open", "Completed", ...PRIORITIES].map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Progress value={(completed / Math.max(tasks.length, 1)) * 100} />
            </div>

            <ul className="space-y-2">
              {visible.map((t) => {
                const index = tasks.indexOf(t);
                return (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-3"
                  >
                    <Checkbox
                      checked={t.done}
                      onCheckedChange={() => spaStore.toggleTask(t.id)}
                      aria-label="Complete task"
                    />
                    <div className="min-w-0 flex-1">
                      <input
                        value={t.title}
                        onChange={(e) => spaStore.updateTask(t.id, { title: e.target.value })}
                        className={`w-full bg-transparent text-sm font-medium outline-none ${
                          t.done ? "text-muted-foreground line-through" : ""
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t.priority} · {t.category}
                        {t.deadline ? ` · due ${t.deadline}` : ""}
                        {t.duration ? ` · ${t.duration}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => move(index, -1)} aria-label="Move up">
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => move(index, 1)} aria-label="Move down">
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => spaStore.removeTask(t.id)}
                        aria-label="Delete task"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Panel>

        <Panel label="SAMMY AI Response" title="Your AI-generated plan" tone="output">
          {loading ? (
            <ThinkingState />
          ) : !plan ? (
            <p className="rounded-2xl bg-background/70 px-4 py-10 text-center text-sm text-muted-foreground">
              Add your tasks and select <strong>Create My Plan</strong> — Sammy AI will prioritise
              them for you.
            </p>
          ) : (
            <div className="space-y-5">
              <AiBadge />
              <PlanBlock title="Today's Priorities">
                <ol className="list-decimal space-y-1 pl-5 text-sm">
                  {plan.priorities.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
              </PlanBlock>
              <PlanBlock title="Suggested Schedule">
                <ul className="space-y-2 text-sm">
                  {plan.schedule.map((s) => (
                    <li key={s.time} className="flex gap-3">
                      <span className="w-28 shrink-0 font-medium text-primary">{s.time}</span>
                      <span>{s.task}</span>
                    </li>
                  ))}
                </ul>
              </PlanBlock>
              <PlanBlock title="This Week">
                <div className="grid gap-3 sm:grid-cols-2">
                  {plan.week.map((d) => (
                    <div key={d.day} className="rounded-xl bg-secondary/60 p-3">
                      <p className="text-sm font-semibold">{d.day}</p>
                      <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                        {d.tasks.length ? (
                          d.tasks.map((t) => <li key={t}>• {t}</li>)
                        ) : (
                          <li>• Light day — space for walk-ins</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </PlanBlock>
              <PlanBlock title="Productivity Tips">
                <ul className="space-y-1 text-sm">
                  {plan.tips.map((t) => (
                    <li key={t} className="flex gap-2">
                      <ListChecks className="mt-0.5 size-4 shrink-0 text-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
              </PlanBlock>
            </div>
          )}
          <ResponsibleAiNotice className="mt-5" />
        </Panel>
      </div>
    </AppShell>
  );
}

function PlanBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-background p-4">
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
