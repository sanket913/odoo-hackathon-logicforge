import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { cityImages } from "@/data/mock";

export const Route = createFileRoute("/_app/trips/new")({
  component: NewTripPage,
  head: () => ({ meta: [{ title: "Plan a new trip — RouteWise" }] }),
});

function NewTripPage() {
  const { createTrip } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "2500",
    cover: Object.values(cityImages)[0],
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Give your trip a name.");
    if (!form.startDate || !form.endDate) return setError("Pick start and end dates.");
    if (new Date(form.endDate) < new Date(form.startDate))
      return setError("End date must be after start date.");

    setSaving(true);
    setError(null);
    try {
      const trip = await createTrip({
        name: form.name.trim(),
        description: form.description.trim() || "A new adventure in the making.",
        startDate: form.startDate,
        endDate: form.endDate,
        budgetTarget: Number(form.budget) || 0,
        cover: form.cover,
      });
      toast.success("Trip created");
      navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Plan a new trip"
        subtitle="A few details now — you'll add stops and activities next."
      />

      <form
        onSubmit={submit}
        className="space-y-6 bg-card rounded-2xl border border-border/60 p-6 sm:p-8 shadow-soft"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Trip name</Label>
          <Input
            id="name"
            placeholder="e.g. Greek Isles Slowdown"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start date</Label>
            <Input
              id="start"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">End date</Label>
            <Input
              id="end"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="What's this trip about?"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Target budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            min={0}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Cover image</Label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(cityImages).map(([name, src]) => (
              <button
                type="button"
                key={name}
                onClick={() => setForm({ ...form, cover: src })}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  form.cover === src
                    ? "border-foreground ring-2 ring-foreground/20"
                    : "border-transparent"
                }`}
              >
                <img src={src} alt={name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <ImageIcon className="h-3 w-3" /> Or upload your own — coming soon.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/trips" })}>
            Cancel
          </Button>
          <Button type="submit" className="rounded-full px-6" disabled={saving}>
            {saving ? "Creating..." : "Create trip"}
          </Button>
        </div>
      </form>
    </div>
  );
}
