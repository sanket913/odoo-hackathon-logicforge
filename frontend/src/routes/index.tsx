import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Wallet, Map, Share2, ArrowRight, Check, PlaneTakeoff, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import heroImg from "@/assets/hero-coast.jpg";
import { featuredCities } from "@/data/mock";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: Sparkles,
    title: "Smart route planning",
    desc: "Analyze your city sequence, travel fatigue, and transport flow for a smoother journey.",
  },
  {
    icon: Wallet,
    title: "Budget-aware planning",
    desc: "Estimate realistic costs across transport, stays, and activities with currency support.",
  },
  {
    icon: Map,
    title: "AI trip assistant",
    desc: "Monitor your trip stress levels based on travel density and city switching frequency.",
  },
  {
    icon: Share2,
    title: "Shared itinerary",
    desc: "Share your beautiful travel summaries with the community. Let others learn from your story.",
  },
];

const heroValueCards = [
  {
    icon: PlaneTakeoff,
    title: "Smart route planning",
    text: "Sequence cities around pace and distance.",
  },
  { icon: Sparkles, title: "AI trip assistant", text: "Ask practical travel questions any time." },
  { icon: Share2, title: "Shared itinerary", text: "Publish polished plans with one link." },
  {
    icon: Wallet,
    title: "Budget-aware planning",
    text: "Keep cost decisions visible while planning.",
  },
];

function Landing() {
  return (
    <div className="bg-background">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              RouteWise · Plan the route. Live the story.
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl font-semibold tracking-tight text-ink text-balance leading-[1.05]">
              Organize smarter{" "}
              <span className="bg-gradient-to-r from-brand via-sky to-coral bg-clip-text text-transparent">
                multi-city journeys
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              RouteWise turns scattered notes and tabs into one calm, intelligent workspace. Reduce
              route confusion, manage realistic budgets, and build itineraries that actually work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/signup">
                  Start planning <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/dashboard">Open workspace</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[oklch(0.8_0.15_70)] text-[oklch(0.8_0.15_70)]"
                  />
                ))}
                <span className="ml-2">Loved by 12,400+ travelers</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-border/60">
              <img
                src={heroImg}
                alt="Coastal trip inspiration"
                width={1600}
                height={1100}
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-card/95 backdrop-blur p-4 border border-border/60 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Live itinerary
                    </p>
                    <p className="font-display text-lg font-semibold">
                      Greek Isles Slowdown · 7 days
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand-soft">On budget</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  {[
                    { d: "Day 1", t: "Athens · Acropolis" },
                    { d: "Day 3", t: "Sail to Santorini" },
                    { d: "Day 6", t: "Caldera sunset" },
                  ].map((s) => (
                    <div key={s.d} className="rounded-lg bg-muted/60 p-2.5 border border-border/60">
                      <p className="text-muted-foreground">{s.d}</p>
                      <p className="font-medium mt-0.5 text-ink">{s.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 hidden max-w-[280px] rounded-2xl bg-card border border-border/60 shadow-card p-4 md:block">
              <div className="grid gap-3">
                {heroValueCards.slice(0, 2).map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-brand-gradient grid place-items-center text-brand-foreground">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
            {heroValueCards.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-brand">Why RouteWise</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
            Everything you need, none of the noise.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Travel planning is fragmented across notes, spreadsheets, maps, and blogs. RouteWise
            centralizes the workflow into one calm, beautiful workspace.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-card transition-shadow"
            >
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-soft text-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-brand">Inspiration</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Curated destinations, ready to plan
            </h2>
          </div>
          <Link to="/explore" className="text-sm font-medium text-foreground hover:underline">
            Explore all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCities.slice(0, 6).map((c) => (
            <div
              key={c.name}
              className="group rounded-2xl overflow-hidden border border-border/60 bg-card shadow-soft hover:shadow-card transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-semibold">{c.name}</p>
                  <span className="text-xs text-muted-foreground">{c.country}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cost index · {c.costIndex}</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-soft text-foreground">
                    {c.popularity}% popular
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl bg-foreground text-background px-8 sm:px-14 py-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-display text-3xl font-semibold tracking-tight">
              Built for the way modern travelers plan.
            </h3>
            <p className="mt-3 text-background/70">
              Trusted by indie nomads, busy families, and travel creators to keep every plan
              considered, transparent, and effortlessly shareable.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 text-sm">
            {[
              "Multi-city itineraries",
              "Live budget tracking",
              "AI suggestions, on tap",
              "Beautiful public links",
              "Packing checklists",
              "Trip notes & journals",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-brand text-brand-foreground grid place-items-center">
                  <Check className="h-3 w-3" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
