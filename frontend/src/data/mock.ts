import type { Trip } from "@/types";
import kyoto from "@/assets/city-kyoto.jpg";
import santorini from "@/assets/city-santorini.jpg";
import bali from "@/assets/city-bali.jpg";
import iceland from "@/assets/city-iceland.jpg";
import lisbon from "@/assets/city-lisbon.jpg";
import marrakech from "@/assets/city-marrakech.jpg";

export const cityImages = {
  Kyoto: kyoto,
  Santorini: santorini,
  Bali: bali,
  Reykjavik: iceland,
  Lisbon: lisbon,
  Marrakech: marrakech,
} as Record<string, string>;

export const featuredCities = [
  {
    name: "Kyoto",
    country: "Japan",
    image: kyoto,
    costIndex: 78,
    popularity: 96,
    region: "Asia",
  },
  {
    name: "Santorini",
    country: "Greece",
    image: santorini,
    costIndex: 82,
    popularity: 94,
    region: "Europe",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: bali,
    costIndex: 42,
    popularity: 92,
    region: "Asia",
  },
  {
    name: "Reykjavik",
    country: "Iceland",
    image: iceland,
    costIndex: 88,
    popularity: 80,
    region: "Europe",
  },
  {
    name: "Lisbon",
    country: "Portugal",
    image: lisbon,
    costIndex: 56,
    popularity: 89,
    region: "Europe",
  },
  {
    name: "Marrakech",
    country: "Morocco",
    image: marrakech,
    costIndex: 38,
    popularity: 85,
    region: "Africa",
  },
  {
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    costIndex: 85,
    popularity: 98,
    region: "Europe",
  },
  {
    name: "Seoul",
    country: "South Korea",
    image:
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=800",
    costIndex: 65,
    popularity: 91,
    region: "Asia",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    image:
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&q=80&w=800",
    costIndex: 45,
    popularity: 88,
    region: "Africa",
  },
];

export const sampleActivities = [
  { name: "Fushimi Inari Shrine walk", category: "Culture", duration: "3h", cost: 0 },
  { name: "Kaiseki dinner experience", category: "Food", duration: "2h", cost: 120 },
  { name: "Bamboo grove sunrise", category: "Sightseeing", duration: "1.5h", cost: 0 },
  { name: "Caldera sunset cruise", category: "Adventure", duration: "4h", cost: 95 },
  { name: "Oia village tour", category: "Sightseeing", duration: "2h", cost: 25 },
  { name: "Local pottery workshop", category: "Culture", duration: "2h", cost: 45 },
  { name: "Surf lesson at Uluwatu", category: "Adventure", duration: "2h", cost: 35 },
  { name: "Tegallalang rice fields", category: "Sightseeing", duration: "3h", cost: 10 },
  { name: "Spa & sound healing", category: "Relaxation", duration: "2h", cost: 60 },
] as const;

