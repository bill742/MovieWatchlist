import { getTrendingTV } from "@/data/tv-loaders";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const shows = await getTrendingTV();

  return jsonResponse(shows, "Failed to fetch trending TV shows");
}
