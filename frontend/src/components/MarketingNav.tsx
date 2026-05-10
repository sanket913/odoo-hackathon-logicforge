import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export function MarketingNav() {
  const { user } = useApp();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#destinations" className="hover:text-foreground transition-colors">
            Destinations
          </a>
          <a href="#trust" className="hover:text-foreground transition-colors">
            Trust
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild variant="default" className="rounded-full">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full hidden sm:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/signup">Start planning</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
