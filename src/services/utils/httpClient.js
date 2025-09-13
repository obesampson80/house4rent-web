import axios from 'axios'
import { store } from '@store'
import { logout, refreshToken } from '@store/slices/authSlice'

// Create axios instance
const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
httpClient.interceptors.request.use(
    config => {
        const state = store.getState()
        const token = state.auth.token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Add request timestamp for logging
        config.metadata = { startTime: new Date() }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Response interceptor
httpClient.interceptors.response.use(
    response => {
        // Calculate request duration
        const endTime = new Date()
        const duration = endTime - response.config.metadata.startTime

        // Log successful requests in development
        if (import.meta.env.MODE === 'development') {
            console.log(
                `[API] ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`
            )
        }

        return response.data
    },
    async error => {
        const originalRequest = error.config
        const endTime = new Date()
        const duration = endTime - originalRequest.metadata.startTime

        // Log error requests in development
        if (import.meta.env.MODE === 'development') {
            console.error(
                `[API ERROR] ${originalRequest.method.toUpperCase()} ${originalRequest.url} - ${error.response?.status} (${duration}ms)`,
                error.response?.data
            )
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                await store.dispatch(refreshToken()).unwrap()
                // Retry original request with new token
                const state = store.getState()
                originalRequest.headers.Authorization = `Bearer ${state.auth.token}`
                return httpClient(originalRequest)
            } catch (refreshError) {
                // Refresh failed, logout user
                store.dispatch(logout())
                window.location.href = '/auth/login'
                return Promise.reject(refreshError)
            }
        }

        // Handle network errors
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
            return Promise.reject({
                message: 'Network error. Please check your connection and try again.',
                type: 'network',
            })
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                message: 'Request timeout. Please try again.',
                type: 'timeout',
            })
        }

        // Return formatted error
        const errorResponse = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            status: error.response?.status,
            data: error.response?.data,
            type: 'api',
        }

        return Promise.reject(errorResponse)
    }
)

// Helper methods
export const api = {
    get: (url, config) => httpClient.get(url, config),
    post: (url, data, config) => httpClient.post(url, data, config),
    put: (url, data, config) => httpClient.put(url, data, config),
    patch: (url, data, config) => httpClient.patch(url, data, config),
    delete: (url, config) => httpClient.delete(url, config),
}

export default httpClient