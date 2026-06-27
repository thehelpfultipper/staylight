# Staylight

Staylight is a small premium travel booking demo inspired by Booking.com — not a clone. It showcases a complete search-to-booking flow with seeded mock data, internal API routes, and **Smart Match**, a rule-based scoring engine that explains why each stay fits a trip.

Built with **Next.js App Router**, **React**, **TypeScript**, and **Tailwind CSS**.

## Live demo

Render: [staylight.onrender.com](https://staylight.onrender.com)

## Core features

- **Search & browse** — filter stays by destination, dates, guests, budget, and trip type
- **Smart Match results** — each result includes a fit score, label, reasons, and tradeoffs
- **Stay details** — gallery, amenities, pricing, availability, and guest reviews
- **Reviews** — read existing reviews and submit new ones (in-memory for the session)
- **Mock checkout** — guest details, clearly labeled demo payment, and booking confirmation
- **Responsive UI** — tuned for mobile, tablet, and desktop breakpoints
- **Async states** — loading, empty, error, and success handling across search, detail, checkout, and confirmation flows

## Smart Match

Smart Match is Staylight's differentiating feature. It lives in `lib/smart-match/calculateSmartMatch.ts` and is **rule-based only** — no AI, LLMs, or external APIs.

For each stay, the engine combines weighted signals into a score from 0–100:

| Signal | What it checks |
|---|---|
| **Budget** | Price per night vs. your stated budget (within, slightly over, or well above) |
| **Location** | Distance from city center (closer stays score higher) |
| **Rating** | Guest rating tiers (e.g. highly rated, well rated, lower ratings) |
| **Amenities** | Overlap between stay amenities and trip-type preferences |
| **Cancellation** | Whether free cancellation is available |
| **Trip type** | Maps trip type (business, family, budget, romantic, leisure) to preferred amenities |

Each result includes:

- A **score** (0–100)
- A **label** — Excellent match, Good match, or Fair match
- **Reasons** explaining positive fit
- **Tradeoffs** when a stay is not ideal

Search results are ranked by Smart Match score before being returned to the client.

## Architecture

| Layer | Location | Role |
|---|---|---|
| Pages & UI | `app/`, `components/` | App Router pages and reusable components |
| API routes | `app/api/` | Thin handlers — validate input, call services, return JSON |
| Services | `lib/services/` | Business logic for stays, search, bookings, reviews |
| Smart Match | `lib/smart-match/` | Pure scoring functions |
| Seed data | `lib/data/` | In-memory stay, review, and booking data |
| Utilities | `lib/utils/` | Dates, money, logging, booking storage helpers |
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

## State handling

Async flows across search, stay detail, checkout, and confirmation include explicit UI states:

- **Loading** — skeletons and spinners while data is fetched
- **Empty** — helpful messaging when no stays or reviews match
- **Error** — user-facing error copy with retry where appropriate
- **Success** — confirmation screens and inline success feedback after booking or review submission

## Accessibility

- Semantic HTML landmarks and headings
- Keyboard-navigable forms, buttons, and interactive controls
- Visible focus states on interactive elements
- ARIA labels and live regions where needed (e.g. async status updates)
- Sufficient color contrast for text and interactive states

## Testing

Tests use **Vitest** with Testing Library for component and service coverage.

Current coverage includes:

- Unit tests for `calculateSmartMatch` (budget, location, rating, amenities, cancellation, trip type)
- Service tests for search and booking logic

```bash
npm run test          # run once (CI)
npm run test:watch    # watch mode during development
```

## CI

GitHub Actions runs on every **push** and **pull request** (`.github/workflows/ci.yml`):

1. Checkout
2. Setup Node 22 (npm cache keyed on `package-lock.json`)
3. `npm ci`
4. Restore Next.js build cache (`.next/cache`) when source and lockfile are unchanged
5. `npm run lint`
6. `npm run typecheck`
7. `npm run test`
8. `npm run build`

**Note:** CI validates the project; it does not deploy. A `concurrency` group cancels redundant runs when the same branch or PR receives new commits quickly.

CI and Render (or Vercel) build independently — green CI means Render’s `npm run build` step is very likely to succeed, but Render still runs its own install and build on deploy.

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
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

### Verify before submitting

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

Staylight works on any Node host that runs `npm run build` then `npm start`. **No environment variables are required** — the app uses seeded mock data only.

### Render (recommended for this repo)

The repo includes [`render.yaml`](render.yaml) and [`.node-version`](.node-version) (Node 22) so Render can pick up settings automatically.

1. Push the repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New → Blueprint** (or **New → Web Service**).
3. Connect the Staylight GitHub repository.
4. If using Blueprint, Render reads `render.yaml`:
   - **Build command:** `npm ci && npm run build`
   - **Start command:** `npm start`
   - **Node version:** 22
5. If configuring manually instead:
   - Runtime: **Node**
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Node version: **22** (or rely on `.node-version`)
6. **No environment variables are required.**
7. Click **Deploy**. Render rebuilds from source on each push to `main` (independent of GitHub Actions).

After deployment, update the live demo link at the top of this README with your Render URL.

### Vercel

1. Push the repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New → Project**.
3. Import the Staylight GitHub repository.
4. Framework preset: **Next.js** (auto-detected).
5. Build command: `npm run build` (default).
6. Output directory: leave as default (`.next`).
7. **No environment variables are required.**
8. Click **Deploy**.

## Known limitations

- **Seeded data only** — no real database; server-side data resets on restart
- **Mocked payment** — checkout collects demo card fields but never charges
- **No authentication** — no user accounts or login
- **No real payment processing** — Stripe and similar integrations are out of scope
- **No external travel APIs** — destinations and availability are mock content
- **Session-scoped mutations** — new reviews and bookings persist in memory; booking confirmation also uses browser session storage for the current session

## Project structure

```
app/                 Pages and API routes
components/          UI, layout, search, stays, checkout
lib/data/            Seed data
lib/services/        Business logic
lib/smart-match/     Fit scoring engine
lib/utils/           Shared helpers
tests/               Vitest unit and service tests
types/               Shared TypeScript types
render.yaml          Render Blueprint (deploy config)
```
