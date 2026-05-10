import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Activity, ChecklistItem, Stop, Trip, TripNote, User } from "@/types";
import { initialTrips, cityImages } from "@/data/mock";
import {
  api,
  ApiClientError,
  setAccessToken,
  type AuthUser,
  type BackendActivity,
  type BackendChecklistItem,
  type BackendNote,
  type BackendStop,
  type BackendTrip,
  type AIStressResult,
  type AIRecapResult,
  type AIImprovementResult,
} from "@/lib/api";

type TripInput = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetTarget: number;
  cover?: string;
};

type AppState = {
  user: User | null;
  authReady: boolean;
  isSyncing: boolean;
  apiError: string | null;
  retrySync: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;

  trips: Trip[];
  getTrip: (id: string) => Trip | undefined;
  loadTrip: (id: string) => Promise<Trip | undefined>;
  getTripByShareToken: (token: string) => Trip | undefined;
  getPublicTripByShareToken: (token: string) => Promise<Trip | undefined>;
  createTrip: (data: TripInput) => Promise<Trip>;
  updateTrip: (id: string, patch: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addStop: (
    tripId: string,
    data: { city: string; country: string; arrival: string; departure: string },
  ) => Promise<void>;
  removeStop: (tripId: string, stopId: string) => Promise<void>;
  addActivity: (tripId: string, stopId: string, activity: Omit<Activity, "id">) => Promise<void>;
  removeActivity: (tripId: string, stopId: string, activityId: string) => Promise<void>;
  addChecklistItem: (tripId: string, item: Omit<ChecklistItem, "id">) => Promise<void>;
  toggleChecklistItem: (tripId: string, itemId: string) => Promise<void>;
  removeChecklistItem: (tripId: string, itemId: string) => Promise<void>;
  addNote: (tripId: string, note: { title: string; body: string }) => Promise<void>;
  removeNote: (tripId: string, noteId: string) => Promise<void>;
  shareTrip: (tripId: string) => Promise<string>;
  analyzeStress: (tripId: string) => Promise<AIStressResult>;
  getTripSummary: (tripId: string) => Promise<AIRecapResult>;
  improveItinerary: (tripId: string) => Promise<AIImprovementResult>;
};

const AppContext = createContext<AppState | null>(null);

const id = () => Math.random().toString(36).slice(2, 10);
const STORAGE_USER = "routewise.user";
const STORAGE_TRIPS = "routewise.trips";

const safeDate = (value: string | Date | null | undefined) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

const money = (value: string | number | null | undefined) => Number(value || 0);

const frontendStatus = (status?: BackendTrip["status"]): Trip["status"] => {
  if (status === "COMPLETED") return "completed";
  if (status === "ACTIVE") return "upcoming";
  return "planning";
};

const backendStatus = (status?: Trip["status"]) => {
  if (status === "completed") return "COMPLETED";
  if (status === "upcoming") return "ACTIVE";
  return "PLANNED";
};

const titleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const mapUser = (user: AuthUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatarUrl || undefined,
});

