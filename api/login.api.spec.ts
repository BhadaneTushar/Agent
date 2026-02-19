import { test, expect, APIRequestContext } from '@playwright/test';
import { SUPER_ADMIN, invalidData } from '../test-data/login.data';

const BASE_URL = 'https://qa.api.eu.eamata.com'; // Adjust if different from UI URL base

test.describe('API: Login (EAEU-2)', () => {

    test('POST /auth/login - Success @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/auth/login`, {
            data: {
                email: SUPER_ADMIN.email,
                password: SUPER_ADMIN.password
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.data).toHaveProperty('token');
    });

    test('POST /auth/login - Invalid Credentials @api', async ({ request }) => {
        const invalidUser = invalidData('both_wrong');
        const response = await request.post(`${BASE_URL}/auth/login`, {
            data: {
                email: invalidUser.email,
                password: invalidUser.password
            }
        });
        expect(response.status()).toBe(400); // or 401
    });

    test('POST /auth/login - Missing Fields @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/auth/login`, {
            data: {
                email: SUPER_ADMIN.email
                // password missing
            }
        });
        expect(response.status()).toBe(400);
    });
});
