# RouteWise

> **Plan the route. Live the story.**

RouteWise is an adaptive AI-assisted travel planning workspace that helps travelers organize smarter multi-city journeys with route optimization, budgeting, itinerary intelligence, and collaborative sharing.

<p>
  <img alt="Status" src="https://img.shields.io/badge/status-production--ready-0f766e?style=for-the-badge" />
  <img alt="Hackathon" src="https://img.shields.io/badge/hackathon-LogicForge-111827?style=for-the-badge" />
  <img alt="AI" src="https://img.shields.io/badge/AI-Gemini_1.5_Flash-7c3aed?style=for-the-badge" />
  <img alt="Database" src="https://img.shields.io/badge/database-MySQL-2563eb?style=for-the-badge" />
</p>

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=111827" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite&logoColor=white" />
  <img alt="TanStack Router" src="https://img.shields.io/badge/TanStack_Router-routing-ff4154?style=flat-square" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />
</p>

---

## Product Snapshot

| Area | RouteWise Delivers |
| --- | --- |
| **Planning** | Multi-city itinerary builder with stops, activities, notes, checklist, and trip status |
| **Intelligence** | Adaptive route analysis, stress scoring, budget optimization, and trip recap generation |
| **Sharing** | Public read-only itinerary pages with clone-ready travel data |
| **Reliability** | Real authentication, real MySQL persistence, protected APIs, validation, and seed data |
| **AI Safety** | Gemini runs only through the backend; API keys never reach the frontend |

---

## Problem Statement

Travel planning is still fragmented across spreadsheets, notes, blogs, maps, calculators, screenshots, and chat threads. The harder the trip, the worse the coordination problem becomes.

Travelers struggle with:

- **Route confusion** when cities are planned in the wrong order
- **Budget overruns** because costs are scattered and hard to compare
- **Overloaded itineraries** with too many activities and transfers in a single day
- **Poor organization** across packing lists, notes, activities, and bookings
- **Scattered travel information** that never becomes a useful itinerary

RouteWise aligns directly with the Traveloop hackathon problem space: personalized multi-city planning, budgeting, itinerary visualization, sharing, relational travel data, and dynamic interfaces.

---

## Solution Overview

RouteWise turns fragmented travel planning into a structured, intelligent workspace.

Instead of asking users to manage trips manually across tools, RouteWise models the travel workflow as connected data:

`User -> Trip -> Stops -> Activities -> Budgets -> Notes -> Checklist -> Public Itinerary`

The product helps travelers:

- Plan multi-city routes with structured stops and dates
- Add activities to each city and estimate cost impact
- Track travel stress based on pacing and route density
- Generate practical AI suggestions for route order, budget, activities, and recaps
- Share polished public itineraries without exposing private account data

---

## Core Features

### Account & Authentication

- Secure register and login flow
- JWT access tokens
- HttpOnly refresh cookie
- Protected user and trip APIs
- Session restore through refresh token flow

### Multi-City Itinerary Builder

- Create trips with dates, budget targets, cover images, and status
- Add ordered city stops with arrival and departure dates
- Attach activities to each stop
- View itinerary in builder and read-only formats

### Route Intelligence

- Route quality score
- City-order suggestions
- Pacing recommendations
- Overloaded-day detection
- Rest-window suggestions

### Budget Management

- Trip-level target budget
- Category-based budget items
- Estimated total cost
- Average cost per day
- Budget risk and savings analysis

### Activity Discovery

- Seeded activity suggestions across global and Indian travel contexts
- Categories such as heritage, food, adventure, culture, nature, shopping, nightlife, and relaxation
- AI-backed recommendations for destination-specific planning

### Packing Checklist

- Trip-specific packing tasks
- Category grouping
- Completion tracking
- Persistence through backend APIs

### Notes & Travel Journal

- Trip notes
- Stop-linked note support in the data model
- Recently updated itinerary context
- Useful for bookings, confirmations, and travel reminders

### Shared Itinerary Pages

- Generate public share links
- Open public itineraries without login
- Copy public itineraries into a logged-in user's workspace
- Preserve relational trip structure during copy

