
/**
 * Test Data for EAEU-911 Logout Feature
 */

export const LOGOUT_DATA = {
    // URLs
    dashboardUrl: '/admin/provider-group',
    loginUrl: '/auth/login',

    // Messages
    logoutSuccessMessage: 'You have been logged out successfully',

    // Scenarios
    sessionTimeout: {
        timeoutMs: 30 * 60 * 1000, // 30 mins
    }
};
