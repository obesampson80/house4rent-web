// src/pages/Analytics/AnalyticsDashboard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    CalendarIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    ClockIcon,
} from '@heroicons/react/24/outline'
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
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'

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

// Mock Analytics Data
const mockOverviewStats = {
    totalUsers: { value: 12456, change: 8.5, trend: 'up' },
    totalProperties: { value: 1678, change: 12.3, trend: 'up' },
    totalRevenue: { value: 45600000, change: 15.7, trend: 'up' },
    avgPropertyPrice: { value: 2800000, change: -3.2, trend: 'down' },
}

const mockUserMetrics = [
    { month: 'Jan', newUsers: 234, activeUsers: 1200, retention: 78 },
    { month: 'Feb', newUsers: 345, activeUsers: 1456, retention: 82 },
    { month: 'Mar', newUsers: 456, activeUsers: 1789, retention: 85 },
    { month: 'Apr', newUsers: 567, activeUsers: 2100, retention: 87 },
    { month: 'May', newUsers: 678, activeUsers: 2456, retention: 89 },
    { month: 'Jun', newUsers: 789, activeUsers: 2800, retention: 91 },
]

const mockPropertyMetrics = [
    { category: 'Residential', listings: 1245, approved: 1156, avgPrice: 1800000, growth: 12.5 },
    { category: 'Commercial', listings: 234, approved: 198, avgPrice: 8500000, growth: 8.3 },
    { category: 'Land', listings: 156, approved: 134, avgPrice: 3200000, growth: 15.7 },
    { category: 'Luxury', listings: 43, approved: 38, avgPrice: 15000000, growth: 22.1 },
]

const mockRevenueData = [
    { month: 'Jan', revenue: 2800000, commissions: 450000, fees: 180000 },
    { month: 'Feb', revenue: 3200000, commissions: 520000, fees: 210000 },
    { month: 'Mar', revenue: 3800000, commissions: 620000, fees: 250000 },
    { month: 'Apr', revenue: 4200000, commissions: 680000, fees: 280000 },
    { month: 'May', revenue: 4800000, commissions: 780000, fees: 320000 },
    { month: 'Jun', revenue: 5400000, commissions: 870000, fees: 360000 },
]

const mockTopAgents = [
    { id: 1, name: 'David Wilson', properties: 25, revenue: 2800000, rating: 4.9 },
    { id: 2, name: 'Sarah Johnson', properties: 22, revenue: 2450000, rating: 4.8 },
    { id: 3, name: 'Mike Brown', properties: 18, revenue: 1950000, rating: 4.7 },
    { id: 4, name: 'Lisa Davis', properties: 16, revenue: 1680000, rating: 4.6 },
    { id: 5, name: 'John Smith', properties: 14, revenue: 1420000, rating: 4.5 },
]

const mockGeographicData = [
    { state: 'Lagos', properties: 856, users: 4567, revenue: 28500000 },
    { state: 'Abuja', properties: 234, users: 1234, revenue: 15200000 },
    { state: 'Rivers', properties: 156, users: 789, revenue: 8700000 },
    { state: 'Ogun', properties: 123, users: 567, revenue: 6500000 },
    { state: 'Kano', properties: 89, users: 345, revenue: 4200000 },
]

