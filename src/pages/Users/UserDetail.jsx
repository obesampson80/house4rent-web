// src/pages/Users/UserDetail.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeftIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    EyeIcon,
    BellIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    StarIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'

// Mock user data - would come from API
const mockUserData = {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    role: 'agent',
    status: 'active',
    kycStatus: 'approved',
    joinedAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-20T14:22:00Z',
    propertiesListed: 12,
    totalEarnings: 450000,
    avatar: null,
    location: 'Lagos, Nigeria',
    verificationLevel: 'level_3',
    subscription: 'premium',
    accountType: 'business',

    // Extended profile data
    profile: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        address: {
            street: '123 Victoria Island',
            city: 'Lagos',
            state: 'Lagos State',
            country: 'Nigeria',
            postalCode: '101001'
        },
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+234 802 345 6789'
        },
        bankDetails: {
            accountName: 'John Doe',
            accountNumber: '0123456789',
            bankName: 'GTBank',
            accountType: 'Savings'
        }
    },

    // KYC Documents
    kycDocuments: [
        {
            id: 'DOC-001',
            type: 'National ID',
            status: 'approved',
            uploadedAt: '2024-01-16T09:00:00Z',
            approvedAt: '2024-01-17T14:30:00Z',
            url: '/documents/national-id.pdf'
        },
        {
            id: 'DOC-002',
            type: 'Bank Statement',
            status: 'approved',
            uploadedAt: '2024-01-16T09:30:00Z',
            approvedAt: '2024-01-17T14:35:00Z',
            url: '/documents/bank-statement.pdf'
        },
        {
            id: 'DOC-003',
            type: 'Utility Bill',
            status: 'pending',
            uploadedAt: '2024-01-18T11:00:00Z',
            approvedAt: null,
            url: '/documents/utility-bill.pdf'
        }
    ],

    // Recent Properties
    recentProperties: [
        {
            id: 'PROP-001',
            title: '3 Bedroom Apartment in Lekki',
            status: 'approved',
            price: 1200000,
            listedAt: '2024-01-18T10:00:00Z',
            views: 145,
            inquiries: 23
        },
        {
            id: 'PROP-002',
            title: '2 Bedroom Duplex in Ikoyi',
            status: 'under_review',
            price: 2500000,
            listedAt: '2024-01-17T15:30:00Z',
            views: 89,
            inquiries: 12
        }
    ],

    // Activity Log
    activityLog: [
        {
            id: 'ACT-001',
            action: 'Listed Property',
            description: '3 Bedroom Apartment in Lekki',
            timestamp: '2024-01-20T14:22:00Z',
            type: 'property'
        },
        {
            id: 'ACT-002',
            action: 'Profile Updated',
            description: 'Updated contact information',
            timestamp: '2024-01-19T10:15:00Z',
            type: 'profile'
        },
        {
            id: 'ACT-003',
            action: 'KYC Document Uploaded',
            description: 'Uploaded utility bill',
            timestamp: '2024-01-18T11:00:00Z',
            type: 'kyc'
        }
    ],

    // Performance Metrics (for agents)
    performanceMetrics: {
        rating: 4.8,
        totalReviews: 156,
        responseTime: '15 min',
        successRate: 85,
        clientSatisfaction: 92,
        propertiesSold: 18,
        totalCommission: 2800000
    }
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
        active: { variant: 'success', label: 'Active' },
        suspended: { variant: 'danger', label: 'Suspended' },
        inactive: { variant: 'default', label: 'Inactive' },
        pending: { variant: 'warning', label: 'Pending' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
}

const getKycBadge = (status) => {
    const statusMap = {
        approved: { variant: 'success', label: 'Approved' },
        pending: { variant: 'warning', label: 'Pending' },
        rejected: { variant: 'danger', label: 'Rejected' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const getRatingStars = (rating) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <StarIcon
                    key={index}
                    className={`h-4 w-4 ${index < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                        }`}
                />
            ))}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                {rating.toFixed(1)}
            </span>
        </div>
    )
}

