import { expect, test } from "@playwright/test";

// The browser projects reuse the session written by auth.setup.ts, which means
// none of them ever exercise signing in. Start from a clean context so this
// spec drives the real flow.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Sign in", () => {
  test("Header shows the account menu without a further navigation", async ({
    page,
  }, testInfo) => {
    // One project only. This drives a real sign-in against the same account the
    // other specs share, and running it per browser destabilised them — a full
    // suite went from 84 passing to one watchlist failure per run, in a
    // different test each time. The behaviour under test is client-side state,
    // not anything browser-specific, so a second and third sign-in buys
    // coverage that is not worth what it costs the rest of the run.
    test.skip(
      testInfo.project.name !== "chromium",
      "drives a real sign-in against the shared account"
    );

    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;

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

    // A failed sign-in re-renders /login with an error rather than redirecting.
    await page.waitForURL((url) => !url.pathname.startsWith("/login"));

    // The regression: signing in is a server action, so supabase-js in this tab
    // never sees it, and the header — which lives in the root layout and
    // survives the redirect without remounting — kept offering "Sign in" to
    // someone already signed in. Detail pages looked right only because their
    // buttons mount fresh. Asserting here, with no navigation in between, is
    // the whole point of the test.
    await expect(page.getByRole("button", { name: "User menu" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toHaveCount(0);
  });
});
