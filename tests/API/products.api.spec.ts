import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  const API_BASE_URL = 'https://api.practicesoftwaretesting.com';

  test('GET /api/products - Retrieve all products with pagination', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('current_page');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/products/:id - Get single product details', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products/01KGZDE9E58HTZSYG5ZJZPHRJK`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('price');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('category_id');
  });

  test('GET /api/products - Filter products by category', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products?category=1`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('GET /api/products/:id - Product not found', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/products/99999`);
    
    expect(response.status()).toBe(404);
  });
});
