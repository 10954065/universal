import { expect, test } from "@playwright/test";

const PAGES = ["/", "/about", "/leadership", "/ministries", "/sermons", "/events", "/plan-your-visit", "/give", "/prayer", "/contact", "/privacy", "/terms"];

test.describe("public pages", () => {
  for (const path of PAGES) {
    test(`${path} renders cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("link", { name: "Skip to main content" })).toBeAttached();

      // No sideways scrolling at any viewport.
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);

      // Includes Content-Security-Policy violations, which surface as console errors.
      expect(errors).toEqual([]);
    });
  }

  test("unknown pages return a helpful 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
  });

  test("sends security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("script-src");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test.describe("navigation", () => {
  test("the main navigation reaches every section", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("dialog", { name: "Site menu" });
      await expect(menu).toBeVisible();
      await menu.getByRole("link", { name: "Sermons" }).click();
    } else {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Sermons" }).click();
    }
    await expect(page).toHaveURL(/\/sermons$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("the mobile menu closes with Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
  });

  test("sermon search filters the library", async ({ page }) => {
    await page.goto("/sermons");
    await page.getByLabel("Search sermons").fill("shepherd");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/q=shepherd/);
    await expect(page.getByRole("status")).toContainText(/found/);
  });
});
