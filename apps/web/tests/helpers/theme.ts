import { expect, type Page } from "@playwright/test";

/**
 * Switches the page to dark mode and waits for it to settle.
 *
 * Playwright's click leaves the pointer resting on the trigger, so Radix keeps
 * the tooltip open. Its content portals to <body>, outside any landmark, and
 * axe's `region` rule flags it. That made the accessibility scans intermittent:
 * they failed only when the scan started before the tooltip finished animating
 * in. Moving the pointer away and waiting for the tooltip to unmount lets the
 * scans see the page at rest.
 */
export async function switchToDarkMode(page: Page) {
  const themeToggle = page.locator("#themeToggle").first();

  await themeToggle.click();

  await page.mouse.move(0, 0);
  await themeToggle.blur();
  await expect(page.getByRole("tooltip")).toHaveCount(0);

  await expect(page.locator("html")).toHaveClass(/dark/);
}
