import { getNowPlayingMovies } from "@/data/loaders";
import { movieListResponse, regionFromRequest } from "@/lib/api";

export async function GET(request: Request) {
  const movies = await getNowPlayingMovies(regionFromRequest(request));

  return movieListResponse(movies, "Failed to fetch now playing movies", [
    "region",
  ]);
}
