import { test, expect } from "@playwright/test";

test.describe("Ranked11", () => {
  test("homepage loads and redirects to locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(en|pt-BR)/);
    await expect(page.getByRole("link", { name: /Ranked11/i })).toBeVisible();
  });

  test("categories page lists categories", async ({ page }) => {
    await page.goto("/en/categories");
    await expect(page.getByRole("heading", { name: /All Categories/i })).toBeVisible();
    await expect(page.getByRole("link").filter({ hasText: /World Cup/i }).first()).toBeVisible();
  });

  test("daily challenge page loads", async ({ page }) => {
    await page.goto("/en/daily");
    await expect(page.getByRole("button", { name: /Reveal & Start/i })).toBeVisible();
  });
});
