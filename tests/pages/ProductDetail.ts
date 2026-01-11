import { Page, expect } from "@playwright/test";
import { getProductId } from "./Home";

export async function goToProductDetail(page: Page, baseURL: string, index: number) {
    await page.goto('/');
    const productId = await getProductId(page, baseURL, index);
    await page.locator(`[data-test="product-${productId}"]`).click();
}

export async function addItemsToCart(page: Page) {
    await page.locator('[data-test="add-to-cart"]').click();
}

export async function increaseItemQuantity(page: Page) {
    await page.locator('[data-test="increase-quantity"]').click();
}

export async function decreaseItemQuantity(page: Page) {
    await page.locator('[data-test="decrease-quantity"]').click();
}

export async function addItemToFavorites(page: Page) {
    await page.locator('[data-test="add-to-favorites"]').click();
}  

export async function clickOnRelatedProduct(page: Page, index: number) {
    await page.locator('css=a.card').nth(index).click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
}

export async function checkProductAddedAlert(page: Page) {
    let alertText = await page.getByRole('alert', { name: 'Product added to shopping' }).getAttribute('aria-label');
    await expect(alertText).toContain('Product added to shopping cart.');
}

export async function getRelatedProductName(page: Page, index: number): Promise<{name: string | null, href: string | null}> {
    const relatedProduct = page.locator('css=a.card').nth(index);
    const name = await relatedProduct.locator('css=.card-title').textContent();
    const href = await relatedProduct.getAttribute('href');
    return {name, href};
}

export async function checkRelatedProductNavigation(page: Page, name: string, href: string) {
    const productTitle = await page.locator('[data-test="product-name"]').textContent();
    const currentURL = page.url();
    await expect(productTitle).toBe(name);
    await expect(currentURL).toContain(href);
}

export async function checkProductAddedToFavAlert(page: Page) {
    let alertText = await page.getByRole('alert', { name: 'Product added to your favorites list.' }).textContent();
    await expect(alertText).toContain('Product added to your favorites list.');
}