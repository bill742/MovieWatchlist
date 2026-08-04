import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("Theme toggle switches between light and dark modes", async ({
    page,
  }) => {
    await page.goto("./");

    const html = page.locator("html");
    const toggleButton = page.getByRole("button", {
      name: /switch to (light|dark) mode/i,
    });
    await expect(toggleButton).toBeVisible();

    // Detect the starting theme from the html element's class
    const initialClasses = (await html.getAttribute("class")) ?? "";
    const startsInDark = initialClasses.split(/\s+/).includes("dark");

    // Initial aria-label should reflect the opposite of the current theme
    await expect(toggleButton).toHaveAccessibleName(
      startsInDark ? "Switch to light mode" : "Switch to dark mode"
    );

    // Click once — theme should flip
    await toggleButton.click();
    if (startsInDark) {
      await expect(html).not.toHaveClass(/\bdark\b/);
      await expect(toggleButton).toHaveAccessibleName("Switch to dark mode");
    } else {
      await expect(html).toHaveClass(/\bdark\b/);
      await expect(toggleButton).toHaveAccessibleName("Switch to light mode");
    }

    // Click again — theme should return to its original state
    await toggleButton.click();
    if (startsInDark) {
      await expect(html).toHaveClass(/\bdark\b/);
      await expect(toggleButton).toHaveAccessibleName("Switch to light mode");
    } else {
      await expect(html).not.toHaveClass(/\bdark\b/);
      await expect(toggleButton).toHaveAccessibleName("Switch to dark mode");
    }
  });

  test("Displays Now Playing and Upcoming Releases lists", async ({ page }) => {
    await page.goto("./");

    // Wait for loading to finish: both section headings are visible
    const nowPlayingHeading = page.getByRole("heading", {
      name: "Now Playing",
    });
    const upcomingHeading = page.getByRole("heading", {
      name: "Upcoming Releases",
    });
    await expect(nowPlayingHeading).toBeVisible();
    await expect(upcomingHeading).toBeVisible();

    // Now Playing: get the section (parent of heading's parent) and count movie links
    const nowPlayingSection = nowPlayingHeading.locator(
      "xpath=ancestor::section[1]"
    );
    await expect(nowPlayingSection).toBeVisible();
    const nowPlayingLinks = nowPlayingSection.getByRole("link");
    const nowPlayingCount = await nowPlayingLinks.count();
    expect(nowPlayingCount).toBeGreaterThanOrEqual(1);
    const movieCards = nowPlayingSection.getByRole("link");
    await expect(movieCards.first()).toBeVisible();

    // Upcoming Releases: same for the second list
    const upcomingSection = upcomingHeading.locator(
      "xpath=ancestor::section[1]"
    );
    await expect(upcomingSection).toBeVisible();
    const upcomingLinks = upcomingSection.getByRole("link");
    const upcomingCount = await upcomingLinks.count();
    expect(upcomingCount).toBeGreaterThanOrEqual(1);
  });
});
