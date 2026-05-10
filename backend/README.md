# RouteWise Backend

Node.js, Express, MySQL, and Prisma REST API for RouteWise, a personalized multi-city travel planning platform.

## Setup

1. `npm install`
2. Create `.env` from `.env.example`
3. Create the local MySQL database: `CREATE DATABASE routewise;`
4. Set `DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/routewise"`
5. `npx prisma migrate dev --name init_mysql`
6. `npx prisma db seed`
7. `npm run dev`

API base URL: `http://localhost:5000/api/v1`

Health checks:

- `GET /health`
- `GET /ready`

## Environment

Copy `.env.example` to `.env` and set real local values. Never commit `.env`.

Required core variables:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL`

Optional integration variables:

- `SENTRY_DSN`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

AI endpoints call Gemini from the backend when `GEMINI_API_KEY` is configured. If the key is missing, the Gemini API fails, or Gemini returns unparseable text, the backend returns structured fallback JSON instead of crashing.

## MySQL Setup

Run these commands after MySQL 8 is installed and running:

```sql
CREATE DATABASE routewise;
```

Then update `backend/.env`:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/routewise"
```

Apply the Prisma schema and seed data:

```bash
npx prisma generate
npx prisma validate
npx prisma migrate dev --name init_mysql
npx prisma db seed
npm run dev
```

## Endpoints

Auth:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

Profile:

- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `DELETE /api/v1/users/me`

Trips:

- `GET /api/v1/trips`
- `POST /api/v1/trips`
- `GET /api/v1/trips/:id`
- `PUT /api/v1/trips/:id`
- `DELETE /api/v1/trips/:id`

Stops:

- `POST /api/v1/trips/:tripId/stops`
- `PUT /api/v1/stops/:id`
- `DELETE /api/v1/stops/:id`
- `PUT /api/v1/trips/:tripId/stops/reorder`

Activities:

- `POST /api/v1/stops/:stopId/activities`
- `PUT /api/v1/activities/:id`
- `DELETE /api/v1/activities/:id`

Search:

- `GET /api/v1/cities?search=&country=&region=&budgetLevel=&popularity=`
- `GET /api/v1/activity-suggestions?city=&category=&budgetLevel=`

Budget:

- `GET /api/v1/trips/:tripId/budget`
- `POST /api/v1/trips/:tripId/budget`
- `PUT /api/v1/budget/:id`
- `DELETE /api/v1/budget/:id`

Checklist:

- `GET /api/v1/trips/:tripId/checklist`
- `POST /api/v1/trips/:tripId/checklist`
- `PUT /api/v1/checklist/:id`
- `DELETE /api/v1/checklist/:id`

Notes:

- `GET /api/v1/trips/:tripId/notes`
- `POST /api/v1/trips/:tripId/notes`
- `PUT /api/v1/notes/:id`
- `DELETE /api/v1/notes/:id`

AI:

- `POST /api/v1/ai/recommend`
- `POST /api/v1/ai/improve-itinerary`
- `POST /api/v1/ai/optimize-budget`
- `POST /api/v1/ai/generate-summary`
- `POST /api/v1/ai/analyze-stress`
- `POST /api/v1/ai/stress-meter`

Sharing:

- `POST /api/v1/trips/:id/share`
- `GET /api/v1/public/itinerary/:shareToken`
- `POST /api/v1/public/itinerary/:shareToken/copy`

Admin:

- `GET /api/v1/admin/analytics`

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

## Frontend Integration

Send access tokens in the `Authorization` header:

```text
Authorization: Bearer <accessToken>
```

Auth refresh tokens are stored in an HttpOnly cookie named `routewise_refresh`. Configure frontend requests with credentials enabled:

```js
fetch('http://localhost:5000/api/v1/auth/refresh', {
  method: 'POST',
  credentials: 'include'
});
```

CORS is restricted to `CLIENT_URL`.

## Database Summary

- `User` owns trips and refresh tokens.
- `Trip` belongs to a user and contains stops, budget items, checklist items, and notes.
- `TripStop` belongs to a trip and contains activities.
- `Activity` belongs to a stop.
- `BudgetItem`, `ChecklistItem`, and `Note` belong to a trip.
- `Note` can optionally reference a stop.
- `City` and `ActivitySuggestion` power discovery/search seed data.
- Public sharing uses `Trip.isPublic` and unique `Trip.shareToken`.

## Security Notes

- MySQL with Prisma ORM only. No MongoDB or Mongoose.
- Environment variables are validated at startup.
- Passwords are hashed with bcrypt.
- JWT access tokens are short-lived.
- Refresh tokens are stored as HttpOnly cookies and hashed in the database.
- Helmet, CORS, cookie parsing, JSON size limits, and rate limiting are enabled.
- Auth routes use a stricter rate limit.
- Centralized error handling returns standard error codes.
- Protected resources verify ownership before reads, updates, and deletes.
- User password hashes are never selected in API responses.

## Verification

Useful local checks:

```bash
npm audit
npm run prisma:generate
npm run check
```

Run migrations and seed data after MySQL is available:

```bash
npx prisma migrate dev --name init_mysql
npx prisma db seed
```

## Manual End-to-End Checklist

1. Start MySQL and confirm the `routewise` database exists.
2. Start the backend with `npm run dev` from `backend/`.
3. Start the frontend with `npm run dev` from `frontend/`.
4. Register a new user.
5. Log in and confirm the dashboard loads.
6. Create a trip.
7. Add a stop.
8. Add an activity.
9. Open the budget tab or call the trip budget API.
10. Run the AI planner or assistant.
11. Generate a share link.
12. Open the public itinerary link in an incognito/private browser.
13. Log out.
14. Log in again and confirm the trip data persists.
