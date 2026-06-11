import { supabase } from "./supabase";

async function requireUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return user.id;
}

/** Episode numbers the user has marked watched for one season. */
export async function getWatchedEpisodes(
  showTmdbId: number,
  seasonNumber: number,
): Promise<number[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("episode_watches")
    .select("episode_number")
    .eq("user_id", userId)
    .eq("show_tmdb_id", showTmdbId)
    .eq("season_number", seasonNumber);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.episode_number as number);
}

export async function markEpisodeWatched(
  showTmdbId: number,
  seasonNumber: number,
  episodeNumber: number,
): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase.from("episode_watches").upsert(
    {
      episode_number: episodeNumber,
      season_number: seasonNumber,
      show_tmdb_id: showTmdbId,
      user_id: userId,
    },
    { onConflict: "user_id,show_tmdb_id,season_number,episode_number" },
  );
  if (error) throw new Error(error.message);
}

export async function unmarkEpisodeWatched(
  showTmdbId: number,
  seasonNumber: number,
  episodeNumber: number,
): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("episode_watches")
    .delete()
    .eq("user_id", userId)
    .eq("show_tmdb_id", showTmdbId)
    .eq("season_number", seasonNumber)
    .eq("episode_number", episodeNumber);
  if (error) throw new Error(error.message);
}
