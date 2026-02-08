import { test, expect } from '@playwright/test';

test.describe('User API', () => {
  const API_BASE_URL = 'https://api.practicesoftwaretesting.com';
  const validEmail = "customer@practicesoftwaretesting.com";
  const validPassword = "welcome01";

  test('POST /api/auth/login - Valid credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: validEmail,
        password: validPassword
      }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body.access_token).toBeTruthy();
  });

  test('POST /api/auth/login - Invalid credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: 'wrong@example.com',
        password: 'wrongpass'
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('GET /api/users/me - Get user profile (authenticated)', async ({ request }) => {
    // First login to get a token
    const loginResponse = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: validEmail,
        password: validPassword
      }
    });

    const { access_token } = await loginResponse.json();

    // Now get user profile
    const response = await request.get(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email');
    expect(body.email).toBe(validEmail);
  });
});
