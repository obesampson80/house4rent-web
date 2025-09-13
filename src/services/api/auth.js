import { api } from '@services/utils/httpClient'
import { API_ROUTES } from '@utils/constants/routes'

export const authService = {
    // Login
    async login(credentials) {
        const response = await api.post(API_ROUTES.AUTH.LOGIN, credentials)
        return response
    },

    // Logout
    async logout() {
        const response = await api.post(API_ROUTES.AUTH.LOGOUT)
        return response
    },

    // Refresh token
    async refreshToken(refreshToken) {
        const response = await api.post(API_ROUTES.AUTH.REFRESH, {
            refreshToken,
        })
        return response
    },

    // Get user profile
    async getProfile() {
        const response = await api.get(API_ROUTES.AUTH.PROFILE)
        return response
    },

    // Update profile
    async updateProfile(profileData) {
        const response = await api.put(API_ROUTES.AUTH.PROFILE, profileData)
        return response
    },

    // Forgot password
    async forgotPassword(email) {
        const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email })
        return response
    },

    // Reset password
    async resetPassword(token, password) {
        const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, {
            token,
            password,
        })
        return response
    },

    // Change password
    async changePassword(currentPassword, newPassword) {
        const response = await api.put('/auth/change-password', {
            currentPassword,
            newPassword,
        })
        return response
    },

    // Enable/disable 2FA
    async toggle2FA(enabled) {
        const response = await api.put('/auth/2fa', { enabled })
        return response
    },

    // Verify 2FA token
    async verify2FA(token) {
        const response = await api.post('/auth/2fa/verify', { token })
        return response
    },
}