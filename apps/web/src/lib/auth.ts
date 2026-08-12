import { redirect } from "next/navigation";

import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Gate for protected routes: returns the signed-in user, or redirects to login
 * preserving where the visitor was headed.
 *
 * This lived in proxy.ts until the move to Cloudflare. Next 16's proxy runs on
 * the Node runtime and that is not configurable, while the OpenNext Cloudflare
 * adapter only supports edge middleware — so the two cannot coexist. Guarding
 * in the pages removes the incompatibility and colocates the check with the
 * route it protects.
 *
 * The tradeoff worth knowing: there is no longer a single choke point, so a new
 * protected route must call this itself. Anything under /watchlist or /profile
 * inherits nothing automatically.
 */
export async function requireUser(nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}
