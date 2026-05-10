import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Gauge,
  Globe2,
  MapPinned,
  PlaneTakeoff,
  PlusCircle,
  Share2,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApp, tripBudgetEstimate, tripDuration } from "@/context/AppContext";
import { featuredCities } from "@/data/mock";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard - RouteWise" }] }),
});

function Dashboard() {
  const { trips, user } = useApp();
  const upcoming = trips.filter((t) => t.status === "upcoming" || t.status === "planning");
  const recent = trips.slice(0, 3);
  const totalCities = trips.reduce((sum, trip) => sum + trip.stops.length, 0);
  const totalBudget = trips.reduce((sum, trip) => sum + tripBudgetEstimate(trip).total, 0);
  const shared = trips.filter((trip) => !!trip.shareToken).length;
  const plannedActivities = trips.reduce(
    (sum, trip) => sum + trip.stops.reduce((inner, stop) => inner + stop.activities.length, 0),
    0,
  );
  const hasTrips = trips.length > 0;
  const hasStops = totalCities > 0;
  const hasActivities = plannedActivities > 0;
  const hasBudget = totalBudget > 0;
  const avgDailySpend = trips.length
    ? Math.round(
        trips.reduce((sum, trip) => {
          const budget = tripBudgetEstimate(trip);
          return sum + budget.total / Math.max(1, budget.days);
        }, 0) / trips.length,
      )
    : 0;
  const stressScore = hasActivities
    ? Math.min(
        100,
        Math.round(
          trips.reduce((sum, trip) => {
            const tripActivities = trip.stops.reduce(
              (inner, stop) => inner + stop.activities.length,
              0,
            );
            const activitiesPerDay = tripActivities / Math.max(1, tripDuration(trip));
            const switches = trip.stops.length / Math.max(1, tripDuration(trip));
            return sum + activitiesPerDay * 12 + switches * 25;
          }, 0) / Math.max(1, trips.length),
        ),
      )
    : 0;
  const routeReadiness = Math.round(
    [
      hasTrips,
      hasStops,
      hasActivities,
      hasBudget,
      shared > 0,
      trips.some((trip) => trip.notes.length > 0 || trip.checklist.length > 0),
    ].filter(Boolean).length * 16.67,
  );
  const routeQuality = hasStops ? Math.max(45, 100 - Math.round(stressScore * 0.45)) : 0;
  const savedDestinations = Array.from(
    new Set(trips.flatMap((trip) => trip.stops.map((stop) => `${stop.city}, ${stop.country}`))),
  ).slice(0, 6);
  const latestTrip = recent[0];
  const nextTrip = upcoming[0];
  const dashboardMode = !hasTrips
    ? "setup"
    : !hasStops
      ? "route"
      : !hasActivities
        ? "activities"
        : "active";
  const nextAction =
    dashboardMode === "setup"
      ? "Create first trip"
      : dashboardMode === "route"
        ? "Add first stop"
        : dashboardMode === "activities"
          ? "Add activities"
          : shared
            ? "Review plans"
            : "Share itinerary";
  const budgetSignal = hasBudget
    ? avgDailySpend
      ? `$${avgDailySpend}/day`
      : `$${totalBudget.toLocaleString()} total`
    : "Set target";
  const stressLabel = hasActivities
    ? stressScore > 65
      ? "High"
      : stressScore > 35
        ? "Moderate"
        : "Low"
    : "Add activities";
  const routeLabel = hasStops ? `${routeQuality}/100` : "Add stops";
  const destinationIdeas = featuredCities
    .slice(0, 5)
    .map((city) => `${city.name}, ${city.country}`);

  return (
    <div>
      <PageHeader
        title={`Hi ${user?.name?.split(" ")[0] || "Traveler"}, ready for the next one?`}
        subtitle="A clear view of your routes, budgets, stress signals, and shared plans."
        actions={
          <Button asChild className="rounded-full">
            <Link to="/trips/new">
              <PlusCircle className="h-4 w-4 mr-1" /> Plan new trip
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Trip workspace"
          value={hasTrips ? trips.length : "Start"}
          hint={hasTrips ? `${upcoming.length} active or planned` : "Create your first itinerary"}
          icon={PlaneTakeoff}
          tone="brand"
        />
        <StatCard
          label="Route depth"
          value={hasStops ? totalCities : "Add stops"}
          hint={hasStops ? `${plannedActivities} activities mapped` : "Cities unlock route signals"}
          icon={MapPinned}
        />
        <StatCard
          label="Budget coverage"
          value={hasBudget ? `$${totalBudget.toLocaleString()}` : "Set target"}
          hint={hasBudget ? `${budgetSignal} average` : "Add a target budget to compare plans"}
          icon={Wallet}
        />
        <StatCard
          label="Shared itineraries"
          value={shared || "Not yet"}
          hint={shared ? "Public links created" : "Generate a link from any trip"}
          icon={Share2}
          tone="warm"
        />
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-4">
        <AnalyticsCard
          icon={TrendingUp}
          label="Budget trend"
          value={budgetSignal}
          helper={
            hasBudget
              ? "Average planned spend from your live itineraries."
              : "Create a trip with a target budget to unlock cost trend analysis."
          }
        />
        <AnalyticsCard
          icon={Gauge}
          label="Travel stress"
          value={stressLabel}
          helper={
            hasActivities
              ? "Based on activity density and city-switching pace."
              : "Add stops and activities so RouteWise can calculate pacing pressure."
          }
          progress={hasActivities ? stressScore : undefined}
        />
        <AnalyticsCard
          icon={Brain}
          label={hasStops ? "Route quality score" : "Planning readiness"}
          value={hasStops ? routeLabel : `${routeReadiness}%`}
          helper={
            hasStops
              ? "Higher when trips have balanced pacing and fewer rushed transfers."
              : "Tracks setup progress across trip, route, budget, activities, and sharing."
          }
          progress={hasStops ? routeQuality : routeReadiness}
        />
        <AnalyticsCard
          icon={Globe2}
          label={savedDestinations.length ? "Saved destinations" : "Destination ideas"}
          value={savedDestinations.length || "Explore"}
          helper={
            savedDestinations.length
              ? "Cities from your saved routes."
              : "Browse curated cities, then save them by adding stops."
          }
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand">Trip overview analytics</p>
              <h2 className="mt-1 font-display text-2xl font-semibold">
                {nextTrip ? nextTrip.name : "Build your first route"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {nextTrip
                  ? `${nextTrip.stops.length} stops, ${nextTrip.stops.reduce((sum, stop) => sum + stop.activities.length, 0)} activities, ${tripDuration(nextTrip)} days.`
                  : "Start with a trip name and dates. The dashboard will turn stops, activities, budgets, and share links into useful signals."}
              </p>
            </div>
            <Button asChild variant="secondary" className="rounded-full">
              {nextTrip ? (
                <Link to="/trips/$tripId" params={{ tripId: nextTrip.id }}>
                  Open trip <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <Link to="/trips/new">
                  Create trip <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              )}
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MiniMetric
              label={hasStops ? "Route quality" : "Next action"}
              value={hasStops ? `${routeQuality}%` : nextAction}
            />
            <MiniMetric
              label="Shared plans"
              value={shared || (hasTrips ? "Ready when public" : "Create trip first")}
            />
            <MiniMetric
              label="Activities planned"
              value={plannedActivities || (hasStops ? "Add first activity" : "Needs a stop")}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-foreground text-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-medium opacity-80">AI insights panel</p>
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">
            Make the next decision with context.
          </h3>
          <p className="mt-2 text-sm opacity-70">
            Ask for route order, trip stress, budget swaps, activity ideas, or a polished travel
            recap.
          </p>
          <Button asChild variant="secondary" className="mt-5 rounded-full">
            <Link to="/assistant">
              Open assistant <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold">Upcoming trips</h2>
            <Link to="/trips" className="text-sm font-medium hover:underline">
              See all
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No upcoming trips yet.{" "}
              <Link to="/trips/new" className="text-foreground underline">
                Start planning
              </Link>
              .
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {upcoming.slice(0, 4).map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
            <p className="font-display text-lg font-semibold">Recently updated itinerary</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {latestTrip
                ? `${latestTrip.name} has ${latestTrip.stops.length} stops and ${latestTrip.notes.length} notes.`
                : "Create a trip and every update will appear here as a live planning trail."}
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
            <p className="font-display text-lg font-semibold">
              {savedDestinations.length ? "Saved destinations" : "Destination ideas"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(savedDestinations.length ? savedDestinations : destinationIdeas).map(
                (destination) => (
                  <span key={destination} className="rounded-full bg-muted px-3 py-1.5 text-sm">
                    {destination}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsCard({
  icon: Icon,
  label,
  value,
  helper,
  progress,
}: {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  helper: string;
  progress?: number;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{helper}</p>
      {progress !== undefined && <Progress value={progress} className="mt-4 h-2" />}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
