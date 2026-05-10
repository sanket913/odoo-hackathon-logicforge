import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { featuredCities, sampleActivities } from "@/data/mock";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/explore")({
  component: ExplorePage,
  head: () => ({ meta: [{ title: "Explore — RouteWise" }] }),
});

const filters = ["All", "Asia", "Europe", "Africa"];
const actCats = ["All", "Sightseeing", "Food", "Adventure", "Culture", "Shopping", "Relaxation"];

function ExplorePage() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("All");
  const [cat, setCat] = useState("All");

  const cities = featuredCities.filter(
    (c) =>
      (region === "All" || c.region === region) &&
      (q === "" || (c.name + c.country).toLowerCase().includes(q.toLowerCase())),
  );
  const acts = sampleActivities.filter((a) => cat === "All" || a.category === cat);

  return (
    <div>
      <PageHeader title="Explore" subtitle="Find your next city, then your next afternoon." />
      <Tabs defaultValue="cities">
        <TabsList className="bg-muted/60 rounded-full h-auto p-1">
          <TabsTrigger
            value="cities"
            className="rounded-full px-4 data-[state=active]:bg-background"
          >
            Cities
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="rounded-full px-4 data-[state=active]:bg-background"
          >
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cities" className="mt-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 h-11 rounded-xl"
                placeholder="Search cities…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setRegion(f)}
                  className={`px-4 h-11 rounded-full text-sm border ${region === f ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <div
                key={c.name}
                className="group rounded-2xl overflow-hidden bg-card border border-border/60 shadow-soft hover:shadow-card transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold">{c.name}</p>
                    <span className="text-xs text-muted-foreground">{c.country}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cost · {c.costIndex}</span>
                    <span>Popularity · {c.popularity}%</span>
                  </div>
                  <Button
                    size="sm"
                    className="mt-4 w-full rounded-full"
                    onClick={() => toast.success(`${c.name} saved`)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add to trip
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <div className="flex flex-wrap gap-2 mb-5">
            {actCats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 h-9 rounded-full text-sm border ${cat === c ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {acts.map((a) => (
              <div
                key={a.name}
                className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft"
              >
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-soft">{a.category}</span>
                <p className="mt-3 font-display text-lg font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.duration} · ${a.cost}
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4 rounded-full"
                  onClick={() => toast.success("Added to trip")}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
