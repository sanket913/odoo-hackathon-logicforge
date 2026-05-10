import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PlusCircle,
  PlaneTakeoff,
  Wallet,
  MapPinned,
  Share2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { useApp, tripBudgetEstimate } from "@/context/AppContext";
import { featuredCities } from "@/data/mock";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — RouteWise" }] }),
});

function Dashboard() {
  const { trips, user } = useApp();
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const recent = trips.filter((t) => t.status !== "upcoming").slice(0, 3);
  const totalCities = trips.reduce((s, t) => s + t.stops.length, 0);
  const totalBudget = trips.reduce((s, t) => s + tripBudgetEstimate(t).total, 0);
  const shared = trips.filter((t) => !!t.shareToken).length;

  return (
    <div>
      <PageHeader
        title={`Hi ${user?.name?.split(" ")[0] || "Traveler"}, ready for the next one?`}
        subtitle="Your trips, budgets, and ideas — all in one calm place."
        actions={
          <Button asChild className="rounded-full">
            <Link to="/trips/new">
              <PlusCircle className="h-4 w-4 mr-1" /> Plan new trip
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total trips" value={trips.length} icon={PlaneTakeoff} tone="brand" />
        <StatCard label="Cities planned" value={totalCities} icon={MapPinned} />
        <StatCard
          label="Estimated budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon={Wallet}
        />
        <StatCard label="Shared itineraries" value={shared} icon={Share2} tone="warm" />
      </div>

      {/* Upcoming */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl font-semibold">Upcoming trips</h2>
          <Link to="/trips" className="text-sm font-medium hover:underline">
            See all →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            No upcoming trips yet —{" "}
            <Link to="/trips/new" className="text-foreground underline">
              start planning
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </div>
        )}
      </section>

      {/* AI prompt + Recommended */}
      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 rounded-2xl bg-foreground text-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-medium opacity-80">AI Assistant</p>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">
            Need a 4-day plan in Lisbon under $900?
          </h3>
          <p className="mt-2 text-sm opacity-70">
            Ask RouteWise AI for itineraries, stress analysis, and travel recaps.
          </p>
          <Button asChild variant="secondary" className="mt-5 rounded-full">
            <Link to="/assistant">
              Open assistant <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Recommended for you</h2>
            <Link to="/explore" className="text-sm font-medium hover:underline">
              Explore →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredCities.slice(0, 3).map((c) => (
              <div
                key={c.name}
                className="group rounded-2xl overflow-hidden border border-border/60 bg-card shadow-soft hover:shadow-card transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent */}
      {recent.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold mb-5">Recent trips</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
