export const PROPERTY_CATEGORIES = {
    RESIDENTIAL: 'residential',
    COMMERCIAL: 'commercial',
    LAND: 'land',
    SPECIALIZED: 'specialized',
}

export const PROPERTY_TYPES = {
    // Residential
    APARTMENT: 'apartment',
    HOUSE: 'house',
    DUPLEX: 'duplex',
    BUNGALOW: 'bungalow',
    MANSION: 'mansion',
    STUDIO: 'studio',
    PENTHOUSE: 'penthouse',

    // Commercial
    OFFICE: 'office',
    SHOP: 'shop',
    WAREHOUSE: 'warehouse',
    MALL: 'mall',
    HOTEL: 'hotel',
    RESTAURANT: 'restaurant',

    // Land
    RESIDENTIAL_LAND: 'residential_land',
    COMMERCIAL_LAND: 'commercial_land',
    AGRICULTURAL_LAND: 'agricultural_land',
    INDUSTRIAL_LAND: 'industrial_land',

    // Specialized
    STUDENT_HOUSING: 'student_housing',
    CO_WORKING: 'co_working',
    SERVICED_APARTMENT: 'serviced_apartment',
    SHORT_LET: 'short_let',
}

export const PROPERTY_STATUS = {
    DRAFT: 'draft',
    PENDING: 'pending',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    LISTED: 'listed',
    RENTED: 'rented',
    SOLD: 'sold',
    EXPIRED: 'expired',
    SUSPENDED: 'suspended',
}

export const PROPERTY_VERIFICATION_STATUS = {
    NOT_STARTED: 'not_started',
    DOCUMENT_REVIEW: 'document_review',
    PHYSICAL_INSPECTION: 'physical_inspection',
    COMPLETED: 'completed',
    FAILED: 'failed',
}

export const REQUIRED_DOCUMENTS = {
    [PROPERTY_CATEGORIES.RESIDENTIAL]: [
        'certificate_of_occupancy',
        'survey_plan',
        'deed_of_assignment',
        'building_plan_approval',
        'tax_clearance',
        'property_photos',
    ],

    [PROPERTY_CATEGORIES.COMMERCIAL]: [
        'certificate_of_occupancy',
        'survey_plan',
        'deed_of_assignment',
        'building_plan_approval',
        'tax_clearance',
        'business_permit',
        'fire_safety_certificate',
        'environmental_impact_assessment',
        'property_photos',
    ],

    [PROPERTY_CATEGORIES.LAND]: [
        'certificate_of_occupancy',
        'survey_plan',
        'deed_of_assignment',
        'excision_gazette',
        'tax_clearance',
        'land_photos',
    ],

    [PROPERTY_CATEGORIES.SPECIALIZED]: [
        'certificate_of_occupancy',
        'survey_plan',
        'deed_of_assignment',
        'building_plan_approval',
        'tax_clearance',
        'special_permits',
        'property_photos',
    ],
}

export const AMENITIES = {
    BASIC: [
        'electricity',
        'water_supply',
        'security',
        'parking',
        'waste_disposal',
    ],

    PREMIUM: [
        'swimming_pool',
        'gym',
        'playground',
        'garden',
        'elevator',
        'generator',
        'air_conditioning',
        'internet',
        'cable_tv',
    ],

    LUXURY: [
        'concierge',
        'spa',
        'tennis_court',
        'golf_course',
        'marina',
        'helipad',
        'wine_cellar',
        'smart_home',
    ],
}

export const PROPERTY_FEES = {
    LISTING_FEE: 0.05, // 5% of annual rent
    PLATFORM_FEE: 0.02, // 2% transaction fee
    VERIFICATION_FEE: 25000, // Fixed fee in Naira
    RENEWAL_FEE: 0.03, // 3% for renewal
}