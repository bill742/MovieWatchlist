import { getNowPlayingMovies } from "@/data/loaders";
import { jsonResponse, regionFromRequest } from "@/lib/api";

export async function GET(request: Request) {
  const movies = await getNowPlayingMovies(regionFromRequest(request));

  return jsonResponse(movies, "Failed to fetch now playing movies", [
    "region",
  ]);
}
