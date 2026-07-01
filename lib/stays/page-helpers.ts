export const SEARCH_PARAM_KEYS = [
  "destination",
  "checkIn",
  "checkOut",
  "guests",
  "budget",
  "tripType",
] as const;

export function toURLSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
      continue;
    }

    params.set(key, value);
  }

  return params;
}

export function hasRequiredSearchParams(params: URLSearchParams): boolean {
  return (
    Boolean(params.get("destination")?.trim()) &&
    Boolean(params.get("checkIn")?.trim()) &&
    Boolean(params.get("checkOut")?.trim())
  );
}

export function buildStayDetailHref(
  stayId: string,
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams();

  for (const key of SEARCH_PARAM_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `/stays/${stayId}?${query}` : `/stays/${stayId}`;
}
