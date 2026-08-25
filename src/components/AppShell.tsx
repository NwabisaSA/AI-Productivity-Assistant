import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  CalendarDays,
  CheckSquare,
  Flower2,
  History,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Sparkle,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chatbot", label: "AI Chatbot", icon: Bot },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/planner", label: "AI Task Planner", icon: CheckSquare },
  { to: "/services", label: "Wellness Services", icon: Flower2 },
  { to: "/activity", label: "Recent Activity", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <Flower2 className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold">SAMMY</p>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Wellness Spa</p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen w-full bg-secondary/40">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0">
          <Brand />
          <NavList />
          <div className="mx-3 mt-4 rounded-2xl bg-primary-soft p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
              <Sparkle className="size-4" /> Sammy AI
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Online and ready to help with emails, chat and daily planning.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand />
                <NavList onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-accent-foreground md:flex">
              <span className="size-2 rounded-full bg-primary" />
              Sammy AI online
            </div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground xl:flex">
              <CalendarDays className="size-4" />
              {today}
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings" asChild>
              <Link to="/settings">
                <Settings className="size-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Profile"
              className="rounded-full bg-primary-soft"
            >
              <UserRound className="size-5" />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
