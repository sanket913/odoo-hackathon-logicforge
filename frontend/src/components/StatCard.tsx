import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "brand" | "warm";
}) {
  const toneClass =
    tone === "brand"
      ? "bg-brand-gradient text-brand-foreground"
      : tone === "warm"
        ? "bg-accent text-accent-foreground"
        : "bg-card text-foreground";
  return (
    <div className={cn("rounded-2xl p-5 border border-border/60 shadow-soft", toneClass)}>
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-xs uppercase tracking-wider font-medium",
            tone === "brand" ? "opacity-80" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "h-8 w-8 grid place-items-center rounded-full",
              tone === "brand" ? "bg-white/15" : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</p>
      {hint && (
        <p
          className={cn("mt-1 text-xs", tone === "brand" ? "opacity-80" : "text-muted-foreground")}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
