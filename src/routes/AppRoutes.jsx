// src/routes/AppRoutes.jsx (Updated with all new pages)
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Layout } from '@components/common/Layout'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

// Auth Pages
import Login from '@pages/Auth/Login'
import ForgotPassword from '@pages/Auth/ForgotPassword'
import ResetPassword from '@pages/Auth/ResetPassword'

// Main Pages
import Dashboard from '@pages/Dashboard/Dashboard'
import KYCDashboard from '@pages/KYC/KYCDashboard'
import PropertiesList from '@pages/Properties/PropertiesList'
import PropertyDetail from '@/pages/Properties/PropertyDetail'
import UsersList from '@pages/Users/UsersList'
import UserDetail from '@/pages/Users/UserDetail'
import AgentsList from '@pages/Agents/AgentsList'
import AgentDetail from '@/pages/Agents/AgentDetail'
import PaymentsList from '@pages/Payments/PaymentsList'
import AnalyticsDashboard from '@pages/Analytics/AnalyticsDashboard'
import PaymentDetail from '@/pages/Payments/PaymentDetail'
import PropertyForm from '@components/forms/PropertyForm'
import UserForm from '@components/forms/UserForm'


//


// Error Pages
import NotFound from '@pages/Error/NotFound'
import ServerError from '@pages/Error/ServerError'
import Unauthorized from '@pages/Error/Unauthorized'

// Simple placeholder pages for remaining routes
const Communications = () => (
    <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                    Communications Center
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage notifications, email campaigns, and user communications
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Push Notifications</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Send instant notifications to users</p>
                <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    Send Notification
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Campaigns</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Create and manage email marketing</p>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Create Campaign
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">SMS Messages</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Send SMS notifications and alerts</p>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Send SMS
                </button>
            </div>
        </div>
    </div>
)

const Reports = () => (
    <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                    Reports Dashboard
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Generate custom reports and schedule automated reporting
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Reports</h3>
                <div className="space-y-3">
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        User Activity Report
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Property Listings Report
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        Financial Summary Report
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Scheduled Reports</h3>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="font-medium">Weekly Analytics Report</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Every Monday at 9:00 AM</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="font-medium">Monthly Financial Report</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">1st of every month</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const Settings = () => (
    <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                    System Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure platform settings and integrations
                </p>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Platform Name
                        </label>
                        <input
                            type="text"
                            defaultValue="Property Admin"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Default Commission Rate (%)
                        </label>
                        <input
                            type="number"
                            defaultValue="5"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Integrations</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                            <div className="font-medium">Payment Gateway</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Paystack Integration</div>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                            <div className="font-medium">KYC Verification</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">NIN/BVN Services</div>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

export const AppRoutes = () => {
    const { isAuthenticated } = useSelector(state => state.auth)

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/auth/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/auth/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/auth/reset-password"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/*"
                element={
                    <PrivateRoute>
                        <Layout>
                            <Routes>
                                {/* Main Pages */}

                                <Route path="/" element={<Dashboard />} />

                                {/* Users Routes */}
                                <Route path="/users" element={<UsersList />} />
                                <Route path="/users/:id" element={<UserDetail />} />

                                {/* Properties Routes */}
                                <Route path="/properties" element={<PropertiesList />} />
                                <Route path="/properties/:id" element={<PropertyDetail />} />

                                {/* Agents Routes */}
                                <Route path="/agents" element={<AgentsList />} />
                                <Route path="/agents/:id" element={<AgentDetail />} />

                                {/* Payments Routes */}
                                <Route path="/payments" element={<PaymentsList />} />
                                <Route path="/payments/:id" element={<PaymentDetail />} />

                                {/* Other Routes */}
                                <Route path="/kyc" element={<KYCDashboard />} />
                                <Route path="/analytics" element={<AnalyticsDashboard />} />
                                <Route path="/communications" element={<Communications />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/settings" element={<Settings />} />

                                {/* Error Pages */}
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                <Route path="/server-error" element={<ServerError />} />
                                <Route path="*" element={<NotFound />} />

                                {/* Form flow route*/}
                                <Route path="/properties/create" element={<PropertyForm mode="create" />} />
                                <Route path="/properties/:id/edit" element={<PropertyForm mode="edit" />} />
                                <Route path="/users/create" element={<UserForm mode="create" />} />
                                <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />

                            </Routes>
                        </Layout>
                    </PrivateRoute>
                }
            />

            {/* Fallback */}
            <Route
                path="*"
                element={
                    isAuthenticated ? (
                        <Navigate to="/" replace />
                    ) : (
                        <Navigate to="/auth/login" replace />
                    )
                }
            />
        </Routes>
    )
}