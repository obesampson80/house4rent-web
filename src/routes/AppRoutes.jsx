// src/routes/AppRoutes.jsx (Updated with proper component imports)
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

// Additional Pages
import Communications from '@pages/Communications/Communications'
import Reports from '@pages/Reports/Reports'
import Settings from '@pages/Settings/Settings'

// Error Pages
import NotFound from '@pages/Error/NotFound'
import ServerError from '@pages/Error/ServerError'
import Unauthorized from '@pages/Error/Unauthorized'

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
                                <Route path="/users/create" element={<UserForm mode="create" />} />
                                <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />

                                {/* Properties Routes */}
                                <Route path="/properties" element={<PropertiesList />} />
                                <Route path="/properties/:id" element={<PropertyDetail />} />
                                <Route path="/properties/create" element={<PropertyForm mode="create" />} />
                                <Route path="/properties/:id/edit" element={<PropertyForm mode="edit" />} />

                                {/* Agents Routes */}
                                <Route path="/agents" element={<AgentsList />} />
                                <Route path="/agents/:id" element={<AgentDetail />} />

                                {/* Payments Routes */}
                                <Route path="/payments" element={<PaymentsList />} />
                                <Route path="/payments/:id" element={<PaymentDetail />} />

                                {/* Other Main Routes */}
                                <Route path="/kyc" element={<KYCDashboard />} />
                                <Route path="/analytics" element={<AnalyticsDashboard />} />
                                <Route path="/communications" element={<Communications />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/settings" element={<Settings />} />

                                {/* Error Pages */}
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                <Route path="/server-error" element={<ServerError />} />
                                <Route path="*" element={<NotFound />} />
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