const UserDetail = () => {
    const { id } = useParams()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showSuspendModal, setShowSuspendModal] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    // In a real app, you'd fetch user data based on the ID
    const user = mockUserData

    const tabs = [
        { id: 'overview', label: 'Overview', icon: UserCircleIcon },
        { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon },
        { id: 'kyc', label: 'KYC Documents', icon: DocumentTextIcon },
        { id: 'activity', label: 'Activity Log', icon: ClockIcon },
        ...(user.role === 'agent' ? [{ id: 'performance', label: 'Performance', icon: ChartBarIcon }] : [])
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/users"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            User ID: {user.id} • Joined {formatDate(user.joinedAt)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="secondary" size="sm" onClick={() => setShowEditModal(true)}>
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                    <Button variant="secondary" size="sm">
                        <BellIcon className="h-4 w-4 mr-2" />
                        Send Notification
                    </Button>
                    {user.status === 'active' ? (
                        <Button variant="warning" size="sm" onClick={() => setShowSuspendModal(true)}>
                            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                            Suspend
                        </Button>
                    ) : (
                        <Button variant="success" size="sm">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Activate
                        </Button>
                    )}
                </div>
            </div>

            {/* User Summary Cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Profile Card */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <Card.Title>Profile Information</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                    <UserCircleIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Email Address
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Phone Number
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {user.phone}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Location
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {user.location}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Last Activity
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {formatDateTime(user.lastActivity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                                        {getStatusBadge(user.status)}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</span>
                                        <Badge variant="primary" size="xs">{user.role}</Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">KYC:</span>
                                        {getKycBadge(user.kycStatus)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user.propertiesListed}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Properties Listed
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(user.totalEarnings).replace('NGN', '₦')}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Earnings
                                </div>
                            </div>
                        </div>
                    </Card>

                    {user.role === 'agent' && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                                        Agent Rating
                                    </div>
                                    {getRatingStars(user.performanceMetrics.rating)}
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {user.performanceMetrics.totalReviews} reviews
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                        {user.performanceMetrics.successRate}%
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Success Rate
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
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
                        {/* Personal Information */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Personal Information</Card.Title>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            First Name
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                                            {user.profile.firstName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Last Name
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                                            {user.profile.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Date of Birth
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                                            {formatDate(user.profile.dateOfBirth)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Gender
                                        </label>
                                        <p className="text-sm text-gray-900 dark:text-white mt-1 capitalize">
                                            {user.profile.gender}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Address
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                                        {user.profile.address.street}, {user.profile.address.city}, {user.profile.address.state}, {user.profile.address.country}
                                    </p>
                                </div>
                            </Card.Content>
                        </Card>

                        {/* Emergency Contact & Bank Details */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Contact & Banking</Card.Title>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Emergency Contact
                                    </label>
                                    <div className="mt-1 space-y-1">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {user.profile.emergencyContact.name} ({user.profile.emergencyContact.relationship})
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.profile.emergencyContact.phone}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Bank Details
                                    </label>
                                    <div className="mt-1 space-y-1">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {user.profile.bankDetails.accountName}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.profile.bankDetails.bankName} - {user.profile.bankDetails.accountNumber}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.profile.bankDetails.accountType}
                                        </p>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <Card>
                        <Card.Header>
                            <div className="flex items-center justify-between">
                                <Card.Title>User Properties</Card.Title>
                                <Link to={`/properties?user=${user.id}`}>
                                    <Button size="sm" variant="secondary">View All</Button>
                                </Link>
                            </div>
                        </Card.Header>
                        <Card.Content>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.Head>Property</Table.Head>
                                        <Table.Head>Status</Table.Head>
                                        <Table.Head>Price</Table.Head>
                                        <Table.Head>Views</Table.Head>
                                        <Table.Head>Inquiries</Table.Head>
                                        <Table.Head>Actions</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {user.recentProperties.map((property) => (
                                        <Table.Row key={property.id}>
                                            <Table.Cell>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {property.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Listed {formatDate(property.listedAt)}
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge variant={property.status === 'approved' ? 'success' : 'warning'}>
                                                    {property.status.replace('_', ' ')}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-medium">
                                                    {formatCurrency(property.price)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>{property.views}</Table.Cell>
                                            <Table.Cell>{property.inquiries}</Table.Cell>
                                            <Table.Cell>
                                                <Link
                                                    to={`/properties/${property.id}`}
                                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                    </Card>
                )}

                {activeTab === 'kyc' && (
                    <Card>
                        <Card.Header>
                            <Card.Title>KYC Documents</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-4">
                                {user.kycDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {doc.type}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Uploaded {formatDate(doc.uploadedAt)}
                                                    {doc.approvedAt && ` • Approved ${formatDate(doc.approvedAt)}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getKycBadge(doc.status)}
                                            <Button size="xs" variant="secondary">
                                                <EyeIcon className="h-3 w-3 mr-1" />
                                                View
                                            </Button>
                                            {doc.status === 'pending' && (
                                                <>
                                                    <Button size="xs" variant="success">
                                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                        Approve
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

                {activeTab === 'activity' && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Recent Activity</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-4">
                                {user.activityLog.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4 p-4 border-l-2 border-primary-200 dark:border-primary-800">
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.action}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                {formatDateTime(activity.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Content>
                    </Card>
                )}

                {activeTab === 'performance' && user.role === 'agent' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <Card.Header>
                                <Card.Title>Performance Metrics</Card.Title>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {user.performanceMetrics.propertiesSold}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Properties Sold
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {user.performanceMetrics.responseTime}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Avg Response Time
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {user.performanceMetrics.clientSatisfaction}%
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Client Satisfaction
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {formatCurrency(user.performanceMetrics.totalCommission).replace('NGN', '₦')}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Total Commission
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>Rating & Reviews</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="text-center space-y-4">
                                    <div>
                                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {user.performanceMetrics.rating}
                                        </div>
                                        {getRatingStars(user.performanceMetrics.rating)}
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Based on {user.performanceMetrics.totalReviews} reviews
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                                    {rating}★
                                                </span>
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-400 h-2 rounded-full"
                                                        style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                                    {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit User Profile"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                defaultValue={user.profile.firstName}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                defaultValue={user.profile.lastName}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                defaultValue={user.email}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                defaultValue={user.phone}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Role
                            </label>
                            <select
                                defaultValue={user.role}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            >
                                <option value="agent">Agent</option>
                                <option value="landlord">Landlord</option>
                                <option value="tenant">Tenant</option>
                                <option value="property_seeker">Property Seeker</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                defaultValue={user.status}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowEditModal(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Suspend User Modal */}
            <Modal
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                title="Suspend User"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Warning
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    This will suspend the user's account and prevent them from accessing the platform.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason for Suspension
                        </label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Explain the reason for suspending this user..."
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuspendModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={() => setShowSuspendModal(false)}>
                        Suspend User
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserDetail