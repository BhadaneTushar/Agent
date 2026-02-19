import { APIRequestContext, expect, APIResponse } from '@playwright/test';

/**
 * Reusable API Helper Functions
 * Industry-standard helpers for Playwright API testing
 */

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface ApiConfig {
    baseURL: string;
    credentials: AuthCredentials;
}

/** Create an authenticated API request context */
export async function createAuthContext(
    request: APIRequestContext,
    config: ApiConfig
): Promise<{ token: string; headers: Record<string, string> }> {
    const response = await request.post(`${config.baseURL}/auth/login`, {
        data: {
            email: config.credentials.email,
            password: config.credentials.password,
        },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    const token = body.data?.token || body.token || body.accessToken;

    return {
        token,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
}

/** POST request with error handling */
export async function postRequest(
    request: APIRequestContext,
    url: string,
    payload: Record<string, unknown>,
    headers?: Record<string, string>
): Promise<APIResponse> {
    return await request.post(url, {
        data: payload,
        headers: headers || { 'Content-Type': 'application/json' },
    });
}

/** GET request with optional query params */
export async function getRequest(
    request: APIRequestContext,
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
): Promise<APIResponse> {
    return await request.get(url, {
        params,
        headers,
    });
}

/** PUT request with error handling */
export async function putRequest(
    request: APIRequestContext,
    url: string,
    payload: Record<string, unknown>,
    headers?: Record<string, string>
): Promise<APIResponse> {
    return await request.put(url, {
        data: payload,
        headers: headers || { 'Content-Type': 'application/json' },
    });
}

/** DELETE request with error handling */
export async function deleteRequest(
    request: APIRequestContext,
    url: string,
    headers?: Record<string, string>
): Promise<APIResponse> {
    return await request.delete(url, { headers });
}

/** Assert response status */
export async function assertResponseStatus(
    response: APIResponse,
    expectedStatus: number
): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
}

/** Assert response body contains expected fields */
export async function assertResponseBody(
    response: APIResponse,
    expectedFields: string[]
): Promise<Record<string, unknown>> {
    const body = await response.json();
    for (const field of expectedFields) {
        expect(body).toHaveProperty(field);
    }
    return body;
}

/** Assert response body matches partial schema */
export async function assertResponseContains(
    response: APIResponse,
    expected: Record<string, unknown>
): Promise<void> {
    const body = await response.json();
    expect(body).toMatchObject(expected);
}
