import { expect, test } from "@playwright/test";
import { E2E_ADMIN_EMAIL } from "./global-setup";

test.describe("admin access", () => {
  test("the dashboard redirects anonymous visitors to sign in", async ({ page }) => {
    await page.goto("/admin/sermons");
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fsermons/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("CSV exports are refused without a session", async ({ request }) => {
    const response = await request.get("/admin/export/donations", { maxRedirects: 0 });
    expect([302, 303, 307, 401, 403]).toContain(response.status());
  });

  test("a wrong password shows a generic message", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email address").fill(E2E_ADMIN_EMAIL);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("The email or password is incorrect, or the account is inactive.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("staff can sign in, reach the requested page and sign out", async ({ page }) => {
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!password, "E2E admin password is created by global setup");

    await page.goto("/admin/login?next=/admin/sermons");
    await page.getByLabel("Email address").fill(E2E_ADMIN_EMAIL);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin\/sermons$/);
    await expect(page.getByRole("heading", { level: 1, name: "Sermons" })).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
