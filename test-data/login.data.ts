import { faker } from '@faker-js/faker';

/**
 * Test Data Factory — Login Feature (EAEU-2)
 * Provides valid, invalid, and boundary test data for login scenarios
 */

export interface LoginCredentials {
    email: string;
    password: string;
}

// --- Actual Test Credentials ---
export const SUPER_ADMIN: LoginCredentials = {
    email: 'tushar.bhadane+super@thinkitive.com',
    password: 'Eamata@123',
};

// --- Factory Functions ---

/** Valid credentials (returns the actual super admin creds) */
export function validData(): LoginCredentials {
    return { ...SUPER_ADMIN };
}

/** Invalid credentials - various types */
export function invalidData(type: 'wrong_email' | 'wrong_password' | 'both_wrong' | 'non_existent'): LoginCredentials {
    switch (type) {
        case 'wrong_email':
            return {
                email: faker.internet.email(),
                password: SUPER_ADMIN.password,
            };
        case 'wrong_password':
            return {
                email: SUPER_ADMIN.email,
                // Must meet format (8+, upper, lower, number, special) but be wrong
                password: `Wrong${faker.string.alphanumeric(4)}@999`,
            };
        case 'both_wrong':
            return {
                email: faker.internet.email(),
                password: `Wrong${faker.string.alphanumeric(4)}@999`,
            };
        case 'non_existent':
            return {
                email: `nonexistent_${faker.string.uuid()}@thinkitive.com`,
                password: `Wrong${faker.string.alphanumeric(4)}@999`,
            };
    }
}

/** Boundary data — edge cases for input fields */
export function boundaryData(type: 'empty_email' | 'empty_password' | 'both_empty' | 'whitespace' | 'max_length' | 'special_chars' | 'sql_injection' | 'xss'): LoginCredentials {
    switch (type) {
        case 'empty_email':
            return { email: '', password: SUPER_ADMIN.password };
        case 'empty_password':
            return { email: SUPER_ADMIN.email, password: '' };
        case 'both_empty':
            return { email: '', password: '' };
        case 'whitespace':
            return { email: '   ', password: '   ' };
        case 'max_length':
            return {
                email: `${'a'.repeat(255)}@test.com`,
                // Meets format requirements but is still wrong/too-long
                password: `Pp1!${'a'.repeat(251)}`,
            };
        case 'special_chars':
            return {
                email: 'test+special&chars@test.com',
                password: '!@#$%^&*()_+{}|:<>?',
            };
        case 'sql_injection':
            return {
                email: "admin'--@test.com",
                password: "' OR '1'='1",
            };
        case 'xss':
            return {
                email: '<script>alert("xss")</script>@test.com',
                password: '<img src=x onerror=alert("xss")>',
            };
    }
}

/** Malformed email formats */
export function malformedEmails(): string[] {
    return [
        'plaintext',
        '@no-local-part.com',
        'no-at-sign.com',
        'user@',
        'user@.com',
        'user @domain.com',
        'user@domain .com',
        'user@domain..com',
    ];
}
