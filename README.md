# Staylight

Staylight is a small premium travel booking demo inspired by Booking.com — not a clone. It showcases a complete search-to-booking flow with **Smart Match**, a rule-based scoring engine that explains why each stay fits a trip.

Built with **Next.js App Router**, **React**, **TypeScript**, and **Tailwind CSS**. All data is seeded mock content served through internal API route handlers.

## Core features

- **Search & browse** — filter stays by destination, dates, guests, budget, and trip type
- **Smart Match results** — each result includes a fit score, label, reasons, and tradeoffs
- **Stay details** — gallery, amenities, pricing, availability, and guest reviews
- **Reviews** — read existing reviews and submit new ones (in-memory for the session)
- **Mock checkout** — guest details, clearly labeled demo payment, and booking confirmation
- **Responsive UI** — tuned for mobile (375px), tablet (768px), and desktop (1280px)
- **Async states** — loading, empty, error, and success handling across search, detail, checkout, and confirmation flows

## Smart Match

Smart Match lives in `lib/smart-match/calculateSmartMatch.ts`. It is **rule-based only** — no AI or external APIs.

For each stay, the engine scores fit using:

- Budget alignment
- Trip type and amenity preferences
- Guest rating and review volume
- Distance from city center
- Free cancellation when relevant

Results include:

- A **score** (0–100)
- A **label** (Excellent / Good / Fair match)
- **Reasons** explaining the fit
- **Tradeoffs** when a stay is not perfect

Search results are ranked by Smart Match score before being returned to the client.

## Architecture

| Layer | Location | Role |
|---|---|---|
| Pages & UI | `app/`, `components/` | App Router pages and reusable components |
| API routes | `app/api/` | Thin handlers — validate input, call services, return JSON |
| Services | `lib/services/` | Business logic for stays, search, bookings, reviews |
| Smart Match | `lib/smart-match/` | Pure scoring functions |
| Seed data | `lib/data/` | In-memory stay, review, and booking data |
| Types | `types/` | Shared domain models |

Principles:

- Client components fetch via API routes — no direct seed imports in the browser
- Services never import React
- Consistent API errors: `{ error: string }` with appropriate HTTP status
- Request logging via `lib/utils/logger.ts`

## API endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/stays` | List all stays (`?featured=true` for featured subset) |
| `GET` | `/api/stays/[id]` | Stay detail with reviews |
| `GET` | `/api/search` | Search stays with Smart Match ranking |
| `POST` | `/api/bookings` | Create a mocked booking |
| `POST` | `/api/reviews` | Submit a review for a stay |

### Search query parameters

`destination`, `checkIn`, `checkOut`, `guests`, `budget` (optional), `tripType`

## Testing strategy

<!-- Placeholder: add Vitest/Jest unit tests for Smart Match and service functions, plus smoke tests for critical API routes -->

Planned coverage:

- Unit tests for `calculateSmartMatch` and key service helpers
- API route smoke tests for search and booking flows

Run tests (once added):

```bash
npm test
```

## CI

<!-- Placeholder: GitHub Actions workflow for lint, typecheck, test, and production build -->

Recommended pipeline steps:

```bash
npm run lint
npm run typecheck
npm run build
```

## Local setup

**Requirements:** Node.js 20+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emit |

## Production build

```bash
npm run build
npm run start
```

The app uses Next.js static optimization where applicable. All booking and review mutations are in-memory against seeded data.

## Known limitations

- **Seeded data only** — no real database; data resets on server restart
- **Mocked payment** — checkout collects demo card fields but never charges
- **No authentication** — no user accounts or login
- **Reviews may not persist** — new reviews live in memory and can be lost after restart
- **Bookings are demo-only** — confirmation details are stored in session storage for the current browser session
- **No external travel APIs** — destinations and availability are mock content

## Project structure

```
app/                 Pages and API routes
components/          UI, layout, search, stays, checkout
lib/data/            Seed data
lib/services/        Business logic
lib/smart-match/     Fit scoring engine
types/               Shared TypeScript types
```
