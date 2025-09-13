// src/pages/Communications/Communications.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    BellIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    DevicePhoneMobileIcon,
    SpeakerWaveIcon,
    DocumentTextIcon,
    UserGroupIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    XCircleIcon,
    StarIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'
import AdvancedFilter from '@components/common/AdvancedFilter/AdvancedFilter'
import { useAdvancedFilter } from '@hooks/useAdvancedFilter'

// Mock Data
const mockNotifications = [
    {
        id: 'NOTIF-001',
        title: 'Welcome to Property Platform',
        message: 'Thank you for joining our platform. Complete your KYC verification to start listing properties.',
        type: 'push',
        channel: 'mobile',
        status: 'sent',
        recipients: 1245,
        opened: 892,
        clicked: 156,
        createdAt: '2024-01-20T10:30:00Z',
        sentAt: '2024-01-20T10:35:00Z',
        createdBy: 'Admin',
        targetAudience: 'new_users',
        priority: 'normal',
    },
    {
        id: 'EMAIL-001',
        title: 'Monthly Property Market Update',
        message: 'Check out the latest trends in the property market and discover new opportunities.',
        type: 'email',
        channel: 'email',
        status: 'scheduled',
        recipients: 3456,
        opened: 0,
        clicked: 0,
        createdAt: '2024-01-19T14:20:00Z',
        scheduledFor: '2024-01-22T09:00:00Z',
        createdBy: 'Marketing Team',
        targetAudience: 'active_agents',
        priority: 'low',
    },
    {
        id: 'SMS-001',
        title: 'Property Inquiry Alert',
        message: 'You have a new inquiry for your property listing. Respond quickly to increase your chances.',
        type: 'sms',
        channel: 'sms',
        status: 'sent',
        recipients: 234,
        opened: 234,
        clicked: 89,
        createdAt: '2024-01-20T16:45:00Z',
        sentAt: '2024-01-20T16:46:00Z',
        createdBy: 'System',
        targetAudience: 'property_owners',
        priority: 'high',
    },
    {
        id: 'NOTIF-002',
        title: 'KYC Document Required',
        message: 'Please upload your utility bill to complete KYC verification.',
        type: 'push',
        channel: 'mobile',
        status: 'failed',
        recipients: 45,
        opened: 0,
        clicked: 0,
        createdAt: '2024-01-19T11:30:00Z',
        sentAt: null,
        createdBy: 'System',
        targetAudience: 'pending_kyc_users',
        priority: 'medium',
        errorMessage: 'Invalid device tokens'
    },
]

const mockTemplates = [
    {
        id: 'TMPL-001',
        name: 'Welcome Message',
        type: 'push',
        subject: 'Welcome to Property Platform',
        content: 'Welcome {{user_name}} to our platform! Complete your profile to get started.',
        usage: 156,
        lastUsed: '2024-01-20T10:30:00Z',
        status: 'active',
        category: 'onboarding'
    },
    {
        id: 'TMPL-002',
        name: 'KYC Reminder',
        type: 'email',
        subject: 'Complete Your KYC Verification',
        content: 'Hi {{user_name}}, Your KYC verification is still pending. Please upload the required documents to continue using our services.',
        usage: 89,
        lastUsed: '2024-01-19T15:20:00Z',
        status: 'active',
        category: 'verification'
    },
    {
        id: 'TMPL-003',
        name: 'Property Approved',
        type: 'sms',
        subject: 'Property Listing Approved',
        content: 'Good news {{user_name}}! Your property "{{property_title}}" has been approved and is now live.',
        usage: 234,
        lastUsed: '2024-01-20T14:15:00Z',
        status: 'active',
        category: 'property_updates'
    },
    {
        id: 'TMPL-004',
        name: 'Commission Payment Alert',
        type: 'email',
        subject: 'Your Commission Payment is Ready',
        content: 'Hello {{user_name}}, Your commission of {{amount}} for property {{property_title}} has been processed.',
        usage: 67,
        lastUsed: '2024-01-18T12:00:00Z',
        status: 'active',
        category: 'payments'
    },
]

