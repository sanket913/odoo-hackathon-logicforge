import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import heroImg from "@/assets/hero-coast.jpg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Log in — RouteWise" }],
  }),
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@routewise.app");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col px-6 sm:px-12 py-8">
        <Logo />
        <div className="flex-1 grid place-items-center">
          <form onSubmit={submit} className="w-full max-w-sm space-y-5 py-12">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Log in to continue planning your next trip.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-xs text-muted-foreground hover:text-foreground">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              New to RouteWise?{" "}
              <Link to="/signup" className="text-foreground font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RouteWise</p>
      </div>

      <div className="hidden lg:block relative">
        <img src={heroImg} alt="Travel inspiration" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-background">
          <p className="font-display text-3xl font-semibold leading-tight max-w-md">
            "RouteWise made our 3-country trip feel handled. We just showed up."
          </p>
          <p className="mt-3 text-sm opacity-80">— Maya R., creator</p>
        </div>
      </div>
    </div>
  );
}
