import { supabase } from "./supabase";

/**
 * Whether the signed-in user holds an active premium subscription.
 *
 * Reads the `subscriptions` row that Phase 4's Stripe/RevenueCat webhooks will
 * maintain. Until those exist no rows are written, so this is false for
 * everyone — but a row inserted by hand in the Supabase dashboard is enough to
 * exercise premium features on a device.
 *
 * Fails closed: any error reads as "not premium".
 */
export async function isPremium(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return false;
  if (data.status !== "active" && data.status !== "trialing") return false;
  if (
    data.current_period_end &&
    new Date(data.current_period_end).getTime() < Date.now()
  ) {
    return false;
  }
  return true;
}