const formatCurrency = (amount) => {
    if (amount >= 1000000) {
        return `₦${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
        return `₦${(amount / 1000).toFixed(1)}K`
    }
    return `₦${amount.toLocaleString()}`
}

const getChangeIndicator = (change, trend) => {
    const isPositive = trend === 'up'
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600'

    return (
        <div className={`flex items-center ${colorClass}`}>
            <Icon className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
    )
}

const MetricCard = ({ title, value, change, trend, icon: Icon, color }) => {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {typeof value === 'number' && value > 1000000
                                ? formatCurrency(value)
                                : value.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    {getChangeIndicator(change, trend)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        vs last month
                    </span>
                </div>
            </div>
        </Card>
    )
}

// Chart configurations
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false,
            },
        },
        y: {
            display: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.1)',
            },
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

// User Growth Chart Data
const userGrowthData = {
    labels: mockUserMetrics.map(item => item.month),
    datasets: [
        {
            label: 'New Users',
            data: mockUserMetrics.map(item => item.newUsers),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
        },
        {
            label: 'Active Users',
            data: mockUserMetrics.map(item => item.activeUsers),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
        },
    ],
}

// Revenue Chart Data
const revenueData = {
    labels: mockRevenueData.map(item => item.month),
    datasets: [
        {
            label: 'Total Revenue',
            data: mockRevenueData.map(item => item.revenue),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
        },
        {
            label: 'Commissions',
            data: mockRevenueData.map(item => item.commissions),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
        },
        {
            label: 'Fees',
            data: mockRevenueData.map(item => item.fees),
            backgroundColor: 'rgba(168, 85, 247, 0.8)',
            borderColor: 'rgb(168, 85, 247)',
            borderWidth: 1,
        },
    ],
}

// Property Distribution Chart Data
const propertyDistributionData = {
    labels: mockPropertyMetrics.map(item => item.category),
    datasets: [
        {
            data: mockPropertyMetrics.map(item => item.listings),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ],
            borderColor: [
                'rgb(59, 130, 246)',
                'rgb(34, 197, 94)',
                'rgb(251, 191, 36)',
                'rgb(168, 85, 247)',
            ],
            borderWidth: 2,
        },
    ],
}

// Geographic Revenue Chart Data
const geographicRevenueData = {
    labels: mockGeographicData.map(item => item.state),
    datasets: [
        {
            label: 'Revenue by State',
            data: mockGeographicData.map(item => item.revenue),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
        },
    ],
}

const AnalyticsDashboard = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('6months')
    const [selectedMetric, setSelectedMetric] = useState('all')

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Analytics Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Comprehensive insights into platform performance and user behavior
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="block rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                        >
                            <option value="7days">Last 7 days</option>
                            <option value="30days">Last 30 days</option>
                            <option value="3months">Last 3 months</option>
                            <option value="6months">Last 6 months</option>
                            <option value="1year">Last year</option>
                        </select>
                    </div>
                    <Button variant="secondary" size="sm">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button size="sm">
                        <FunnelIcon className="h-4 w-4 mr-2" />
                        Custom Report
                    </Button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Users"
                    value={mockOverviewStats.totalUsers.value}
                    change={mockOverviewStats.totalUsers.change}
                    trend={mockOverviewStats.totalUsers.trend}
                    icon={UsersIcon}
                    color="bg-blue-500"
                />
                <MetricCard
                    title="Total Properties"
                    value={mockOverviewStats.totalProperties.value}
                    change={mockOverviewStats.totalProperties.change}
                    trend={mockOverviewStats.totalProperties.trend}
                    icon={BuildingOfficeIcon}
                    color="bg-green-500"
                />
                <MetricCard
                    title="Total Revenue"
                    value={mockOverviewStats.totalRevenue.value}
                    change={mockOverviewStats.totalRevenue.change}
                    trend={mockOverviewStats.totalRevenue.trend}
                    icon={CurrencyDollarIcon}
                    color="bg-purple-500"
                />
                <MetricCard
                    title="Avg Property Price"
                    value={mockOverviewStats.avgPropertyPrice.value}
                    change={mockOverviewStats.avgPropertyPrice.change}
                    trend={mockOverviewStats.avgPropertyPrice.trend}
                    icon={ArrowTrendingUpIcon}
                    color="bg-orange-500"
                />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* User Growth Chart */}
                <Card>
                    <Card.Header>
                        <Card.Title>User Growth Trends</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="h-80">
                            <Line data={userGrowthData} options={chartOptions} />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">2,456</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">789</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">New This Month</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">91%</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Retention Rate</div>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Revenue Chart */}
                <Card>
                    <Card.Header>
                        <Card.Title>Revenue Analytics</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="h-80">
                            <Bar data={revenueData} options={chartOptions} />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{formatCurrency(5400000)}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">This Month</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{formatCurrency(870000)}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Commissions</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">15.7%</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Growth Rate</div>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Property Distribution */}
                <Card>
                    <Card.Header>
                        <Card.Title>Property Distribution by Category</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="h-80">
                            <Doughnut data={propertyDistributionData} options={doughnutOptions} />
                        </div>
                    </Card.Content>
                </Card>

                {/* Geographic Revenue */}
                <Card>
                    <Card.Header>
                        <Card.Title>Revenue by State</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="h-80">
                            <Bar
                                data={geographicRevenueData}
                                options={{
                                    ...chartOptions,
                                    indexAxis: 'y',
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Property Analytics */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <Card.Title>Property Performance by Category</Card.Title>
                            <Link to="/analytics/properties" className="text-primary-600 hover:text-primary-500 text-sm">
                                View Details
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        <div className="overflow-x-auto">
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.Head>Category</Table.Head>
                                        <Table.Head>Listings</Table.Head>
                                        <Table.Head>Avg Price</Table.Head>
                                        <Table.Head>Growth</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {mockPropertyMetrics.map((metric, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {metric.category}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="text-sm">
                                                    <div className="font-medium">{metric.listings}</div>
                                                    <div className="text-green-600">{metric.approved} approved</div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="font-medium">
                                                    {formatCurrency(metric.avgPrice)}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center text-green-600">
                                                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                                    {metric.growth}%
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </Card.Content>
                </Card>

                {/* Top Agents */}
                <Card>
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <Card.Title>Top Performing Agents</Card.Title>
                            <Link to="/agents" className="text-primary-600 hover:text-primary-500 text-sm">
                                View All
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        <div className="space-y-4">
                            {mockTopAgents.map((agent, index) => (
                                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {agent.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {agent.properties} properties • {agent.rating}★
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(agent.revenue)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Revenue
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Geographic Distribution */}
            <Card>
                <Card.Header>
                    <div className="flex items-center justify-between">
                        <Card.Title>Geographic Distribution</Card.Title>
                        <Link to="/analytics/geographic" className="text-primary-600 hover:text-primary-500 text-sm">
                            View Map
                        </Link>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <div className="h-64">
                                <Bar
                                    data={geographicRevenueData}
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                            title: {
                                                display: true,
                                                text: 'Revenue Distribution by State'
                                            }
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {mockGeographicData.map((location, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {location.state}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {location.properties} properties • {location.users} users
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(location.revenue)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Revenue
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Quick Access Links */}
            <Card>
                <Card.Header>
                    <Card.Title>Detailed Analytics</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link to="/analytics/users" className="block">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <UsersIcon className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            User Analytics
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Detailed user insights
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/analytics/properties" className="block">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <BuildingOfficeIcon className="h-8 w-8 text-green-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            Property Analytics
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Market trends & insights
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/analytics/revenue" className="block">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            Revenue Analytics
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Financial performance
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/analytics/geographic" className="block">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <MapPinIcon className="h-8 w-8 text-orange-500" />
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            Geographic Analytics
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Location-based insights
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </Card.Content>
            </Card>
        </div>
    )
}

export default AnalyticsDashboard