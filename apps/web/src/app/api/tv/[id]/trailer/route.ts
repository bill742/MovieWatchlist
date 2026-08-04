import { getTVTrailer } from "@/data/tv-loaders";
import { invalidIdResponse, isValidId, jsonResponse } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  // A missing trailer is a valid result, so wrap it rather than 502-ing.
  const key = await getTVTrailer(id);

  return jsonResponse({ key }, "Failed to fetch TV trailer");
}
