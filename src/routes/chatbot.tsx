import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Trash2, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AiBadge, CopyButton, Panel, ResponsibleAiNotice, ThinkingState } from "@/components/AiPanels";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SUGGESTED_PROMPTS, chatReply, think } from "@/lib/sammy-ai";
import { spaStore, useSpaStore } from "@/lib/spa-store";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "Sammy AI Chatbot — SAMMY Wellness Spa" },
      {
        name: "description",
        content:
          "Chat with Sammy AI, the virtual wellness spa assistant, for client wording, admin help and spa information.",
      },
      { property: "og:title", content: "Sammy AI Chatbot — SAMMY Wellness Spa" },
      {
        property: "og:description",
        content: "Ask your virtual spa assistant questions and get AI-generated responses.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { messages } = useSpaStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    setInput("");
    spaStore.addMessages([{ id: crypto.randomUUID(), role: "user", content: question }]);
    setLoading(true);
    const reply = await think(chatReply(question));
    spaStore.addMessages([{ id: crypto.randomUUID(), role: "ai", content: reply }]);
    spaStore.countConversation(question);
    setLoading(false);
  }

  return (
    <AppShell
      title="Sammy AI — Virtual Wellness Spa Assistant"
      subtitle="Ask your virtual assistant questions and get helpful AI-generated responses."
    >
      <div className="space-y-6">
        <Panel
          label="SAMMY AI Response"
          title="Conversation"
          tone="output"
          actions={
            <Button variant="outline" size="sm" onClick={() => spaStore.resetChat()}>
              <Trash2 className="size-4" /> Clear conversation
            </Button>
          }
        >
          <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end gap-3">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                    {m.content}
                  </div>
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <UserRound className="size-4" />
                  </span>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <Bot className="size-4 text-primary" />
                  </span>
                  <div className="max-w-[85%] space-y-2">
                    <AiBadge />
                    <div className="rounded-2xl rounded-tl-sm bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>
                    <CopyButton text={m.content} label="Copy response" />
                  </div>
                </div>
              ),
            )}
            {loading ? <ThinkingState /> : null}
            <div ref={endRef} />
          </div>
        </Panel>

        <Panel label="Your Request" title="Message Sammy AI">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-primary-soft"
                >
                  {p}
                </button>
              ))}
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={3}
              placeholder="Ask Sammy AI anything about running your spa..."
            />
            <Button
              onClick={() => void send(input)}
              disabled={loading || !input.trim()}
              className="w-full sm:w-auto"
            >
              <Send className="size-4" /> Send
            </Button>
          </div>
        </Panel>

        <ResponsibleAiNotice />
      </div>
    </AppShell>
  );
}
