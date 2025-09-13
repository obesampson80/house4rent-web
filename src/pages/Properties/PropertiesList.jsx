// src/pages/Properties/PropertiesList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    HomeIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    ClockIcon,
    PhotoIcon,
    DocumentTextIcon,
    FunnelIcon,
    PencilIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import AdvancedFilter from '@components/common/AdvancedFilter/AdvancedFilter'
import { useAdvancedFilter } from '@hooks/useAdvancedFilter'
import { PlusIcon } from '@heroicons/react/24/outline'
import PropertyForm from '@components/forms/PropertyForm'
import { PropertyStatusModal, BulkActionModal } from '@components/forms/QuickActionForms'


// Mock Properties Data (same as before)
const mockProperties = [
    {
        id: 'PROP-001',
        title: '3 Bedroom Apartment in Lekki',
        address: 'Lekki Phase 1, Lagos State',
        type: 'apartment',
        category: 'residential',
        owner: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+234 801 234 5678',
        },
        price: {
            amount: 1200000,
            period: 'annually',
        },
        status: 'pending_approval',
        submittedAt: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        documents: ['certificate_of_occupancy', 'survey_plan', 'deed_of_assignment'],
        verification: {
            documentsVerified: true,
            physicalInspection: false,
            ownershipConfirmed: true,
        },
        features: ['3 bedrooms', '2 bathrooms', 'Parking space', 'Security', 'Generator'],
        description: 'Modern 3-bedroom apartment with excellent amenities in a prime location.',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        furnished: true,
    },
    {
        id: 'PROP-002',
        title: '2 Bedroom Duplex in Ikoyi',
        address: 'Ikoyi, Lagos State',
        type: 'duplex',
        category: 'residential',
        owner: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+234 802 345 6789',
        },
        price: {
            amount: 2500000,
            period: 'annually',
        },
        status: 'under_review',
        submittedAt: '2024-01-14T14:20:00Z',
        createdAt: '2024-01-14T14:20:00Z',
        images: ['img4.jpg', 'img5.jpg'],
        documents: ['certificate_of_occupancy', 'survey_plan'],
        verification: {
            documentsVerified: false,
            physicalInspection: false,
            ownershipConfirmed: false,
        },
        features: ['2 bedrooms', '3 bathrooms', 'Swimming pool', 'Gym', 'Security'],
        description: 'Luxury duplex with premium amenities and stunning views.',
        bedrooms: 2,
        bathrooms: 3,
        area: 200,
        furnished: false,
    },
    {
        id: 'PROP-003',
        title: 'Commercial Office Space',
        address: 'Victoria Island, Lagos State',
        type: 'office',
        category: 'commercial',
        owner: {
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+234 803 456 7890',
        },
        price: {
            amount: 5000000,
            period: 'annually',
        },
        status: 'approved',
        submittedAt: '2024-01-12T09:15:00Z',
        createdAt: '2024-01-12T09:15:00Z',
        images: ['img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg'],
        documents: ['certificate_of_occupancy', 'survey_plan', 'deed_of_assignment', 'business_permit'],
        verification: {
            documentsVerified: true,
            physicalInspection: true,
            ownershipConfirmed: true,
        },
        features: ['Open plan', 'Conference rooms', 'Parking', '24/7 security', 'Elevator'],
        description: 'Premium office space in the heart of Victoria Island business district.',
        bedrooms: 0,
        bathrooms: 4,
        area: 500,
        furnished: true,
    },
]

const mockStats = {
    total: 156,
    pending: 23,
    approved: 98,
    rejected: 12,
    underReview: 23,
}

// Define search fields for properties
const searchFields = [
    'title',
    'address',
    'owner.name',
    'owner.email',
    'description',
    'features',
    'type',
    'category'
]

// Define filter options for properties
const filterOptions = [
    {
        key: 'status',
        label: 'Status',
        options: [
            { value: 'pending_approval', label: 'Pending Approval' },
            { value: 'under_review', label: 'Under Review' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'listed', label: 'Listed' },
        ]
    },
    {
        key: 'category',
        label: 'Category',
        options: [
            { value: 'residential', label: 'Residential' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'land', label: 'Land' },
            { value: 'specialized', label: 'Specialized' },
        ]
    },
    {
        key: 'type',
        label: 'Property Type',
        options: [
            { value: 'apartment', label: 'Apartment' },
            { value: 'house', label: 'House' },
            { value: 'duplex', label: 'Duplex' },
            { value: 'office', label: 'Office' },
            { value: 'shop', label: 'Shop' },
            { value: 'warehouse', label: 'Warehouse' },
        ]
    },
    {
        key: 'verification.documentsVerified',
        label: 'Documents',
        options: [
            { value: 'true', label: 'Verified' },
            { value: 'false', label: 'Pending' },
        ]
    },
    {
        key: 'verification.physicalInspection',
        label: 'Inspection',
        options: [
            { value: 'true', label: 'Completed' },
            { value: 'false', label: 'Pending' },
        ]
    },
    {
        key: 'furnished',
        label: 'Furnished',
        options: [
            { value: 'true', label: 'Furnished' },
            { value: 'false', label: 'Unfurnished' },
        ]
    }
]

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

