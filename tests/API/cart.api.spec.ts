import { test, expect, APIRequestContext } from "@playwright/test";

async function createCart(baseURL: string, request: APIRequestContext) {
  const response = await request.post(`${baseURL}/carts`);
  return [response, await response.json()];
}

test.describe("Cart API", () => {
  const API_BASE_URL = "https://api.practicesoftwaretesting.com";

  test("POST /api/carts - Create a new cart", async ({ request }) => {
    // Create a cart
    const [response, body] = await createCart(API_BASE_URL, request);

    expect(response.status()).toBeLessThanOrEqual(201);
    expect(body).toHaveProperty("id");
  });

  test("POST /api/carts/:id/add-product - Add product to cart", async ({
    request,
  }) => {
    // Create a cart
    const [cartResponse, cartBody] = await createCart(API_BASE_URL, request);
    const cartId = cartBody.id;
    // Add a product to the cart
    const addProductResponse = await request.post(
      `${API_BASE_URL}/carts/${cartId}`,
      {
        data: {
        "product_id": "01KGZDE9E58HTZSYG5ZJZPHRJK",
        "quantity": 1
        }
      }
    );
    expect(addProductResponse.status()).toBeLessThanOrEqual(201);
  });
});
