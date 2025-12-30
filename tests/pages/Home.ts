import { Page, expect } from "@playwright/test";
type Headings = Record<string, string>;


const headings_DE: Headings = {
    "nav-home": "Start",
    "nav-categories": "Kategorien",
    "nav-contact": "Kontakt",
    "nav-sign-in": "Einloggen",
}

export async function getProductId(page: Page, baseURL: string, index: number): Promise<string | null> {
  await page.goto(`${baseURL}/`);
  const product = await page.locator('css=a.card').nth(index);
  const productId = await product.getAttribute('data-test');
  const cleanedProductId = productId?.slice(8); // Remove 'product-' prefix
  return cleanedProductId!;
}

export async function addItemToCart(page: Page, baseURL: string, productId: string) {
  await page.goto(`${baseURL}/product/${productId}`);
  await page.locator('[data-test="add-to-cart"]').click();
}

export async function checkLanguageChange(page: Page) {
    for (const [heading, text] of Object.entries(headings_DE)) {
        const locator = page.locator(`[data-test="${heading}"]`);
        await expect(locator).toHaveText(text);
    }
}