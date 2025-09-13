export const USER_ROLES = {
    // Admin Roles
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',

    // Officer Roles
    KYC_OFFICER: 'kyc_officer',
    PROPERTY_OFFICER: 'property_officer',
    FINANCE_OFFICER: 'finance_officer',
    COMPLIANCE_OFFICER: 'compliance_officer',

    // Support Roles
    SUPPORT_AGENT: 'support_agent',
    VIEWER: 'viewer',

    // App User Roles
    AGENT: 'agent',
    LANDLORD: 'landlord',
    TENANT: 'tenant',
    PROPERTY_SEEKER: 'property_seeker',
}

export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING_VERIFICATION: 'pending_verification',
    BLOCKED: 'blocked',
}

export const KYC_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    PENDING_REVIEW: 'pending_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    EXPIRED: 'expired',
}

export const KYC_DOCUMENT_TYPES = {
    NIN: 'nin',
    BVN: 'bvn',
    INTERNATIONAL_PASSPORT: 'international_passport',
    DRIVERS_LICENSE: 'drivers_license',
    VOTERS_CARD: 'voters_card',
    UTILITY_BILL: 'utility_bill',
    BANK_STATEMENT: 'bank_statement',
    SELFIE: 'selfie',
    SIGNATURE: 'signature',
}

export const VERIFICATION_LEVELS = {
    LEVEL_1: 'level_1', // Basic info + phone
    LEVEL_2: 'level_2', // + Email verification
    LEVEL_3: 'level_3', // + ID verification (NIN/BVN)
    LEVEL_4: 'level_4', // + Address verification
    LEVEL_5: 'level_5', // + Enhanced due diligence
}

export const AGENT_VERIFICATION_STATUS = {
    UNVERIFIED: 'unverified',
    DOCUMENTS_SUBMITTED: 'documents_submitted',
    UNDER_REVIEW: 'under_review',
    INTERVIEW_SCHEDULED: 'interview_scheduled',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
}

export const AGENT_PERFORMANCE_METRICS = {
    LISTINGS_COUNT: 'listings_count',
    SUCCESSFUL_RENTALS: 'successful_rentals',
    CUSTOMER_RATING: 'customer_rating',
    RESPONSE_TIME: 'response_time',
    PROFILE_COMPLETION: 'profile_completion',
    COMMISSION_EARNED: 'commission_earned',
}