import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Wallet, Copy, Share2 } from "lucide-react";
import { format, eachDayOfInterval } from "date-fns";
import { useApp, tripBudgetEstimate } from "@/context/AppContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import type { Trip } from "@/types";

export const Route = createFileRoute("/share/$token")({
  component: PublicShare,
  head: () => ({ meta: [{ title: "Shared itinerary — RouteWise" }] }),
});

function PublicShare() {
  const { token } = Route.useParams();
  const { getTripByShareToken, getPublicTripByShareToken } = useApp();
  const [publicTrip, setPublicTrip] = useState<Trip | null | undefined>(undefined);
  const trip = publicTrip || getTripByShareToken(token);

  useEffect(() => {
    let cancelled = false;
    setPublicTrip(undefined);
    void getPublicTripByShareToken(token).then((loaded) => {
      if (!cancelled) setPublicTrip(loaded || null);
    });
    return () => {
      cancelled = true;
    };
  }, [getPublicTripByShareToken, token]);

  const days = useMemo(() => {
    if (!trip) return [];
    const list = eachDayOfInterval({
      start: new Date(trip.startDate),
      end: new Date(trip.endDate),
    });
    return list.map((d) => ({
      date: d,
      stop: trip.stops.find(
        (s) =>
          new Date(s.arrival).getTime() <= d.getTime() &&
          new Date(s.departure).getTime() >= d.getTime(),
      ),
    }));
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/60">
          <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
            <Logo />
            <Button asChild className="rounded-full">
              <Link to="/signup">Start planning</Link>
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <EmptyState
            title={publicTrip === undefined ? "Loading itinerary" : "Itinerary not found"}
            description={
              publicTrip === undefined
                ? "Fetching the shared RouteWise itinerary."
                : "This public link may have been removed or copied incorrectly."
            }
            icon={<Share2 className="h-5 w-5" />}
          />
        </div>
      </div>
    );
  }

  const b = tripBudgetEstimate(trip);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Logo />
          <Button asChild className="rounded-full">
            <Link to="/signup">Clone this trip</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden shadow-card border border-border/60 mt-8">
          <img src={trip.cover} alt={trip.name} className="h-72 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-background">
            <p className="text-xs uppercase tracking-wider opacity-80">Public itinerary</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
              {trip.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(trip.startDate), "MMM d")} →{" "}
                {format(new Date(trip.endDate), "MMM d, yyyy")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {trip.stops.length} stops
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4" />${b.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-card border border-border/60 p-5 shadow-soft flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-sm font-mono text-muted-foreground truncate">
            {typeof window !== "undefined"
              ? `${window.location.origin}/share/${trip.shareToken || token}`
              : ""}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button className="rounded-full">
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>

        <p className="mt-10 text-muted-foreground max-w-3xl">{trip.description}</p>

        <div className="mt-10 relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {days.map((d, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[18px] top-2 h-3 w-3 rounded-full bg-brand-gradient ring-4 ring-background" />
                <p className="font-display text-lg font-semibold">
                  Day {i + 1}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {format(d.date, "EEE, MMM d")}
                    {d.stop && ` · ${d.stop.city}`}
                  </span>
                </p>
                <div className="mt-3 grid gap-2">
                  {d.stop?.activities.length ? (
                    d.stop.activities.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-xl bg-card border border-border/60 p-4 shadow-soft flex items-center gap-4"
                      >
                        <div className="text-xs font-mono text-muted-foreground w-12">
                          {a.time || "—"}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.category} · {a.duration}
                          </p>
                        </div>
                        <p className="text-sm font-medium">${a.cost}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                      Open day · explore freely.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-foreground text-background p-10 text-center">
          <p className="text-sm opacity-80">Built with RouteWise</p>
          <h3 className="mt-2 font-display text-3xl font-semibold">
            Plan smarter trips, beautifully.
          </h3>
          <Button asChild variant="secondary" className="mt-5 rounded-full">
            <Link to="/signup">Start planning your own</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
