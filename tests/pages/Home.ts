import { Page, expect } from "@playwright/test";

export async function getProductId(page: Page, baseURL: string, index: number): Promise<string | null> {
  await page.goto(`${baseURL}/`);
  const product = await page.locator('css=a.card').nth(index);
  const productId = await product.getAttribute('data-test');
  const cleanedProductId = productId?.slice(8); // Remove 'product-' prefix
  return cleanedProductId!;
}

export async function addItemToCart(page: Page, baseURL, productId: string) {
  await page.goto(`${baseURL}/product/${productId}`);
  await page.locator('[data-test="add-to-cart"]').click();
}