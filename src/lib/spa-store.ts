import { useSyncExternalStore } from "react";
import { DEMO_TASKS, OPENING_MESSAGE, type Task } from "./sammy-ai";

export type ChatMessage = { id: string; role: "user" | "ai"; content: string };
export type Activity = { id: string; label: string; detail: string; at: string };

type State = {
  tasks: Task[];
  messages: ChatMessage[];
  emailsGenerated: number;
  conversations: number;
  activity: Activity[];
};

const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

let state: State = {
  tasks: DEMO_TASKS,
  messages: [{ id: "m0", role: "ai", content: OPENING_MESSAGE }],
  emailsGenerated: 12,
  conversations: 8,
  activity: [
    { id: "a1", label: "Email generated", detail: "Appointment reminder for a client", at: "09:42" },
    { id: "a2", label: "Chat with Sammy AI", detail: "Asked about organising spa tasks", at: "09:15" },
    { id: "a3", label: "Plan created", detail: "7 tasks prioritised for today", at: "08:34" },
    { id: "a4", label: "Task completed", detail: "Check treatment rooms", at: "08:05" },
  ],
};

const listeners = new Set<() => void>();

function set(update: Partial<State>) {
  state = { ...state, ...update };
  listeners.forEach((l) => l());
}

function logActivity(label: string, detail: string) {
  set({
    activity: [{ id: crypto.randomUUID(), label, detail, at: now() }, ...state.activity].slice(0, 12),
  });
}

export const spaStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
  setTasks(tasks: Task[]) {
    set({ tasks });
  },
  addTask(task: Task) {
    set({ tasks: [...state.tasks, task] });
    logActivity("Task added", task.title);
  },
  toggleTask(id: string) {
    const task = state.tasks.find((t) => t.id === id);
    set({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
    if (task && !task.done) logActivity("Task completed", task.title);
  },
  updateTask(id: string, patch: Partial<Task>) {
    set({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  },
  removeTask(id: string) {
    set({ tasks: state.tasks.filter((t) => t.id !== id) });
  },
  planned(count: number) {
    logActivity("Plan created", `${count} tasks prioritised by Sammy AI`);
  },
  addMessages(msgs: ChatMessage[]) {
    set({ messages: [...state.messages, ...msgs] });
  },
  countConversation(question: string) {
    set({ conversations: state.conversations + 1 });
    logActivity("Chat with Sammy AI", question.slice(0, 60));
  },
  resetChat() {
    set({ messages: [{ id: crypto.randomUUID(), role: "ai", content: OPENING_MESSAGE }] });
  },
  countEmail(purpose: string) {
    set({ emailsGenerated: state.emailsGenerated + 1 });
    logActivity("Email generated", purpose);
  },
};

export function useSpaStore() {
  return useSyncExternalStore(spaStore.subscribe, spaStore.get, spaStore.get);
}
