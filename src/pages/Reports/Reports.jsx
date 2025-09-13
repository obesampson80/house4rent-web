// src/pages/Reports/Reports.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    DocumentChartBarIcon,
    CalendarIcon,
    ArrowDownTrayIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    PlusIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    DocumentTextIcon,
    FunnelIcon,
    ArrowPathIcon,
    BellIcon,
    ShareIcon,
    TrashIcon,
    PencilIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

// Mock Data
const mockReports = [
    {
        id: 'RPT-001',
        name: 'Weekly User Activity Report',
        description: 'Comprehensive analysis of user engagement and platform usage',
        type: 'user_activity',
        frequency: 'weekly',
        status: 'completed',
        lastGenerated: '2024-01-20T10:30:00Z',
        nextScheduled: '2024-01-27T10:30:00Z',
        createdBy: 'System',
        recipients: ['admin@example.com', 'manager@example.com'],
        format: 'pdf',
        size: '2.3 MB',
        downloads: 45,
    },
    {
        id: 'RPT-002',
        name: 'Monthly Revenue Analysis',
        description: 'Detailed breakdown of revenue streams, commissions, and financial metrics',
        type: 'financial',
        frequency: 'monthly',
        status: 'generating',
        lastGenerated: '2024-01-15T15:20:00Z',
        nextScheduled: '2024-02-01T09:00:00Z',
        createdBy: 'Finance Team',
        recipients: ['finance@example.com', 'ceo@example.com'],
        format: 'xlsx',
        size: '5.7 MB',
        downloads: 23,
        progress: 75,
    },
    {
        id: 'RPT-003',
        name: 'Property Listing Performance',
        description: 'Analysis of property listings, approval rates, and market trends',
        type: 'property',
        frequency: 'bi-weekly',
        status: 'failed',
        lastGenerated: '2024-01-18T14:45:00Z',
        nextScheduled: '2024-01-25T14:45:00Z',
        createdBy: 'Property Manager',
        recipients: ['property@example.com'],
        format: 'pdf',
        size: '1.2 MB',
        downloads: 12,
        errorMessage: 'Database connection timeout',
    },
    {
        id: 'RPT-004',
        name: 'Agent Performance Dashboard',
        description: 'Individual agent metrics, commissions, and performance rankings',
        type: 'agent_performance',
        frequency: 'monthly',
        status: 'scheduled',
        lastGenerated: '2024-01-01T10:00:00Z',
        nextScheduled: '2024-01-22T10:00:00Z',
        createdBy: 'HR Manager',
        recipients: ['hr@example.com', 'agents@example.com'],
        format: 'pdf',
        size: '3.1 MB',
        downloads: 78,
    },
    {
        id: 'RPT-005',
        name: 'KYC Verification Summary',
        description: 'Status of user verifications, pending documents, and compliance metrics',
        type: 'kyc_compliance',
        frequency: 'daily',
        status: 'completed',
        lastGenerated: '2024-01-20T08:00:00Z',
        nextScheduled: '2024-01-21T08:00:00Z',
        createdBy: 'Compliance Officer',
        recipients: ['compliance@example.com'],
        format: 'csv',
        size: '500 KB',
        downloads: 156,
    },
]

const mockQuickReports = [
    {
        id: 'QR-001',
        name: 'Today\'s Activity Summary',
        description: 'Quick overview of today\'s key metrics and activities',
        icon: ChartBarIcon,
        color: 'bg-blue-500',
        estimatedTime: '30 seconds',
    },
    {
        id: 'QR-002',
        name: 'User Registration Report',
        description: 'New user signups and registration trends',
        icon: UsersIcon,
        color: 'bg-green-500',
        estimatedTime: '1 minute',
    },
    {
        id: 'QR-003',
        name: 'Property Listings Summary',
        description: 'Current property listings status and metrics',
        icon: BuildingOfficeIcon,
        color: 'bg-purple-500',
        estimatedTime: '45 seconds',
    },
    {
        id: 'QR-004',
        name: 'Financial Overview',
        description: 'Revenue, commissions, and payment summaries',
        icon: CurrencyDollarIcon,
        color: 'bg-orange-500',
        estimatedTime: '2 minutes',
    },
]

