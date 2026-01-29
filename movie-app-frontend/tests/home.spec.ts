import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows Now Playing and Upcoming Releases lists with 12 items each", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for loading to finish: both section headings are visible
    const nowPlayingHeading = page.getByRole("heading", { name: "Now Playing" });
    const upcomingHeading = page.getByRole("heading", {
      name: "Upcoming Releases",
    });
    await expect(nowPlayingHeading).toBeVisible();
    await expect(upcomingHeading).toBeVisible();

    // Now Playing: get the section (parent of heading's parent) and count movie links
    const nowPlayingSection = nowPlayingHeading.locator("xpath=ancestor::section[1]");
    await expect(nowPlayingSection).toBeVisible();
    const nowPlayingLinks = nowPlayingSection.getByRole("link");
    await expect(nowPlayingLinks).toHaveCount(12);

    // Upcoming Releases: same for the second list
    const upcomingSection = upcomingHeading.locator("xpath=ancestor::section[1]");
    await expect(upcomingSection).toBeVisible();
    const upcomingLinks = upcomingSection.getByRole("link");
    await expect(upcomingLinks).toHaveCount(12);
  });
});
