import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, Compass } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export const Route = createFileRoute("/_app/trips/")({
  component: TripsPage,
  head: () => ({ meta: [{ title: "My Trips — RouteWise" }] }),
});

const filters = ["All", "Planning", "Upcoming", "Completed"] as const;

function TripsPage() {
  const { trips } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = trips.filter((t) =>
    filter === "All" ? true : t.status === filter.toLowerCase(),
  );

  return (
    <div>
      <PageHeader
        title="My trips"
        subtitle="Every trip you're planning, sorted and ready to refine."
        actions={
          <Button asChild className="rounded-full">
            <Link to="/trips/new">
              <PlusCircle className="h-4 w-4 mr-1" /> New trip
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 h-9 rounded-full text-sm border transition-colors ${
              filter === f
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No trips here yet"
          description="Start by creating a trip — add cities, dates, and let RouteWise handle the rest."
          icon={<Compass className="h-5 w-5" />}
          action={
            <Button asChild className="rounded-full">
              <Link to="/trips/new">Plan your first trip</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
}
