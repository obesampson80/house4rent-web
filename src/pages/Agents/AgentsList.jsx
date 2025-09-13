// src/pages/Agents/AgentsList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    UserGroupIcon,
    StarIcon,
    TrophyIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    ChatBubbleLeftRightIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    ChartBarIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import AdvancedFilter from '@components/common/AdvancedFilter/AdvancedFilter'
import { useAdvancedFilter } from '@hooks/useAdvancedFilter'

// Enhanced Mock Agents Data
const mockAgents = [
    {
        id: 'AGT-001',
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+234 801 234 5678',
        location: 'Lagos, Nigeria',
        specialization: ['Residential', 'Commercial'],
        status: 'verified',
        joinedAt: '2023-08-15T10:30:00Z',
        createdAt: '2023-08-15T10:30:00Z',
        lastActivity: '2024-01-20T14:22:00Z',
        properties: {
            listed: 25,
            sold: 18,
            active: 7,
        },
        performance: {
            rating: 4.8,
            reviews: 156,
            responseTime: '15 min',
            successRate: 85,
        },
        earnings: {
            thisMonth: 450000,
            total: 2800000,
            commission: 0.05,
        },
        verification: {
            documents: true,
            interview: true,
            background: true,
            references: true,
        },
        avatar: null,
        tier: 'platinum',
        experienceYears: 5,
    },
    {
        id: 'AGT-002',
        name: 'Rachel Adams',
        email: 'rachel.adams@example.com',
        phone: '+234 802 345 6789',
        location: 'Abuja, Nigeria',
        specialization: ['Luxury Properties', 'Land'],
        status: 'pending_verification',
        joinedAt: '2024-01-10T09:15:00Z',
        createdAt: '2024-01-10T09:15:00Z',
        lastActivity: '2024-01-19T16:45:00Z',
        properties: {
            listed: 8,
            sold: 3,
            active: 5,
        },
        performance: {
            rating: 4.2,
            reviews: 32,
            responseTime: '25 min',
            successRate: 65,
        },
        earnings: {
            thisMonth: 180000,
            total: 580000,
            commission: 0.04,
        },
        verification: {
            documents: true,
            interview: false,
            background: true,
            references: false,
        },
        avatar: null,
        tier: 'gold',
        experienceYears: 2,
    },
    {
        id: 'AGT-003',
        name: 'Thomas Brown',
        email: 'thomas.brown@example.com',
        phone: '+234 803 456 7890',
        location: 'Port Harcourt, Nigeria',
        specialization: ['Residential'],
        status: 'suspended',
        joinedAt: '2023-12-05T11:20:00Z',
        createdAt: '2023-12-05T11:20:00Z',
        lastActivity: '2024-01-15T10:30:00Z',
        properties: {
            listed: 12,
            sold: 5,
            active: 2,
        },
        performance: {
            rating: 3.5,
            reviews: 87,
            responseTime: '45 min',
            successRate: 45,
        },
        earnings: {
            thisMonth: 0,
            total: 850000,
            commission: 0.03,
        },
        verification: {
            documents: true,
            interview: true,
            background: false,
            references: true,
        },
        avatar: null,
        tier: 'bronze',
        experienceYears: 1,
    },
]

const mockStats = {
    total: 156,
    verified: 134,
    pending: 15,
    suspended: 7,
    activeListings: 234,
    totalSales: 892,
    averageRating: 4.3,
    totalCommission: 15600000,
}

// Define search fields for agents
const searchFields = [
    'name',
    'email',
    'phone',
    'location',
    'specialization',
    'tier'
]

// Define filter options for agents
const filterOptions = [
    {
        key: 'status',
        label: 'Status',
        options: [
            { value: 'verified', label: 'Verified' },
            { value: 'pending_verification', label: 'Pending Verification' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'rejected', label: 'Rejected' },
        ]
    },
    {
        key: 'specialization',
        label: 'Specialization',
        options: [
            { value: 'residential', label: 'Residential' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'luxury', label: 'Luxury Properties' },
            { value: 'land', label: 'Land' },
        ]
    },
    {
        key: 'tier',
        label: 'Agent Tier',
        options: [
            { value: 'bronze', label: 'Bronze' },
            { value: 'silver', label: 'Silver' },
            { value: 'gold', label: 'Gold' },
            { value: 'platinum', label: 'Platinum' },
        ]
    },
    {
        key: 'performance.rating',
        label: 'Rating',
        options: [
            { value: '4.5', label: '4.5+ Stars' },
            { value: '4.0', label: '4.0+ Stars' },
            { value: '3.5', label: '3.5+ Stars' },
            { value: '3.0', label: '3.0+ Stars' },
        ]
    },
    {
        key: 'experienceYears',
        label: 'Experience',
        options: [
            { value: '5', label: '5+ Years' },
            { value: '3', label: '3+ Years' },
            { value: '1', label: '1+ Years' },
            { value: '0', label: 'New Agent' },
        ]
    }
]

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

