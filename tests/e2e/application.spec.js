const { test, expect } = require("@playwright/test");

test("application should load", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Application")
  ).toBeVisible();
});