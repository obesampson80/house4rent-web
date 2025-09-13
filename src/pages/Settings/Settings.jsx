// src/pages/Settings/Settings.jsx
import { useState } from 'react'
import {
    Cog6ToothIcon,
    BellIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    UserGroupIcon,
    KeyIcon,
    EnvelopeIcon,
    DevicePhoneMobileIcon,
    CloudIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Modal from '@components/common/Modal/Modal'

// Mock Data
const mockSystemSettings = {
    platformName: 'Property Admin',
    platformUrl: 'https://admin.property.ng',
    defaultCommissionRate: 5.0,
    defaultCurrency: 'NGN',
    timezone: 'Africa/Lagos',
    language: 'English',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    phoneVerificationRequired: true,
    kycRequired: true,
}

const mockNotificationSettings = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newUserSignup: true,
    newPropertyListing: true,
    kycSubmission: true,
    paymentReceived: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
}

const mockIntegrations = [
    {
        id: 'paystack',
        name: 'Paystack',
        description: 'Payment processing and gateway',
        status: 'connected',
        category: 'payments',
        icon: '💳',
        lastSync: '2024-01-20T10:30:00Z',
        config: {
            publicKey: 'pk_test_***************',
            secretKey: '•••••••••••••••••••',
            webhookUrl: 'https://api.property.ng/webhooks/paystack',
        }
    },
    {
        id: 'nin_verification',
        name: 'NIN Verification Service',
        description: 'National Identification Number verification',
        status: 'connected',
        category: 'kyc',
        icon: '🆔',
        lastSync: '2024-01-20T08:45:00Z',
        config: {
            apiKey: '•••••••••••••••••••',
            endpoint: 'https://api.nin.gov.ng/v1',
        }
    },
    {
        id: 'bvn_verification',
        name: 'BVN Verification Service',
        description: 'Bank Verification Number verification',
        status: 'connected',
        category: 'kyc',
        icon: '🏦',
        lastSync: '2024-01-19T16:20:00Z',
        config: {
            apiKey: '•••••••••••••••••••',
            endpoint: 'https://api.bvn.ng/v2',
        }
    },
    {
        id: 'cloudinary',
        name: 'Cloudinary',
        description: 'Image and video management',
        status: 'disconnected',
        category: 'storage',
        icon: '☁️',
        lastSync: null,
        config: null,
    },
    {
        id: 'sendgrid',
        name: 'SendGrid',
        description: 'Email delivery service',
        status: 'connected',
        category: 'communications',
        icon: '📧',
        lastSync: '2024-01-20T11:15:00Z',
        config: {
            apiKey: '•••••••••••••••••••',
            senderEmail: 'noreply@property.ng',
            senderName: 'Property Platform',
        }
    },
]

const mockUsers = [
    {
        id: 'USR-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Super Admin',
        status: 'active',
        lastLogin: '2024-01-20T14:30:00Z',
        permissions: ['all'],
    },
    {
        id: 'USR-002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Admin',
        status: 'active',
        lastLogin: '2024-01-19T16:45:00Z',
        permissions: ['users', 'properties', 'payments'],
    },
    {
        id: 'USR-003',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'Manager',
        status: 'active',
        lastLogin: '2024-01-18T10:20:00Z',
        permissions: ['properties', 'reports'],
    },
]

const mockAuditLogs = [
    {
        id: 'LOG-001',
        action: 'User Created',
        user: 'john.doe@example.com',
        target: 'jane.smith@example.com',
        timestamp: '2024-01-20T14:30:00Z',
        details: 'Created new admin user',
        ip: '192.168.1.100',
    },
    {
        id: 'LOG-002',
        action: 'Settings Updated',
        user: 'jane.smith@example.com',
        target: 'System Settings',
        timestamp: '2024-01-20T11:15:00Z',
        details: 'Updated commission rate from 4% to 5%',
        ip: '192.168.1.101',
    },
    {
        id: 'LOG-003',
        action: 'Integration Connected',
        user: 'john.doe@example.com',
        target: 'Paystack',
        timestamp: '2024-01-19T16:45:00Z',
        details: 'Connected Paystack payment gateway',
        ip: '192.168.1.100',
    },
]

