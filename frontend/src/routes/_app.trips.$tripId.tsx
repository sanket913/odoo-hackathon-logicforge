import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wallet,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Share2,
  Copy,
  ListTodo,
  StickyNote,
  Map as MapIcon,
  CalendarDays,
  Clock,
  Coins,
  TrendingUp,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { format, differenceInDays, eachDayOfInterval } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp, tripBudgetEstimate } from "@/context/AppContext";
import { EmptyState } from "@/components/EmptyState";
import type {
  Activity,
  ActivityCategory,
  AIImprovementResult,
  AIRecapResult,
  AIStressResult,
  AIBudgetOptimizationResult,
  ChecklistItem,
} from "@/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { cityImages } from "@/data/mock";

export const Route = createFileRoute("/_app/trips/$tripId")({
  component: TripDetail,
});

const categories: ActivityCategory[] = [
  "Sightseeing",
  "Food",
  "Adventure",
  "Culture",
  "Shopping",
  "Relaxation",
];

const categoryColor: Record<ActivityCategory, string> = {
  Sightseeing: "bg-[oklch(0.94_0.04_220)] text-[oklch(0.35_0.1_240)]",
  Food: "bg-[oklch(0.96_0.05_60)] text-[oklch(0.4_0.13_50)]",
  Adventure: "bg-[oklch(0.93_0.05_30)] text-[oklch(0.4_0.15_25)]",
  Culture: "bg-[oklch(0.94_0.04_300)] text-[oklch(0.35_0.1_300)]",
  Shopping: "bg-[oklch(0.94_0.04_340)] text-[oklch(0.4_0.12_340)]",
  Relaxation: "bg-[oklch(0.93_0.05_155)] text-[oklch(0.35_0.12_155)]",
};

