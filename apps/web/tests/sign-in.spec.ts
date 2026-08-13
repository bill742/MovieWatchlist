import { expect, test } from "@playwright/test";

import { AUTH_STATE } from "../playwright.config";

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

  test("Signing out clears the header without re-rendering the layout", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "drives a real sign-in against the shared account"
    );
    // React strips this warning from production builds, and CI serves one, so
    // the assertion below would pass there whether or not the bug was present.
    // Skipping says that outright rather than reporting a green run as proof.
    test.skip(
      !!process.env.CI,
      "the warning only exists in development builds of React"
    );

    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;

    // Only React's own warnings matter here; a failed TMDB image or an
    // extension writing to the console should not fail the run.
    const reactWarnings: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        reactWarnings.push(message.text());
      }
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/login"));

    await page.getByRole("button", { name: "User menu" }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();

    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "User menu" })).toHaveCount(
      0
    );

    // The header is client state, so on its own it only proves the browser
    // thinks the session is gone. Sign-out now happens in the browser rather
    // than through a server action, which makes it worth confirming the server
    // agrees: a protected route has to bounce.
    await page.goto("/watchlist");
    await expect(page).toHaveURL(/\/login/);

    // Sign-out used to go through a server action, and a server-action redirect
    // makes React re-render the root layout on the client. next-themes keeps a
    // <script> there to set the theme before paint, which React will not
    // execute client-side and warns about — on every sign-out.
    expect(
      reactWarnings.filter((text) => /script tag/i.test(text)),
      "React warned about a script tag — the layout is being re-rendered on the client"
    ).toEqual([]);

    // Sign back in and rewrite the shared state before leaving. supabase-js
    // signs out globally by default, so the sign-out above revoked every
    // session for this account — including the one auth.setup.ts saved and
    // every other spec loads. Skipping this leaves the projects that run after
    // Chromium holding dead tokens, which surfaced as watchlist failures that
    // looked like flake and had nothing to do with the watchlist.
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/login"));
    await page.context().storageState({ path: AUTH_STATE });
  });
});
