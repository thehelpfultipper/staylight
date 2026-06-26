import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StayCard } from "@/components/stays/StayCard";
import type { SearchResultApiItem } from "@/types/api";

function createSearchResult(
  overrides: Partial<SearchResultApiItem> = {},
): SearchResultApiItem {
  return {
    stay: {
      id: "stay-test-card",
      name: "Canal View Loft",
      city: "Amsterdam",
      country: "Netherlands",
      stayType: "urban_loft",
      description: "Bright loft overlooking the canal.",
      pricePerNight: 185,
      rating: 4.6,
      reviewCount: 12,
      distanceFromCenterKm: 1.8,
      maxGuests: 4,
      availableRooms: 3,
      amenities: ["wifi", "kitchen", "city-view"],
      freeCancellation: true,
      imageUrl: "/test-loft.jpg",
    },
    totalPrice: 555,
    nights: 3,
    smartMatch: {
      score: 82,
      label: "Good match",
      reasons: ["Within your budget", "Well rated by guests"],
      tradeoffs: [],
    },
    ...overrides,
  };
}

describe("StayCard", () => {
  it("renders stay details and Smart Match information", () => {
    render(
      <StayCard
        result={createSearchResult()}
        detailHref="/stays/stay-test-card"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Canal View Loft" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/\$185/)).toBeInTheDocument();
    expect(screen.getByText(/\$555 total/)).toBeInTheDocument();
    expect(screen.getByText("4.6")).toBeInTheDocument();
    expect(screen.getByText(/3 rooms available/)).toBeInTheDocument();
    expect(screen.getByText(/Good match · 82%/)).toBeInTheDocument();
  });
});
