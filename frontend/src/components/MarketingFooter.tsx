import { Logo } from "@/components/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            RouteWise centralizes itineraries, budgets, and inspiration so every trip feels
            intentional — and memorable.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Product</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Itinerary builder</li>
            <li>Budget planner</li>
            <li>Route intelligence</li>
            <li>Public sharing</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RouteWise. Plan the route. Live the story.</p>
          <p>Made for explorers.</p>
        </div>
      </div>
    </footer>
  );
}
