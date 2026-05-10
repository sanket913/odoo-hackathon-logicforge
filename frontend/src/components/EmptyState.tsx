import { type ReactNode } from "react";
import { Compass } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-brand-soft text-foreground">
        {icon ?? <Compass className="h-5 w-5" />}
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
