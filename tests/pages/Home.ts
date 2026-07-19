import { Page, expect } from "@playwright/test";
import { selectors } from '../selectors';

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
  const product = await page.locator(selectors.home.productCard).nth(index);
  const productId = await product.getAttribute('data-test');
  const cleanedProductId = productId?.slice(8); // Remove 'product-' prefix
  return cleanedProductId!;
}

export async function addItemToCart(page: Page, baseURL: string, productId: string) {
  await page.goto(`${baseURL}/product/${productId}`);
  await page.locator(selectors.product.addToCart).click();
}

export async function checkLanguageChange(page: Page) {
    for (const [heading, text] of Object.entries(navbar_links_DE)) {
        const locator = page.locator(selectors.nav[heading as keyof typeof selectors.nav]);
        await expect(locator).toHaveText(text);
    }
}

export async function clickOnNthPageNumber(page: Page, n: number) {
    await page.getByRole('button', { name: '2' }).click();
}

export async function sortByOption(page: Page, optionValue: string) {
    await page.locator(selectors.home.sortDropdown).selectOption(optionValue);
    await page.waitForLoadState("domcontentloaded");
}

export async function getProductDetails(page: Page): Promise<Product[]> {
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    const products = await page.locator(selectors.home.productCard).all();
    return Promise.all(
    products.map(async (card) => ({
      id: (await card.getAttribute('data-test')) || '',
      name: await card.locator(selectors.home.cardTitle).textContent(),
      price: await card.locator(selectors.home.productPrice).textContent(),
    }))
  );
}

export async function moveSliderTo(page: Page, position: 'left' | 'right', targetValue: number) {
  /**
   * Moves a range slider to the desired value using keyboard events
   * @param position - 'left' for min slider, 'right' for max slider
   * @param targetValue - The value to set the slider to (0-200)
   */
  const sliderHandle = position === 'left' 
    ? page.locator(selectors.home.sliderMinHandle)
    : page.locator(selectors.home.sliderMaxHandle);
  
  // Get current value from aria-valuenow attribute
  const currentValueStr = await sliderHandle.getAttribute('aria-valuenow');
  const currentValue = parseInt(currentValueStr || '0');
  
  // Focus the slider
  await sliderHandle.focus();
  
  // Calculate steps needed (1 step = 1 unit)
  const difference = targetValue - currentValue;
  const steps = Math.abs(difference);
  const direction = difference > 0 ? 'ArrowRight' : 'ArrowLeft';
  
  // Press arrow keys to move the slider
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press(direction);
    await page.waitForTimeout(10); // Small delay between key presses
  }
  
  // Wait for the UI to update
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
}

export async function submitSearch(page: Page) {
  await page.locator(selectors.home.searchSubmit).click();
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
}