function TripDetail() {
  const { tripId } = Route.useParams();
  const { getTrip, loadTrip } = useApp();
  const trip = getTrip(tripId);
  const navigate = useNavigate();

  useEffect(() => {
    void loadTrip(tripId);
  }, [loadTrip, tripId]);

  if (!trip) {
    return (
      <EmptyState
        title="Trip not found"
        description="This trip might have been deleted or the link is wrong."
        icon={<AlertTriangle className="h-5 w-5" />}
        action={
          <Button asChild className="rounded-full">
            <Link to="/trips">Back to my trips</Link>
          </Button>
        }
      />
    );
  }

  const budget = tripBudgetEstimate(trip);

  return (
    <div>
      <Link
        to="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> All trips
      </Link>

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-card">
        <img src={trip.cover} alt={trip.name} className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-background">
          <Badge className="bg-background/15 backdrop-blur text-background border-0 capitalize rounded-full">
            {trip.status}
          </Badge>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            {trip.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base opacity-80">{trip.description}</p>
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
              <Wallet className="h-4 w-4" />${budget.total.toLocaleString()} est.
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="bg-muted/60 rounded-full h-auto p-1 flex-wrap">
          {[
            ["overview", "Overview"],
            ["builder", "Itinerary builder"],
            ["view", "Itinerary view"],
            ["budget", "Budget"],
            ["checklist", "Checklist"],
            ["notes", "Notes"],
            ["share", "Share"],
          ].map(([v, l]) => (
            <TabsTrigger
              key={v}
              value={v}
              className="rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-soft"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Overview trip={trip} />
        </TabsContent>
        <TabsContent value="builder" className="mt-6">
          <Builder trip={trip} />
        </TabsContent>
        <TabsContent value="view" className="mt-6">
          <ItineraryView trip={trip} />
        </TabsContent>
        <TabsContent value="budget" className="mt-6">
          <BudgetTab trip={trip} />
        </TabsContent>
        <TabsContent value="checklist" className="mt-6">
          <ChecklistTab trip={trip} />
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <NotesTab trip={trip} />
        </TabsContent>
        <TabsContent value="share" className="mt-6">
          <ShareTab trip={trip} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* -------- Overview -------- */
function Overview({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const { analyzeStress, getTripSummary, improveItinerary } = useApp();
  const [stress, setStress] = useState<AIStressResult | null>(null);
  const [summary, setSummary] = useState<AIRecapResult | null>(null);
  const [improvements, setImprovements] = useState<AIImprovementResult | null>(null);
  const [budgetAI, setBudgetAI] = useState<AIBudgetOptimizationResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const loadAI = useCallback(async () => {
    setIsLoadingAI(true);
    setAiError(null);
    try {
      const [stressData, summaryData, improvementData, budgetData] = await Promise.all([
        analyzeStress(trip.id),
        getTripSummary(trip.id),
        improveItinerary(trip.id),
        api.optimizeBudget({
          tripId: trip.id,
          budget: trip.budgetTarget,
          durationDays: Math.max(
            1,
            differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1,
          ),
        }),
      ]);
      setStress(stressData);
      setSummary(summaryData);
      setImprovements(improvementData);
      setBudgetAI(budgetData.result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Unable to load RouteWise AI insights.");
    } finally {
      setIsLoadingAI(false);
    }
  }, [
    analyzeStress,
    getTripSummary,
    improveItinerary,
    trip.budgetTarget,
    trip.endDate,
    trip.id,
    trip.startDate,
  ]);

  useEffect(() => {
    void loadAI();
  }, [loadAI]);

  const budget = tripBudgetEstimate(trip);
  const checklistDone = trip.checklist.filter((c) => c.done).length;
  const fallbackReason =
    stress?.fallbackReason ||
    summary?.fallbackReason ||
    improvements?.fallbackReason ||
    budgetAI?.fallbackReason;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {(fallbackReason || aiError) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{aiError || `Fallback AI active: ${fallbackReason}`}</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-background"
              onClick={() => void loadAI()}
              disabled={isLoadingAI}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Adaptive Route Intelligence / Improvements */}
        <div className="rounded-2xl bg-foreground text-background p-6 shadow-card overflow-hidden relative group">
          <div className="absolute -right-8 -top-8 bg-brand/20 h-32 w-32 rounded-full blur-3xl group-hover:bg-brand/30 transition-colors" />
          <div className="flex items-center gap-2 relative">
            <Sparkles className="h-5 w-5 text-brand" />
            <p className="text-sm font-medium opacity-80">Route Intelligence</p>
          </div>
          <div className="relative">
            {isLoadingAI ? (
              <div className="mt-4 space-y-2 animate-pulse">
                <div className="h-6 bg-background/10 rounded w-3/4" />
                <div className="h-6 bg-background/10 rounded w-1/2" />
              </div>
            ) : improvements?.pacingSuggestions[0] ? (
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug max-w-xl">
                {improvements.pacingSuggestions[0]}
              </h3>
            ) : (
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug max-w-xl">
                Your itinerary flow looks solid. No major bottlenecks detected.
              </h3>
            )}
            {improvements && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <p className="rounded-xl bg-background/10 p-3 text-xs">
                  Quality score: {improvements.routeQualityScore}/100
                </p>
                <p className="rounded-xl bg-background/10 p-3 text-xs">
                  Route: {improvements.betterRouteOrder.join(" -> ") || "Add stops to analyze"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Travel Recap */}
        {summary && (
          <div className="rounded-2xl bg-brand/5 border border-brand/20 p-6 shadow-soft relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 text-brand/20 opacity-10">
              <MapIcon className="h-24 w-24" />
            </div>
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand" />
              {summary.title || "AI Travel Recap"}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed italic">
              "{summary.shortSummary}"
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {summary.highlights.map((h, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-background border-brand/20 text-brand rounded-full"
                >
                  {h}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground/80">{summary.shareCaption}</p>
          </div>
        )}

        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            Quick highlights
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {trip.stops.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-xl border border-border/60 p-4">
                <p className="font-medium">{s.city}</p>
                <p className="text-xs text-muted-foreground">{s.country}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(s.arrival), "MMM d")} → {format(new Date(s.departure), "MMM d")}{" "}
                  · {s.activities.length} activities
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Trip Stress Meter */}
        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Trip Stress Meter
            </p>
            {stress && (
              <Badge
                className={cn(
                  "rounded-full px-2 py-0",
                  stress.stressLevel === "Low"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : stress.stressLevel === "Moderate"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-rose-50 text-rose-700 border-rose-100",
                )}
              >
                {stress.stressLevel}
              </Badge>
            )}
          </div>
          {isLoadingAI ? (
            <div className="mt-4 space-y-2 animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-2 bg-muted rounded w-full" />
            </div>
          ) : (
            <>
              <p className="mt-2 font-display text-3xl font-semibold">
                {stress?.stressScore || 0}
                <span className="text-sm font-normal text-muted-foreground ml-1">/100</span>
              </p>
              <Progress
                value={stress?.stressScore || 0}
                className={cn(
                  "mt-3 h-2",
                  (stress?.stressScore || 0) > 60
                    ? "bg-rose-100"
                    : (stress?.stressScore || 0) > 30
                      ? "bg-amber-100"
                      : "bg-emerald-100",
                )}
              />
              {stress?.reasons[0] && (
                <div className="mt-4 p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground flex gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p>{stress.reasons[0]}</p>
                </div>
              )}
              {stress?.fixes[0] && (
                <p className="mt-3 text-xs text-muted-foreground">{stress.fixes[0]}</p>
              )}
            </>
          )}
        </div>

        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Budget Optimization
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            ${Math.round(budgetAI?.possibleSavings || 0).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            possible savings - {budgetAI?.budgetRiskLevel || "Moderate"} risk
          </p>
          <Progress
            value={Math.min(
              100,
              ((budgetAI?.currentEstimatedCost || budget.total) / Math.max(1, trip.budgetTarget)) *
                100,
            )}
            className="mt-3 h-2"
          />
          {budgetAI?.categorySuggestions[0] && (
            <p className="mt-4 text-xs text-muted-foreground">
              {budgetAI.categorySuggestions[0].suggestion}
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Checklist</p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {checklistDone}/{trip.checklist.length || 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">items packed</p>
          <Progress
            value={trip.checklist.length ? (checklistDone / trip.checklist.length) * 100 : 0}
            className="mt-3 h-2"
          />
        </div>
      </div>
    </div>
  );
}

/* -------- Itinerary Builder -------- */
function Builder({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const { addStop, removeStop, addActivity, removeActivity } = useApp();
  const [openStop, setOpenStop] = useState(false);
  const [stopForm, setStopForm] = useState({
    city: "Lisbon",
    country: "Portugal",
    arrival: trip.startDate,
    departure: trip.endDate,
  });

  const submitStop = async () => {
    if (!stopForm.city) return;
    try {
      await addStop(trip.id, stopForm);
      setOpenStop(false);
      toast.success(`${stopForm.city} added to your trip`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add stop");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">Itinerary builder</h2>
          <p className="text-sm text-muted-foreground">
            Add stops, then drop activities into each day.
          </p>
        </div>
        <Dialog open={openStop} onOpenChange={setOpenStop}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-1" /> Add stop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a stop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input
                    value={stopForm.city}
                    onChange={(e) => setStopForm({ ...stopForm, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Input
                    value={stopForm.country}
                    onChange={(e) => setStopForm({ ...stopForm, country: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Arrival</Label>
                  <Input
                    type="date"
                    value={stopForm.arrival}
                    onChange={(e) => setStopForm({ ...stopForm, arrival: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Departure</Label>
                  <Input
                    type="date"
                    value={stopForm.departure}
                    onChange={(e) => setStopForm({ ...stopForm, departure: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={submitStop} className="rounded-full">
                Add stop
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {trip.stops.length === 0 ? (
        <EmptyState
          title="No stops yet"
          description="Add your first city to start building this itinerary."
          icon={<MapIcon className="h-5 w-5" />}
          action={
            <Button onClick={() => setOpenStop(true)} className="rounded-full">
              Add a stop
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {trip.stops.map((stop, idx) => {
            const days = Math.max(
              1,
              differenceInDays(new Date(stop.departure), new Date(stop.arrival)) || 1,
            );
            return (
              <div
                key={stop.id}
                className="rounded-2xl bg-card border border-border/60 shadow-soft overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-56 h-40 md:h-auto relative">
                    <img
                      src={stop.image || cityImages[stop.city] || Object.values(cityImages)[0]}
                      alt={stop.city}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs rounded-full bg-background/90 backdrop-blur font-medium">
                      Stop {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-xl font-semibold">
                          {stop.city}, {stop.country}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(stop.arrival), "MMM d")} →{" "}
                          {format(new Date(stop.departure), "MMM d")} · {days}{" "}
                          {days === 1 ? "day" : "days"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          void removeStop(trip.id, stop.id);
                          toast("Stop removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {stop.activities.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No activities yet — add some below.
                        </p>
                      )}
                      {stop.activities.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[a.category]}`}
                            >
                              {a.category}
                            </span>
                            <p className="text-sm font-medium truncate">{a.name}</p>
                            <span className="hidden sm:inline text-xs text-muted-foreground">
                              {a.time && `${a.time} · `}
                              {a.duration || ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">${a.cost}</span>
                            <button
                              onClick={() => void removeActivity(trip.id, stop.id, a.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <AddActivityForm
                      onAdd={(a) => {
                        void addActivity(trip.id, stop.id, a)
                          .then(() => toast.success("Activity added"))
                          .catch((error) =>
                            toast.error(
                              error instanceof Error ? error.message : "Unable to add activity",
                            ),
                          );
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddActivityForm({ onAdd }: { onAdd: (a: Omit<Activity, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Activity, "id">>({
    name: "",
    category: "Sightseeing",
    time: "10:00",
    duration: "2h",
    cost: 0,
  });

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground hover:text-brand transition-colors"
      >
        <Plus className="h-4 w-4" /> Add activity
      </button>
    );

  return (
    <div className="mt-3 rounded-xl border border-dashed p-3 bg-muted/30 grid gap-2 sm:grid-cols-12">
      <Input
        placeholder="Activity name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="sm:col-span-4"
      />
      <Select
        value={form.category}
        onValueChange={(v) => setForm({ ...form, category: v as ActivityCategory })}
      >
        <SelectTrigger className="sm:col-span-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Time"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        className="sm:col-span-2"
      />
      <Input
        placeholder="$"
        type="number"
        value={form.cost}
        onChange={(e) => setForm({ ...form, cost: Number(e.target.value) || 0 })}
        className="sm:col-span-1"
      />
      <div className="sm:col-span-2 flex gap-1">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => {
            if (!form.name.trim()) return;
            onAdd(form);
            setForm({ ...form, name: "", cost: 0 });
            setOpen(false);
          }}
        >
          Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* -------- Itinerary View -------- */
function ItineraryView({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const [view, setView] = useState<"list" | "calendar">("list");

  const days = useMemo(() => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const list = eachDayOfInterval({ start, end });
    return list.map((d) => {
      const stop = trip.stops.find(
        (s) =>
          new Date(s.arrival).getTime() <= d.getTime() &&
          new Date(s.departure).getTime() >= d.getTime(),
      );
      return { date: d, stop };
    });
  }, [trip]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">Itinerary view</h2>
          <p className="text-sm text-muted-foreground">A clean, day-by-day timeline.</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 h-8 text-sm rounded-full capitalize transition-colors ${
                view === v ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
            >
              {v === "list" ? (
                <ListTodo className="h-4 w-4 inline mr-1" />
              ) : (
                <CalendarDays className="h-4 w-4 inline mr-1" />
              )}
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-6">
            {days.map((d, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[18px] top-2 h-3 w-3 rounded-full bg-brand-gradient ring-4 ring-background" />
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-lg font-semibold">Day {i + 1}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(d.date, "EEE, MMM d")} {d.stop && `· ${d.stop.city}`}
                  </p>
                </div>
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
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full ${categoryColor[a.category]}`}
                            >
                              {a.category}
                            </span>
                            <Clock className="h-3 w-3" /> {a.duration || "—"}
                          </p>
                        </div>
                        <p className="text-sm font-medium">${a.cost}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                      Nothing planned. A breath day or open canvas.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((d, i) => (
            <div
              key={i}
              className="rounded-xl bg-card border border-border/60 p-3 min-h-[140px] shadow-soft"
            >
              <p className="text-xs text-muted-foreground">{format(d.date, "EEE")}</p>
              <p className="font-display text-lg font-semibold leading-none">
                {format(d.date, "d")}
              </p>
              {d.stop && <p className="mt-2 text-xs font-medium">{d.stop.city}</p>}
              <div className="mt-2 space-y-1">
                {(d.stop?.activities || []).slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className={`text-[10px] px-1.5 py-1 rounded ${categoryColor[a.category]} truncate`}
                  >
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Budget Tab -------- */
function BudgetTab({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const b = tripBudgetEstimate(trip);
  const items = [
    { key: "Transport", value: b.transport, color: "bg-[oklch(0.7_0.15_50)]" },
    { key: "Stay", value: b.stay, color: "bg-[oklch(0.66_0.12_195)]" },
    { key: "Food", value: b.food, color: "bg-[oklch(0.7_0.14_155)]" },
    { key: "Activities", value: b.activities, color: "bg-[oklch(0.55_0.13_220)]" },
    { key: "Misc", value: b.misc, color: "bg-[oklch(0.65_0.04_250)]" },
  ];
  const overBudget = b.total > trip.budgetTarget;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Estimated total</p>
        <p className="mt-2 font-display text-4xl font-semibold">${b.total.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">
          Target ${trip.budgetTarget.toLocaleString()} · ${Math.round(b.total / b.days)} per day
        </p>

        <div className="mt-6 h-3 w-full rounded-full overflow-hidden flex">
          {items.map((i) => (
            <div
              key={i.key}
              className={i.color}
              style={{ width: `${(i.value / b.total) * 100}%` }}
            />
          ))}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {items.map((i) => (
            <div
              key={i.key}
              className="flex items-center justify-between rounded-xl border border-border/60 p-3"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${i.color}`} />
                <span className="text-sm">{i.key}</span>
              </div>
              <span className="text-sm font-medium">${i.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {overBudget && (
          <div className="mt-4 rounded-xl bg-[oklch(0.97_0.03_30)] border border-[oklch(0.85_0.1_30)] p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-[oklch(0.5_0.15_30)]" />
            <div>
              <p className="font-medium text-sm">
                Over target by ${(b.total - trip.budgetTarget).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Try cutting one paid activity per day or swap a stay tier — RouteWise AI can help.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-foreground text-background p-6 shadow-card">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <p className="text-sm opacity-80">Smart insight</p>
          </div>
          <p className="mt-3 font-display text-lg leading-snug">
            Stays make up {Math.round((b.stay / b.total) * 100)}% of your trip — biggest lever to
            optimize.
          </p>
          <Button variant="secondary" className="mt-4 rounded-full">
            <Sparkles className="h-4 w-4 mr-1" /> Optimize budget
          </Button>
        </div>
        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Coins className="h-3.5 w-3.5" /> AVERAGE / DAY
          </div>
          <p className="mt-2 font-display text-2xl font-semibold">
            ${Math.round(b.total / b.days)}
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Layers className="h-3.5 w-3.5" /> TRIP LENGTH
          </div>
          <p className="mt-2 font-display text-2xl font-semibold">{b.days} days</p>
        </div>
      </div>
    </div>
  );
}

/* -------- Checklist Tab -------- */
function ChecklistTab({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const { addChecklistItem, toggleChecklistItem, removeChecklistItem } = useApp();
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState<ChecklistItem["category"]>("Documents");
  const groups: ChecklistItem["category"][] = [
    "Clothing",
    "Documents",
    "Electronics",
    "Medicines",
    "Other",
  ];
  const done = trip.checklist.filter((c) => c.done).length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Add a packing item…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="flex-1 h-11 rounded-xl"
          />
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as ChecklistItem["category"])}
          >
            <SelectTrigger className="h-11 rounded-xl sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="h-11 rounded-xl"
            onClick={() => {
              if (!label.trim()) return;
              void addChecklistItem(trip.id, { label: label.trim(), category, done: false })
                .then(() => setLabel(""))
                .catch((error) =>
                  toast.error(
                    error instanceof Error ? error.message : "Unable to add checklist item",
                  ),
                );
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {groups.map((g) => {
          const list = trip.checklist.filter((c) => c.category === g);
          if (!list.length) return null;
          return (
            <div key={g} className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{g}</p>
              <div className="mt-3 divide-y">
                {list.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 py-2.5 cursor-pointer group">
                    <Checkbox
                      checked={c.done}
                      onCheckedChange={() => void toggleChecklistItem(trip.id, c.id)}
                    />
                    <span
                      className={`flex-1 text-sm ${c.done ? "line-through text-muted-foreground" : ""}`}
                    >
                      {c.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        void removeChecklistItem(trip.id, c.id);
                      }}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        {trip.checklist.length === 0 && (
          <EmptyState
            title="Checklist is empty"
            description="Add your first packing item above."
            icon={<ListTodo className="h-5 w-5" />}
          />
        )}
      </div>

      <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft h-fit">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Packing progress</p>
        <p className="mt-2 font-display text-3xl font-semibold">
          {done}/{trip.checklist.length || 0}
        </p>
        <Progress
          value={trip.checklist.length ? (done / trip.checklist.length) * 100 : 0}
          className="mt-3 h-2"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          {trip.checklist.length === 0
            ? "Nothing to pack yet."
            : done === trip.checklist.length
              ? "All packed. Safe travels!"
              : `${trip.checklist.length - done} items to go.`}
        </p>
      </div>
    </div>
  );
}

/* -------- Notes Tab -------- */
function NotesTab({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const { addNote, removeNote } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">Notes & journal</h2>
          <p className="text-sm text-muted-foreground">Reservations, reminders, and thoughts.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-1" /> New note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New note</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                rows={5}
                placeholder="Write something…"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  if (!form.title.trim()) return;
                  void addNote(trip.id, form)
                    .then(() => {
                      setForm({ title: "", body: "" });
                      setOpen(false);
                      toast.success("Note saved");
                    })
                    .catch((error) =>
                      toast.error(error instanceof Error ? error.message : "Unable to save note"),
                    );
                }}
                className="rounded-full"
              >
                Save note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {trip.notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Capture reservations, packing tips, or trip journal entries."
          icon={<StickyNote className="h-5 w-5" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trip.notes.map((n) => (
            <div key={n.id} className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(n.createdAt), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>
                <button
                  onClick={() => void removeNote(trip.id, n.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Share Tab -------- */
function ShareTab({ trip }: { trip: ReturnType<typeof useApp>["trips"][0] }) {
  const { shareTrip } = useApp();
  const [token, setToken] = useState(trip.shareToken);
  const url =
    typeof window !== "undefined" && token ? `${window.location.origin}/share/${token}` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <h2 className="font-display text-2xl font-semibold">Share this trip</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate a public, read-only link friends can view (and clone) without an account.
        </p>

        {token ? (
          <div className="mt-5 rounded-xl border border-border/60 bg-muted/40 p-4 flex items-center gap-3">
            <span className="text-sm font-mono truncate flex-1">{url}</span>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                navigator.clipboard?.writeText(url);
                toast.success("Link copied");
              }}
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link to="/share/$token" params={{ token }}>
                Preview
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            className="mt-5 rounded-full"
            onClick={async () => {
              try {
                const t = await shareTrip(trip.id);
                setToken(t);
                toast.success("Trip is now public");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to share trip");
              }
            }}
          >
            Generate public link
          </Button>
        )}

        {token && (
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {["Twitter / X", "Facebook", "WhatsApp", "Email"].map((s) => (
              <button
                key={s}
                className="px-3 h-9 rounded-full border border-border bg-background hover:bg-muted transition-colors"
              >
                Share to {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-foreground text-background p-6 shadow-card">
        <p className="text-sm opacity-80">Why share?</p>
        <p className="mt-3 font-display text-xl leading-snug">
          Build a public portfolio of trips. Inspire friends. Get cloned by other planners.
        </p>
      </div>
    </div>
  );
}
