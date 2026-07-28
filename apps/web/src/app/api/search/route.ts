import { getSearchResults } from "@/data/loaders";
import { jsonResponse } from "@/lib/api";

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("term");

  if (!term) {
    return jsonResponse([], "Failed to fetch search results");
  }

  const movies = await getSearchResults(term);

  return jsonResponse(movies, "Failed to fetch search results");
}
