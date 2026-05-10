import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wand2, Wallet, FileText, Map } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type {
  AIBudgetOptimizationResult,
  AIImprovementResult,
  AIRecapResult,
  AIRecommendationResult,
} from "@/types";

export const Route = createFileRoute("/_app/assistant")({
  component: AssistantPage,
  head: () => ({ meta: [{ title: "AI Assistant - RouteWise" }] }),
});

const presets = [
  {
    icon: Map,
    label: "Recommend activities",
    prompt: "Recommend 5 unique activities for a 4-day Lisbon trip with two foodies.",
  },
  {
    icon: Wallet,
    label: "Optimize budget",
    prompt: "Optimize my Greek Isles trip to fit under $2,500 without losing the best moments.",
  },
  {
    icon: FileText,
    label: "Generate trip summary",
    prompt: "Write a polished sharing summary of my Japan in Bloom trip.",
  },
  {
    icon: Wand2,
    label: "Improve day plan",
    prompt: "Improve day 3 of my Kyoto plan. It feels rushed before lunch.",
  },
];

type AssistantResult =
  | { kind: "recommend"; data: AIRecommendationResult }
  | { kind: "budget"; data: AIBudgetOptimizationResult }
  | { kind: "summary"; data: AIRecapResult }
  | { kind: "improve"; data: AIImprovementResult };

function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AssistantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");

  const send = async (text: string) => {
    setPrompt(text);
    setLastPrompt(text);
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const lower = text.toLowerCase();
      const payload = { destination: text, notes: text, preferences: ["food", "culture"] };
      if (lower.includes("budget")) {
        const data = await api.optimizeBudget(payload);
        setResponse({ kind: "budget", data: data.result });
      } else if (lower.includes("summary")) {
        const data = await api.generateTripSummary(payload);
        setResponse({ kind: "summary", data: data.result });
      } else if (lower.includes("improve")) {
        const data = await api.improveItinerary(payload);
        setResponse({ kind: "improve", data: data.result });
      } else {
        const data = await api.recommendActivities(payload);
        setResponse({ kind: "recommend", data: data.result });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backend AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="AI Assistant"
        subtitle="Ask RouteWise to plan, optimize, or summarize. It uses the backend AI pipeline."
      />

      <div className="rounded-2xl bg-foreground text-background p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm opacity-80">Prompt</p>
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything - e.g. 'Plan a 5-day Lisbon + Porto trip under $1,200'"
          rows={3}
          className="mt-3 bg-background/10 border-background/20 text-background placeholder:text-background/50 rounded-xl"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => void send(p.prompt)}
              className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-background/10 hover:bg-background/20 text-sm transition-colors"
            >
              <p.icon className="h-4 w-4" /> {p.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => void send(prompt || presets[0].prompt)}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4 mr-1" /> {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border/60 p-6 shadow-soft min-h-[200px]">
        {loading && (
          <div className="space-y-3">
            <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
          </div>
        )}
        {!loading && !response && !error && (
          <p className="text-sm text-muted-foreground">Your response will appear here.</p>
        )}
        {error && (
          <div>
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="secondary"
              className="mt-4 rounded-full"
              onClick={() => void send(lastPrompt || prompt || presets[0].prompt)}
            >
              Retry
            </Button>
          </div>
        )}
        {response && (
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> RouteWise AI
            </div>
            {response.data.fallbackReason && (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Fallback AI active: {response.data.fallbackReason}
              </p>
            )}
            <AssistantResponse result={response} />
            <div className="mt-5 flex gap-2">
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => void send(lastPrompt || prompt || presets[0].prompt)}
              >
                Retry
              </Button>
              <Button variant="ghost" className="rounded-full" onClick={() => setResponse(null)}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantResponse({ result }: { result: AssistantResult }) {
  if (result.kind === "recommend") {
    return (
      <div className="mt-4 grid gap-3">
        {result.data.recommendations.map((item, index) => (
          <div key={index} className="rounded-xl border border-border/60 p-4">
            <p className="text-xs uppercase text-muted-foreground">{item.type}</p>
            <p className="mt-1 font-medium">{item.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p>
            {item.localTip && <p className="mt-2 text-sm">{item.localTip}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (result.kind === "budget") {
    return (
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InsightCard label="Possible savings" value={`$${result.data.possibleSavings}`} />
        <InsightCard label="Risk" value={result.data.budgetRiskLevel} />
        {result.data.categorySuggestions.slice(0, 3).map((item, index) => (
          <div key={index} className="rounded-xl border border-border/60 p-4 sm:col-span-2">
            <p className="font-medium capitalize">{item.category}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.suggestion}</p>
          </div>
        ))}
      </div>
    );
  }

  if (result.kind === "summary") {
    return (
      <div className="mt-4 rounded-xl border border-border/60 p-4">
        <p className="font-display text-xl font-semibold">{result.data.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{result.data.shortSummary}</p>
        <p className="mt-3 text-sm">{result.data.shareCaption}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <InsightCard label="Route quality" value={`${result.data.routeQualityScore}/100`} />
        <InsightCard label="Stress" value={result.data.tripStressLevel} />
      </div>
      {result.data.pacingSuggestions.slice(0, 4).map((item, index) => (
        <div key={index} className="rounded-xl border border-border/60 p-4 text-sm">
          {item}
        </div>
      ))}
    </div>
  );
}

function InsightCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
