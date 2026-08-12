import { getReleaseRows } from "@/data/loaders";
import { jsonResponse, regionFromRequest } from "@/lib/api";

export async function GET(request: Request) {
  const rows = await getReleaseRows(regionFromRequest(request));

  return jsonResponse(rows, "Failed to fetch releases", ["region"]);
}