const mockCampaigns = [
    {
        id: 'CAMP-001',
        name: 'Q1 2024 Agent Onboarding',
        type: 'email_sequence',
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-03-31T23:59:59Z',
        totalRecipients: 567,
        sent: 342,
        opened: 256,
        clicked: 89,
        conversions: 23,
        budget: 50000,
        spent: 32500,
        description: 'Automated email sequence for new agent onboarding'
    },
    {
        id: 'CAMP-002',
        name: 'Property Market Newsletter',
        type: 'recurring_email',
        status: 'active',
        frequency: 'monthly',
        totalRecipients: 2345,
        sent: 2345,
        opened: 1876,
        clicked: 345,
        conversions: 67,
        budget: 25000,
        spent: 18750,
        description: 'Monthly newsletter with market trends and insights'
    },
    {
        id: 'CAMP-003',
        name: 'Holiday Property Promotion',
        type: 'push_campaign',
        status: 'completed',
        startDate: '2023-12-20T00:00:00Z',
        endDate: '2024-01-02T23:59:59Z',
        totalRecipients: 5678,
        sent: 5678,
        opened: 4532,
        clicked: 892,
        conversions: 134,
        budget: 75000,
        spent: 72300,
        description: 'Holiday season property promotion campaign'
    },
]

const mockStats = {
    totalSent: 15678,
    delivered: 14892,
    opened: 8934,
    clicked: 2345,
    openRate: 60.0,
    clickRate: 15.7,
    bounceRate: 5.0,
    unsubscribeRate: 2.3,
}

// Search fields and filters
const searchFields = [
    'title',
    'message',
    'createdBy',
    'targetAudience',
]

const filterOptions = [
    {
        key: 'type',
        label: 'Message Type',
        options: [
            { value: 'push', label: 'Push Notification' },
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'in_app', label: 'In-App' },
        ]
    },
    {
        key: 'status',
        label: 'Status',
        options: [
            { value: 'sent', label: 'Sent' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'draft', label: 'Draft' },
            { value: 'failed', label: 'Failed' },
        ]
    },
    {
        key: 'priority',
        label: 'Priority',
        options: [
            { value: 'high', label: 'High' },
            { value: 'normal', label: 'Normal' },
            { value: 'low', label: 'Low' },
        ]
    },
    {
        key: 'targetAudience',
        label: 'Target Audience',
        options: [
            { value: 'all_users', label: 'All Users' },
            { value: 'new_users', label: 'New Users' },
            { value: 'active_agents', label: 'Active Agents' },
            { value: 'property_owners', label: 'Property Owners' },
        ]
    },
]

