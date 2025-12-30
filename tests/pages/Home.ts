import { Page, expect } from "@playwright/test";

type navbar_links = Record<string, string>;

interface Product {
  id: string;
  name: string | null;
  price: string | null;
}


const navbar_links_DE: navbar_links = {
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
    for (const [heading, text] of Object.entries(navbar_links_DE)) {
        const locator = page.locator(`[data-test="${heading}"]`);
        await expect(locator).toHaveText(text);
    }
}

export async function clickOnNthPageNumber(page: Page, n: number) {
    await page.getByRole('button', { name: '2' }).click();
}

export async function sortByOption(page: Page, optionValue: string) {
    await page.locator('[data-test="sort-select"]').selectOption(optionValue);
}

export async function getProductDetails(page: Page): Promise<Product[]> {
  const products = await page.locator('css=a.card').all();
  
  return Promise.all(
    products.map(async (card) => ({
      id: (await card.getAttribute('data-test')) || '',
      name: await card.locator('css=.card-title').textContent(),
      price: await card.locator('[data-test="product-price"]').textContent(),
    }))
  );
}

