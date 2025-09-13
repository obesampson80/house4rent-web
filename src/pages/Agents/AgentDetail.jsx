// src/pages/Agents/AgentDetail.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeftIcon,
    UserGroupIcon,
    StarIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    BellIcon,
    TrophyIcon,
    EnvelopeIcon,
    PhoneIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'

// Mock agent data
const mockAgentData = {
    id: 'AGT-001',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    specialization: ['Residential', 'Commercial'],
    status: 'verified',
    joinedAt: '2023-08-15T10:30:00Z',
    lastActivity: '2024-01-20T14:22:00Z',

    // Extended profile
    profile: {
        bio: 'Experienced real estate agent with over 5 years in the Lagos property market. Specializing in residential and commercial properties with a focus on premium locations.',
        education: 'BSc Estate Management, University of Lagos',
        certifications: ['Licensed Real Estate Agent', 'Property Valuation Certificate'],
        languages: ['English', 'Yoruba', 'Igbo'],
        yearsExperience: 5,
        licenseNumber: 'REA/LAG/2019/001234',
        licenseExpiry: '2025-12-31T00:00:00Z',
    },

    // Performance metrics
    performance: {
        rating: 4.8,
        totalReviews: 156,
        responseTime: '15 min',
        successRate: 85,
        clientSatisfaction: 92,
        averageDaysToSell: 45,
        repeatClientRate: 75,
    },

    // Properties & Sales
    properties: {
        listed: 25,
        sold: 18,
        active: 7,
        pending: 3,
        totalValue: 125000000,
        averagePrice: 2500000,
    },

    // Financial data
    earnings: {
        thisMonth: 450000,
        lastMonth: 380000,
        total: 2800000,
        commission: 0.05,
        totalCommissionEarned: 6250000,
        pendingCommission: 125000,
    },

    // Verification status
    verification: {
        documents: true,
        interview: true,
        background: true,
        references: true,
        license: true,
        bankAccount: true,
    },

    // Recent activities
    recentActivities: [
        {
            id: 'ACT-001',
            type: 'property_sold',
            description: 'Sold 2 Bedroom Duplex in Ikoyi',
            amount: 2500000,
            commission: 125000,
            timestamp: '2024-01-20T10:30:00Z'
        },
        {
            id: 'ACT-002',
            type: 'property_listed',
            description: 'Listed 3 Bedroom Apartment in Victoria Island',
            amount: 3200000,
            commission: null,
            timestamp: '2024-01-19T14:15:00Z'
        },
        {
            id: 'ACT-003',
            type: 'client_meeting',
            description: 'Client consultation for property valuation',
            amount: null,
            commission: null,
            timestamp: '2024-01-18T16:00:00Z'
        }
    ],

    // Recent reviews
    recentReviews: [
        {
            id: 'REV-001',
            clientName: 'Mrs. Sarah Johnson',
            rating: 5,
            comment: 'David was exceptional in helping us find our dream home. His knowledge of the Lagos market is impressive.',
            propertyTitle: '4 Bedroom House in Lekki',
            timestamp: '2024-01-15T09:00:00Z'
        },
        {
            id: 'REV-002',
            clientName: 'Mr. Michael Okafor',
            rating: 5,
            comment: 'Professional service, quick response time, and great negotiation skills. Highly recommended!',
            propertyTitle: '2 Bedroom Duplex in Ikoyi',
            timestamp: '2024-01-10T14:30:00Z'
        }
    ],

    // Properties handled
    recentProperties: [
        {
            id: 'PROP-001',
            title: '3 Bedroom Apartment in Lekki',
            status: 'sold',
            price: 1200000,
            listedAt: '2024-01-18T10:00:00Z',
            soldAt: '2024-01-20T10:30:00Z',
            daysOnMarket: 2,
            commission: 60000
        },
        {
            id: 'PROP-002',
            title: '2 Bedroom Duplex in Ikoyi',
            status: 'active',
            price: 2500000,
            listedAt: '2024-01-17T15:30:00Z',
            soldAt: null,
            daysOnMarket: 3,
            commission: null
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
        verified: { variant: 'success', label: 'Verified' },
        pending_verification: { variant: 'warning', label: 'Pending' },
        suspended: { variant: 'danger', label: 'Suspended' },
        rejected: { variant: 'danger', label: 'Rejected' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
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

const AgentDetail = () => {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('overview')
    const [showEditModal, setShowEditModal] = useState(false)
    const [showSuspendModal, setShowSuspendModal] = useState(false)

    const agent = mockAgentData

    const tabs = [
        { id: 'overview', label: 'Overview', icon: UserGroupIcon },
        { id: 'properties', label: 'Properties', icon: BuildingOfficeIcon },
        { id: 'performance', label: 'Performance', icon: ChartBarIcon },
        { id: 'reviews', label: 'Reviews', icon: StarIcon },
        { id: 'verification', label: 'Verification', icon: CheckCircleIcon },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/agents"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {agent.name}
                        </h1>
                        <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {agent.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                Agent ID: {agent.id}
                            </div>
                        </div>
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
                    {agent.status === 'verified' ? (
                        <Button variant="warning" size="sm" onClick={() => setShowSuspendModal(true)}>
                            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                            Suspend
                        </Button>
                    ) : (
                        <Button variant="success" size="sm">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Verify
                        </Button>
                    )}
                </div>
            </div>

            {/* Agent Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Profile Card */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <Card.Title>Agent Profile</Card.Title>
                            {getStatusBadge(agent.status)}
                        </div>
                    </Card.Header>
                    <Card.Content>
                        <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                    <UserGroupIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
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
                                                {agent.email}
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
                                                {agent.phone}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Specialization
                                        </label>
                                        <div className="flex items-center mt-1 space-x-2">
                                            {agent.specialization.map((spec, index) => (
                                                <Badge key={index} variant="default" size="xs">
                                                    {spec}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Experience
                                        </label>
                                        <div className="flex items-center mt-1">
                                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {agent.profile.yearsExperience} years
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Bio
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                                        {agent.profile.bio}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="text-center space-y-2">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {agent.performance.rating}
                            </div>
                            {getRatingStars(agent.performance.rating)}
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {agent.performance.totalReviews} reviews
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {agent.properties.sold}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Properties Sold
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
                                    {formatCurrency(agent.earnings.totalCommissionEarned).replace('NGN', '₦')}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Commission
                                </div>
                            </div>
                        </div>
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
                        {/* Professional Info */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Professional Information</Card.Title>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Education
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                                        {agent.profile.education}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        License Number
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                                        {agent.profile.licenseNumber}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        Expires: {formatDate(agent.profile.licenseExpiry)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Certifications
                                    </label>
                                    <div className="mt-1 space-y-1">
                                        {agent.profile.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-900 dark:text-white">{cert}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Languages
                                    </label>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {agent.profile.languages.map((lang, index) => (
                                            <Badge key={index} variant="default" size="xs">
                                                {lang}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Recent Activity</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    {agent.recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-4 p-3 border-l-2 border-primary-200 dark:border-primary-800">
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {activity.description}
                                                </h4>
                                                {activity.amount && (
                                                    <p className="text-sm text-green-600 dark:text-green-400">
                                                        {formatCurrency(activity.amount)}
                                                        {activity.commission && (
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                (Commission: {formatCurrency(activity.commission)})
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {formatDateTime(activity.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <Card>
                        <Card.Header>
                            <div className="flex items-center justify-between">
                                <Card.Title>Agent Properties</Card.Title>
                                <Link to={`/properties?agent=${agent.id}`}>
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
                                        <Table.Head>Days on Market</Table.Head>
                                        <Table.Head>Commission</Table.Head>
                                        <Table.Head>Actions</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {agent.recentProperties.map((property) => (
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
                                                <Badge variant={property.status === 'sold' ? 'success' : 'info'}>
                                                    {property.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-medium">
                                                    {formatCurrency(property.price)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>{property.daysOnMarket} days</Table.Cell>
                                            <Table.Cell>
                                                {property.commission ? (
                                                    <span className="text-green-600 font-medium">
                                                        {formatCurrency(property.commission)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Pending</span>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link
                                                    to={`/properties/${property.id}`}
                                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                                >
                                                    <span className="text-sm">View</span>
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Card.Content>
                    </Card>
                )}

                {activeTab === 'performance' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <Card.Header>
                                <Card.Title>Performance Metrics</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {agent.performance.successRate}%
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {agent.performance.responseTime}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {agent.performance.averageDaysToSell}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Days to Sell</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {agent.performance.repeatClientRate}%
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Repeat Clients</div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>Financial Summary</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                                        <span className="font-medium text-green-600">
                                            {formatCurrency(agent.earnings.thisMonth)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
                                        <span className="font-medium">
                                            {formatCurrency(agent.earnings.lastMonth)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Pending Commission</span>
                                        <span className="font-medium text-yellow-600">
                                            {formatCurrency(agent.earnings.pendingCommission)}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">Total Earned</span>
                                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                                {formatCurrency(agent.earnings.totalCommissionEarned)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Client Reviews</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-6">
                                {agent.recentReviews.map((review) => (
                                    <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {review.clientName}
                                                    </h4>
                                                    {getRatingStars(review.rating)}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                    "{review.comment}"
                                                </p>
                                                <div className="text-sm text-gray-500 dark:text-gray-500">
                                                    <span className="font-medium">{review.propertyTitle}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatDate(review.timestamp)}</span>
                                                </div>
                                            </div>
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
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {Object.entries(agent.verification).map(([key, verified]) => (
                                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="text-sm font-medium capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                        </span>
                                        {verified ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card.Content>
                    </Card>
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Agent Profile"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                defaultValue={agent.name}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                defaultValue={agent.email}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                defaultValue={agent.phone}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                defaultValue={agent.status}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            >
                                <option value="verified">Verified</option>
                                <option value="pending_verification">Pending Verification</option>
                                <option value="suspended">Suspended</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                        </label>
                        <textarea
                            rows={3}
                            defaultValue={agent.profile.bio}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
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

            {/* Suspend Modal */}
            <Modal
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                title="Suspend Agent"
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
                                    This will suspend the agent's account and prevent them from listing new properties.
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
                            placeholder="Explain the reason for suspending this agent..."
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuspendModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={() => setShowSuspendModal(false)}>
                        Suspend Agent
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AgentDetail// src/pages/Agents/AgentDetail.jsx
