import { type Page, expect } from "@playwright/test";

/**
 * Submits the header search and waits for the results URL.
 *
 * The search form is entirely client-driven: a controlled input plus an
 * onSubmit handler that calls router.push. There is no `action` attribute, so
 * nothing works until React hydrates. Interacting before then fails two ways,
 * both of which showed up in CI:
 *
 *   - the click is dropped, no navigation happens, and waitForURL times out;
 *   - the fill is dropped, React still holds "", and the form submits an empty
 *     term. The URL matches /search?term= so waitForURL passes, and the test
 *     then fails later looking for results that were never requested.
 *
 * The clear button only renders once React holds the term in state, so it is a
 * direct signal that hydration has happened and the term will actually be
 * submitted. The fill is retried alongside it because hydrating over a
 * pre-filled controlled input resets the value to "" — asserting alone would
 * just turn the flake into a failure, whereas re-filling recovers. Matching on
 * the parsed term rather than a regex stops an empty term slipping through.
 */
export async function submitSearch(page: Page, term: string) {
  const input = page.getByPlaceholder("Search by Movie Title");
  const clearButton = page.getByRole("button", { name: "Clear search" });

  await expect(async () => {
    await input.fill(term);
    await expect(clearButton).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });

  await page.getByRole("button", { name: "Search movies" }).click();

  await page.waitForURL(
    (url) => url.pathname === "/search" && url.searchParams.get("term") === term
  );

  // waitForURL resolves as soon as the URL changes, but this is a client-side
  // navigation: the new document's content and <title> arrive afterwards.
  // Callers that scan or assert immediately would otherwise see the old page or
  // a blank one — an axe scan here reported 43 violations, led by
  // "document-title", against a document that had not rendered yet.
  await expect(page).toHaveTitle(/Search Results/);
}