const mockAnalytics = {
    totalReports: 127,
    scheduledReports: 23,
    completedToday: 8,
    failedReports: 3,
    totalDownloads: 1247,
    automationRate: 78.5,
}

const mockRecentDownloads = [
    {
        id: 'DL-001',
        reportName: 'Weekly User Activity Report',
        downloadedBy: 'admin@example.com',
        downloadedAt: '2024-01-20T14:30:00Z',
        format: 'PDF',
        size: '2.3 MB',
    },
    {
        id: 'DL-002',
        reportName: 'Agent Performance Dashboard',
        downloadedBy: 'hr@example.com',
        downloadedAt: '2024-01-20T11:15:00Z',
        format: 'Excel',
        size: '3.1 MB',
    },
    {
        id: 'DL-003',
        reportName: 'Property Listing Performance',
        downloadedBy: 'property@example.com',
        downloadedAt: '2024-01-19T16:45:00Z',
        format: 'PDF',
        size: '1.2 MB',
    },
]

// Chart data
const reportGenerationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Reports Generated',
            data: [45, 52, 48, 61, 55, 67],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
        },
        {
            label: 'Automated Reports',
            data: [35, 42, 38, 48, 43, 52],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
        },
    ],
}

const reportTypeDistribution = {
    labels: ['Financial', 'User Activity', 'Property', 'Compliance', 'Analytics'],
    datasets: [
        {
            data: [30, 25, 20, 15, 10],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
                'rgb(59, 130, 246)',
                'rgb(34, 197, 94)',
                'rgb(251, 191, 36)',
                'rgb(168, 85, 247)',
                'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
        },
    ],
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        x: {
            display: true,
        },
        y: {
            display: true,
        },
    },
}

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
}

const getStatusBadge = (status) => {
    const statusMap = {
        completed: { variant: 'success', label: 'Completed', icon: CheckCircleIcon },
        generating: { variant: 'info', label: 'Generating', icon: ClockIcon },
        scheduled: { variant: 'warning', label: 'Scheduled', icon: CalendarIcon },
        failed: { variant: 'danger', label: 'Failed', icon: XCircleIcon },
    }

    const config = statusMap[status] || { variant: 'default', label: status, icon: ClockIcon }
    const Icon = config.icon

    return (
        <div className="flex items-center space-x-1">
            <Icon className="h-3 w-3" />
            <Badge variant={config.variant} size="xs">{config.label}</Badge>
        </div>
    )
}

