import { describe, expect, it } from "vitest";
import { calculateSmartMatch } from "@/lib/smart-match/calculateSmartMatch";
import { getStayById } from "@/lib/data/stays.seed";
import type { Stay } from "@/types/stay";

function createStay(overrides: Partial<Stay> = {}): Stay {
  return {
    id: "stay-test",
    name: "Test Stay",
    city: "Paris",
    country: "France",
    stayType: "boutique_hotel",
    description: "A test stay.",
    pricePerNight: 200,
    rating: 4.8,
    reviewCount: 10,
    distanceFromCenterKm: 1.0,
    maxGuests: 2,
    availableRooms: 4,
    amenities: ["wifi", "breakfast", "city-view"],
    freeCancellation: true,
    images: ["/test.jpg"],
    availability: [
      { startDate: "2026-07-01", endDate: "2026-12-31", roomsAvailable: 4 },
    ],
    reviews: [],
    ...overrides,
  };
}

describe("calculateSmartMatch", () => {
  it("returns a high score for an in-budget, close, highly rated stay", () => {
    const stay = createStay({
      pricePerNight: 240,
      rating: 4.8,
      distanceFromCenterKm: 1.2,
    });

    const result = calculateSmartMatch({
      stay,
      budgetPerNight: 250,
    });

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.label).toBe("Excellent match");
    expect(result.reasons).toContain("Within your budget");
    expect(result.reasons).toContain("Close to the city center");
    expect(result.reasons).toContain("Highly rated by guests");
  });

  it("includes a budget tradeoff when price is above budget", () => {
    const stay = createStay({ pricePerNight: 300 });

    const result = calculateSmartMatch({
      stay,
      budgetPerNight: 250,
    });

    expect(result.tradeoffs.some((tradeoff) => tradeoff.includes("budget"))).toBe(
      true,
    );
    expect(result.score).toBeLessThan(
      calculateSmartMatch({
        stay: createStay({ pricePerNight: 240 }),
        budgetPerNight: 250,
      }).score,
    );
  });

  it("rewards business trips with wifi and workspace amenities", () => {
    const businessStay = getStayById("stay-ny-midtown-executive");
    expect(businessStay).toBeDefined();

    const result = calculateSmartMatch({
      stay: businessStay!,
      tripType: "business",
    });

    expect(result.reasons).toContain("Has business-friendly amenities");
    expect(result.score).toBeGreaterThan(
      calculateSmartMatch({
        stay: businessStay!,
        tripType: "family",
      }).score,
    );
  });

  it("rewards family trips with kitchen, laundry, and family-friendly amenities", () => {
    const familyStay = getStayById("stay-ny-brooklyn-family");
    expect(familyStay).toBeDefined();

    const result = calculateSmartMatch({
      stay: familyStay!,
      tripType: "family",
    });

    expect(result.reasons).toContain("Has family-friendly amenities");
    expect(result.score).toBeGreaterThan(
      calculateSmartMatch({
        stay: familyStay!,
        tripType: "business",
      }).score,
    );
  });

  it("maps score labels correctly", () => {
    const excellent = calculateSmartMatch({
      stay: createStay({
        pricePerNight: 200,
        rating: 4.8,
        distanceFromCenterKm: 1.0,
        freeCancellation: true,
      }),
      budgetPerNight: 250,
      tripType: "leisure",
    });
    expect(excellent.score).toBeGreaterThanOrEqual(85);
    expect(excellent.label).toBe("Excellent match");

    const good = calculateSmartMatch({
      stay: createStay({
        pricePerNight: 240,
        rating: 4.4,
        distanceFromCenterKm: 2.5,
        freeCancellation: false,
        amenities: ["pool", "breakfast", "city-view"],
      }),
      budgetPerNight: 250,
      tripType: "leisure",
    });
    expect(good.score).toBeGreaterThanOrEqual(70);
    expect(good.score).toBeLessThan(85);
    expect(good.label).toBe("Good match");

    const fair = calculateSmartMatch({
      stay: createStay({
        pricePerNight: 400,
        rating: 3.5,
        distanceFromCenterKm: 8,
        freeCancellation: false,
        amenities: ["wifi"],
      }),
      budgetPerNight: 200,
      tripType: "leisure",
    });
    expect(fair.score).toBeLessThan(70);
    expect(fair.label).toBe("Fair match");
  });
});
