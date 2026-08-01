import { getUpcomingMovies } from "@/data/loaders";
import { movieListResponse, regionFromRequest } from "@/lib/api";

export async function GET(request: Request) {
  const movies = await getUpcomingMovies(regionFromRequest(request));

  return movieListResponse(movies, "Failed to fetch upcoming movies", [
    "region",
  ]);
}
