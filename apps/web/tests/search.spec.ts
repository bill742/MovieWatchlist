import { expect, test } from "@playwright/test";

import { submitSearch } from "./helpers/search";

test.describe("Search", () => {
  test("Displays results for a valid movie title", async ({ page }) => {
    await page.goto("./");

    await submitSearch(page, "Inception");

    const heading = page.getByRole("heading", {
      name: 'Results for "Inception"',
    });
    await expect(heading).toBeVisible();

    // Scope to the results section and confirm at least one movie card is shown
    const resultsSection = heading.locator("xpath=ancestor::section[1]");
    const movieLinks = resultsSection.getByRole("link");
    await expect(movieLinks.first()).toBeVisible();
    expect(await movieLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test("Displays a no results message for an unrecognized title", async ({
    page,
  }) => {
    await page.goto("./");

    await submitSearch(page, "xyzxyzxyzqwerty12345notamovie");

    await expect(
      page.getByRole("heading", { name: /Results for "/ })
    ).toBeVisible();
    await expect(page.getByText("No results found")).toBeVisible();
  });

  test("Includes TV shows, not just movies", async ({ page }) => {
    await page.goto("./");

    // "Breaking Bad" has no film of the same name, so a /tv/ link is decisive.
    await submitSearch(page, "Breaking Bad");

    const heading = page.getByRole("heading", {
      name: 'Results for "Breaking Bad"',
    });
    const results = heading.locator("xpath=ancestor::section[1]");

    await expect(results.locator('a[href^="/tv/"]').first()).toBeVisible();
  });
});
