import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import heroImg from "@/assets/city-santorini.jpg";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({
    meta: [{ title: "Join RouteWise — Plan. Optimize. Share." }],
  }),
});

function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please tell us your name.");
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 8) return setError("Password must be 8+ characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    if (!agree) return setError("Please accept the terms to continue.");
    setLoading(true);
    setError(null);
    try {
      await signup(name, email, password);
      toast.success("Welcome to RouteWise!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src={heroImg} alt="Santorini" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-background">
          <p className="font-display text-3xl font-semibold leading-tight max-w-md">
            One workspace for every itinerary, budget, and packing list.
          </p>
        </div>
      </div>

      <div className="flex flex-col px-6 sm:px-12 py-8">
        <Logo />
        <div className="flex-1 grid place-items-center">
          <form onSubmit={submit} className="w-full max-w-sm space-y-5 py-10">
            <div>
              <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
                Join RouteWise
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Create an account to start planning your next journey.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="Alex Morgan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
                placeholder="you@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pw">Password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw2">Confirm</Label>
                <Input
                  id="pw2"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
              <span>
                I agree to the RouteWise <a className="underline">Terms</a> and{" "}
                <a className="underline">Privacy Policy</a>.
              </span>
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
              {loading ? "Creating account..." : "Join RouteWise"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-foreground font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RouteWise</p>
      </div>
    </div>
  );
}
