export type TripStatus = "planning" | "upcoming" | "completed";

export type ActivityCategory =
  | "Sightseeing"
  | "Food"
  | "Adventure"
  | "Culture"
  | "Shopping"
  | "Relaxation";

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  time?: string;
  duration?: string;
  cost: number;
  notes?: string;
}

export interface Stop {
  id: string;
  city: string;
  country: string;
  arrival: string; // ISO date
  departure: string; // ISO date
  image: string;
  activities: Activity[];
}

export interface ChecklistItem {
  id: string;
  category: "Clothing" | "Documents" | "Electronics" | "Medicines" | "Other";
  label: string;
  done: boolean;
}

export interface TripNote {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface BudgetBreakdown {
  transport: number;
  stay: number;
  food: number;
  activities: number;
  misc: number;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  cover: string;
  status: TripStatus;
  budgetTarget: number;
  stops: Stop[];
  checklist: ChecklistItem[];
  notes: TripNote[];
  shareToken?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AIStressResult {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  stressScore: number;
  stressLevel: "Low" | "Moderate" | "High";
  reasons: string[];
  fixes: string[];
}

export interface AIRecapResult {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  title: string;
  shortSummary: string;
  highlights: string[];
  bestFor: string[];
  shareCaption: string;
}

export interface AIImprovementResult {
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
}

export interface AIBudgetOptimizationResult {
  provider?: string;
  model?: string | null;
  liveIntegrationEnabled?: boolean;
  fallbackReason?: string;
  currentEstimatedCost: number;
  possibleSavings: number;
  categorySuggestions: { category: string; suggestion: string; estimatedSavings?: number }[];
  budgetRiskLevel: "Low" | "Moderate" | "High";
  cheaperAlternatives: string[];
}

export interface AIRecommendationResult {
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
}