const getCategoryBadge = (category) => {
    const categoryMap = {
        residential: { variant: 'primary', label: 'Residential' },
        commercial: { variant: 'info', label: 'Commercial' },
        land: { variant: 'warning', label: 'Land' },
        specialized: { variant: 'default', label: 'Specialized' },
    }

    const config = categoryMap[category] || { variant: 'default', label: category }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
}

const PropertyTypeIcon = ({ type }) => {
    const iconMap = {
        apartment: HomeIcon,
        house: HomeIcon,
        duplex: BuildingOfficeIcon,
        office: BuildingOfficeIcon,
        shop: BuildingOfficeIcon,
    }

    const Icon = iconMap[type] || HomeIcon
    return <Icon className="h-5 w-5 text-gray-400" />
}

const VerificationStatus = ({ verification }) => {
    const items = [
        { key: 'documentsVerified', label: 'Docs', icon: DocumentTextIcon },
        { key: 'physicalInspection', label: 'Inspection', icon: EyeIcon },
        { key: 'ownershipConfirmed', label: 'Ownership', icon: CheckIcon },
    ]

    return (
        <div className="flex items-center space-x-2">
            {items.map(({ key, label, icon: Icon }) => (
                <div
                    key={key}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${verification[key]
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                    title={label}
                >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{label}</span>
                </div>
            ))}
        </div>
    )
}

const PropertiesList = () => {
    const { filteredData, filterState, handleFiltersChange, stats } = useAdvancedFilter(
        mockProperties,
        searchFields
    )

    // Calculate dynamic stats based on filtered data
    const dynamicStats = {
        total: stats.total,
        filtered: stats.filtered,
        pending: filteredData.filter(p => p.status === 'pending_approval').length,
        approved: filteredData.filter(p => p.status === 'approved').length,
        rejected: filteredData.filter(p => p.status === 'rejected').length,
        underReview: filteredData.filter(p => p.status === 'under_review').length,
    }

    const [showPropertyForm, setShowPropertyForm] = useState(false)
    const [editingProperty, setEditingProperty] = useState(null)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedPropertyForStatus, setSelectedPropertyForStatus] = useState(null)
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [selectedProperties, setSelectedProperties] = useState([])

    // Add these handler functions
    const handleAddProperty = () => {
        setEditingProperty(null)
        setShowPropertyForm(true)
    }

    const handleEditProperty = (property) => {
        setEditingProperty(property)
        setShowPropertyForm(true)
    }

    const handleStatusChange = (property) => {
        setSelectedPropertyForStatus(property)
        setShowStatusModal(true)
    }

    const handleBulkActions = () => {
        if (selectedProperties.length > 0) {
            setShowBulkModal(true)
        }
    }

    const handlePropertyStatusUpdate = async (statusData) => {
        console.log('Updating property status:', statusData)
        // API call to update property status
        // Refresh data after update
    }

    const handleBulkAction = async (actionData) => {
        console.log('Performing bulk action:', actionData)
        // API call to perform bulk action
        // Refresh data after action
        setSelectedProperties([])
    }

    return (
        <div className="space-y-6">
            {/* Update the header section */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Properties
                        {stats.hasFilters && (
                            <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                                ({stats.filtered} of {stats.total})
                            </span>
                        )}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage property listings and approvals with advanced filtering
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    {/* Add bulk actions button when items are selected */}
                    {selectedProperties.length > 0 && (
                        <Button variant="secondary" onClick={handleBulkActions}>
                            Bulk Actions ({selectedProperties.length})
                        </Button>
                    )}
                    <Button variant="secondary">
                        Export Results ({stats.filtered})
                    </Button>
                    {/* Update the Add Property button */}
                    <Button onClick={handleAddProperty}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Property
                    </Button>
                </div>
            </div>

            {/* Dynamic Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.filtered}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {stats.hasFilters ? 'Filtered' : 'Total'} Properties
                            </div>
                            {stats.hasFilters && (
                                <div className="text-xs text-gray-400">
                                    of {dynamicStats.total} total
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ClockIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.pending}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Pending Approval
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.approved}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Approved
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <EyeIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.underReview}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Under Review
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <XMarkIcon className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.rejected}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Rejected
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Advanced Filter Component */}
            <AdvancedFilter
                searchFields={searchFields}
                filters={filterOptions}
                onFiltersChange={handleFiltersChange}
                placeholder="Search properties, owners, addresses, features..."
                data={mockProperties}
            />

            {/* No Results State */}
            {stats.hasFilters && stats.filtered === 0 && (
                <Card className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                        <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No properties found</h3>
                        <p>Try adjusting your filters or search terms to find more properties.</p>
                    </div>
                </Card>
            )}

            {/* Properties Table */}
            {filteredData.length > 0 && (
                <Card>
                    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1400px' }}>
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[350px]">
                                        Property
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Owner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Verification
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredData.map((property, index) => (
                                    <tr
                                        key={property.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        {property.images.length > 0 ? (
                                                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                                                        ) : (
                                                            <PropertyTypeIcon type={property.type} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {property.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                                        <span className="truncate">{property.address}</span>
                                                    </div>
                                                    {property.bedrooms > 0 && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {property.bedrooms} bed • {property.bathrooms} bath • {property.area}m²
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {property.owner.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {property.owner.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getCategoryBadge(property.category)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatPrice(property.price.amount)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        per {property.price.period}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(property.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <VerificationStatus verification={property.verification} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatTimeAgo(property.submittedAt)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Link
                                                    to={`/properties/${property.id}`}
                                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                    title="View Property"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>

                                                {/* Add edit button */}
                                                <button
                                                    onClick={() => handleEditProperty(property)}
                                                    className="text-gray-600 hover:text-gray-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                                                    title="Edit Property"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>

                                                {/* Add status change button */}
                                                <button
                                                    onClick={() => handleStatusChange(property)}
                                                    className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="Change Status"
                                                >
                                                    <ClockIcon className="h-4 w-4" />
                                                </button>



                                                {property.status === 'pending_approval' && (
                                                    <>
                                                        <button
                                                            className="text-green-600 hover:text-green-500 px-2 py-1 text-xs bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded transition-colors"
                                                            title="Approve Property"
                                                        >
                                                            <CheckIcon className="h-3 w-3 mr-1 inline" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-500 px-2 py-1 text-xs bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded transition-colors"
                                                            title="Reject Property"
                                                        >
                                                            <XMarkIcon className="h-3 w-3 mr-1 inline" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {property.status === 'under_review' && (
                                                    <button
                                                        className="text-blue-600 hover:text-blue-500 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded transition-colors"
                                                        title="Review Property"
                                                    >
                                                        Review
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Enhanced Pagination with Filter Context */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
                                {stats.hasFilters && ` (filtered from ${stats.total} total)`}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button size="sm" variant="secondary" disabled>
                                    Previous
                                </Button>
                                <Button size="sm" variant="secondary" disabled>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Quick Actions Card - Only show relevant actions based on filtered data */}
            <Card>
                <Card.Header>
                    <Card.Title>Quick Actions</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Button variant="secondary" className="justify-start">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Review Pending ({dynamicStats.pending})
                        </Button>
                        <Button variant="secondary" className="justify-start">
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            Verify Documents
                        </Button>
                        <Button variant="secondary" className="justify-start">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Schedule Inspections
                        </Button>
                        <Button variant="secondary" className="justify-start">
                            <PhotoIcon className="h-4 w-4 mr-2" />
                            Review Images
                        </Button>
                    </div>
                </Card.Content>
            </Card>

            {/* Property Form Modal */}
            {showPropertyForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowPropertyForm(false)} />
                    <div className="relative">
                        <PropertyForm
                            mode={editingProperty ? 'edit' : 'create'}
                            initialData={editingProperty}
                            onClose={() => setShowPropertyForm(false)}
                            onSave={() => {
                                setShowPropertyForm(false)
                                // Refresh your data here
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Property Status Modal */}
            <PropertyStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                property={selectedPropertyForStatus}
                onStatusChange={handlePropertyStatusUpdate}
            />

            {/* Bulk Actions Modal */}
            <BulkActionModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                selectedItems={selectedProperties}
                itemType="properties"
                onBulkAction={handleBulkAction}
            />
        </div>
    )
}

export default PropertiesList