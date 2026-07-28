import { getMovie } from "@/data/loaders";
import { invalidIdResponse, isValidId, jsonResponse } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isValidId(id)) {
    return invalidIdResponse();
  }

  const movie = await getMovie(id);

  return jsonResponse(movie, "Failed to fetch movie");
}
