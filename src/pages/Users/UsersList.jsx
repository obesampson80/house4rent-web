// src/pages/Users/UsersList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    UsersIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    UserPlusIcon,
    ArrowDownTrayIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'
import UserForm from '@components/forms/UserForm'
import { UserStatusModal, SendNotificationModal } from '@components/forms/QuickActionForms'


// Mock Users Data
const mockUsers = [
    {
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
    },
    {
        id: 'USR-002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+234 802 345 6789',
        role: 'landlord',
        status: 'active',
        kycStatus: 'pending_review',
        joinedAt: '2024-01-10T09:15:00Z',
        lastActivity: '2024-01-19T16:45:00Z',
        propertiesListed: 5,
        totalEarnings: 2500000,
        avatar: null,
        location: 'Abuja, Nigeria',
        verificationLevel: 'level_2',
    },
    {
        id: 'USR-003',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+234 803 456 7890',
        role: 'tenant',
        status: 'suspended',
        kycStatus: 'rejected',
        joinedAt: '2024-01-05T11:20:00Z',
        lastActivity: '2024-01-18T10:30:00Z',
        propertiesListed: 0,
        totalEarnings: 0,
        avatar: null,
        location: 'Port Harcourt, Nigeria',
        verificationLevel: 'level_1',
    },
    {
        id: 'USR-004',
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        phone: '+234 804 567 8901',
        role: 'property_seeker',
        status: 'active',
        kycStatus: 'approved',
        joinedAt: '2024-01-08T15:45:00Z',
        lastActivity: '2024-01-20T12:15:00Z',
        propertiesListed: 0,
        totalEarnings: 0,
        avatar: null,
        location: 'Kano, Nigeria',
        verificationLevel: 'level_3',
    },
]

const mockStats = {
    total: 2456,
    active: 2234,
    suspended: 34,
    pendingKyc: 188,
    agents: 156,
    landlords: 289,
    tenants: 1823,
    propertySeekersX: 188,
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
        pending_review: { variant: 'warning', label: 'Pending' },
        rejected: { variant: 'danger', label: 'Rejected' },
        not_started: { variant: 'default', label: 'Not Started' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const getRoleBadge = (role) => {
    const roleMap = {
        agent: { variant: 'primary', label: 'Agent' },
        landlord: { variant: 'info', label: 'Landlord' },
        tenant: { variant: 'success', label: 'Tenant' },
        property_seeker: { variant: 'warning', label: 'Property Seeker' },
        admin: { variant: 'danger', label: 'Admin' },
    }

    const config = roleMap[role] || { variant: 'default', label: role }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const getVerificationLevel = (level) => {
    const levels = {
        level_1: { dots: 1, color: 'bg-red-400' },
        level_2: { dots: 2, color: 'bg-yellow-400' },
        level_3: { dots: 3, color: 'bg-green-400' },
        level_4: { dots: 4, color: 'bg-blue-400' },
        level_5: { dots: 5, color: 'bg-purple-400' },
    }

    const config = levels[level] || { dots: 0, color: 'bg-gray-400' }

    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index < config.dots ? config.color : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                />
            ))}
        </div>
    )
}

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
}

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount)
}

