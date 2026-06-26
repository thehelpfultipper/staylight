# Staylight — Implementation Plan

Ordered build sequence. Complete each phase before moving on; do not skip ahead to polish.

---

## Phase 1 — Scaffold and Structure

- [ ] Initialize Next.js (App Router) + TypeScript + Tailwind
- [ ] Create folder layout per architecture rules (`app`, `app/api`, `lib`, `types`, `components`)
- [ ] Add `globals.css` with design tokens (warm off-white bg, system font, CSS variables)
- [ ] Root layout with minimal nav/footer shell
- [ ] Verify `npm run build` succeeds

## Phase 2 — Types and Seed Data

- [ ] Define domain types in `types/`: `Stay`, `Review`, `Booking`, `SearchParams`, `SmartMatchResult`, `Availability`
- [ ] Create seed data in `lib/data/`: ~8–12 stays with images (placeholder URLs), pricing, availability windows, amenities, locations
- [ ] Seed reviews per stay; seed a few existing bookings for demo state if useful
- [ ] Export typed accessors (`getStays`, `getStayById`, etc.) from data module

## Phase 3 — Utilities

- [ ] Date/format helpers (nightly rate display, date range validation)
- [ ] Currency formatting
- [ ] Simple API response helpers (`ok`, `error`, status codes)
- [ ] Request logger wrapper for API routes

## Phase 4 — Smart Match Engine

- [ ] Implement `lib/smart-match/` rule-based scorer
- [ ] Inputs: search params (dates, guests, location/keywords, budget) + stay attributes
- [ ] Output: `score` (0–100), `explanation` (human-readable bullet reasons)
- [ ] Rules examples: price fit, guest capacity, amenity match, location keyword, availability overlap
- [ ] Unit tests for scorer with varied inputs

## Phase 5 — API Routes

- [ ] `GET /api/stays` — list/search with query params; attach Smart Match scores when search context present
- [ ] `GET /api/stays/[id]` — stay detail + reviews + availability
- [ ] `POST /api/stays/[id]/reviews` — add review (validate, append to seed)
- [ ] `POST /api/bookings` — create mocked booking (validate dates, availability, return confirmation)
- [ ] `GET /api/bookings/[id]` — booking confirmation lookup
- [ ] Consistent error handling and logging on all routes

## Phase 6 — Homepage and Search Form

- [ ] Hero with editorial premium feel (not dashboard)
- [ ] Search form: destination/keywords, check-in/out, guests
- [ ] Submit navigates to search results with query string
- [ ] Loading state on submit

## Phase 7 — Search Results Page

- [ ] Fetch stays from API with search params
- [ ] Stay cards with image, title, price/night, Smart Match score + short explanation
- [ ] Sort by Smart Match score (default) or price
- [ ] Empty state when no matches; error state on API failure
- [ ] Responsive grid (1 col mobile → 2–3 col desktop)

## Phase 8 — Stay Detail Page and Reviews

- [ ] Image gallery or hero image, description, amenities, pricing, availability calendar/summary
- [ ] Smart Match breakdown section when arriving from search
- [ ] Reviews list + form to add review (optimistic or refresh after POST)
- [ ] "Book now" CTA → checkout with stay + dates pre-filled
- [ ] Loading, error, not-found states

## Phase 9 — Checkout and Confirmation

- [ ] Checkout page: stay summary, date/guest recap, nightly breakdown, total
- [ ] **Clearly mocked** payment section (fake card fields, demo labels)
- [ ] Submit → `POST /api/bookings` → redirect to confirmation
- [ ] Confirmation page: booking reference, stay details, dates, total, "demo booking" notice
- [ ] Success and error states throughout

## Phase 10 — Responsive / Accessibility / State Polish

- [ ] Audit all pages at mobile, tablet, desktop breakpoints
- [ ] Focus rings, heading hierarchy, form labels, button accessible names
- [ ] Skeleton loaders on async pages
- [ ] Consistent empty/error copy tone (premium, concise)

## Phase 11 — Tests

- [ ] Smart Match unit tests (Phase 4)
- [ ] Service function tests (search filtering, booking validation)
- [ ] 1–2 API route smoke tests
- [ ] Optional: one component test for search form or stay card

## Phase 12 — CI

- [ ] GitHub Actions workflow: install, lint, test, build
- [ ] Run on push/PR to main

## Phase 13 — README and Deployment Readiness

- [ ] README: project overview, setup (`npm install`, `npm run dev`), scripts, env vars (if any)
- [ ] Document mocked nature of payments and data
- [ ] Verify production build (`npm run build && npm start`)
- [ ] Note deployment target (Vercel recommended for Next.js)

---

## Definition of Done

A user can search stays → see Smart Match scores → view details and reviews → complete mocked checkout → land on a confirmation page. All primary flows have loading/empty/error/success states. CI passes. README explains how to run the app.