export const initialTrips: Trip[] = [
  {
    id: "trip-japan",
    name: "Japan in Bloom",
    description:
      "Two weeks chasing cherry blossoms across Kyoto, Osaka, and Tokyo with pockets of slow afternoons.",
    startDate: "2026-04-04",
    endDate: "2026-04-16",
    cover: kyoto,
    status: "upcoming",
    budgetTarget: 4200,
    stops: [
      {
        id: "stop-kyoto",
        city: "Kyoto",
        country: "Japan",
        arrival: "2026-04-04",
        departure: "2026-04-09",
        image: kyoto,
        activities: [
          {
            id: "a1",
            name: "Fushimi Inari Shrine walk",
            category: "Culture",
            time: "07:30",
            duration: "3h",
            cost: 0,
          },
          {
            id: "a2",
            name: "Tea ceremony in Gion",
            category: "Culture",
            time: "14:00",
            duration: "1.5h",
            cost: 55,
          },
          {
            id: "a3",
            name: "Kaiseki dinner",
            category: "Food",
            time: "19:30",
            duration: "2h",
            cost: 120,
          },
        ],
      },
      {
        id: "stop-osaka",
        city: "Osaka",
        country: "Japan",
        arrival: "2026-04-09",
        departure: "2026-04-12",
        image: lisbon,
        activities: [
          {
            id: "a4",
            name: "Dotonbori street food crawl",
            category: "Food",
            time: "18:00",
            duration: "3h",
            cost: 60,
          },
          {
            id: "a5",
            name: "Osaka Castle gardens",
            category: "Sightseeing",
            time: "10:00",
            duration: "2h",
            cost: 8,
          },
        ],
      },
      {
        id: "stop-tokyo",
        city: "Tokyo",
        country: "Japan",
        arrival: "2026-04-12",
        departure: "2026-04-16",
        image: marrakech,
        activities: [
          {
            id: "a6",
            name: "TeamLab Planets",
            category: "Culture",
            time: "11:00",
            duration: "2.5h",
            cost: 32,
          },
          {
            id: "a7",
            name: "Shibuya at night",
            category: "Sightseeing",
            time: "20:00",
            duration: "2h",
            cost: 0,
          },
        ],
      },
    ],
    checklist: [
      { id: "c1", category: "Documents", label: "Passport (6m validity)", done: true },
      { id: "c2", category: "Documents", label: "JR Pass voucher", done: true },
      { id: "c3", category: "Electronics", label: "Universal adapter", done: false },
      { id: "c4", category: "Clothing", label: "Light rain shell", done: false },
      { id: "c5", category: "Medicines", label: "Motion sickness pills", done: false },
    ],
    notes: [
      {
        id: "n1",
        title: "Reservations",
        body: "Booked Kaiseki at Gion Karyo for the 6th. Confirmation #GK-22841.",
        createdAt: "2026-02-12T10:30:00Z",
      },
      {
        id: "n2",
        title: "Packing reminder",
        body: "Pack a foldable tote — Don Quijote runs are guaranteed.",
        createdAt: "2026-03-01T17:10:00Z",
      },
    ],
    shareToken: "japan-bloom-2026",
  },
  {
    id: "trip-greece",
    name: "Greek Isles Slowdown",
    description:
      "A barefoot week between Athens and Santorini — slow mornings, long lunches, painted sunsets.",
    startDate: "2026-06-12",
    endDate: "2026-06-19",
    cover: santorini,
    status: "planning",
    budgetTarget: 2800,
    stops: [
      {
        id: "stop-athens",
        city: "Athens",
        country: "Greece",
        arrival: "2026-06-12",
        departure: "2026-06-14",
        image: lisbon,
        activities: [
          {
            id: "g1",
            name: "Acropolis sunrise tour",
            category: "Sightseeing",
            time: "06:30",
            duration: "3h",
            cost: 45,
          },
        ],
      },
      {
        id: "stop-santorini",
        city: "Santorini",
        country: "Greece",
        arrival: "2026-06-14",
        departure: "2026-06-19",
        image: santorini,
        activities: [
          {
            id: "g2",
            name: "Caldera sunset cruise",
            category: "Adventure",
            time: "16:30",
            duration: "4h",
            cost: 95,
          },
          {
            id: "g3",
            name: "Oia village tour",
            category: "Sightseeing",
            time: "10:00",
            duration: "2h",
            cost: 25,
          },
        ],
      },
    ],
    checklist: [
      { id: "gc1", category: "Documents", label: "EU travel insurance", done: false },
      { id: "gc2", category: "Clothing", label: "Linen layers", done: false },
    ],
    notes: [],
  },
  {
    id: "trip-bali",
    name: "Bali Reset",
    description: "Ten days of yoga, rice fields, and surf in Ubud and Uluwatu.",
    startDate: "2025-09-08",
    endDate: "2025-09-18",
    cover: bali,
    status: "completed",
    budgetTarget: 1900,
    stops: [
      {
        id: "stop-ubud",
        city: "Ubud",
        country: "Indonesia",
        arrival: "2025-09-08",
        departure: "2025-09-13",
        image: bali,
        activities: [
          {
            id: "b1",
            name: "Tegallalang rice fields",
            category: "Sightseeing",
            time: "07:00",
            duration: "3h",
            cost: 10,
          },
          {
            id: "b2",
            name: "Spa & sound healing",
            category: "Relaxation",
            time: "15:00",
            duration: "2h",
            cost: 60,
          },
        ],
      },
    ],
    checklist: [],
    notes: [],
  },
];
