import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
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
