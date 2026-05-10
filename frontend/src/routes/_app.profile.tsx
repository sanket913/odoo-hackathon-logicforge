import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { featuredCities } from "@/data/mock";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — RouteWise" }] }),
});

function ProfilePage() {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "Traveler");
  const [email, setEmail] = useState(user?.email || "demo@routewise.app");
  const [saving, setSaving] = useState(false);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile & settings"
        subtitle="Manage your account, preferences, and saved destinations."
      />

      <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-brand-gradient grid place-items-center text-brand-foreground text-2xl font-semibold">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        </div>
        <Button
          className="mt-5 rounded-full"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await updateProfile(name, email);
              toast.success("Profile updated");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Unable to update profile");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
        <p className="font-display text-lg font-semibold">Saved destinations</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {featuredCities.slice(0, 4).map((c) => (
            <span key={c.name} className="px-3 py-1.5 rounded-full bg-muted text-sm">
              {c.name}, {c.country}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-destructive/30 p-6">
        <p className="font-display text-lg font-semibold text-destructive flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Danger zone
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign out or remove your account. This is a demo — your data lives only in your browser.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              void logout();
              navigate({ to: "/" });
            }}
            className="rounded-full"
          >
            Sign out
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.clear();
              void logout();
              navigate({ to: "/" });
            }}
            className="rounded-full"
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
