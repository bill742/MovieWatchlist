import { getOnTheAirTV } from "@/data/tv-loaders";
import { jsonResponse, regionFromRequest } from "@/lib/api";

export async function GET(request: Request) {
  const shows = await getOnTheAirTV(regionFromRequest(request));

  return jsonResponse(shows, "Failed to fetch currently airing TV shows");
}
