
import { Page } from 'playwright-core';
import * as productDetail from './ProductDetail.ts';
import { expect } from '@playwright/test';

export async function addProductToCart(page: Page, baseURL: string, index: number, quantity: number) {
    await productDetail.goToProductDetail(page, baseURL, index);
    for (let i = 1; i < quantity; i++) {
        await productDetail.increaseItemQuantity(page);
    }
    await productDetail.addItemsToCart(page);
}

export async function clickOnCartIcon(page: Page) {
    await page.locator('[data-test="nav-cart"]').click();
}

export async function setItemQuantity(page: Page, quantity: number, itemId: number) {
    await page.locator('[data-test="product-quantity"]').nth(itemId).click();
    await page.locator('[data-test="product-quantity"]').nth(itemId).fill(quantity.toString());
    await page.locator('body').click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
}

export async function checkTotalPrice(page: Page) {
    const products = await page.locator('tr.ng-star-inserted').all();
    let total = 0;

    for(const product of products)
    {
        const priceText = await product.locator('[data-test="product-price"]').textContent();
        const linePriceText = await product.locator('[data-test="line-price"]').textContent();
        const quantityText = await product.locator('[data-test="product-quantity"]').inputValue();
        const quantity = parseInt(quantityText, 10);
        const price = parseFloat(priceText!.replace('$', ''));
        const linePrice = parseFloat(linePriceText!.replace('$', ''));
        expect(linePrice).toEqual(price * quantity);
        total += linePrice;
    }
    const cartTotalText = await page.locator('[data-test="cart-total"]').textContent();
    const cartTotal = parseFloat(cartTotalText!.replace('$', ''));
    expect(cartTotal).toEqual(total);
}