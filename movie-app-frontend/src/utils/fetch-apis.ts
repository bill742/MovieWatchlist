import type { Movie } from "@/types";

/**
 * Generic API fetch utility for single resource endpoints
 * @param url - The full URL to fetch from
 * @returns Promise resolving to the fetched data or null on error
 */
export async function fetchAPI<T = Movie>(url: string): Promise<T | null> {
  const options: RequestInit = {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
      accept: "application/json",
    },
    method: "GET",
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const result: T = await response.json();
    return result;
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}

/**
 * API fetch utility for TMDB list endpoints that return paginated results
 * @param url - The full URL to fetch from
 * @returns Promise resolving to array of results or null on error
 */
export async function fetchAPIList<T = Movie>(
  url: string
): Promise<T[] | null> {
  const options: RequestInit = {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_API_KEY || "",
      accept: "application/json",
    },
    method: "GET",
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const result: { results: T[] } = await response.json();
    return result.results || [];
  } catch (error) {
    console.error("API fetch error:", error);
    return null;
  }
}
