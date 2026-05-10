import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Gauge, Map, Route as RouteIcon, Sparkles, Wand2, Wallet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, type AIAskResult } from "@/lib/api";

export const Route = createFileRoute("/_app/assistant")({
  component: AssistantPage,
  head: () => ({ meta: [{ title: "AI Travel Assistant - RouteWise" }] }),
});

const featureCards = [
  {
    icon: RouteIcon,
    title: "Adaptive Route Intelligence",
    prompt: "Review my route order and suggest a smoother city sequence.",
  },
  {
    icon: Gauge,
    title: "Trip Stress Meter",
    prompt: "How can I make a busy 7-day multi-city trip feel less rushed?",
  },
  {
    icon: Wallet,
    title: "Budget Optimizer",
    prompt: "How can I reduce cost for a Tokyo trip without missing the highlights?",
  },
  {
    icon: FileText,
    title: "Travel Recap Generator",
    prompt: "Write a polished trip recap for a cultural family trip in Rajasthan.",
  },
  {
    icon: Map,
    title: "Activity Finder",
    prompt: "What are family-friendly activities in Jaipur?",
  },
];

function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AIAskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");

  const send = async (text = prompt) => {
    const nextPrompt = text.trim();
    if (!nextPrompt) {
      setError("Ask a travel question to get started.");
      return;
    }

    setPrompt(nextPrompt);
    setLastPrompt(nextPrompt);
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const data = await api.askAI({ prompt: nextPrompt });
      setResponse(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach RouteWise AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="RouteWise AI Travel Assistant"
        subtitle="Ask practical travel questions, compare route choices, reduce trip stress, and refine budgets with backend AI."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {featureCards.map((feature) => (
          <button
            key={feature.title}
            onClick={() => void send(feature.prompt)}
            className="group rounded-2xl border border-border/60 bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-foreground group-hover:bg-foreground group-hover:text-background">
              <feature.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold leading-tight">{feature.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{feature.prompt}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-foreground text-background p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm opacity-80">Ask RouteWise</p>
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What to visit in Bali? How can I reduce cost for Tokyo? What are family-friendly activities in Jaipur?"
          rows={4}
          className="mt-3 bg-background/10 border-background/20 text-background placeholder:text-background/50 rounded-xl"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-background/60">
            Answers use Gemini when configured, with practical local guidance as backup.
          </p>
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => void send()}
            disabled={loading}
          >
            <Wand2 className="h-4 w-4 mr-1" /> {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border/60 p-6 shadow-soft min-h-[220px]">
        {loading && (
          <div className="space-y-4">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="h-24 bg-muted rounded-2xl animate-pulse" />
              <div className="h-24 bg-muted rounded-2xl animate-pulse" />
              <div className="h-24 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        )}
        {!loading && !response && !error && (
          <p className="text-sm text-muted-foreground">
            Your RouteWise AI response will appear here.
          </p>
        )}
        {error && (
          <div>
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="secondary"
              className="mt-4 rounded-full"
              onClick={() => void send(lastPrompt || prompt)}
            >
              Retry
            </Button>
          </div>
        )}
        {response && (
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> RouteWise AI
              {response.fallbackReason && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">
                  Using local guidance
                </span>
              )}
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold">{response.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{response.answer}</p>

            <ResponseList title="Suggestions" items={response.suggestions} />
            <ResponseList title="Budget tips" items={response.estimatedBudgetTips} />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <TagPanel title="Best for" items={response.bestFor} />
              <ResponseList title="Next steps" items={response.nextSteps} compact />
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => void send(lastPrompt || prompt)}
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

function ResponseList({
  title,
  items,
  compact = false,
}: {
  title: string;
  items: string[];
  compact?: boolean;
}) {
  if (!items.length) return null;

  return (
    <div className={compact ? "" : "mt-5"}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-xl border border-border/60 p-4 text-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TagPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-brand-soft px-3 py-1.5 text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
