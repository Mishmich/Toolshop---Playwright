
import { Page } from 'playwright-core';
import * as productDetail from './ProductDetail';
import { expect } from '@playwright/test';
import { selectors } from '../selectors';

export async function addProductToCart(page: Page, baseURL: string, index: number, quantity: number) {
    await productDetail.goToProductDetail(page, baseURL, index);
    for (let i = 1; i < quantity; i++) {
        await productDetail.increaseItemQuantity(page);
    }
    await productDetail.addItemsToCart(page);
}

export async function clickOnCartIcon(page: Page) {
    await page.locator(selectors.nav.cart).click();
}

export async function setItemQuantity(page: Page, quantity: number, itemId: number) {
    await page.locator(selectors.checkout.productQuantity).nth(itemId).click();
    await page.locator(selectors.checkout.productQuantity).nth(itemId).fill(quantity.toString());
    await page.locator(selectors.common.body).click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
}

export async function checkTotalPrice(page: Page) {
    const products = await page.locator(selectors.checkout.row).all();
    let total = 0;

    for(const product of products)
    {
        const priceText = await product.locator(selectors.checkout.productPrice).textContent();
        const linePriceText = await product.locator(selectors.checkout.linePrice).textContent();
        const quantityText = await product.locator(selectors.checkout.productQuantity).inputValue();
        const quantity = parseInt(quantityText, 10);
        const price = parseFloat(priceText!.replace('$', ''));
        const linePrice = parseFloat(linePriceText!.replace('$', ''));
        expect(linePrice).toEqual(price * quantity);
        total += linePrice;
    }
    const cartTotalText = await page.locator(selectors.checkout.cartTotal).textContent();
    const cartTotal = parseFloat(cartTotalText!.replace('$', ''));
    expect(cartTotal).toEqual(total);
}