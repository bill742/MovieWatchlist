import { getTrendingMovies } from "@/data/loaders";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const movies = await getTrendingMovies();

  return jsonResponse(movies, "Failed to fetch trending movies");
}