const mapActivity = (activity: BackendActivity): Activity => ({
  id: activity.id,
  name: activity.title,
  category: titleCase(activity.category) as Activity["category"],
  time: activity.startTime
    ? new Date(activity.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : undefined,
  duration: activity.durationMinutes ? `${Math.round(activity.durationMinutes / 60)}h` : undefined,
  cost: money(activity.estimatedCost),
  notes: activity.description || activity.location || undefined,
});

const mapStop = (stop: BackendStop): Stop => ({
  id: stop.id,
  city: stop.cityName,
  country: stop.country,
  arrival: safeDate(stop.arrivalDate),
  departure: safeDate(stop.departureDate),
  image: cityImages[stop.cityName] || Object.values(cityImages)[0],
  activities: (stop.activities || []).map(mapActivity),
});

const mapChecklist = (item: BackendChecklistItem): ChecklistItem => ({
  id: item.id,
  category: titleCase(item.category) as ChecklistItem["category"],
  label: item.title,
  done: item.isPacked,
});

const mapNote = (note: BackendNote): TripNote => ({
  id: note.id,
  title: note.title || "Untitled note",
  body: note.content,
  createdAt: note.createdAt,
});

export const mapBackendTrip = (trip: BackendTrip): Trip => ({
  id: trip.id,
  name: trip.title,
  description: trip.description || "A new adventure in the making.",
  startDate: safeDate(trip.startDate),
  endDate: safeDate(trip.endDate),
  cover: trip.coverImageUrl || Object.values(cityImages)[0],
  status: frontendStatus(trip.status),
  budgetTarget: money(trip.totalEstimatedBudget),
  stops: (trip.stops || []).map(mapStop),
  checklist: (trip.checklistItems || []).map(mapChecklist),
  notes: (trip.notes || []).map(mapNote),
  shareToken: trip.shareToken || undefined,
});

const isApiUnavailable = (error: unknown) =>
  error instanceof ApiClientError && error.isNetworkError;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const replaceTrip = useCallback((trip: Trip) => {
    setTrips((prev) => {
      const exists = prev.some((item) => item.id === trip.id);
      return exists ? prev.map((item) => (item.id === trip.id ? trip : item)) : [trip, ...prev];
    });
  }, []);

  const loadTripsFromApi = useCallback(async () => {
    const { trips: backendTrips } = await api.getTrips();
    setTrips(backendTrips.map(mapBackendTrip));
    setApiError(null);
  }, []);

  const retrySync = useCallback(async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await loadTripsFromApi();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to sync trips.");
    } finally {
      setIsSyncing(false);
    }
  }, [loadTripsFromApi, user]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (typeof window !== "undefined") {
        try {
          const storedUser = localStorage.getItem(STORAGE_USER);
          const storedTrips = localStorage.getItem(STORAGE_TRIPS);
          if (storedUser) setUser(JSON.parse(storedUser));
          if (storedTrips) setTrips(JSON.parse(storedTrips));
        } catch {
          // Keep bundled demo data if local storage is unavailable or malformed.
        }
      }

      setIsSyncing(true);
      try {
        const refreshed = await api.refresh();
        if (cancelled) return;
        setAccessToken(refreshed.accessToken);
        setUser(mapUser(refreshed.user));
        const current = await api.getCurrentUser();
        if (cancelled) return;
        setUser(mapUser(current.user));
        await loadTripsFromApi();
      } catch (error) {
        if (!cancelled && isApiUnavailable(error)) {
          setApiError(error instanceof Error ? error.message : "RouteWise API is unavailable.");
        }
      } finally {
        if (!cancelled) {
          setIsSyncing(false);
          setAuthReady(true);
        }
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [loadTripsFromApi]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_USER);
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_TRIPS, JSON.stringify(trips));
  }, [trips]);

  const value = useMemo<AppState>(() => {
    const updateOne = (tripId: string, patch: Partial<Trip>) =>
      setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, ...patch } : trip)));

    return {
      user,
      authReady,
      isSyncing,
      apiError,
      retrySync,

      login: async (email, password) => {
        try {
          const result = await api.login({ email, password });
          setAccessToken(result.accessToken);
          setUser(mapUser(result.user));
          await loadTripsFromApi();
          setApiError(null);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setApiError(error instanceof Error ? error.message : "Using saved demo data.");
          setUser({
            id: "user-1",
            name: email.split("@")[0].replace(/\b\w/g, (char) => char.toUpperCase()),
            email,
          });
        }
      },
      logout: async () => {
        try {
          await api.logout();
        } catch {
          // Local logout still succeeds if the API is offline.
        }
        setAccessToken(null);
        setUser(null);
      },
      signup: async (name, email, password) => {
        try {
          const result = await api.register({ name, email, password });
          setAccessToken(result.accessToken);
          setUser(mapUser(result.user));
          await loadTripsFromApi();
          setApiError(null);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setApiError(error instanceof Error ? error.message : "Using saved demo data.");
          setUser({ id: "user-1", name, email });
        }
      },
      updateProfile: async (name, email) => {
        try {
          const result = await api.updateCurrentUser({ name });
          setUser({ ...mapUser(result.user), email });
          setApiError(null);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setUser((prev) => ({ id: prev?.id || "user-1", name, email }));
        }
      },

      trips,
      getTrip: (tripId) => trips.find((trip) => trip.id === tripId),
      loadTrip: async (tripId) => {
        try {
          const { trip } = await api.getTripById(tripId);
          const mapped = mapBackendTrip(trip);
          replaceTrip(mapped);
          setApiError(null);
          return mapped;
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setApiError(
            error instanceof Error ? error.message : "Unable to load latest trip details.",
          );
          return trips.find((trip) => trip.id === tripId);
        }
      },
      getTripByShareToken: (token) => trips.find((trip) => trip.shareToken === token),
      getPublicTripByShareToken: async (token) => {
        try {
          const { trip } = await api.getPublicItinerary(token);
          return mapBackendTrip(trip);
        } catch {
          return trips.find((trip) => trip.shareToken === token);
        }
      },

      createTrip: async (data) => {
        try {
          const { trip } = await api.createTrip({
            title: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            coverImageUrl: data.cover,
            totalEstimatedBudget: data.budgetTarget,
            status: "PLANNED",
          });
          const mapped = mapBackendTrip(trip);
          replaceTrip(mapped);
          setApiError(null);
          return mapped;
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setApiError(error instanceof Error ? error.message : "Trip saved locally.");
          const trip: Trip = {
            id: `trip-${id()}`,
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            cover: data.cover || Object.values(cityImages)[0],
            status: "planning",
            budgetTarget: data.budgetTarget,
            stops: [],
            checklist: [],
            notes: [],
          };
          setTrips((prev) => [trip, ...prev]);
          return trip;
        }
      },
      updateTrip: async (tripId, patch) => {
        updateOne(tripId, patch);
        try {
          const { trip } = await api.updateTrip(tripId, {
            ...(patch.name ? { title: patch.name } : {}),
            ...(patch.description ? { description: patch.description } : {}),
            ...(patch.startDate ? { startDate: patch.startDate } : {}),
            ...(patch.endDate ? { endDate: patch.endDate } : {}),
            ...(patch.cover ? { coverImageUrl: patch.cover } : {}),
            ...(patch.status ? { status: backendStatus(patch.status) } : {}),
            ...(patch.budgetTarget !== undefined
              ? { totalEstimatedBudget: patch.budgetTarget }
              : {}),
          });
          replaceTrip(mapBackendTrip(trip));
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setApiError(error instanceof Error ? error.message : "Trip updated locally.");
        }
      },
      deleteTrip: async (tripId) => {
        setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
        try {
          await api.deleteTrip(tripId);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          setApiError(error instanceof Error ? error.message : "Trip deleted locally.");
        }
      },

      addStop: async (tripId, data) => {
        try {
          const trip = trips.find((item) => item.id === tripId);
          const { stop } = await api.addStop(tripId, {
            cityName: data.city,
            country: data.country,
            arrivalDate: data.arrival,
            departureDate: data.departure,
            orderIndex: trip?.stops.length || 0,
          });
          updateOne(tripId, { stops: [...(trip?.stops || []), mapStop(stop)] });
          setApiError(null);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          const stop: Stop = {
            id: `stop-${id()}`,
            city: data.city,
            country: data.country,
            arrival: data.arrival,
            departure: data.departure,
            image: cityImages[data.city] || Object.values(cityImages)[0],
            activities: [],
          };
          setTrips((prev) =>
            prev.map((trip) =>
              trip.id === tripId ? { ...trip, stops: [...trip.stops, stop] } : trip,
            ),
          );
          setApiError(error instanceof Error ? error.message : "Stop saved locally.");
        }
      },
      removeStop: async (tripId, stopId) => {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId
              ? { ...trip, stops: trip.stops.filter((stop) => stop.id !== stopId) }
              : trip,
          ),
        );
        try {
          await api.deleteStop(stopId);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
        }
      },

      addActivity: async (tripId, stopId, activity) => {
        const trip = trips.find((item) => item.id === tripId);
        const stop = trip?.stops.find((item) => item.id === stopId);
        try {
          const startTime =
            activity.time && stop
              ? new Date(`${stop.arrival}T${activity.time}:00`).toISOString()
              : undefined;
          const { activity: created } = await api.addActivity(stopId, {
            title: activity.name,
            category: activity.category,
            startTime,
            durationMinutes: activity.duration?.includes("h")
              ? Math.round(Number(activity.duration.replace("h", "")) * 60)
              : undefined,
            estimatedCost: activity.cost,
            description: activity.notes,
          });
          const mapped = mapActivity(created);
          setTrips((prev) =>
            prev.map((item) =>
              item.id === tripId
                ? {
                    ...item,
                    stops: item.stops.map((s) =>
                      s.id === stopId ? { ...s, activities: [...s.activities, mapped] } : s,
                    ),
                  }
                : item,
            ),
          );
          setApiError(null);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          const localActivity: Activity = { ...activity, id: `act-${id()}` };
          setTrips((prev) =>
            prev.map((item) =>
              item.id === tripId
                ? {
                    ...item,
                    stops: item.stops.map((s) =>
                      s.id === stopId ? { ...s, activities: [...s.activities, localActivity] } : s,
                    ),
                  }
                : item,
            ),
          );
          setApiError(error instanceof Error ? error.message : "Activity saved locally.");
        }
      },
      removeActivity: async (tripId, stopId, activityId) => {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  stops: trip.stops.map((stop) =>
                    stop.id === stopId
                      ? {
                          ...stop,
                          activities: stop.activities.filter(
                            (activity) => activity.id !== activityId,
                          ),
                        }
                      : stop,
                  ),
                }
              : trip,
          ),
        );
        try {
          await api.deleteActivity(activityId);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
        }
      },

      addChecklistItem: async (tripId, item) => {
        try {
          const { item: created } = await api.addChecklistItem(tripId, {
            title: item.label,
            category: item.category.toLowerCase(),
            isPacked: item.done,
          });
          const mapped = mapChecklist(created);
          setTrips((prev) =>
            prev.map((trip) =>
              trip.id === tripId ? { ...trip, checklist: [...trip.checklist, mapped] } : trip,
            ),
          );
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          const localItem: ChecklistItem = { ...item, id: `cl-${id()}` };
          setTrips((prev) =>
            prev.map((trip) =>
              trip.id === tripId ? { ...trip, checklist: [...trip.checklist, localItem] } : trip,
            ),
          );
        }
      },
      toggleChecklistItem: async (tripId, itemId) => {
        const current = trips
          .find((trip) => trip.id === tripId)
          ?.checklist.find((item) => item.id === itemId);
        const nextDone = !current?.done;
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  checklist: trip.checklist.map((item) =>
                    item.id === itemId ? { ...item, done: nextDone } : item,
                  ),
                }
              : trip,
          ),
        );
        try {
          await api.updateChecklistItem(itemId, { isPacked: nextDone });
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
        }
      },
      removeChecklistItem: async (tripId, itemId) => {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId
              ? { ...trip, checklist: trip.checklist.filter((item) => item.id !== itemId) }
              : trip,
          ),
        );
        try {
          await api.deleteChecklistItem(itemId);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
        }
      },

      addNote: async (tripId, note) => {
        try {
          const { note: created } = await api.addNote(tripId, {
            title: note.title,
            content: note.body,
          });
          const mapped = mapNote(created);
          setTrips((prev) =>
            prev.map((trip) =>
              trip.id === tripId ? { ...trip, notes: [mapped, ...trip.notes] } : trip,
            ),
          );
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          const localNote: TripNote = {
            ...note,
            id: `note-${id()}`,
            createdAt: new Date().toISOString(),
          };
          setTrips((prev) =>
            prev.map((trip) =>
              trip.id === tripId ? { ...trip, notes: [localNote, ...trip.notes] } : trip,
            ),
          );
        }
      },
      removeNote: async (tripId, noteId) => {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId
              ? { ...trip, notes: trip.notes.filter((note) => note.id !== noteId) }
              : trip,
          ),
        );
        try {
          await api.deleteNote(noteId);
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
        }
      },

      shareTrip: async (tripId) => {
        try {
          const { trip } = await api.shareTrip(tripId);
          const mapped = mapBackendTrip(trip);
          updateOne(tripId, { shareToken: mapped.shareToken });
          return mapped.shareToken || "";
        } catch (error) {
          if (!isApiUnavailable(error)) throw error;
          const token = `share-${id()}`;
          updateOne(tripId, { shareToken: token });
          return token;
        }
      },

      analyzeStress: async (tripId) => {
        const trip = trips.find((t) => t.id === tripId);
        if (!trip) throw new Error("Trip not found");
        try {
          const { result } = await api.getStressMeter({
            stops: trip.stops,
            activities: trip.stops.flatMap((s) => s.activities),
            budget: tripBudgetEstimate(trip).total,
            durationDays: tripDuration(trip),
            tripId,
          });
          return result;
        } catch (error) {
          console.error("AI Stress Error:", error);
          return {
            provider: "fallback",
            liveIntegrationEnabled: false,
            fallbackReason: "Backend AI request failed",
            stressScore: 20,
            stressLevel: "Low",
            reasons: ["The app could not reach the backend AI service."],
            fixes: ["Retry after confirming the backend is running."],
          };
        }
      },

      getTripSummary: async (tripId) => {
        const trip = trips.find((t) => t.id === tripId);
        if (!trip) throw new Error("Trip not found");
        try {
          const { result } = await api.generateTripSummary({
            destination: trip.stops[0]?.city || "the world",
            tripId,
          });
          return result;
        } catch (error) {
          console.error("AI Summary Error:", error);
          return {
            provider: "fallback",
            liveIntegrationEnabled: false,
            fallbackReason: "Backend AI request failed",
            title: trip.name,
            shortSummary: `A practical journey through ${trip.stops.length} planned stops.`,
            highlights: ["Planned with RouteWise"],
            bestFor: ["organized travelers"],
            shareCaption:
              "A RouteWise itinerary with planned stops, activities, and budget context.",
          };
        }
      },

      improveItinerary: async (tripId) => {
        const trip = trips.find((t) => t.id === tripId);
        if (!trip) throw new Error("Trip not found");
        try {
          const { result } = await api.improveItinerary({
            stops: trip.stops,
            activities: trip.stops.flatMap((s) => s.activities),
            tripId,
          });
          return result;
        } catch (error) {
          console.error("AI Improvement Error:", error);
          return {
            provider: "fallback",
            liveIntegrationEnabled: false,
            fallbackReason: "Backend AI request failed",
            routeQualityScore: 70,
            tripStressLevel: "Moderate",
            overloadedDays: [],
            routeIssues: ["Route analysis is temporarily unavailable."],
            pacingSuggestions: ["Group nearby activities and keep a rest evening after transfers."],
            betterRouteOrder: trip.stops.map((stop) => stop.city),
            restDaySuggestions: ["Keep one flexible evening open."],
          };
        }
      },
    };
  }, [user, authReady, isSyncing, apiError, retrySync, trips, loadTripsFromApi, replaceTrip]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function tripDuration(t: Trip) {
  const ms = new Date(t.endDate).getTime() - new Date(t.startDate).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function tripActivityCost(t: Trip) {
  return t.stops.reduce(
    (sum, stop) =>
      sum +
      stop.activities.reduce((activitySum, activity) => activitySum + (activity.cost || 0), 0),
    0,
  );
}

export function tripBudgetEstimate(t: Trip) {
  const days = tripDuration(t);
  const stayPerDay = 110;
  const foodPerDay = 55;
  const transport = t.stops.length * 180 + 350;
  const stay = days * stayPerDay;
  const food = days * foodPerDay;
  const activities = tripActivityCost(t);
  const misc = Math.round((stay + food) * 0.08);
  const total = transport + stay + food + activities + misc;
  return { transport, stay, food, activities, misc, total, days };
}
