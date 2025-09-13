// Export all API services
export { authService } from './auth'

// Placeholder exports for other services that will be created later
export const usersService = {
    getUsers: () => Promise.resolve([]),
    getUser: (id) => Promise.resolve({}),
    createUser: (data) => Promise.resolve(data),
    updateUser: (id, data) => Promise.resolve(data),
    deleteUser: (id) => Promise.resolve({}),
}

export const kycService = {
    getVerifications: () => Promise.resolve([]),
    getVerification: (id) => Promise.resolve({}),
    approveVerification: (id) => Promise.resolve({}),
    rejectVerification: (id) => Promise.resolve({}),
}

export const propertiesService = {
    getProperties: () => Promise.resolve([]),
    getProperty: (id) => Promise.resolve({}),
    approveProperty: (id) => Promise.resolve({}),
    rejectProperty: (id) => Promise.resolve({}),
}

export const paymentsService = {
    getPayments: () => Promise.resolve([]),
    getPayment: (id) => Promise.resolve({}),
    processRefund: (id, amount) => Promise.resolve({}),
}

export const analyticsService = {
    getDashboardData: () => Promise.resolve({}),
    getUserAnalytics: () => Promise.resolve({}),
    getPropertyAnalytics: () => Promise.resolve({}),
    getRevenueAnalytics: () => Promise.resolve({}),
}