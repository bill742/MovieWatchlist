import { getSearchResults } from "@/data/loaders";
import { movieListResponse } from "@/lib/api";

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("term");

  if (!term) {
    return movieListResponse([], "Failed to fetch search results");
  }

  const movies = await getSearchResults(term);

  return movieListResponse(movies, "Failed to fetch search results");
}