const getReportTypeColor = (type) => {
    const typeMap = {
        user_activity: 'text-blue-600',
        financial: 'text-green-600',
        property: 'text-purple-600',
        agent_performance: 'text-orange-600',
        kyc_compliance: 'text-red-600',
    }
    return typeMap[type] || 'text-gray-600'
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

const formatFileSize = (size) => {
    if (size.includes('MB')) return size
    if (size.includes('KB')) return size
    return `${(parseInt(size) / 1024 / 1024).toFixed(1)} MB`
}

const Reports = () => {
    const [activeTab, setActiveTab] = useState('reports')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)
    const [filterType, setFilterType] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    const tabs = [
        { id: 'reports', label: 'All Reports', icon: DocumentChartBarIcon },
        { id: 'scheduled', label: 'Scheduled', icon: CalendarIcon },
        { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    ]

    const filteredReports = mockReports.filter(report => {
        const typeMatch = filterType === 'all' || report.type === filterType
        const statusMatch = filterStatus === 'all' || report.status === filterStatus
        return typeMatch && statusMatch
    })

    const handleGenerateQuickReport = (reportId) => {
        console.log('Generating quick report:', reportId)
        // Simulate report generation
    }

    const handleDownloadReport = (reportId) => {
        console.log('Downloading report:', reportId)
        // Simulate download
    }

    const handleScheduleReport = (report) => {
        setSelectedReport(report)
        setShowScheduleModal(true)
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Reports Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Generate, schedule, and manage comprehensive platform reports
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <Button variant="secondary" size="sm">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Export All
                    </Button>
                    <Button size="sm" onClick={() => setShowCreateModal(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Report
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <DocumentChartBarIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockAnalytics.totalReports}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total Reports
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CalendarIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockAnalytics.scheduledReports}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Scheduled Reports
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
                                {mockAnalytics.completedToday}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Completed Today
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ArrowDownTrayIcon className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mockAnalytics.totalDownloads}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Total Downloads
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Reports Section */}
            <Card>
                <Card.Header>
                    <Card.Title>Quick Reports</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {mockQuickReports.map((report) => {
                            const Icon = report.icon
                            return (
                                <div
                                    key={report.id}
                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => handleGenerateQuickReport(report.id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 ${report.color} rounded-lg`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                {report.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {report.description}
                                            </p>
                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                ~{report.estimatedTime}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card.Content>
            </Card>

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
                {activeTab === 'reports' && (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="block w-40 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="user_activity">User Activity</option>
                                        <option value="financial">Financial</option>
                                        <option value="property">Property</option>
                                        <option value="agent_performance">Agent Performance</option>
                                        <option value="kyc_compliance">KYC Compliance</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="block w-32 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="generating">Generating</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Reports Table */}
                        <Card>
                            <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1200px' }}>
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[300px]">
                                                Report
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                Frequency
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                                Last Generated
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                                Downloads
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredReports.map((report, index) => (
                                            <tr key={report.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                                                }`}>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {report.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                                                            {report.description}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {report.format.toUpperCase()} • {report.size}
                                                        </div>
                                                        {report.errorMessage && (
                                                            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                                Error: {report.errorMessage}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${getReportTypeColor(report.type)} capitalize`}>
                                                        {report.type.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        {getStatusBadge(report.status)}
                                                        {report.progress && (
                                                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-primary-600 h-1.5 rounded-full"
                                                                    style={{ width: `${report.progress}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                        {report.frequency}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        <div>{formatDate(report.lastGenerated)}</div>
                                                        {report.nextScheduled && (
                                                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                Next: {formatDate(report.nextScheduled)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {report.downloads}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        downloads
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            className="text-primary-600 hover:text-primary-500 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                            title="View Report"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </button>
                                                        {report.status === 'completed' && (
                                                            <button
                                                                onClick={() => handleDownloadReport(report.id)}
                                                                className="text-green-600 hover:text-green-500 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                                title="Download"
                                                            >
                                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleScheduleReport(report)}
                                                            className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                            title="Schedule"
                                                        >
                                                            <CalendarIcon className="h-4 w-4" />
                                                        </button>
                                                        <button className="text-gray-600 hover:text-gray-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors">
                                                            <PencilIcon className="h-4 w-4" />
                                                        </button>
                                                        {report.status === 'failed' && (
                                                            <button className="text-orange-600 hover:text-orange-500 p-1 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors">
                                                                <ArrowPathIcon className="h-4 w-4" />
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
                                        Showing {filteredReports.length} of {mockReports.length} reports
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

                        {/* Recent Downloads */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Recent Downloads</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-3">
                                    {mockRecentDownloads.map((download) => (
                                        <div key={download.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {download.reportName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Downloaded by {download.downloadedBy} • {formatDate(download.downloadedAt)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {download.format}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {download.size}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Content>
                        </Card>
                    </>
                )}

                {activeTab === 'scheduled' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {mockReports.filter(r => r.status === 'scheduled' || r.nextScheduled).map((report) => (
                                <Card key={report.id}>
                                    <Card.Header>
                                        <div className="flex items-center justify-between">
                                            <Card.Title className="truncate">{report.name}</Card.Title>
                                            {getStatusBadge(report.status)}
                                        </div>
                                    </Card.Header>
                                    <Card.Content>
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {report.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">Next Run:</span>
                                                    <div className="font-medium">{formatDate(report.nextScheduled)}</div>
                                                </div>
                                            </div>

                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Created by {report.createdBy} • {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button size="xs" variant="secondary" className="flex-1">
                                                    <EyeIcon className="h-3 w-3 mr-1" />
                                                    View Settings
                                                </Button>
                                                <Button size="xs" variant="secondary">
                                                    <PencilIcon className="h-3 w-3" />
                                                </Button>
                                                <Button size="xs" variant="warning">
                                                    Pause
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
                    <div className="space-y-6">
                        {/* Charts Section */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <Card.Header>
                                    <Card.Title>Report Generation Trends</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="h-64">
                                        <Line data={reportGenerationData} options={chartOptions} />
                                    </div>
                                </Card.Content>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Card.Title>Report Types Distribution</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="h-64">
                                        <Doughnut data={reportTypeDistribution} options={doughnutOptions} />
                                    </div>
                                </Card.Content>
                            </Card>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <Card>
                                <Card.Header>
                                    <Card.Title>Generation Success Rate</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-600">94.2%</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Successful generations this month
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Completed</span>
                                                <span className="font-medium">124</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Failed</span>
                                                <span className="font-medium text-red-600">8</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Card.Title>Average Generation Time</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600">3.2m</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Average time to generate
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Fastest</span>
                                                <span className="font-medium">45s</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Slowest</span>
                                                <span className="font-medium">12m</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>

                            <Card>
                                <Card.Header>
                                    <Card.Title>Automation Rate</Card.Title>
                                </Card.Header>
                                <Card.Content>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-600">
                                            {mockAnalytics.automationRate}%
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            Reports generated automatically
                                        </div>
                                        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full"
                                                style={{ width: `${mockAnalytics.automationRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        </div>

                        {/* Top Downloaded Reports */}
                        <Card>
                            <Card.Header>
                                <Card.Title>Most Downloaded Reports</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <div className="space-y-4">
                                    {mockReports.slice(0, 5).map((report, index) => (
                                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${index === 0 ? 'bg-yellow-500' :
                                                    index === 1 ? 'bg-gray-400' :
                                                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {report.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {report.type.replace('_', ' ')} • {report.frequency}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {report.downloads}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    downloads
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

            {/* Create Report Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Custom Report"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Report Name
                            </label>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="Enter report name..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Report Type
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="user_activity">User Activity</option>
                                <option value="financial">Financial</option>
                                <option value="property">Property Analysis</option>
                                <option value="agent_performance">Agent Performance</option>
                                <option value="kyc_compliance">KYC Compliance</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Describe what this report will include..."
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date Range
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="last_7_days">Last 7 days</option>
                                <option value="last_30_days">Last 30 days</option>
                                <option value="last_90_days">Last 90 days</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Format
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="pdf">PDF</option>
                                <option value="xlsx">Excel</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Schedule
                            </label>
                            <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                <option value="once">Generate Once</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Recipients
                        </label>
                        <input
                            type="text"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter email addresses separated by commas..."
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowCreateModal(false)}>
                        Create Report
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Schedule Report Modal */}
            <Modal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                title={`Schedule Report: ${selectedReport?.name}`}
                size="md"
            >
                {selectedReport && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                {selectedReport.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedReport.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Frequency
                                </label>
                                <select
                                    defaultValue={selectedReport.frequency}
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="bi-weekly">Bi-weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    defaultValue="09:00"
                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Recipients
                            </label>
                            <textarea
                                rows={3}
                                defaultValue={selectedReport.recipients.join(', ')}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="Enter email addresses separated by commas..."
                            />
                        </div>
                    </div>
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setShowScheduleModal(false)}>
                        Update Schedule
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Reports
