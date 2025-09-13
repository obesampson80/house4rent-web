// Public Routes
export const PUBLIC_ROUTES = {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
}

// Protected Routes
export const PROTECTED_ROUTES = {
    DASHBOARD: '/',

    // Users
    USERS: '/users',
    USER_DETAIL: '/users/:id',
    USER_CREATE: '/users/create',
    USER_EDIT: '/users/:id/edit',

    // KYC
    KYC: '/kyc',
    KYC_REVIEW: '/kyc/review/:id',
    KYC_QUEUE: '/kyc/queue',
    KYC_SETTINGS: '/kyc/settings',

    // Properties
    PROPERTIES: '/properties',
    PROPERTY_DETAIL: '/properties/:id',
    PROPERTY_APPROVAL: '/properties/approvals',
    PROPERTY_CATEGORIES: '/properties/categories',

    // Agents
    AGENTS: '/agents',
    AGENT_DETAIL: '/agents/:id',
    AGENT_PERFORMANCE: '/agents/:id/performance',
    AGENT_VERIFICATION: '/agents/verification',

    // Payments
    PAYMENTS: '/payments',
    PAYMENT_DETAIL: '/payments/:id',
    REFUND_MANAGEMENT: '/payments/refunds',
    PAYMENT_ANALYTICS: '/payments/analytics',

    // Analytics
    ANALYTICS: '/analytics',
    USER_ANALYTICS: '/analytics/users',
    PROPERTY_ANALYTICS: '/analytics/properties',
    REVENUE_ANALYTICS: '/analytics/revenue',
    GEOGRAPHIC_ANALYTICS: '/analytics/geographic',

    // Communications
    COMMUNICATIONS: '/communications',
    EMAIL_CAMPAIGNS: '/communications/email',
    MESSAGE_TEMPLATES: '/communications/templates',

    // Reports
    REPORTS: '/reports',
    CUSTOM_REPORTS: '/reports/custom',
    SCHEDULED_REPORTS: '/reports/scheduled',

    // Settings
    SETTINGS: '/settings',
    GENERAL_SETTINGS: '/settings/general',
    USER_MANAGEMENT: '/settings/users',
    SYSTEM_CONFIG: '/settings/system',
    INTEGRATION_SETTINGS: '/settings/integrations',
    SECURITY_SETTINGS: '/settings/security',
}

// API Routes
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        PROFILE: '/auth/profile',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },

    USERS: {
        LIST: '/users',
        CREATE: '/users',
        GET: '/users/:id',
        UPDATE: '/users/:id',
        DELETE: '/users/:id',
        BULK_UPDATE: '/users/bulk',
    },

    KYC: {
        LIST: '/kyc',
        GET: '/kyc/:id',
        APPROVE: '/kyc/:id/approve',
        REJECT: '/kyc/:id/reject',
        DOCUMENTS: '/kyc/:id/documents',
        VERIFY_NIN: '/kyc/verify/nin',
        VERIFY_BVN: '/kyc/verify/bvn',
    },

    PROPERTIES: {
        LIST: '/properties',
        CREATE: '/properties',
        GET: '/properties/:id',
        UPDATE: '/properties/:id',
        DELETE: '/properties/:id',
        APPROVE: '/properties/:id/approve',
        REJECT: '/properties/:id/reject',
        CATEGORIES: '/properties/categories',
    },

    AGENTS: {
        LIST: '/agents',
        GET: '/agents/:id',
        PERFORMANCE: '/agents/:id/performance',
        VERIFY: '/agents/:id/verify',
    },

    PAYMENTS: {
        LIST: '/payments',
        GET: '/payments/:id',
        REFUND: '/payments/:id/refund',
        ANALYTICS: '/payments/analytics',
    },

    ANALYTICS: {
        DASHBOARD: '/analytics/dashboard',
        USERS: '/analytics/users',
        PROPERTIES: '/analytics/properties',
        REVENUE: '/analytics/revenue',
        GEOGRAPHIC: '/analytics/geographic',
    },

    COMMUNICATIONS: {
        NOTIFICATIONS: '/communications/notifications',
        EMAIL: '/communications/email',
        SMS: '/communications/sms',
        PUSH: '/communications/push',
        TEMPLATES: '/communications/templates',
    },

    REPORTS: {
        GENERATE: '/reports/generate',
        LIST: '/reports',
        DOWNLOAD: '/reports/:id/download',
        SCHEDULE: '/reports/schedule',
    },

    SETTINGS: {
        GET: '/settings',
        UPDATE: '/settings',
        INTEGRATIONS: '/settings/integrations',
        SECURITY: '/settings/security',
    },
}