const getTierBadge = (tier) => {
    const tierMap = {
        platinum: { variant: 'primary', label: 'Platinum' },
        gold: { variant: 'warning', label: 'Gold' },
        silver: { variant: 'default', label: 'Silver' },
        bronze: { variant: 'secondary', label: 'Bronze' },
    }

    const config = tierMap[tier] || { variant: 'default', label: tier }
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

const getPerformanceIndicator = (successRate) => {
    let color = 'bg-red-400'
    if (successRate >= 80) color = 'bg-green-400'
    else if (successRate >= 60) color = 'bg-yellow-400'

    return (
        <div className="flex items-center">
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full`}
                    style={{ width: `${successRate}%` }}
                />
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {successRate}%
            </span>
        </div>
    )
}

const getVerificationProgress = (verification) => {
    const total = Object.keys(verification).length
    const completed = Object.values(verification).filter(Boolean).length
    const percentage = (completed / total) * 100

    return (
        <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
                {Object.entries(verification).map(([key, value]) => (
                    <div
                        key={key}
                        className={`w-3 h-3 rounded-full ${value ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        title={key}
                    />
                ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {completed}/{total}
            </span>
        </div>
    )
}

const formatCurrency = (amount) => {
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

const AgentsList = () => {
    const { filteredData, filterState, handleFiltersChange, stats } = useAdvancedFilter(
        mockAgents,
        searchFields
    )

    // Calculate dynamic stats based on filtered data
    const dynamicStats = {
        total: stats.total,
        filtered: stats.filtered,
        verified: filteredData.filter(a => a.status === 'verified').length,
        pending: filteredData.filter(a => a.status === 'pending_verification').length,
        suspended: filteredData.filter(a => a.status === 'suspended').length,
        averageRating: filteredData.length > 0
            ? (filteredData.reduce((sum, agent) => sum + agent.performance.rating, 0) / filteredData.length)
            : 0,
        totalCommission: filteredData.reduce((sum, agent) => sum + agent.earnings.total, 0),
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Agents Management
                        {stats.hasFilters && (
                            <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                                ({stats.filtered} of {stats.total})
                            </span>
                        )}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage agent verification, performance, and commissions with advanced filtering
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <Button variant="secondary" size="sm">
                        Export Report ({stats.filtered})
                    </Button>
                    <Button size="sm">
                        Agent Analytics
                    </Button>
                </div>
            </div>

            {/* Dynamic Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <UserGroupIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.filtered}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {stats.hasFilters ? 'Filtered' : 'Total'} Agents
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
                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.verified}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Verified Agents
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <StarIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.averageRating.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Average Rating
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(dynamicStats.totalCommission).replace('NGN', '₦')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total Commission
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
                placeholder="Search agents by name, email, location, specialization..."
                data={mockAgents}
            />

            {/* No Results State */}
            {stats.hasFilters && stats.filtered === 0 && (
                <Card className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                        <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No agents found</h3>
                        <p>Try adjusting your filters or search terms to find more agents.</p>
                    </div>
                </Card>
            )}

            {/* Agents Table */}
            {filteredData.length > 0 && (
                <Card>
                    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1500px' }}>
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[250px]">
                                        Agent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Specialization
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                                        Performance
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Properties
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Earnings
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Verification
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Last Active
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredData.map((agent, index) => (
                                    <tr
                                        key={agent.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                        <UserGroupIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {agent.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                        <EnvelopeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        <span className="truncate">{agent.email}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                        <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        <span className="truncate">{agent.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                {getStatusBadge(agent.status)}
                                                {getTierBadge(agent.tier)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {agent.specialization.map((spec, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                        {spec}
                                                    </span>
                                                ))}
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {agent.experienceYears} years exp.
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                {getRatingStars(agent.performance.rating)}
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {agent.performance.reviews} reviews
                                                </div>
                                                {getPerformanceIndicator(agent.performance.successRate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-center">
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {agent.properties.listed}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Listed
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-medium text-green-600">
                                                            {agent.properties.sold}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Sold
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-medium text-blue-600">
                                                            {agent.properties.active}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Active
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(agent.earnings.thisMonth)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    This month
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Total: {formatCurrency(agent.earnings.total)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getVerificationProgress(agent.verification)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                                <span>{formatTimeAgo(agent.lastActivity)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Link
                                                    to={`/agents/${agent.id}`}
                                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                    title="View Agent"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="View Analytics"
                                                >
                                                    <ChartBarIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-500 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                    title="Message Agent"
                                                >
                                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                </button>
                                                {agent.status === 'verified' ? (
                                                    <button
                                                        className="text-yellow-600 hover:text-yellow-500 p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                                        title="Suspend Agent"
                                                    >
                                                        <ClockIcon className="h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-green-600 hover:text-green-500 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                        title="Verify Agent"
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    {/* Enhanced Pagination */}
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

            {/* Quick Actions - Context-aware based on filtered data */}
            <Card>
                <Card.Header>
                    <Card.Title>Quick Actions</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Button variant="secondary" className="justify-start">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Pending Verifications ({dynamicStats.pending})
                        </Button>
                        <Button variant="secondary" className="justify-start">
                            <TrophyIcon className="h-4 w-4 mr-2" />
                            Top Performers
                        </Button>
                        <Button variant="secondary" className="justify-start">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                            Commission Reports
                        </Button>
                        <Button variant="secondary" className="justify-start">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                            Send Notification
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        </div>
    )
}

export default AgentsList