const getStatusBadge = (status) => {
    const statusMap = {
        sent: { variant: 'success', label: 'Sent' },
        scheduled: { variant: 'warning', label: 'Scheduled' },
        draft: { variant: 'default', label: 'Draft' },
        failed: { variant: 'danger', label: 'Failed' },
        active: { variant: 'success', label: 'Active' },
        paused: { variant: 'warning', label: 'Paused' },
        completed: { variant: 'info', label: 'Completed' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
}

const getTypeBadge = (type) => {
    const typeMap = {
        push: { variant: 'primary', label: 'Push', icon: BellIcon },
        email: { variant: 'info', label: 'Email', icon: EnvelopeIcon },
        sms: { variant: 'success', label: 'SMS', icon: DevicePhoneMobileIcon },
        in_app: { variant: 'warning', label: 'In-App', icon: ChatBubbleLeftRightIcon },
        email_sequence: { variant: 'info', label: 'Email Sequence', icon: EnvelopeIcon },
        recurring_email: { variant: 'info', label: 'Newsletter', icon: DocumentTextIcon },
        push_campaign: { variant: 'primary', label: 'Push Campaign', icon: BellIcon },
    }

    const config = typeMap[type] || { variant: 'default', label: type, icon: BellIcon }
    const Icon = config.icon

    return (
        <div className="flex items-center space-x-1">
            <Icon className="h-3 w-3" />
            <Badge variant={config.variant} size="xs">{config.label}</Badge>
        </div>
    )
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount)
}

const Communications = () => {
    const [activeTab, setActiveTab] = useState('notifications')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [showCampaignModal, setShowCampaignModal] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [createType, setCreateType] = useState('push')

    const { filteredData, filterState, handleFiltersChange, stats } = useAdvancedFilter(
        mockNotifications,
        searchFields
    )

    const tabs = [
        { id: 'notifications', label: 'Messages', icon: BellIcon },
        { id: 'campaigns', label: 'Campaigns', icon: SpeakerWaveIcon },
        { id: 'templates', label: 'Templates', icon: DocumentTextIcon },
        { id: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
    ]

    const handleViewNotification = (notification) => {
        setSelectedNotification(notification)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Communications Center
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage notifications, campaigns, and user communications across all channels
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <Button variant="secondary" size="sm">
                        Export Analytics
                    </Button>
                    <Button size="sm" onClick={() => setShowCreateModal(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Message
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <SpeakerWaveIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.totalSent.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total Sent
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <EyeIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatPercentage(mockStats.openRate)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Open Rate
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatPercentage(mockStats.clickRate)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Click Rate
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatPercentage(mockStats.bounceRate)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Bounce Rate
                            </div>
                        </div>
                    </div>
                </Card>
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
                {activeTab === 'notifications' && (
                    <>
                        {/* Advanced Filter */}
                        <AdvancedFilter
                            searchFields={searchFields}
                            filters={filterOptions}
                            onFiltersChange={handleFiltersChange}
                            placeholder="Search notifications by title, message, creator..."
                            data={mockNotifications}
                        />

                        {/* No Results State */}
                        {stats.hasFilters && stats.filtered === 0 && (
                            <Card className="p-8 text-center">
                                <div className="text-gray-500 dark:text-gray-400">
                                    <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No messages found</h3>
                                    <p>Try adjusting your filters or search terms to find more messages.</p>
                                </div>
                            </Card>
                        )}

                        {/* Notifications Table */}
                        {filteredData.length > 0 && (
                            <Card>
                                <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1400px' }}>
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[350px]">
                                                    Message
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                                    Performance
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[160px]">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredData.map((notification, index) => (
                                                <tr key={notification.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                                                    }`}>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {notification.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                                                                {notification.message}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {notification.targetAudience.replace(/_/g, ' ')} • {notification.createdBy}
                                                            </div>
                                                            {notification.errorMessage && (
                                                                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                                    Error: {notification.errorMessage}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getTypeBadge(notification.type)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(notification.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="text-center">
                                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                                        {notification.recipients}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Sent
                                                                    </div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="font-medium text-blue-600">
                                                                        {notification.opened}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Opened
                                                                    </div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="font-medium text-green-600">
                                                                        {notification.clicked}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Clicked
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            <div>{formatDate(notification.createdAt)}</div>
                                                            {notification.scheduledFor && (
                                                                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                                    Scheduled: {formatDate(notification.scheduledFor)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button
                                                                onClick={() => handleViewNotification(notification)}
                                                                className="text-primary-600 hover:text-primary-500 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                            >
                                                                <EyeIcon className="h-4 w-4" />
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors">
                                                                <PencilIcon className="h-4 w-4" />
                                                            </button>
                                                            {notification.status === 'failed' && (
                                                                <button className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                                                                    <ArrowTrendingUpIcon className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            <button className="text-red-600 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
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
                    </>
                )}

                {activeTab === 'campaigns' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Marketing Campaigns</h3>
                            <Button size="sm" onClick={() => setShowCampaignModal(true)}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                New Campaign
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {mockCampaigns.map((campaign) => (
                                <Card key={campaign.id}>
                                    <Card.Header>
                                        <div className="flex items-center justify-between">
                                            <Card.Title>{campaign.name}</Card.Title>
                                            {getStatusBadge(campaign.status)}
                                        </div>
                                    </Card.Header>
                                    <Card.Content>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                {getTypeBadge(campaign.type)}
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {campaign.frequency && `• ${campaign.frequency}`}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {campaign.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Recipients</span>
                                                        <span className="font-medium">{campaign.totalRecipients.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Sent</span>
                                                        <span className="font-medium">{campaign.sent.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Opened</span>
                                                        <span className="font-medium text-blue-600">{campaign.opened.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Clicked</span>
                                                        <span className="font-medium text-green-600">{campaign.clicked.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Conversions</span>
                                                        <span className="font-medium text-purple-600">{campaign.conversions}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500 dark:text-gray-400">Budget</span>
                                                        <span className="font-medium">{formatCurrency(campaign.budget).replace('NGN', '₦')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {campaign.startDate && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                </div>
                                            )}

                                            <div className="flex space-x-2">
                                                <Button size="xs" variant="secondary" className="flex-1">
                                                    <EyeIcon className="h-3 w-3 mr-1" />
                                                    View Details
                                                </Button>
                                                <Button size="xs" variant="secondary">
                                                    <PencilIcon className="h-3 w-3" />
                                                </Button>
                                                {campaign.status === 'active' ? (
                                                    <Button size="xs" variant="warning">
                                                        Pause
                                                    </Button>
                                                ) : campaign.status === 'paused' ? (
                                                    <Button size="xs" variant="success">
                                                        Resume
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Message Templates</h3>
                            <Button size="sm" onClick={() => setShowTemplateModal(true)}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                New Template
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {mockTemplates.map((template) => (
                                <Card key={template.id}>
                                    <Card.Content>
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {template.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {getTypeBadge(template.type)}
                                                        <Badge variant="default" size="xs">{template.category}</Badge>
                                                    </div>
                                                </div>
                                                {getStatusBadge(template.status)}
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                    {template.subject}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                                    {template.content}
                                                </p>
                                            </div>

                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>Used {template.usage} times</span>
                                                <span>Updated {formatDate(template.lastUsed)}</span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button size="xs" variant="secondary" className="flex-1">
                                                    Use Template
                                                </Button>
                                                <Button size="xs" variant="secondary">
                                                    <PencilIcon className="h-3 w-3" />
                                                </Button>
                                                <Button size="xs" variant="secondary">
                                                    <TrashIcon className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <Card.Header>
                                <Card.Title>Performance Overview</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">{mockStats.delivered.toLocaleString()}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Delivered</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{mockStats.opened.toLocaleString()}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Opened</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">{mockStats.clicked.toLocaleString()}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Clicked</div>
                                        </div>
                                        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-red-600">{formatPercentage(mockStats.unsubscribeRate)}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Unsubscribed</div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>Channel Performance</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <BellIcon className="h-5 w-5 text-blue-500" />
                                            <span className="font-medium">Push Notifications</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">78.5%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <EnvelopeIcon className="h-5 w-5 text-green-500" />
                                            <span className="font-medium">Email</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">45.2%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <DevicePhoneMobileIcon className="h-5 w-5 text-purple-500" />
                                            <span className="font-medium">SMS</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">95.8%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Delivery Rate</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-500" />
                                            <span className="font-medium">In-App</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">62.1%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Engagement Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        {/* Best Performing Messages */}
                        <Card className="lg:col-span-2">
                            <Card.Header>
                                <Card.Title>Top Performing Messages</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    {mockNotifications.slice(0, 3).map((notification, index) => (
                                        <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${index === 0 ? 'bg-yellow-500' :
                                                    index === 1 ? 'bg-gray-400' :
                                                        'bg-orange-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {notification.recipients} recipients • {((notification.opened / notification.recipients) * 100).toFixed(1)}% open rate
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {notification.clicked}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Clicks
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}
            </div>

            {/* Create Message Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Message"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message Type
                        </label>
                        <select
                            value={createType}
                            onChange={(e) => setCreateType(e.target.value)}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="push">Push Notification</option>
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="in_app">In-App Message</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Target Audience
                        </label>
                        <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                            <option value="all_users">All Users</option>
                            <option value="new_users">New Users</option>
                            <option value="active_agents">Active Agents</option>
                            <option value="property_owners">Property Owners</option>
                            <option value="custom">Custom Segment</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title/Subject
                        </label>
                        <input
                            type="text"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter message title..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message Content
                        </label>
                        <textarea
                            rows={4}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter your message content..."
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Use variables like {`{{ user_name }}, {{ property_title }}`} for personalization
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Priority
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Schedule
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="now">Send Now</option>
                                <option value="schedule">Schedule for Later</option>
                                <option value="draft">Save as Draft</option>
                            </select>
                        </div>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowCreateModal(false)}>
                        Create Message
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Template Modal */}
            <Modal
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                title="Create Message Template"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Template Name
                            </label>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="Enter template name..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Template Type
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="push">Push Notification</option>
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Subject Line
                        </label>
                        <input
                            type="text"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter subject line..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Template Content
                        </label>
                        <textarea
                            rows={6}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter template content with variables like {{user_name}}, {{property_title}}..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                            <option value="onboarding">Onboarding</option>
                            <option value="verification">Verification</option>
                            <option value="property_updates">Property Updates</option>
                            <option value="payments">Payments</option>
                            <option value="marketing">Marketing</option>
                            <option value="system">System Alerts</option>
                        </select>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowTemplateModal(false)}>
                        Create Template
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Campaign Modal */}
            <Modal
                isOpen={showCampaignModal}
                onClose={() => setShowCampaignModal(false)}
                title="Create Marketing Campaign"
                size="xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Campaign Name
                            </label>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="Enter campaign name..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Campaign Type
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="email_sequence">Email Sequence</option>
                                <option value="recurring_email">Recurring Email</option>
                                <option value="push_campaign">Push Campaign</option>
                                <option value="multi_channel">Multi-Channel</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Campaign Description
                        </label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Describe your campaign goals and strategy..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Target Audience
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="all_users">All Users</option>
                                <option value="new_users">New Users</option>
                                <option value="active_agents">Active Agents</option>
                                <option value="property_owners">Property Owners</option>
                                <option value="inactive_users">Inactive Users</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Budget (₦)
                            </label>
                            <input
                                type="number"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="Enter campaign budget..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCampaignModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowCampaignModal(false)}>
                        Create Campaign
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Communications