### Analytics Dashboard

- Trip workspace status
- Route depth
- Budget coverage
- Shared itinerary count
- Travel stress signals
- Planning readiness
- Saved destinations and next-action prompts

---

## AI Features

RouteWise uses AI where it creates practical travel value, not decorative output.

| AI Capability | What It Does | User Value |
| --- | --- | --- |
| **Adaptive Route Intelligence** | Reviews stops, dates, transfer density, and activities | Helps users reduce backtracking and build smoother routes |
| **Trip Stress Meter** | Scores itinerary stress from activity density, city switching, budget pressure, and missing data | Shows whether the plan is realistic before the trip starts |
| **Budget Optimization** | Analyzes budget categories and suggests savings | Helps reduce costs without removing the best experiences |
| **AI Travel Recap** | Creates a polished trip summary for sharing | Turns itinerary data into a shareable travel story |
| **Activity Recommendation Engine** | Suggests destinations, food, activities, transport ideas, and local tips | Helps users decide what to do next with context |
| **Free-Form AI Assistant** | Answers typed travel questions through `/api/v1/ai/ask` | Supports real questions like "What to visit in Bali?" or "How can I reduce cost for Tokyo?" |

### AI Engineering

- **Model:** Gemini 1.5 Flash
- **Execution:** Backend-only integration
- **Response style:** Structured JSON responses
- **Failure mode:** Clean fallback guidance if Gemini is unavailable or returns malformed output
- **Security:** `GEMINI_API_KEY` never leaves the backend

The AI layer is designed to be resilient: RouteWise still returns useful structured guidance when a live model call fails.

---

## Screenshots

Place final screenshots in `docs/screenshots/`.

| Screen | Path |
| --- | --- |
| Dashboard | `docs/screenshots/dashboard.png` |
| AI Assistant | `docs/screenshots/ai-assistant.png` |
| Trip Builder | `docs/screenshots/trip-builder.png` |
| Budget Breakdown | `docs/screenshots/budget-breakdown.png` |
| Public Itinerary | `docs/screenshots/public-itinerary.png` |
| Analytics | `docs/screenshots/analytics.png` |
| Mobile Experience | `docs/screenshots/mobile.png` |

---

## Architecture

RouteWise is built as a full-stack application with a modular backend and a dynamic frontend.

### Frontend

- React
- Vite
- TanStack Router
- Tailwind CSS
- Context API for auth, trip state, API sync, and fallback handling
- Credentialed API requests for refresh-cookie support

### Backend

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT authentication
- HttpOnly refresh tokens
- Zod validation
- Gemini AI service layer
- Modular route/controller/service organization

### System Architecture

```mermaid
flowchart LR
  User[Traveler] --> Frontend[React + Vite Frontend]
  Frontend --> API[Express API /api/v1]
  API --> Auth[JWT Auth + HttpOnly Refresh Cookie]
  API --> Validation[Zod Validation Layer]
  API --> Services[Domain Services]
  Services --> Prisma[Prisma ORM]
  Prisma --> MySQL[(MySQL Database)]
  Services --> Gemini[Gemini 1.5 Flash]
  API --> Public[Public Itinerary API]
  Public --> Frontend
```

### Request Lifecycle

```mermaid
sequenceDiagram
  participant UI as Frontend
  participant API as Express API
  participant Guard as Auth + Validation
  participant Service as Service Layer
  participant DB as MySQL via Prisma

  UI->>API: Credentialed request
  API->>Guard: Validate token and request body
  Guard->>Service: Pass trusted request data
  Service->>DB: Query or mutate relational records
  DB-->>Service: Return typed data
  Service-->>API: Domain response
  API-->>UI: JSON envelope
```

### Auth Flow

```mermaid
sequenceDiagram
  participant User
  participant FE as Frontend
  participant BE as Backend
  participant DB as MySQL

  User->>FE: Register or login
  FE->>BE: POST /auth/register or /auth/login
  BE->>DB: Create/find user and refresh token
  BE-->>FE: Access token + HttpOnly refresh cookie
  FE->>BE: Protected API request with Bearer token
  BE-->>FE: User trip data
  FE->>BE: POST /auth/refresh
  BE-->>FE: New access token from refresh cookie
```

