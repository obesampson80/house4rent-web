// User Roles
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    KYC_OFFICER: 'kyc_officer',
    PROPERTY_OFFICER: 'property_officer',
    FINANCE_OFFICER: 'finance_officer',
    COMPLIANCE_OFFICER: 'compliance_officer',
    SUPPORT_AGENT: 'support_agent',
    VIEWER: 'viewer',
}

// Permissions
export const PERMISSIONS = {
    // User Management
    MANAGE_USERS: 'users:manage',
    VIEW_USERS: 'users:read',
    CREATE_USERS: 'users:create',
    UPDATE_USERS: 'users:update',
    DELETE_USERS: 'users:delete',
    VIEW_ALL_USERS: 'users:view_all',

    // KYC Management
    MANAGE_KYC: 'kyc:manage',
    VIEW_KYC: 'kyc:read',
    APPROVE_KYC: 'kyc:approve',
    REJECT_KYC: 'kyc:reject',
    ACCESS_SENSITIVE_DATA: 'kyc:sensitive_data',

    // Property Management
    MANAGE_PROPERTIES: 'properties:manage',
    VIEW_PROPERTIES: 'properties:read',
    APPROVE_PROPERTIES: 'properties:approve',
    REJECT_PROPERTIES: 'properties:reject',
    DELETE_PROPERTIES: 'properties:delete',

    // Agent Management
    MANAGE_AGENTS: 'agents:manage',
    VIEW_AGENTS: 'agents:read',
    VERIFY_AGENTS: 'agents:verify',

    // Payment Management
    MANAGE_PAYMENTS: 'payments:manage',
    VIEW_PAYMENTS: 'payments:read',
    PROCESS_REFUNDS: 'payments:refund',
    ACCESS_FINANCIAL_DATA: 'payments:financial_data',

    // Analytics & Reports
    VIEW_ANALYTICS: 'analytics:read',
    EXPORT_DATA: 'analytics:export',
    GENERATE_REPORTS: 'reports:generate',

    // Communications
    SEND_NOTIFICATIONS: 'communications:send',
    MANAGE_TEMPLATES: 'communications:templates',
    BROADCAST_MESSAGES: 'communications:broadcast',

    // System Settings
    MANAGE_SETTINGS: 'settings:manage',
    VIEW_AUDIT_LOGS: 'audit:read',
    MANAGE_INTEGRATIONS: 'integrations:manage',

    // Bulk Operations
    BULK_OPERATIONS: 'bulk_operations',
}

// Role Permissions Mapping
export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

    [ROLES.ADMIN]: [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.UPDATE_USERS,
        PERMISSIONS.VIEW_ALL_USERS,
        PERMISSIONS.MANAGE_PROPERTIES,
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.APPROVE_PROPERTIES,
        PERMISSIONS.REJECT_PROPERTIES,
        PERMISSIONS.MANAGE_AGENTS,
        PERMISSIONS.VIEW_AGENTS,
        PERMISSIONS.VERIFY_AGENTS,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.EXPORT_DATA,
        PERMISSIONS.GENERATE_REPORTS,
        PERMISSIONS.SEND_NOTIFICATIONS,
        PERMISSIONS.MANAGE_TEMPLATES,
        PERMISSIONS.BULK_OPERATIONS,
    ],

    [ROLES.KYC_OFFICER]: [
        PERMISSIONS.MANAGE_KYC,
        PERMISSIONS.VIEW_KYC,
        PERMISSIONS.APPROVE_KYC,
        PERMISSIONS.REJECT_KYC,
        PERMISSIONS.ACCESS_SENSITIVE_DATA,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.SEND_NOTIFICATIONS,
    ],

    [ROLES.PROPERTY_OFFICER]: [
        PERMISSIONS.MANAGE_PROPERTIES,
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.APPROVE_PROPERTIES,
        PERMISSIONS.REJECT_PROPERTIES,
        PERMISSIONS.VIEW_AGENTS,
        PERMISSIONS.SEND_NOTIFICATIONS,
    ],

    [ROLES.FINANCE_OFFICER]: [
        PERMISSIONS.MANAGE_PAYMENTS,
        PERMISSIONS.VIEW_PAYMENTS,
        PERMISSIONS.PROCESS_REFUNDS,
        PERMISSIONS.ACCESS_FINANCIAL_DATA,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.EXPORT_DATA,
        PERMISSIONS.GENERATE_REPORTS,
    ],

    [ROLES.COMPLIANCE_OFFICER]: [
        PERMISSIONS.VIEW_KYC,
        PERMISSIONS.ACCESS_SENSITIVE_DATA,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.VIEW_AUDIT_LOGS,
        PERMISSIONS.GENERATE_REPORTS,
    ],

    [ROLES.SUPPORT_AGENT]: [
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.VIEW_PAYMENTS,
        PERMISSIONS.SEND_NOTIFICATIONS,
    ],

    [ROLES.VIEWER]: [
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.VIEW_PROPERTIES,
        PERMISSIONS.VIEW_USERS,
    ],
}

// Navigation Menu Permissions
export const MENU_PERMISSIONS = {
    dashboard: [PERMISSIONS.VIEW_ANALYTICS],
    users: [PERMISSIONS.VIEW_USERS],
    kyc: [PERMISSIONS.VIEW_KYC],
    properties: [PERMISSIONS.VIEW_PROPERTIES],
    agents: [PERMISSIONS.VIEW_AGENTS],
    payments: [PERMISSIONS.VIEW_PAYMENTS],
    analytics: [PERMISSIONS.VIEW_ANALYTICS],
    communications: [PERMISSIONS.SEND_NOTIFICATIONS],
    reports: [PERMISSIONS.GENERATE_REPORTS],
    settings: [PERMISSIONS.MANAGE_SETTINGS],
}