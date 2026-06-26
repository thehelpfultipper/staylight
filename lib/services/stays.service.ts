import { staysSeed, getStayById } from "@/lib/data/stays.seed";
import type { Stay } from "@/types/stay";

const FEATURED_MIN_RATING = 4.7;
const FEATURED_LIMIT = 6;

export function getAllStays(): Stay[] {
  return staysSeed;
}

export function getFeaturedStays(): Stay[] {
  return [...staysSeed]
    .filter((stay) => stay.rating >= FEATURED_MIN_RATING)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, FEATURED_LIMIT);
}

export function findStayById(id: string): Stay | undefined {
  return getStayById(id);
}
