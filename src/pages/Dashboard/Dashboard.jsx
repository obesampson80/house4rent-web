// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect, createElement } from 'react'
import {
    UsersIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    ExclamationTriangleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'

// Mock data for the dashboard
const mockStats = {
    totalUsers: { value: 12345, change: 8.2, trend: 'up' },
    totalProperties: { value: 1567, change: 12.5, trend: 'up' },
    pendingKYC: { value: 89, change: -15.3, trend: 'down' },
    monthlyRevenue: { value: 2150000, change: 23.1, trend: 'up' },
}

const mockRecentActivities = [
    {
        id: 1,
        type: 'kyc_approved',
        message: 'KYC verification approved for John Doe',
        time: '2 minutes ago',
        icon: CheckCircleIcon,
        iconColor: 'text-green-500',
    },
    {
        id: 2,
        type: 'property_submitted',
        message: 'New property submitted: 3BR Apartment in Lekki',
        time: '5 minutes ago',
        icon: BuildingOfficeIcon,
        iconColor: 'text-blue-500',
    },
    {
        id: 3,
        type: 'payment_received',
        message: 'Payment of ₦45,000 received for Property #1234',
        time: '12 minutes ago',
        icon: CreditCardIcon,
        iconColor: 'text-green-500',
    },
    {
        id: 4,
        type: 'kyc_pending',
        message: 'KYC verification required for Jane Smith',
        time: '1 hour ago',
        icon: ClockIcon,
        iconColor: 'text-yellow-500',
    },
    {
        id: 5,
        type: 'property_rejected',
        message: 'Property application rejected: Missing documents',
        time: '2 hours ago',
        icon: XCircleIcon,
        iconColor: 'text-red-500',
    },
]

const mockPendingTasks = [
    {
        id: 1,
        title: 'Review 15 pending KYC verifications',
        count: 15,
        urgency: 'high',
        path: '/kyc',
    },
    {
        id: 2,
        title: 'Approve 8 property submissions',
        count: 8,
        urgency: 'medium',
        path: '/properties/approvals',
    },
    {
        id: 3,
        title: 'Process 3 refund requests',
        count: 3,
        urgency: 'high',
        path: '/payments/refunds',
    },
    {
        id: 4,
        title: 'Review agent verifications',
        count: 5,
        urgency: 'low',
        path: '/agents/verification',
    },
]

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
    const isPositive = trend === 'up'
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
    const ChangeIcon = isPositive ? ArrowUpIcon : ArrowDownIcon

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-soft rounded-xl">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                {title}
                            </dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {typeof value === 'number' && value > 1000000
                                        ? `₦${(value / 1000000).toFixed(1)}M`
                                        : typeof value === 'number' && value > 1000
                                            ? `${(value / 1000).toFixed(1)}k`
                                            : value.toLocaleString()}
                                </div>
                                <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
                                    <ChangeIcon className="self-center flex-shrink-0 h-4 w-4" />
                                    <span className="ml-1">{Math.abs(change)}%</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ActivityItem = ({ activity }) => {
    const Icon = activity.icon
    return (
        <div className="flex items-start space-x-3 py-3">
            <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${activity.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
            </div>
        </div>
    )
}

const TaskCard = ({ task }) => {
    const urgencyColors = {
        high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
        low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h4>
                    <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${urgencyColors[task.urgency]}`}>
                            {task.urgency} priority
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {task.count} items
                        </span>
                    </div>
                </div>
                <EyeIcon className="h-5 w-5 text-gray-400" />
            </div>
        </div>
    )
}

const Dashboard = () => {
    const [stats, setStats] = useState(mockStats)
    const [activities, setActivities] = useState(mockRecentActivities)
    const [tasks, setTasks] = useState(mockPendingTasks)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate small changes in stats
            setStats(prev => ({
                ...prev,
                pendingKYC: {
                    ...prev.pendingKYC,
                    value: prev.pendingKYC.value + Math.floor(Math.random() * 3) - 1,
                },
            }))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Welcome back! Here's what's happening with your property management platform.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.value}
                    change={stats.totalUsers.change}
                    trend={stats.totalUsers.trend}
                    icon={UsersIcon}
                    color="bg-gradient-to-r from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Properties Listed"
                    value={stats.totalProperties.value}
                    change={stats.totalProperties.change}
                    trend={stats.totalProperties.trend}
                    icon={BuildingOfficeIcon}
                    color="bg-gradient-to-r from-green-500 to-green-600"
                />
                <StatCard
                    title="Pending KYC"
                    value={stats.pendingKYC.value}
                    change={stats.pendingKYC.change}
                    trend={stats.pendingKYC.trend}
                    icon={ExclamationTriangleIcon}
                    color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={stats.monthlyRevenue.value}
                    change={stats.monthlyRevenue.change}
                    trend={stats.monthlyRevenue.trend}
                    icon={CreditCardIcon}
                    color="bg-gradient-to-r from-purple-500 to-purple-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Activities */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 shadow-soft rounded-xl">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Latest actions and updates across the platform
                            </p>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flow-root">
                                <ul className="-my-3 divide-y divide-gray-200 dark:divide-gray-700">
                                    {activities.map((activity) => (
                                        <li key={activity.id}>
                                            <ActivityItem activity={activity} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    View All Activities
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div>
                    <div className="bg-white dark:bg-gray-800 shadow-soft rounded-xl">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Tasks</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Items requiring your attention
                            </p>
                        </div>
                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 shadow-soft rounded-xl">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                </div>
                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <button className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            Review KYC Queue
                        </button>
                        <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            Approve Properties
                        </button>
                        <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            Generate Report
                        </button>
                        <button className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                            Send Notification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard