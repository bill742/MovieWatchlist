import { getTrendingMovies } from "@/data/loaders";
import { movieListResponse } from "@/lib/api";

export async function GET() {
  const movies = await getTrendingMovies();

  return movieListResponse(movies, "Failed to fetch trending movies");
}