### Database Relations

```mermaid
erDiagram
  User ||--o{ Trip : owns
  User ||--o{ RefreshToken : has
  Trip ||--o{ TripStop : contains
  TripStop ||--o{ Activity : includes
  Trip ||--o{ BudgetItem : tracks
  Trip ||--o{ ChecklistItem : prepares
  Trip ||--o{ Note : stores
  TripStop ||--o{ Note : references
  City ||--o{ ActivitySuggestion : inspires

  User {
    string id
    string email
    string role
  }

  Trip {
    string id
    string title
    datetime startDate
    datetime endDate
    decimal totalEstimatedBudget
    boolean isPublic
    string shareToken
  }

  TripStop {
    string cityName
    string country
    datetime arrivalDate
    datetime departureDate
    int orderIndex
  }

  Activity {
    string title
    string category
    decimal estimatedCost
    int durationMinutes
  }
```

---

## Database Design

RouteWise uses MySQL with Prisma to model travel planning as relational data.

Core entities:

- **Users:** account identity, role, refresh tokens
- **Trips:** title, dates, budget target, visibility, share token
- **Stops:** city-level route structure with ordering
- **Activities:** stop-level plans with cost, category, duration, and location
- **Budgets:** category-based cost tracking
- **Notes:** trip and stop-level travel context
- **Checklists:** packing and preparation items
- **Cities:** seeded destination metadata
- **Activity Suggestions:** seeded global and Indian travel activity ideas

### Why MySQL + Prisma?

- MySQL is easy to run locally and widely deployable
- Prisma provides a typed schema, migrations, and relational includes
- The travel domain benefits from strong relationships and cascade behavior
- Prisma keeps backend code readable while preserving database structure

---

## Security

RouteWise uses production-minded security patterns:

- Password hashing before storage
- JWT access tokens for protected API calls
- HttpOnly refresh token cookie
- Refresh token persistence and invalidation
- CORS configured for local frontend origins
- Rate limiting with development-safe thresholds
- Zod request validation
- Protected route middleware
- Admin-only middleware support
- Environment-variable based configuration
- Backend-only AI key usage

No `.env` files or real API secrets should be committed.

---

## API Overview

All private APIs are served under:

```text
http://localhost:5000/api/v1
```

| Domain | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Auth | `POST` | `/auth/register` | Create account |
| Auth | `POST` | `/auth/login` | Login and set refresh cookie |
| Auth | `POST` | `/auth/refresh` | Restore session |
| Auth | `POST` | `/auth/logout` | Clear refresh cookie |
| User | `GET` | `/users/me` | Current user |
| Trips | `GET` | `/trips` | List user trips |
| Trips | `POST` | `/trips` | Create trip |
| Trips | `GET` | `/trips/:id` | Get trip detail |
| Trips | `PUT` | `/trips/:id` | Update trip |
| Trips | `DELETE` | `/trips/:id` | Delete trip |
| Stops | `POST` | `/trips/:tripId/stops` | Add stop |
| Stops | `PUT` | `/stops/:id` | Update stop |
| Stops | `PUT` | `/trips/:tripId/stops/reorder` | Reorder route |
| Activities | `POST` | `/stops/:stopId/activities` | Add activity |
| Activities | `PUT` | `/activities/:id` | Update activity |
| Budget | `GET` | `/trips/:tripId/budget` | Budget summary |
| Budget | `POST` | `/trips/:tripId/budget` | Add budget item |
| Checklist | `GET` | `/trips/:tripId/checklist` | List packing items |
| Notes | `GET` | `/trips/:tripId/notes` | List notes |
| AI | `POST` | `/ai/ask` | Free-form travel assistant |
| AI | `POST` | `/ai/recommend` | Activity and travel recommendations |
| AI | `POST` | `/ai/improve-itinerary` | Route and pacing analysis |
| AI | `POST` | `/ai/optimize-budget` | Budget savings suggestions |
| AI | `POST` | `/ai/generate-summary` | Shareable trip recap |
| AI | `POST` | `/ai/stress-meter` | Stress score |
| Sharing | `POST` | `/trips/:id/share` | Generate public itinerary |
| Sharing | `GET` | `/public/itinerary/:shareToken` | View public itinerary |
| Sharing | `POST` | `/public/itinerary/:shareToken/copy` | Copy public itinerary |
| Admin | `GET` | `/admin/analytics` | Admin-only platform counts |

