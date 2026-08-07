import type { Profile } from "@moviewatchlist/shared";

import { supabase } from "./supabase";

async function requireUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return user.id;
}

/**
 * The signed-in user's profile row, or null if it has not been created yet.
 *
 * A `handle_new_user` trigger inserts one per auth user, so this is normally
 * present — but returning null rather than throwing keeps a first run from
 * blocking the whole screen.
 */
export async function getProfile(): Promise<Profile | null> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}

/** Shared with the web app, which reads the same column for its own filtering. */
export async function updateRegion(region: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("profiles")
    .update({ region, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}
