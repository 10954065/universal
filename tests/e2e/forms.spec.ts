import { expect, test, type Page } from "@playwright/test";

// The signed form token rejects submissions faster than a person could type (2.5 s).
async function waitLikeAPerson(page: Page) {
  await page.waitForTimeout(3_000);
}

test.describe("contact form", () => {
  test("explains every invalid field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("A");
    await page.getByLabel("Email address").fill("not-an-email");
    await page.getByLabel("Message").fill("hi");
    await waitLikeAPerson(page);
    // Bypass the browser's own checks so the server validation is exercised.
    await page.locator("form").filter({ has: page.getByLabel("Message") }).evaluate((form) => form.setAttribute("novalidate", ""));
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Please check the highlighted fields.")).toBeVisible();
    await expect(page.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Message")).toHaveAttribute("aria-invalid", "true");
    // What the visitor typed is kept.
    await expect(page.getByLabel("Your name")).toHaveValue("A");
  });

  test("stores a valid message and confirms it", async ({ page }, testInfo) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Ama Mensah");
    await page.getByLabel("Email address").fill(`ama+${testInfo.project.name}@example.org`);
    await page.getByLabel("Message").fill("I would like to know more about the youth ministry, please.");
    await waitLikeAPerson(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Thank you, Ama\. Your message has been received/)).toBeVisible();
  });
});

test.describe("prayer form", () => {
  test("accepts an anonymous request", async ({ page }) => {
    await page.goto("/prayer");
    await page.getByLabel(/Submit anonymously/).check();
    await page.getByLabel("Your prayer request").fill("Please pray for healing in my family.");
    await page.getByRole("checkbox").last().check();
    await waitLikeAPerson(page);
    await page.getByRole("button", { name: /send|submit/i }).click();
    await expect(page.getByText(/Our prayer team will be praying for you/)).toBeVisible();
  });
});
