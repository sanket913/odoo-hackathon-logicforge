import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Wallet } from "lucide-react";
import type { Trip } from "@/types";
import { Badge } from "@/components/ui/badge";
import { tripBudgetEstimate, tripDuration } from "@/context/AppContext";
import { format } from "date-fns";

const statusStyles: Record<Trip["status"], string> = {
  upcoming: "bg-brand-soft text-foreground",
  planning: "bg-accent text-accent-foreground",
  completed: "bg-muted text-muted-foreground",
};

export function TripCard({ trip }: { trip: Trip }) {
  const budget = tripBudgetEstimate(trip);
  return (
    <Link
      to="/trips/$tripId"
      params={{ tripId: trip.id }}
      className="group block rounded-2xl overflow-hidden bg-card border border-border/60 shadow-soft hover:shadow-card transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={trip.cover}
          alt={trip.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`rounded-full ${statusStyles[trip.status]} border-0 capitalize`}>
            {trip.status}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-ink line-clamp-1">{trip.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {tripDuration(trip)} days
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {trip.stops.length} stops
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5" />${budget.total.toLocaleString()}
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {format(new Date(trip.startDate), "MMM d")} →{" "}
          {format(new Date(trip.endDate), "MMM d, yyyy")}
        </div>
      </div>
    </Link>
  );
}
