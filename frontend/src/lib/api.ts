const env = import.meta.env as Record<string, string | undefined>;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type JsonBody = Record<string, unknown> | unknown[] | null;

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export class ApiClientError extends Error {
  code: string;
  status?: number;
  isNetworkError: boolean;

  constructor(message: string, code = "INTERNAL_ERROR", status?: number, isNetworkError = false) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

export const BASE_URL =
  env.VITE_API_BASE_URL || env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const HEALTH_URL = BASE_URL.replace(/\/api\/v1\/?$/, "/health");

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(
  path: string,
  {
    method = "GET",
    body,
    auth = true,
  }: { method?: HttpMethod; body?: JsonBody; auth?: boolean } = {},
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const text = await response.text();
    const payload = text
      ? (JSON.parse(text) as ApiEnvelope<T>)
      : ({ success: true, data: {} as T } as const);

    if (!payload.success) {
      const details = "details" in payload.error ? payload.error.details : undefined;
      const fieldErrors =
        details &&
        typeof details === "object" &&
        "fieldErrors" in details &&
        details.fieldErrors &&
        typeof details.fieldErrors === "object"
          ? Object.values(details.fieldErrors as Record<string, unknown>)
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";
      throw new ApiClientError(
        fieldErrors || payload.error.message,
        payload.error.code,
        response.status,
      );
    }

    if (!response.ok) {
      throw new ApiClientError(
        response.statusText || "Request failed",
        "INTERNAL_ERROR",
        response.status,
      );
    }

    return payload.data;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError(
      "Connection issue detected. Showing saved local data until RouteWise reconnects.",
      "NETWORK_ERROR",
      undefined,
      true,
    );
  }
}

export async function checkApiHealth() {
  try {
    const response = await fetch(HEALTH_URL, {
      method: "GET",
      credentials: "include",
    });
    const payload = (await response.json()) as { success?: boolean };
    return response.ok && payload.success === true;
  } catch {
    return false;
  }
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role?: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export type BackendTrip = {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl?: string | null;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  totalEstimatedBudget: string | number;
  isPublic?: boolean;
  shareToken?: string | null;
  stops?: BackendStop[];
  budgetItems?: BackendBudgetItem[];
  checklistItems?: BackendChecklistItem[];
  notes?: BackendNote[];
  _count?: Record<string, number>;
};

export type BackendStop = {
  id: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  orderIndex?: number;
  costIndex?: number | null;
  activities?: BackendActivity[];
};

export type BackendActivity = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  startTime?: string | null;
  durationMinutes?: number | null;
  estimatedCost: string | number;
  location?: string | null;
};

export type BackendBudgetItem = {
  id: string;
  category: string;
  title: string;
  amount: string | number;
  currency: string;
  date?: string | null;
};

export type BackendChecklistItem = {
  id: string;
  title: string;
  category: string;
  isPacked: boolean;
};

