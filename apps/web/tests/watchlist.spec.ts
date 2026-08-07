import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

/**
 * The browser projects share one test account against the real Supabase
 * project, so each takes distinct ids — otherwise one project's cleanup
 * deletes another's fixture mid-run. Six rows total stays well under
 * FREE_WATCHLIST_LIMIT (25), which addToWatchlist enforces.
 */
const FIXTURES: Record<string, { movie: number; tv: number }> = {
  chromium: { movie: 155, tv: 1399 },
  firefox: { movie: 27205, tv: 1396 },
  webkit: { movie: 603, tv: 66732 },
};

function fixturesFor(projectName: string) {
  const ids = FIXTURES[projectName];
  if (!ids)
    throw new Error(`No watchlist fixture ids for project ${projectName}`);
  return {
    moviePath: `/movies/${ids.movie}`,
    tvPath: `/tv/${ids.tv}`,
    ...ids,
  };
}

/**
 * Drives the detail-page toggle until the stored state matches, which is all a
 * fixture needs — the button's own re-render is pinned by a separate spec.
 *
 * The click is inside the retry loop, not before it. The button is server
 * rendered, so it is clickable before React attaches its handler; a click
 * landing in that window is silently dropped, and no amount of reloading
 * recovers from it. WebKit hydrates slowly enough to hit this routinely.
 * Retrying is safe: add upserts and remove is a no-op when the row is gone.
 */
async function setWatchlisted(page: Page, path: string, wanted: boolean) {
  const target = wanted ? "Remove from watchlist" : "Add to watchlist";

  await page.goto(path);

  await expect(async () => {
    await page.reload();

    const toggle = page.getByRole("button", {
      name: /^(Add to|Remove from) watchlist$/,
    });
    await expect(toggle).toBeVisible({ timeout: 5_000 });

    if ((await toggle.getAttribute("aria-label")) !== target) {
      await toggle.click();
    }

    // Confirms the write landed. A click dropped before hydration leaves this
    // unchanged, and the reload at the top of the next pass retries it.
    await expect(toggle).toHaveAttribute("aria-label", target, {
      timeout: 3_000,
    });
  }).toPass({ timeout: 45_000 });
}

/** Rows are matched by link href so the assertions do not depend on TMDB copy. */
function rowFor(page: Page, href: string) {
  return page.locator("li").filter({ has: page.locator(`a[href="${href}"]`) });
}

test.describe("Watchlist", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const { moviePath, tvPath } = fixturesFor(testInfo.project.name);
    await setWatchlisted(page, moviePath, true);
    await setWatchlisted(page, tvPath, true);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const { moviePath, tvPath } = fixturesFor(testInfo.project.name);
    await setWatchlisted(page, moviePath, false);
    await setWatchlisted(page, tvPath, false);
  });

  test("Lists movies and TV shows under their tabs", async ({
    page,
  }, testInfo) => {
    const { moviePath, tvPath } = fixturesFor(testInfo.project.name);

    await page.goto("/watchlist");

    // Movies is the default tab, matching the mobile app.
    await expect(rowFor(page, moviePath)).toBeVisible();
    await expect(rowFor(page, tvPath)).toHaveCount(0);

    // The web page once dropped shows entirely while still counting them.
    await page.getByRole("button", { name: "TV Shows", exact: true }).click();
    await expect(rowFor(page, tvPath)).toBeVisible();
    await expect(rowFor(page, moviePath)).toHaveCount(0);
  });

  test("Status filter narrows the list", async ({ page }, testInfo) => {
    const { moviePath } = fixturesFor(testInfo.project.name);

    await page.goto("/watchlist");
    await expect(rowFor(page, moviePath)).toBeVisible();

    // Newly added rows default to "want to watch", so this must hide it.
    await page.getByRole("button", { name: "Watched", exact: true }).click();
    await expect(rowFor(page, moviePath)).toHaveCount(0);

    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(rowFor(page, moviePath)).toBeVisible();
  });

  test("Item count matches the rows shown", async ({ page }) => {
    await page.goto("/watchlist");

    const rows = await page.getByRole("listitem").count();
    await expect(page.getByText(new RegExp(`^${rows} items?$`))).toBeVisible();
  });

  test("Removing an item takes it off the list", async ({ page }, testInfo) => {
    const { tvPath } = fixturesFor(testInfo.project.name);

    await page.goto("/watchlist");
    await page.getByRole("button", { name: "TV Shows", exact: true }).click();

    const row = rowFor(page, tvPath);
    await row.getByRole("button", { name: /^Remove / }).click();

    await expect(row).toHaveCount(0);
  });

  test("Watch status survives a reload", async ({ page }, testInfo) => {
    const { moviePath } = fixturesFor(testInfo.project.name);

    await page.goto("/watchlist");

    // Retried because the select is server rendered, so a change landing before
    // React attaches is dropped. The assertion runs after a reload so it
    // reflects what was stored, not the value the browser painted locally.
    await expect(async () => {
      await page.reload();
      await page.waitForLoadState("networkidle");

      const status = rowFor(page, moviePath).getByRole("combobox");
      await expect(status).toBeVisible({ timeout: 5_000 });
      await status.selectOption("watching");
      await expect(status).toHaveValue("watching", { timeout: 2_000 });

      // Changing the select fires a server action; reloading straight away
      // aborts that request and the write never lands.
      await page.waitForLoadState("networkidle");

      await page.reload();
      await expect(rowFor(page, moviePath).getByRole("combobox")).toHaveValue(
        "watching",
        { timeout: 3_000 }
      );
    }).toPass({ timeout: 45_000 });
  });

  test("Detail-page toggle updates without a reload", async ({
    page,
  }, testInfo) => {
    const { tvPath } = fixturesFor(testInfo.project.name);

    await page.goto(tvPath);
    // Settle first so this covers the relabel, not the pre-hydration click
    // window that setWatchlisted deliberately retries through.
    await page.waitForLoadState("networkidle");

    // beforeEach leaves this one added, so the button starts as "Remove".
    await page.getByRole("button", { name: "Remove from watchlist" }).click();

    await expect(
      page.getByRole("button", { name: "Add to watchlist" })
    ).toBeVisible();
  });

  test("Should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/watchlist");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