const getStatusBadge = (status) => {
    const statusMap = {
        connected: { variant: 'success', label: 'Connected' },
        disconnected: { variant: 'danger', label: 'Disconnected' },
        pending: { variant: 'warning', label: 'Pending' },
        error: { variant: 'danger', label: 'Error' },
        active: { variant: 'success', label: 'Active' },
        inactive: { variant: 'default', label: 'Inactive' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const getRoleBadge = (role) => {
    const roleMap = {
        'Super Admin': { variant: 'danger', label: 'Super Admin' },
        'Admin': { variant: 'warning', label: 'Admin' },
        'Manager': { variant: 'info', label: 'Manager' },
        'User': { variant: 'default', label: 'User' },
    }

    const config = roleMap[role] || { variant: 'default', label: role }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
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

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general')
    const [systemSettings, setSystemSettings] = useState(mockSystemSettings)
    const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showUserModal, setShowUserModal] = useState(false)
    const [showIntegrationModal, setShowIntegrationModal] = useState(false)
    const [selectedIntegration, setSelectedIntegration] = useState(null)
    const [showApiKey, setShowApiKey] = useState({})

    const tabs = [
        { id: 'general', label: 'General', icon: Cog6ToothIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon },
        { id: 'integrations', label: 'Integrations', icon: GlobeAltIcon },
        { id: 'users', label: 'Admin Users', icon: UserGroupIcon },
        { id: 'audit', label: 'Audit Logs', icon: DocumentTextIcon },
    ]

    const handleSystemSettingChange = (key, value) => {
        setSystemSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleNotificationSettingChange = (key, value) => {
        setNotificationSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleConnectIntegration = (integration) => {
        setSelectedIntegration(integration)
        setShowIntegrationModal(true)
    }

    const toggleApiKeyVisibility = (integrationId, field) => {
        setShowApiKey(prev => ({
            ...prev,
            [`${integrationId}-${field}`]: !prev[`${integrationId}-${field}`]
        }))
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        System Settings
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Configure platform settings, integrations, and system preferences
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Button size="sm">
                        Save All Changes
                    </Button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
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
                {activeTab === 'general' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <Card.Header>
                                <Card.Title>Platform Settings</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Platform Name
                                        </label>
                                        <input
                                            type="text"
                                            value={systemSettings.platformName}
                                            onChange={(e) => handleSystemSettingChange('platformName', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Platform URL
                                        </label>
                                        <input
                                            type="url"
                                            value={systemSettings.platformUrl}
                                            onChange={(e) => handleSystemSettingChange('platformUrl', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Default Commission Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={systemSettings.defaultCommissionRate}
                                            onChange={(e) => handleSystemSettingChange('defaultCommissionRate', parseFloat(e.target.value))}
                                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Default Currency
                                            </label>
                                            <select
                                                value={systemSettings.defaultCurrency}
                                                onChange={(e) => handleSystemSettingChange('defaultCurrency', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            >
                                                <option value="NGN">Nigerian Naira (NGN)</option>
                                                <option value="USD">US Dollar (USD)</option>
                                                <option value="GBP">British Pound (GBP)</option>
                                                <option value="EUR">Euro (EUR)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Timezone
                                            </label>
                                            <select
                                                value={systemSettings.timezone}
                                                onChange={(e) => handleSystemSettingChange('timezone', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            >
                                                <option value="Africa/Lagos">Africa/Lagos</option>
                                                <option value="UTC">UTC</option>
                                                <option value="America/New_York">America/New_York</option>
                                                <option value="Europe/London">Europe/London</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>System Controls</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">Maintenance Mode</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Temporarily disable user access</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleSystemSettingChange('maintenanceMode', !systemSettings.maintenanceMode)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <UserGroupIcon className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">User Registration</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Allow new user signups</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleSystemSettingChange('registrationEnabled', !systemSettings.registrationEnabled)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${systemSettings.registrationEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${systemSettings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <EnvelopeIcon className="h-5 w-5 text-purple-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">Email Verification</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Require email verification for new users</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleSystemSettingChange('emailVerificationRequired', !systemSettings.emailVerificationRequired)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${systemSettings.emailVerificationRequired ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${systemSettings.emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">KYC Verification</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Require KYC for property listing</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleSystemSettingChange('kycRequired', !systemSettings.kycRequired)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${systemSettings.kycRequired ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${systemSettings.kycRequired ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <Card.Header>
                                <Card.Title>Notification Channels</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Send notifications via email</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleNotificationSettingChange('emailNotifications', !notificationSettings.emailNotifications)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${notificationSettings.emailNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <BellIcon className="h-5 w-5 text-purple-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Send push notifications to users</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleNotificationSettingChange('pushNotifications', !notificationSettings.pushNotifications)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${notificationSettings.pushNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <DevicePhoneMobileIcon className="h-5 w-5 text-green-500" />
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Send SMS notifications</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleNotificationSettingChange('smsNotifications', !notificationSettings.smsNotifications)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${notificationSettings.smsNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>Event Notifications</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    {[
                                        { key: 'newUserSignup', label: 'New User Signup', description: 'Notify when new users register' },
                                        { key: 'newPropertyListing', label: 'New Property Listing', description: 'Notify when properties are listed' },
                                        { key: 'kycSubmission', label: 'KYC Submission', description: 'Notify when KYC documents are submitted' },
                                        { key: 'paymentReceived', label: 'Payment Received', description: 'Notify when payments are processed' },
                                        { key: 'systemAlerts', label: 'System Alerts', description: 'Notify about system issues' },
                                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Send weekly summary reports' },
                                        { key: 'monthlyReports', label: 'Monthly Reports', description: 'Send monthly analytics reports' },
                                    ].map((setting) => (
                                        <div key={setting.key} className="flex items-center justify-between p-2">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{setting.label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleNotificationSettingChange(setting.key, !notificationSettings[setting.key])}
                                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${notificationSettings[setting.key] ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition-transform ${notificationSettings[setting.key] ? 'translate-x-5' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <Card>
                            <Card.Header>
                                <Card.Title>Password Policy</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Minimum Password Length
                                            </label>
                                            <input
                                                type="number"
                                                min="6"
                                                max="32"
                                                defaultValue="8"
                                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Session Timeout (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                min="5"
                                                max="480"
                                                defaultValue="60"
                                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { label: 'Require uppercase letters', defaultChecked: true },
                                            { label: 'Require lowercase letters', defaultChecked: true },
                                            { label: 'Require numbers', defaultChecked: true },
                                            { label: 'Require special characters', defaultChecked: false },
                                            { label: 'Prevent common passwords', defaultChecked: true },
                                            { label: 'Enable two-factor authentication', defaultChecked: false },
                                        ].map((policy, index) => (
                                            <div key={index} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={policy.defaultChecked}
                                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                                                />
                                                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {policy.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card>
                            <Card.Header>
                                <Card.Title>API Security</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <div className="flex">
                                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    API Rate Limiting
                                                </div>
                                                <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                    Current limit: 1000 requests per hour per IP
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setShowPasswordModal(true)}
                                    >
                                        <KeyIcon className="h-4 w-4 mr-2" />
                                        Generate New API Key
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {mockIntegrations.map((integration) => (
                                <Card key={integration.id}>
                                    <Card.Content>
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-2xl">{integration.icon}</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {integration.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {integration.description}
                                                        </div>
                                                        <Badge variant="default" size="xs" className="mt-1">
                                                            {integration.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {getStatusBadge(integration.status)}
                                            </div>

                                            {integration.config && (
                                                <div className="space-y-2">
                                                    {Object.entries(integration.config).map(([key, value]) => (
                                                        <div key={key} className="flex items-center justify-between text-sm">
                                                            <span className="text-gray-500 dark:text-gray-400 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1')}:
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-mono text-xs">
                                                                    {key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') ?
                                                                        (showApiKey[`${integration.id}-${key}`] ? value : '•••••••••••••••••••')
                                                                        : value
                                                                    }
                                                                </span>
                                                                {(key.toLowerCase().includes('key') || key.toLowerCase().includes('secret')) && (
                                                                    <button
                                                                        onClick={() => toggleApiKeyVisibility(integration.id, key)}
                                                                        className="text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        {showApiKey[`${integration.id}-${key}`] ?
                                                                            <EyeSlashIcon className="h-3 w-3" /> :
                                                                            <EyeIcon className="h-3 w-3" />
                                                                        }
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {integration.lastSync && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Last synced: {formatDate(integration.lastSync)}
                                                </div>
                                            )}

                                            <div className="flex space-x-2">
                                                {integration.status === 'connected' ? (
                                                    <>
                                                        <Button size="xs" variant="secondary" className="flex-1">
                                                            <PencilIcon className="h-3 w-3 mr-1" />
                                                            Configure
                                                        </Button>
                                                        <Button size="xs" variant="danger">
                                                            Disconnect
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="xs"
                                                        className="flex-1"
                                                        onClick={() => handleConnectIntegration(integration)}
                                                    >
                                                        <PlusIcon className="h-3 w-3 mr-1" />
                                                        Connect
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Admin Users</h3>
                            <Button size="sm" onClick={() => setShowUserModal(true)}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Admin User
                            </Button>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Last Login
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {mockUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(user.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(user.lastLogin)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button className="text-primary-600 hover:text-primary-500 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
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
                        </Card>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Recent Activity</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="space-y-4">
                                {mockAuditLogs.map((log) => (
                                    <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {log.action}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {log.details}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {log.user} • {formatDate(log.timestamp)} • {log.ip}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Content>
                    </Card>
                )}
            </div>

            {/* Modals */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                title="Generate New API Key"
                size="md"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                            <div className="ml-3">
                                <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Warning
                                </div>
                                <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Generating a new API key will invalidate the current one. Make sure to update all integrations.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Key Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Production API Key"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowPasswordModal(false)}>
                        Generate Key
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                title="Add Admin User"
                size="md"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Role
                        </label>
                        <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowUserModal(false)}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                isOpen={showIntegrationModal}
                onClose={() => setShowIntegrationModal(false)}
                title={`Connect ${selectedIntegration?.name}`}
                size="md"
            >
                {selectedIntegration && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-2xl">{selectedIntegration.icon}</div>
                            <div>
                                <div className="font-medium">{selectedIntegration.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedIntegration.description}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                API Key
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your API key..."
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>
                        {selectedIntegration.category === 'payments' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Secret Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your secret key..."
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>
                        )}
                    </div>
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowIntegrationModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowIntegrationModal(false)}>
                        Connect Integration
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Settings