export type BackendNote = {
  id: string;
  tripId?: string;
  stopId?: string | null;
  title?: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

export type BudgetSummary = {
  totalEstimatedCost: number;
  costByCategory: Record<string, number>;
  averageCostPerDay: number;
  overBudgetAlerts: { type: string; message: string }[];
};

export type AIStressResult = {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  stressScore: number;
  stressLevel: "Low" | "Moderate" | "High";
  reasons: string[];
  fixes: string[];
};

export type AIRecapResult = {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  title: string;
  shortSummary: string;
  highlights: string[];
  bestFor: string[];
  shareCaption: string;
};

export type AIImprovementResult = {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  routeQualityScore: number;
  tripStressLevel: "Low" | "Moderate" | "High";
  overloadedDays: string[];
  routeIssues: string[];
  pacingSuggestions: string[];
  betterRouteOrder: string[];
  restDaySuggestions: string[];
};

export type AIBudgetOptimizationResult = {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  currentEstimatedCost: number;
  possibleSavings: number;
  categorySuggestions: { category: string; suggestion: string; estimatedSavings?: number }[];
  budgetRiskLevel: "Low" | "Moderate" | "High";
  cheaperAlternatives: string[];
};

export type AIRecommendationResult = {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  recommendations: {
    type: string;
    title: string;
    reason: string;
    estimatedCost?: number;
    localTip?: string;
  }[];
};

export type AIAskResult = {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  title: string;
  answer: string;
  suggestions: string[];
  estimatedBudgetTips: string[];
  bestFor: string[];
  nextSteps: string[];
};

export const api = {
  checkHealth: checkApiHealth,
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: data, auth: false }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: data, auth: false }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  refresh: () => request<AuthResponse>("/auth/refresh", { method: "POST", auth: false }),
  getCurrentUser: () => request<{ user: AuthUser }>("/users/me"),

  getTrips: () => request<{ trips: BackendTrip[] }>("/trips"),
  createTrip: (data: JsonBody) =>
    request<{ trip: BackendTrip }>("/trips", { method: "POST", body: data }),
  getTripById: (id: string) => request<{ trip: BackendTrip }>(`/trips/${id}`),
  updateTrip: (id: string, data: JsonBody) =>
    request<{ trip: BackendTrip }>(`/trips/${id}`, { method: "PUT", body: data }),
  deleteTrip: (id: string) => request<{ message: string }>(`/trips/${id}`, { method: "DELETE" }),

  addStop: (tripId: string, data: JsonBody) =>
    request<{ stop: BackendStop }>(`/trips/${tripId}/stops`, { method: "POST", body: data }),
  updateStop: (id: string, data: JsonBody) =>
    request<{ stop: BackendStop }>(`/stops/${id}`, { method: "PUT", body: data }),
  deleteStop: (id: string) => request<{ message: string }>(`/stops/${id}`, { method: "DELETE" }),
  reorderStops: (tripId: string, stops: { id: string; orderIndex: number }[]) =>
    request<{ stops: BackendStop[] }>(`/trips/${tripId}/stops/reorder`, {
      method: "PUT",
      body: { stops },
    }),

  addActivity: (stopId: string, data: JsonBody) =>
    request<{ activity: BackendActivity }>(`/stops/${stopId}/activities`, {
      method: "POST",
      body: data,
    }),
  updateActivity: (id: string, data: JsonBody) =>
    request<{ activity: BackendActivity }>(`/activities/${id}`, { method: "PUT", body: data }),
  deleteActivity: (id: string) =>
    request<{ message: string }>(`/activities/${id}`, { method: "DELETE" }),

  getTripBudget: (tripId: string) =>
    request<{ items: BackendBudgetItem[]; summary: BudgetSummary }>(`/trips/${tripId}/budget`),
  addBudgetItem: (tripId: string, data: JsonBody) =>
    request<{ item: BackendBudgetItem }>(`/trips/${tripId}/budget`, { method: "POST", body: data }),
  updateBudgetItem: (id: string, data: JsonBody) =>
    request<{ item: BackendBudgetItem }>(`/budget/${id}`, { method: "PUT", body: data }),
  deleteBudgetItem: (id: string) =>
    request<{ message: string }>(`/budget/${id}`, { method: "DELETE" }),

  getChecklist: (tripId: string) =>
    request<{ items: BackendChecklistItem[] }>(`/trips/${tripId}/checklist`),
  addChecklistItem: (tripId: string, data: JsonBody) =>
    request<{ item: BackendChecklistItem }>(`/trips/${tripId}/checklist`, {
      method: "POST",
      body: data,
    }),
  updateChecklistItem: (id: string, data: JsonBody) =>
    request<{ item: BackendChecklistItem }>(`/checklist/${id}`, { method: "PUT", body: data }),
  deleteChecklistItem: (id: string) =>
    request<{ message: string }>(`/checklist/${id}`, { method: "DELETE" }),

  getNotes: (tripId: string) => request<{ notes: BackendNote[] }>(`/trips/${tripId}/notes`),
  addNote: (tripId: string, data: JsonBody) =>
    request<{ note: BackendNote }>(`/trips/${tripId}/notes`, { method: "POST", body: data }),
  updateNote: (id: string, data: JsonBody) =>
    request<{ note: BackendNote }>(`/notes/${id}`, { method: "PUT", body: data }),
  deleteNote: (id: string) => request<{ message: string }>(`/notes/${id}`, { method: "DELETE" }),

  recommendActivities: (data: JsonBody) =>
    request<{ result: AIRecommendationResult }>("/ai/recommend", { method: "POST", body: data }),
  askAI: (data: JsonBody) =>
    request<{ result: AIAskResult }>("/ai/ask", { method: "POST", body: data }),
  improveItinerary: (data: JsonBody) =>
    request<{ result: AIImprovementResult }>("/ai/improve-itinerary", {
      method: "POST",
      body: data,
    }),
  optimizeBudget: (data: JsonBody) =>
    request<{ result: AIBudgetOptimizationResult }>("/ai/optimize-budget", {
      method: "POST",
      body: data,
    }),
  generateTripSummary: (data: JsonBody) =>
    request<{ result: AIRecapResult }>("/ai/generate-summary", { method: "POST", body: data }),
  analyzeTripStress: (data: JsonBody) =>
    request<{ result: AIStressResult }>("/ai/analyze-stress", { method: "POST", body: data }),
  getStressMeter: (data: JsonBody) =>
    request<{ result: AIStressResult }>("/ai/stress-meter", { method: "POST", body: data }),

  shareTrip: (id: string) =>
    request<{ trip: BackendTrip; publicUrl: string }>(`/trips/${id}/share`, { method: "POST" }),
  getPublicItinerary: (shareToken: string) =>
    request<{ trip: BackendTrip }>(`/public/itinerary/${shareToken}`, { auth: false }),
  copyPublicItinerary: (shareToken: string) =>
    request<{ trip: BackendTrip }>(`/public/itinerary/${shareToken}/copy`, { method: "POST" }),

  updateCurrentUser: (data: JsonBody) =>
    request<{ user: AuthUser }>("/users/me", { method: "PUT", body: data }),
  deleteCurrentUser: () => request<{ message: string }>("/users/me", { method: "DELETE" }),
};
