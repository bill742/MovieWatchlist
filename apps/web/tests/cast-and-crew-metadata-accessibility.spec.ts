/* eslint-disable no-console */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Tom Hanks — stable, well-known TMDB entry (ID 31)
const KNOWN_PERSON_ID = "31";
const KNOWN_PERSON_NAME = "Tom Hanks";

test.describe("Cast and crew person page does not have accessibility issues", () => {
  test("Should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto(`/cast-and-crew/${KNOWN_PERSON_ID}`);

    console.log("Running accessibility scan on cast and crew person page");

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
  test("Verify cast and crew person page metadata", async ({ page }) => {
    await page.goto(`/cast-and-crew/${KNOWN_PERSON_ID}`);

    console.log("Checking metadata on cast and crew person page");

    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");

    const title = await page.title();
    expect(title).toBe(
      `${KNOWN_PERSON_NAME} - ${process.env.NEXT_PUBLIC_SITE_NAME}`
    );

    // Description is derived from the person's biography (sliced to 160 chars)
    const descriptionMeta = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(descriptionMeta).toBeTruthy();
    expect(descriptionMeta!.length).toBeLessThanOrEqual(160);

    const canonicalLink = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonicalLink).toBe(
      `${process.env.NEXT_PUBLIC_SITE_URL}/cast-and-crew/${KNOWN_PERSON_ID}`
    );
  });
});
