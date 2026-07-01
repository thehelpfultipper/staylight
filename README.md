# Staylight

Staylight is a small premium travel booking demo inspired by Booking.com — not a clone. It showcases a complete search-to-booking flow with seeded mock data, internal API routes, and **Smart Match**, a rule-based scoring engine that explains why each stay fits a trip.

Built with **Next.js App Router**, **React**, **TypeScript**, and **Tailwind CSS**.

## Live demo

Render: [staylight.onrender.com](https://staylight.onrender.com)

Guardrails that lay the foundation for production readiness: [Why AI-Generated Code Actually Fails And How To Fix It](https://thehelpfultipper.com/why-ai-generated-code-actually-fails-and-how-to-fix-it/)

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


| Signal           | What it checks                                                                      |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Budget**       | Price per night vs. your stated budget (within, slightly over, or well above)       |
| **Location**     | Distance from city center (closer stays score higher)                               |
| **Rating**       | Guest rating tiers (e.g. highly rated, well rated, lower ratings)                   |
| **Amenities**    | Overlap between stay amenities and trip-type preferences                            |
| **Cancellation** | Whether free cancellation is available                                              |
| **Trip type**    | Maps trip type (business, family, budget, romantic, leisure) to preferred amenities |


Each result includes:

- A **score** (0–100)
- A **label** — Excellent match, Good match, or Fair match
- **Reasons** explaining positive fit
- **Tradeoffs** when a stay is not ideal

Search results are ranked by Smart Match score before being returned to the client.

## Architecture


| Layer       | Location              | Role                                                       |
| ----------- | --------------------- | ---------------------------------------------------------- |
| Pages & UI  | `app/`, `components/` | App Router pages and reusable components                   |
| API routes  | `app/api/`            | Thin handlers — validate input, call services, return JSON |
| Services    | `lib/services/`       | Business logic for stays, search, bookings, reviews        |
| Smart Match | `lib/smart-match/`    | Pure scoring functions                                     |
| Seed data   | `lib/data/`           | In-memory stay, review, and booking data                   |
| Utilities   | `lib/utils/`          | Dates, money, logging, booking storage helpers             |
| Types       | `types/`              | Shared domain models                                       |


Principles:

- Client components fetch via API routes — no direct seed imports in the browser
- Services never import React; prefer plain functions over classes — no repository pattern, DI, or ORM
- Use server components where data fetching is straightforward; client components for interactivity
- Consistent API errors: `{ error: string }` with appropriate HTTP status
- Request logging via `lib/utils/logger.ts`



### Design & trade-offs

Staylight targets a **premium minimalist** aesthetic — warm off-white surfaces, generous spacing, large rounded corners, and restrained typography. Visual guidance lives in `.cursor/rules/design-system.mdc`.


| Decision             | Choice                     | Why                                                                 |
| -------------------- | -------------------------- | ------------------------------------------------------------------- |
| Data                 | Seeded in-memory modules   | Zero env vars, simple deploy, no database setup                     |
| Backend              | Next.js API route handlers | Single codebase; services stay thin and testable                    |
| Differentiator       | Rule-based Smart Match     | Explainable fit scores without AI cost or complexity                |
| Payments & auth      | Mocked / omitted           | Demo scope — full booking flow without real integrations            |
| Maps & external APIs | Deferred by default        | Keeps the app self-contained; see roadmap for a stylized map option |




## API endpoints


| Method | Route             | Description                                           |
| ------ | ----------------- | ----------------------------------------------------- |
| `GET`  | `/api/stays`      | List all stays (`?featured=true` for featured subset) |
| `GET`  | `/api/stays/[id]` | Stay detail with reviews                              |
| `GET`  | `/api/search`     | Search stays with Smart Match ranking                 |
| `POST` | `/api/bookings`   | Create a mocked booking                               |
| `POST` | `/api/reviews`    | Submit a review for a stay                            |




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

CI and Render build independently — green CI means Render’s `npm run build` step is very likely to succeed, but Render still runs its own install and build on deploy.

## Local setup

**Requirements:** Node.js 20+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts


| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run dev`        | Start development server    |
| `npm run build`      | Production build            |
| `npm run start`      | Serve production build      |
| `npm run lint`       | Run ESLint                  |
| `npm run typecheck`  | Run TypeScript without emit |
| `npm run test`       | Run tests once              |
| `npm run test:watch` | Run tests in watch mode     |




### Verify before submitting

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```



## Deployment

Staylight works on any Node host that runs `npm run build` then `npm start`. **No environment variables are required** — the app uses seeded mock data only.

### Render

The repo includes `[render.yaml](render.yaml)` and `[.node-version](.node-version)` (Node 22) so Render can pick up settings automatically.

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

## Known limitations

- **Seeded data only** — no real database; server-side data resets on restart
- **Mocked payment** — checkout collects demo card fields but never charges
- **No authentication** — no user accounts or login
- **No real payment processing** — Stripe and similar integrations are out of scope
- **No external travel APIs** — destinations and availability are mock content
- **Session-scoped mutations** — new reviews and bookings persist in memory; booking confirmation also uses browser session storage for the current session
- **Basic gallery** — stay detail uses a hero image and thumbnail strip; seed data has few photos per stay
- **Browse mode is minimal** — `/stays` without search params lists all stays with no filter or sort controls
- **No map visualization** — location is text and distance-from-center only



## Roadmap (with more time)

These items are **documented for future work only** — not yet implemented. Suggested priority order:

1. **Rich image gallery** — Expand seed photos (outdoor, indoor, room categories); add lightbox, keyboard navigation, and a “View all photos” grid on stay detail. Listing cards would show richer cover imagery.
2. **Browse filters and sorting on** `/stays` — Filter by city or country; sort by popularity (rating and review count), price, or distance. Search results could also expose a user-selectable sort (Smart Match, price, rating).
3. **Smart Match Explore** — A lighter discovery flow for users who know budget, trip type, or occasion (e.g. anniversary, conference) but not a specific destination or dates. Rule-based recommendations only — an extension of Smart Match, not AI.
4. **Stylized location map** — Add latitude/longitude to seed data and render a premium static neighborhood map on stay detail (and optionally search). Avoids external map API keys while still conveying where a stay sits relative to the city center.

**Smaller enhancements** that reuse existing logic: “Similar stays” on the detail page (same city, trip type, price band) and a search-results sort toggle.

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

