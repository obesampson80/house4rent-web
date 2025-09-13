// src/pages/KYC/KYCDashboard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    DocumentTextIcon,
    UserIcon,
    IdentificationIcon,
    CreditCardIcon,
    HomeIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'

// Mock KYC data
const mockKYCQueue = [
    {
        id: 'KYC-001',
        user: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+234 801 234 5678',
            avatar: null,
        },
        submittedAt: '2024-01-15T10:30:00Z',
        status: 'pending_review',
        priority: 'high',
        documentsSubmitted: ['nin', 'bvn', 'utility_bill', 'selfie'],
        riskScore: 'low',
        completionPercentage: 95,
    },
    {
        id: 'KYC-002',
        user: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+234 802 345 6789',
            avatar: null,
        },
        submittedAt: '2024-01-15T09:15:00Z',
        status: 'documents_missing',
        priority: 'medium',
        documentsSubmitted: ['nin', 'selfie'],
        riskScore: 'medium',
        completionPercentage: 60,
    },
    {
        id: 'KYC-003',
        user: {
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+234 803 456 7890',
            avatar: null,
        },
        submittedAt: '2024-01-15T08:45:00Z',
        status: 'under_review',
        priority: 'low',
        documentsSubmitted: ['nin', 'bvn', 'utility_bill', 'selfie', 'bank_statement'],
        riskScore: 'low',
        completionPercentage: 100,
    },
]

const mockStats = {
    pendingReview: 15,
    underReview: 8,
    approved: 342,
    rejected: 23,
    documentsRequired: 12,
}

const getStatusBadge = (status) => {
    const statusMap = {
        pending_review: { variant: 'warning', label: 'Pending Review' },
        under_review: { variant: 'info', label: 'Under Review' },
        documents_missing: { variant: 'danger', label: 'Documents Missing' },
        approved: { variant: 'success', label: 'Approved' },
        rejected: { variant: 'danger', label: 'Rejected' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
}

const getPriorityBadge = (priority) => {
    const priorityMap = {
        high: { variant: 'danger', label: 'High' },
        medium: { variant: 'warning', label: 'Medium' },
        low: { variant: 'success', label: 'Low' },
    }

    const config = priorityMap[priority] || { variant: 'default', label: priority }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const getRiskBadge = (risk) => {
    const riskMap = {
        low: { variant: 'success', label: 'Low Risk' },
        medium: { variant: 'warning', label: 'Medium Risk' },
        high: { variant: 'danger', label: 'High Risk' },
    }

    const config = riskMap[risk] || { variant: 'default', label: risk }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
}

const DocumentIcon = ({ type }) => {
    const iconMap = {
        nin: IdentificationIcon,
        bvn: CreditCardIcon,
        utility_bill: HomeIcon,
        selfie: UserIcon,
        bank_statement: DocumentTextIcon,
    }

    const Icon = iconMap[type] || DocumentTextIcon
    return <Icon className="h-4 w-4" />
}

const KYCDashboard = () => {
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [selectedPriority, setSelectedPriority] = useState('all')

    const filteredQueue = mockKYCQueue.filter(item => {
        const statusMatch = selectedFilter === 'all' || item.status === selectedFilter
        const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority
        return statusMatch && priorityMatch
    })

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        KYC Verification
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage user identity verification and compliance
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <Button variant="secondary">
                        Export Report
                    </Button>
                    <Button>
                        Review Queue
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ClockIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.pendingReview}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Pending Review
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
                                {mockStats.underReview}
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
                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.approved}
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
                            <XCircleIcon className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.rejected}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Rejected
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockStats.documentsRequired}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Docs Required
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="block w-40 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending_review">Pending Review</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="documents_missing">Docs Missing</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={selectedPriority}
                                    onChange={(e) => setSelectedPriority(e.target.value)}
                                    className="block w-32 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="all">All</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button variant="secondary" size="sm">
                                Bulk Actions
                            </Button>
                            <Button size="sm">
                                Review Next
                            </Button>
                        </div>
                    </div>
                </div>

                {/* KYC Queue Table */}
                <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1200px' }}>
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[50px]">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                    Risk Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                                    Documents
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                    Progress
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredQueue.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getPriorityBadge(item.priority)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRiskBadge(item.riskScore)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            {item.documentsSubmitted.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded"
                                                    title={doc.replace('_', ' ').toUpperCase()}
                                                >
                                                    <DocumentIcon type={doc} />
                                                </div>
                                            ))}
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                                {item.documentsSubmitted.length}/5
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full"
                                                    style={{ width: `${item.completionPercentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                {item.completionPercentage}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatTimeAgo(item.submittedAt)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link
                                                to={`/kyc/review/${item.id}`}
                                                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                            <Button size="xs" variant="secondary">
                                                Review
                                            </Button>
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
                            Showing 1 to {filteredQueue.length} of {filteredQueue.length} results
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
        </div>
    )
}

export default KYCDashboard