const UsersList = () => {
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [selectedRole, setSelectedRole] = useState('all')
    const [selectedKyc, setSelectedKyc] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [bulkAction, setBulkAction] = useState('')
    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedUserForStatus, setSelectedUserForStatus] = useState(null)
    const [showNotificationModal, setShowNotificationModal] = useState(false)
    const [selectedUsersForNotification, setSelectedUsersForNotification] = useState([])

    // Add handlers
    const handleAddUser = () => {
        setEditingUser(null)
        setShowUserForm(true)
    }

    const handleEditUser = (user) => {
        setEditingUser(user)
        setShowUserForm(true)
    }

    const handleUserStatusChange = (user) => {
        setSelectedUserForStatus(user)
        setShowStatusModal(true)
    }

    const handleSendNotification = () => {
        setSelectedUsersForNotification(selectedUsers)
        setShowNotificationModal(true)
    }

    const handleUserStatusUpdate = async (statusData) => {
        console.log('Updating user status:', statusData)
        // API call and refresh
    }

    const handleNotificationSend = async (notificationData) => {
        console.log('Sending notification:', notificationData)
        // API call
        setSelectedUsersForNotification([])
    }


    const filteredUsers = mockUsers.filter(user => {
        const statusMatch = selectedFilter === 'all' || user.status === selectedFilter
        const roleMatch = selectedRole === 'all' || user.role === selectedRole
        const kycMatch = selectedKyc === 'all' || user.kycStatus === selectedKyc
        const searchMatch = searchQuery === '' ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)

        return statusMatch && roleMatch && kycMatch && searchMatch
    })

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(filteredUsers.map(user => user.id))
        } else {
            setSelectedUsers([])
        }
    }

    const handleSelectUser = (userId, checked) => {
        if (checked) {
            setSelectedUsers(prev => [...prev, userId])
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId))
        }
    }

    const handleBulkAction = (action) => {
        setBulkAction(action)
        setShowBulkModal(true)
    }

    const executeBulkAction = () => {
        console.log(`Executing ${bulkAction} on users:`, selectedUsers)
        setShowBulkModal(false)
        setSelectedUsers([])
        setBulkAction('')
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Users Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage user accounts, roles, and verification status
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    {selectedUsers.length > 0 && (
                        <>
                            <Button variant="secondary" onClick={handleSendNotification}>
                                Send Notification ({selectedUsers.length})
                            </Button>
                            <Button variant="secondary" onClick={handleBulkActions}>
                                Bulk Actions ({selectedUsers.length})
                            </Button>
                        </>
                    )}
                    <Button variant="secondary" size="sm">
                        Export
                    </Button>
                    <Button size="sm" onClick={handleAddUser}>
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <UsersIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.total.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total Users
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.active.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Active Users
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
                                {mockStats.pendingKyc}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Pending KYC
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <UserCircleIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.agents}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Active Agents
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex items-center space-x-3">
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="block w-32 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="block w-36 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="agent">Agents</option>
                                    <option value="landlord">Landlords</option>
                                    <option value="tenant">Tenants</option>
                                    <option value="property_seeker">Property Seekers</option>
                                </select>

                                <select
                                    value={selectedKyc}
                                    onChange={(e) => setSelectedKyc(e.target.value)}
                                    className="block w-32 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="all">All KYC</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending_review">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedUsers.length > 0 && (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {selectedUsers.length} selected
                                </span>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleBulkAction('suspend')}
                                >
                                    Suspend
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleBulkAction('activate')}
                                >
                                    Activate
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleBulkAction('delete')}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Users Table - Simple Horizontal Scroll */}
                <style>
                    {`
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
`}
                </style>
                <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1200px' }}>
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[300px]">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                    KYC Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                    Verification
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                    Properties
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                    Last Activity
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                                        }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                    <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="ml-4 min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                    <EnvelopeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                    <PhoneIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{user.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getKycBadge(user.kycStatus)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {getVerificationLevel(user.verificationLevel)}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.verificationLevel.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {user.propertiesListed}
                                            </div>
                                            {user.totalEarnings > 0 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatCurrency(user.totalEarnings)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                            <span>{formatTimeAgo(user.lastActivity)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link
                                                to={`/users/${user.id}`}
                                                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                title="View User"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                            <button
                                                className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                                                title="Edit User"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            {user.status === 'active' ? (
                                                <button
                                                    className="text-yellow-600 hover:text-yellow-500 p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                                    title="Suspend User"
                                                >
                                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-green-600 hover:text-green-500 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                    title="Activate User"
                                                >
                                                    <CheckIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                className="text-red-600 hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="Delete User"
                                            >
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
                            Showing 1 to {filteredUsers.length} of {filteredUsers.length} results
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

            {/* Bulk Action Modal */}
            <Modal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                title={`Bulk ${bulkAction}`}
            >
                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to {bulkAction} {selectedUsers.length} selected user(s)?
                        This action cannot be undone.
                    </p>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBulkModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant={bulkAction === 'delete' ? 'danger' : 'primary'}
                        onClick={executeBulkAction}
                    >
                        {bulkAction === 'delete' ? 'Delete' : 'Confirm'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* User Form Modal */}
            {showUserForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowUserForm(false)} />
                    <div className="relative">
                        <UserForm
                            mode={editingUser ? 'edit' : 'create'}
                            initialData={editingUser}
                            onClose={() => setShowUserForm(false)}
                            onSave={() => {
                                setShowUserForm(false)
                                // Refresh data
                            }}
                        />
                    </div>
                </div>
            )}

            {/* User Status Modal */}
            <UserStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                user={selectedUserForStatus}
                onStatusChange={handleUserStatusUpdate}
            />

            {/* Send Notification Modal */}
            <SendNotificationModal
                isOpen={showNotificationModal}
                onClose={() => setShowNotificationModal(false)}
                recipients={selectedUsersForNotification}
                onSendNotification={handleNotificationSend}
            />
        </div>
    )
}

export default UsersList