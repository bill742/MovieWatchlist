"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function markEpisodeWatched(
  showTmdbId: number,
  seasonNumber: number,
  episodeNumber: number,
) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from("episode_watches").upsert(
    {
      episode_number: episodeNumber,
      season_number: seasonNumber,
      show_tmdb_id: showTmdbId,
      user_id: user.id,
    },
    { onConflict: "user_id,show_tmdb_id,season_number,episode_number" },
  );

  if (error) throw new Error(error.message);
  revalidatePath(`/tv/${showTmdbId}/season/${seasonNumber}`);
}

export async function unmarkEpisodeWatched(
  showTmdbId: number,
  seasonNumber: number,
  episodeNumber: number,
) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from("episode_watches")
    .delete()
    .eq("user_id", user.id)
    .eq("show_tmdb_id", showTmdbId)
    .eq("season_number", seasonNumber)
    .eq("episode_number", episodeNumber);

  if (error) throw new Error(error.message);
  revalidatePath(`/tv/${showTmdbId}/season/${seasonNumber}`);
}

export async function getWatchedEpisodesForSeason(
  showTmdbId: number,
  seasonNumber: number,
): Promise<number[]> {
  const { supabase, user } = await getAuthenticatedUser();

  const { data } = await supabase
    .from("episode_watches")
    .select("episode_number")
    .eq("user_id", user.id)
    .eq("show_tmdb_id", showTmdbId)
    .eq("season_number", seasonNumber);

  return (data ?? []).map((r) => r.episode_number);
}
