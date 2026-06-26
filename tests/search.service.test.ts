import { describe, expect, it } from "vitest";
import { searchStays } from "@/lib/services/search.service";

const FUTURE_CHECK_IN = "2026-07-10";
const FUTURE_CHECK_OUT = "2026-07-14";

describe("searchStays", () => {
  it("filters results by destination", () => {
    const paris = searchStays({
      destination: "Paris",
      checkIn: FUTURE_CHECK_IN,
      checkOut: FUTURE_CHECK_OUT,
      guests: 2,
    });

    expect(paris.results.length).toBeGreaterThan(0);
    expect(
      paris.results.every((result) => result.stay.city.toLowerCase() === "paris"),
    ).toBe(true);

    const tokyo = searchStays({
      destination: "Tokyo",
      checkIn: FUTURE_CHECK_IN,
      checkOut: FUTURE_CHECK_OUT,
      guests: 2,
    });

    expect(
      tokyo.results.every((result) => result.stay.city.toLowerCase() === "tokyo"),
    ).toBe(true);
    expect(tokyo.results.some((result) => result.stay.city === "Paris")).toBe(
      false,
    );
  });

  it("filters results by guest capacity", () => {
    const smallParty = searchStays({
      destination: "New York",
      checkIn: FUTURE_CHECK_IN,
      checkOut: FUTURE_CHECK_OUT,
      guests: 2,
    });

    const largeParty = searchStays({
      destination: "New York",
      checkIn: FUTURE_CHECK_IN,
      checkOut: FUTURE_CHECK_OUT,
      guests: 6,
    });

    expect(largeParty.results.length).toBeLessThan(smallParty.results.length);
    expect(
      largeParty.results.every((result) => result.stay.maxGuests >= 6),
    ).toBe(true);
    expect(
      largeParty.results.some(
        (result) => result.stay.id === "stay-ny-midtown-executive",
      ),
    ).toBe(false);
  });

  it("filters out stays unavailable for the selected date range", () => {
    const beforeSohoAvailability = searchStays({
      destination: "New York",
      checkIn: "2026-07-01",
      checkOut: "2026-07-05",
      guests: 2,
    });

    expect(
      beforeSohoAvailability.results.some(
        (result) => result.stay.id === "stay-ny-soho-loft",
      ),
    ).toBe(false);

    const duringSohoAvailability = searchStays({
      destination: "New York",
      checkIn: "2026-08-05",
      checkOut: "2026-08-09",
      guests: 2,
    });

    expect(
      duringSohoAvailability.results.some(
        (result) => result.stay.id === "stay-ny-soho-loft",
      ),
    ).toBe(true);
  });

  it("sorts results by Smart Match score descending", () => {
    const { results } = searchStays({
      destination: "Paris",
      checkIn: FUTURE_CHECK_IN,
      checkOut: FUTURE_CHECK_OUT,
      guests: 2,
      budget: 250,
      tripType: "leisure",
    });

    expect(results.length).toBeGreaterThan(1);

    for (let index = 0; index < results.length - 1; index += 1) {
      expect(results[index].smartMatch.score).toBeGreaterThanOrEqual(
        results[index + 1].smartMatch.score,
      );
    }
  });

  it("returns an empty array when nothing matches", () => {
    const { results } = searchStays({
      destination: "Reykjavik",
      checkIn: FUTURE_CHECK_IN,
      checkOut: FUTURE_CHECK_OUT,
      guests: 2,
    });

    expect(results).toEqual([]);
  });
});
