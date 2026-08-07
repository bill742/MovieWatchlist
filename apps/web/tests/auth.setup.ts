import { expect, test as setup } from "@playwright/test";

import { AUTH_STATE } from "../playwright.config";

/**
 * Signs in once so the browser projects can reach the protected routes.
 *
 * Credentials come from E2E_EMAIL / E2E_PASSWORD — `.env` locally (loaded by
 * playwright.config.ts), repository secrets in CI. They are deliberately not
 * NEXT_PUBLIC_ prefixed: anything with that prefix is inlined into the client
 * bundle and served to every visitor.
 *
 * The account writes to the same Supabase project as production, so specs must
 * only touch rows they created — see the per-project ids in watchlist.spec.ts.
 */
setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  // Fail here rather than leaving every protected-route spec to fail as a
  // redirect to /login, which looks like a product bug rather than config.
  expect(
    email,
    "E2E_EMAIL is not set — add it to apps/web/.env (or repository secrets in CI)"
  ).toBeTruthy();
  expect(
    password,
    "E2E_PASSWORD is not set — add it to apps/web/.env (or repository secrets in CI)"
  ).toBeTruthy();

  await page.goto("/login");

  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();

  // A failed sign-in re-renders /login with an error rather than redirecting,
  // so assert we actually left the page before saving state.
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));

  // Protected routes redirect when unauthenticated; reaching this one proves
  // the session cookie works, not merely that the form submitted.
  await page.goto("/watchlist");
  await expect(page).toHaveURL(/\/watchlist$/);

  await page.context().storageState({ path: AUTH_STATE });
});
