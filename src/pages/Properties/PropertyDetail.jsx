// src/pages/Properties/PropertyDetail.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeftIcon,
    HomeIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    EyeIcon,
    CalendarIcon,
    UserIcon,
    DocumentTextIcon,
    PhotoIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    ShareIcon,
    HeartIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'

// Mock property data - would come from API
const mockPropertyData = {
    id: 'PROP-001',
    title: '3 Bedroom Apartment in Lekki',
    address: 'Lekki Phase 1, Lagos State',
    type: 'apartment',
    category: 'residential',
    status: 'approved',
    submittedAt: '2024-01-15T10:30:00Z',
    approvedAt: '2024-01-16T14:20:00Z',
    listedAt: '2024-01-16T15:00:00Z',

    // Property Details
    details: {
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        furnished: true,
        parking: 'Yes',
        yearBuilt: 2020,
        floors: 2,
        propertyAge: '4 years',
    },

    // Pricing
    pricing: {
        amount: 1200000,
        period: 'annually',
        currency: 'NGN',
        deposit: 600000,
        agentFee: 60000,
        legalFee: 50000,
        totalUpfront: 710000,
    },

    // Owner Information
    owner: {
        id: 'USR-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
        role: 'landlord',
        joinedAt: '2023-08-15T10:30:00Z',
        propertiesListed: 5,
        rating: 4.6,
        responseTime: '2 hours',
    },

    // Agent Information (if different from owner)
    agent: {
        id: 'AGT-001',
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+234 802 345 6789',
        rating: 4.8,
        responseTime: '15 min',
        propertiesSold: 18,
        commission: 0.05,
    },

    // Images
    images: [
        { id: 'IMG-001', url: '/images/property-1.jpg', caption: 'Living Room', isPrimary: true },
        { id: 'IMG-002', url: '/images/property-2.jpg', caption: 'Master Bedroom', isPrimary: false },
        { id: 'IMG-003', url: '/images/property-3.jpg', caption: 'Kitchen', isPrimary: false },
        { id: 'IMG-004', url: '/images/property-4.jpg', caption: 'Bathroom', isPrimary: false },
        { id: 'IMG-005', url: '/images/property-5.jpg', caption: 'Exterior View', isPrimary: false },
    ],

    // Documents
    documents: [
        {
            id: 'DOC-001',
            name: 'Certificate of Occupancy',
            type: 'certificate_of_occupancy',
            status: 'verified',
            uploadedAt: '2024-01-15T11:00:00Z',
            verifiedAt: '2024-01-16T09:30:00Z',
            url: '/documents/c_of_o.pdf'
        },
        {
            id: 'DOC-002',
            name: 'Survey Plan',
            type: 'survey_plan',
            status: 'verified',
            uploadedAt: '2024-01-15T11:15:00Z',
            verifiedAt: '2024-01-16T09:35:00Z',
            url: '/documents/survey.pdf'
        },
        {
            id: 'DOC-003',
            name: 'Deed of Assignment',
            type: 'deed_of_assignment',
            status: 'pending',
            uploadedAt: '2024-01-15T11:30:00Z',
            verifiedAt: null,
            url: '/documents/deed.pdf'
        }
    ],

    // Features & Amenities
    features: [
        'Air Conditioning', 'Security', 'Generator', 'Water Supply', 'Parking Space',
        'Swimming Pool', 'Gym', 'Elevator', 'Balcony', 'Garden'
    ],

    // Verification Status
    verification: {
        documentsVerified: true,
        physicalInspection: true,
        ownershipConfirmed: true,
        priceVerified: true,
        locationVerified: true,
        inspectionDate: '2024-01-16T10:00:00Z',
        inspectionBy: 'Inspector Jane Smith',
        inspectionNotes: 'Property is in excellent condition. All amenities functional.'
    },

    // Analytics
    analytics: {
        views: 245,
        inquiries: 34,
        favorites: 12,
        contactAttempts: 18,
        tourRequests: 8,
        viewsThisWeek: 45,
        inquiriesThisWeek: 8,
    },

    // Location Details
    location: {
        neighborhood: 'Lekki Phase 1',
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        coordinates: { lat: 6.4474, lng: 3.5412 },
        nearbyPlaces: [
            { name: 'Lekki Shopping Mall', distance: '2 km', type: 'shopping' },
            { name: 'Bridge House College', distance: '1.5 km', type: 'school' },
            { name: 'Lekki General Hospital', distance: '3 km', type: 'hospital' },
            { name: 'Elegushi Beach', distance: '5 km', type: 'recreation' },
        ]
    },

    // Description
    description: 'Modern 3-bedroom apartment with excellent amenities in a prime location. The property features contemporary design, high-quality finishes, and access to premium facilities including a swimming pool, gym, and 24/7 security. Located in the heart of Lekki Phase 1, it offers easy access to major commercial areas, schools, and recreational facilities.',

    // Recent Inquiries
    recentInquiries: [
        {
            id: 'INQ-001',
            inquirerName: 'Sarah Johnson',
            inquirerEmail: 'sarah.j@email.com',
            inquirerPhone: '+234 803 123 4567',
            message: 'I am interested in viewing this property. When can I schedule a visit?',
            timestamp: '2024-01-20T09:30:00Z',
            status: 'pending',
            responseTime: null
        },
        {
            id: 'INQ-002',
            inquirerName: 'Michael Brown',
            inquirerEmail: 'mike.brown@email.com',
            inquirerPhone: '+234 804 234 5678',
            message: 'Is the property still available? I would like to know more about the lease terms.',
            timestamp: '2024-01-19T14:15:00Z',
            status: 'responded',
            responseTime: '2 hours'
        }
    ]
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const getStatusBadge = (status) => {
    const statusMap = {
        pending_approval: { variant: 'warning', label: 'Pending Approval' },
        under_review: { variant: 'info', label: 'Under Review' },
        approved: { variant: 'success', label: 'Approved' },
        rejected: { variant: 'danger', label: 'Rejected' },
        listed: { variant: 'success', label: 'Listed' },
        draft: { variant: 'default', label: 'Draft' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
}

const getVerificationBadge = (status) => {
    const statusMap = {
        verified: { variant: 'success', label: 'Verified', icon: CheckCircleIcon },
        pending: { variant: 'warning', label: 'Pending', icon: ClockIcon },
        rejected: { variant: 'danger', label: 'Rejected', icon: XCircleIcon },
    }

    const config = statusMap[status] || { variant: 'default', label: status, icon: ClockIcon }
    const Icon = config.icon

    return (
        <div className="flex items-center space-x-1">
            <Icon className="h-4 w-4" />
            <Badge variant={config.variant} size="xs">{config.label}</Badge>
        </div>
    )
}

const PropertyDetail = () => {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('overview')
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)

    // In a real app, you'd fetch property data based on the ID
    const property = mockPropertyData

    const tabs = [
        { id: 'overview', label: 'Overview', icon: HomeIcon },
        { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
        { id: 'inquiries', label: 'Inquiries', icon: UserIcon },
        { id: 'verification', label: 'Verification', icon: CheckCircleIcon },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/properties"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {property.title}
                        </h1>
                        <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {property.address}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                Property ID: {property.id}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {property.status === 'pending_approval' && (
                        <>
                            <Button variant="success" onClick={() => setShowApprovalModal(true)}>
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                            <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                                <XCircleIcon className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                        </>
                    )}
                    <Button variant="secondary">
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="secondary">
                        <ShareIcon className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Property Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Image Gallery */}
                <Card className="lg:col-span-2">
                    <Card.Content className="p-0">
                        <div className="relative">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={property.images[selectedImage]?.url || '/placeholder-image.jpg'}
                                    alt={property.images[selectedImage]?.caption || 'Property Image'}
                                    className="w-full h-64 object-cover rounded-t-lg"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='
                                    }}
                                />
                            </div>
                            <div className="absolute top-4 left-4">
                                {getStatusBadge(property.status)}
                            </div>
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                    {selectedImage + 1} / {property.images.length}
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-5 gap-2">
                                {property.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-w-16 aspect-h-9 rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary-500' : ''
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.caption}
                                            className="w-full h-16 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OL0E8L3RleHQ+PC9zdmc+'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Quick Info & Actions */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <Card className="p-6">
                        <div className="text-center space-y-4">
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(property.pricing.amount)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    per {property.pricing.period}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(property.pricing.deposit)}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">Deposit</div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(property.pricing.totalUpfront)}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400">Total Upfront</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Property Details */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Property Details</Card.Title>
                        </Card.Header>
                        <Card.Content className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Bedrooms</span>
                                    <span className="font-medium">{property.details.bedrooms}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Bathrooms</span>
                                    <span className="font-medium">{property.details.bathrooms}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Area</span>
                                    <span className="font-medium">{property.details.area}m²</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Furnished</span>
                                    <span className="font-medium">{property.details.furnished ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Parking</span>
                                    <span className="font-medium">{property.details.parking}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Year Built</span>
                                    <span className="font-medium">{property.details.yearBuilt}</span>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Performance</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">{property.analytics.views}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Views</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">{property.analytics.inquiries}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Inquiries</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-600">{property.analytics.favorites}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Favorites</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">{property.analytics.tourRequests}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Tour Requests</div>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Description & Features */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Description</Card.Title>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {property.description}
                                </p>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Features & Amenities</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {property.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        {/* Owner & Agent Info */}
                        <div className="space-y-6">
                            <Card>
                                <Card.Header>
                                    <Card.Title>Property Owner</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                            <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {property.owner.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {property.owner.propertiesListed} properties listed
                                            </div>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <div className="flex items-center space-x-1">
                                                    <EnvelopeIcon className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {property.owner.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <PhoneIcon className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {property.owner.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/users/${property.owner.id}`}>
                                            <Button size="xs" variant="secondary">
                                                <EyeIcon className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </Card.Content>
                            </Card>

                            {property.agent && (
                                <Card>
                                    <Card.Header>
                                        <Card.Title>Listing Agent</Card.Title>
                                    </Card.Header>
                                    <Card.Content>
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {property.agent.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {property.agent.propertiesSold} properties sold • Rating: {property.agent.rating}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Avg response: {property.agent.responseTime}
                                                </div>
                                            </div>
                                            <Link to={`/agents/${property.agent.id}`}>
                                                <Button size="xs" variant="secondary">
                                                    <EyeIcon className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card.Content>
                                </Card>
                            )}

                            {/* Location Info */}
                            <Card>
                                <Card.Header>
                                    <Card.Title>Location & Nearby</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {property.location.neighborhood}, {property.location.city}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {property.location.nearbyPlaces.map((place, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">{place.name}</span>
                                                    <span className="text-gray-500 dark:text-gray-500">{place.distance}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Property Documents</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-4">
                                {property.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {doc.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Uploaded {formatDate(doc.uploadedAt)}
                                                    {doc.verifiedAt && ` • Verified ${formatDate(doc.verifiedAt)}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getVerificationBadge(doc.status)}
                                            <Button size="xs" variant="secondary">
                                                <EyeIcon className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                            {doc.status === 'pending' && (
                                                <>
                                                    <Button size="xs" variant="success">
                                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                        Verify
                                                    </Button>
                                                    <Button size="xs" variant="danger">
                                                        <XCircleIcon className="h-3 w-3 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Content>
                    </Card>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <Card.Header>
                                <Card.Title>View Analytics</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{property.analytics.views}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{property.analytics.viewsThisWeek}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{property.analytics.contactAttempts}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Contact Attempts</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{property.analytics.favorites}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Favorited</div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>Engagement Metrics</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Inquiry Rate</span>
                                        <span className="font-medium">{((property.analytics.inquiries / property.analytics.views) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Tour Request Rate</span>
                                        <span className="font-medium">{((property.analytics.tourRequests / property.analytics.views) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Favorite Rate</span>
                                        <span className="font-medium">{((property.analytics.favorites / property.analytics.views) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <Card>
                        <Card.Header>
                            <div className="flex items-center justify-between">
                                <Card.Title>Recent Inquiries</Card.Title>
                                <Badge variant="info">{property.recentInquiries.length} inquiries</Badge>
                            </div>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-4">
                                {property.recentInquiries.map((inquiry) => (
                                    <div key={inquiry.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {inquiry.inquirerName}
                                                    </h4>
                                                    <Badge variant={inquiry.status === 'responded' ? 'success' : 'warning'} size="xs">
                                                        {inquiry.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                    <div className="flex items-center space-x-4">
                                                        <span>{inquiry.inquirerEmail}</span>
                                                        <span>{inquiry.inquirerPhone}</span>
                                                    </div>
                                                    <p className="italic">"{inquiry.message}"</p>
                                                    <div className="flex items-center space-x-4 text-xs">
                                                        <span>{formatDateTime(inquiry.timestamp)}</span>
                                                        {inquiry.responseTime && (
                                                            <span>Responded in {inquiry.responseTime}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {inquiry.status === 'pending' && (
                                                <Button size="xs">
                                                    Respond
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Content>
                    </Card>
                )}

                {activeTab === 'verification' && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Verification Status</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="text-sm font-medium">Documents Verified</span>
                                        {property.verification.documentsVerified ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="text-sm font-medium">Physical Inspection</span>
                                        {property.verification.physicalInspection ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="text-sm font-medium">Ownership Confirmed</span>
                                        {property.verification.ownershipConfirmed ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="text-sm font-medium">Price Verified</span>
                                        {property.verification.priceVerified ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                </div>

                                {property.verification.physicalInspection && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                                            Inspection Report
                                        </h4>
                                        <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                            <p><strong>Date:</strong> {formatDate(property.verification.inspectionDate)}</p>
                                            <p><strong>Inspector:</strong> {property.verification.inspectionBy}</p>
                                            <p><strong>Notes:</strong> {property.verification.inspectionNotes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card.Content>
                    </Card>
                )}
            </div>

            {/* Approval Modal */}
            <Modal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                title="Approve Property"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex">
                            <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                                    Ready for Approval
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                    This property will be approved and listed on the platform.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Approval Notes (Optional)
                        </label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Add any notes about the approval..."
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowApprovalModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={() => setShowApprovalModal(false)}>
                        Approve Property
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Rejection Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Reject Property"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="flex">
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Reject Property
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    This property will be rejected and the owner will be notified.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason for Rejection <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Explain why this property is being rejected..."
                            required
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => setShowRejectModal(false)}>
                        Reject Property
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PropertyDetail