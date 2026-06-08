/* eslint-disable no-console */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const KNOWN_MOVIE_TITLE = "Inception";

test.describe("Search results page does not have accessibility issues", () => {
  test("Should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("./");

    await page
      .getByPlaceholder("Search by Movie Title")
      .fill(KNOWN_MOVIE_TITLE);
    await page.getByRole("button", { name: "Search movies" }).click();

    await page.waitForURL(/\/search\?term=/);

    console.log("Running accessibility scan on search results page");

    // Test light mode
    const lightModeClass = await page.locator("html").getAttribute("class");
    expect(lightModeClass).toContain("light");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

    // Test dark mode
    const themeToggle = page.locator("#themeToggle");
    await themeToggle.first().click();
    console.log("Switching to Dark mode for accessibility testing");
    const darkModeClass = await page.locator("html").getAttribute("class");
    expect(darkModeClass).toContain("dark");

    const darkModeAccessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();
    expect(darkModeAccessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("Page Metadata and Document Structure", () => {
  test("Verify Search Results Page Metadata", async ({ page }) => {
    await page.goto("./");

    await page
      .getByPlaceholder("Search by Movie Title")
      .fill(KNOWN_MOVIE_TITLE);
    await page.getByRole("button", { name: "Search movies" }).click();

    await page.waitForURL(/\/search\?term=/);

    console.log("Checking metadata on search results page");

    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");

    const title = await page.title();
    expect(title).toBe(
      `"${KNOWN_MOVIE_TITLE}" - Search Results - ${process.env.NEXT_PUBLIC_SITE_NAME}`
    );

    const descriptionMeta = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(descriptionMeta).toBe(
      `Search results for "${KNOWN_MOVIE_TITLE}" on Movie Watchlist.`
    );

    const canonicalLink = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonicalLink).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/search?term=${KNOWN_MOVIE_TITLE}`
    );
  });
});
