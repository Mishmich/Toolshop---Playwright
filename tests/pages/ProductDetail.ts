import { Page, expect } from "@playwright/test";
import { getProductId } from "./Home";
import { selectors } from '../selectors';

export async function goToProductDetail(page: Page, baseURL: string, index: number) {
    await page.goto('/');
    const productId = await getProductId(page, baseURL, index);
    await page.locator(selectors.dynamic.productLink(productId!)).click();
}

export async function addItemsToCart(page: Page) {
    await page.locator(selectors.product.addToCart).click();
}

export async function increaseItemQuantity(page: Page) {
    await page.locator(selectors.product.increaseQuantity).click();
}

export async function decreaseItemQuantity(page: Page) {
    await page.locator(selectors.product.decreaseQuantity).click();
}

export async function addItemToFavorites(page: Page) {
    await page.locator(selectors.product.addToFavorites).click();
}  

export async function clickOnRelatedProduct(page: Page, index: number) {
    await page.locator(selectors.product.card).nth(index).click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
}

export async function checkProductAddedAlert(page: Page) {
    let alertText = await page.getByRole('alert', { name: 'Product added to shopping' }).getAttribute('aria-label');
    await expect(alertText).toContain('Product added to shopping cart.');
}

export async function getRelatedProductName(page: Page, index: number): Promise<{name: string | null, href: string | null}> {
    const relatedProduct = page.locator(selectors.product.card).nth(index);
    const name = await relatedProduct.locator(selectors.product.cardTitle).textContent();
    const href = await relatedProduct.getAttribute('href');
    return {name, href};
}

export async function checkRelatedProductNavigation(page: Page, name: string, href: string) {
    const productTitle = await page.locator(selectors.product.productName).textContent();
    const currentURL = page.url();
    await expect(productTitle).toBe(name);
    await expect(currentURL).toContain(href);
}

export async function checkProductAddedToFavAlert(page: Page) {
    let alertText = await page.getByRole('alert', { name: 'Product added to your favorites list.' }).textContent();
    await expect(alertText).toContain('Product added to your favorites list.');
}