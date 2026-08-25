import { Check, Copy, Info, Loader2, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/sammy-ai";
import { cn } from "@/lib/utils";

export function ResponsibleAiNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-border bg-primary-soft/60 p-4 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>{DISCLAIMER}</p>
    </div>
  );
}

export function Panel({
  label,
  title,
  tone = "input",
  actions,
  children,
}: {
  label: string;
  title: string;
  tone?: "input" | "output";
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "card-soft overflow-hidden",
        tone === "output" && "border-primary/40 bg-primary-soft/30",
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div>
          <p
            className={cn(
              "text-[11px] font-semibold tracking-[0.16em] uppercase",
              tone === "output" ? "text-primary" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ThinkingState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-background/70 px-4 py-6 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin text-primary" />
      SAMMY AI is thinking...
    </div>
  );
}

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
      <Sparkles className="size-3" /> AI-Generated Response
    </span>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {label}
    </Button>
  );
}