---

## Product Workflow

```mermaid
flowchart LR
  Register[Register] --> Trip[Create Trip]
  Trip --> Stops[Add Stops]
  Stops --> Activities[Add Activities]
  Activities --> Budget[Budget Planning]
  Budget --> AI[AI Optimization]
  AI --> Share[Generate Share Link]
  Share --> Public[Public Itinerary]
```

Typical user journey:

1. Register an account
2. Create a trip with dates and budget
3. Add city stops
4. Add activities to each stop
5. Review budget and pacing
6. Run AI route, stress, budget, and recap tools
7. Generate a public itinerary link
8. Reopen later and confirm data persists

---

## Seed Data

The backend seed script loads realistic travel data for evaluation and development.

Included destination coverage:

- Global cities such as Paris, Rome, Barcelona, Tokyo, Kyoto, Seoul, Dubai, Bali, Singapore, Bangkok, New York, Amsterdam, Istanbul, Santorini, Sydney, and Cape Town
- Indian travel scenarios such as Jaipur, Udaipur, Jodhpur, Varanasi, Rishikesh, Manali, Goa, Alleppey, Munnar, Amritsar, Agra, Mumbai, Delhi, Kutch, Hampi, Mysuru, and Coorg
- Activity suggestions such as Jaipur City Palace Tour, Varanasi Ganga Aarti, Kerala Backwater Houseboat, Bali Temple Trail, Tokyo Food Alley Walk, Dubai Desert Safari, and Santorini Sunset Cruise

No fixed demo credentials are required. Register a new account through the app.

---

## Installation

### Prerequisites

- Node.js `20.19+` recommended
- MySQL running locally
- npm

### 1. Clone

```bash
git clone https://github.com/sanket913/odoo-hackathon-logicforge.git
cd odoo-hackathon-logicforge
```

### 2. Create MySQL Database

```sql
CREATE DATABASE routewise;
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/routewise"
JWT_ACCESS_SECRET=replace_with_secure_hex_secret
JWT_REFRESH_SECRET=replace_with_different_secure_hex_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```

Generate local JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run Prisma:

```bash
npx prisma generate
npx prisma validate
npx prisma migrate dev --name init_mysql
npx prisma db seed
npm run dev
```

Backend health:

```text
http://localhost:5000/health
http://localhost:5000/ready
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Frontend environment:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Validation Commands

Backend:

```bash
cd backend
npm run check
npx prisma validate
npx prisma db seed
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

---

## Project Structure

```text
RouteWise/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      config/
      middleware/
      modules/
        auth/
        trips/
        stops/
        activities/
        budgets/
        checklist/
        notes/
        ai/
        sharing/
        admin/
      routes/
      utils/
  frontend/
    src/
      assets/
      components/
      context/
      data/
      lib/
      routes/
      types/
```

---

## Scalability & Future Scope

RouteWise is structured for expansion into a larger travel operating system:

- Real-time collaborative trip planning
- Map-based route visualization
- Booking API integrations
- Flight, train, and hotel cost syncing
- AI personalization based on travel history
- Group voting for activities and destinations
- Mobile app support
- Offline-first itinerary access
- Recommendation engine trained on anonymized itinerary patterns
- Team and creator workspaces for travel planners

---

## Team

| Team | Members |
| --- | --- |
| LogicForge | Sanket Prajapati, Manav Joshi |

Built for the Odoo x Parul University Hackathon 2026.

---

## Vision

RouteWise transforms fragmented travel planning into an intelligent, organized, and adaptive travel experience.

