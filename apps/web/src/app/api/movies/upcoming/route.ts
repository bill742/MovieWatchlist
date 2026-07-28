import { getUpcomingMovies } from "@/data/loaders";
import { jsonResponse, regionFromRequest } from "@/lib/api";

export async function GET(request: Request) {
  const movies = await getUpcomingMovies(regionFromRequest(request));

  return jsonResponse(movies, "Failed to fetch upcoming movies");
}
