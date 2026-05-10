import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2 group", className)}>
      <span className="relative grid place-items-center h-9 w-9 rounded-xl bg-brand-gradient text-brand-foreground shadow-soft">
        <Compass className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-ink">RouteWise</span>
    </Link>
  );
}
