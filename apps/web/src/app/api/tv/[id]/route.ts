import { getTVShow } from "@/data/tv-loaders";
import { invalidIdResponse, isValidId, jsonResponse } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  const show = await getTVShow(id);

  return jsonResponse(show, "Failed to fetch TV show");
}
