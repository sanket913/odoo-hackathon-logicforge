import { type ReactNode, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MapPinned,
  Sparkles,
  Compass,
  PlusCircle,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trips", label: "My Trips", icon: MapPinned },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/profile", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const { user, authReady, isSyncing, apiError, retrySync, logout } = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => path === to || path.startsWith(to + "/");

  useEffect(() => {
    if (authReady && !user) {
      navigate({ to: "/login" });
    }
  }, [authReady, navigate, user]);

  if (!authReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your RouteWise workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-border/70 bg-sidebar/80 backdrop-blur-xl px-4 py-6 flex flex-col transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo to="/dashboard" />
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Button
          className="mt-6 rounded-full justify-start gap-2"
          onClick={() => {
            setMobileOpen(false);
            navigate({ to: "/trips/new" });
          }}
        >
          <PlusCircle className="h-4 w-4" /> Plan new trip
        </Button>

        <nav className="mt-6 flex-1 space-y-1">
          {items.map((it) => {
            const active = isActive(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-foreground text-background shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-border/60 p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-gradient grid place-items-center text-brand-foreground font-medium">
              {user?.name?.[0]?.toUpperCase() || "T"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Traveler"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "guest@traveloop.app"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start gap-2 text-muted-foreground"
            onClick={() => {
              void logout();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Topbar */}
      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-30 h-16 border-b border-border/70 bg-background/80 backdrop-blur-md">
          <div className="h-full px-4 sm:px-8 flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search cities, trips, activities…"
                className="w-full pl-10 pr-4 h-10 rounded-full bg-muted/60 border border-transparent focus:border-border focus:bg-card outline-none text-sm transition-colors"
              />
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-brand-soft text-foreground">
                {isSyncing ? "Syncing..." : "RouteWise workspace"}
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {apiError && (
            <div className="mb-5 rounded-2xl border border-border/60 bg-card p-4 shadow-soft flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{apiError}</p>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full"
                onClick={() => void retrySync()}
              >
                Retry
              </Button>
            </div>
          )}
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
