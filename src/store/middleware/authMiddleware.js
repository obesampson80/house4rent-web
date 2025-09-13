export const authMiddleware = store => next => action => {
    // Log authentication actions in development
    if (import.meta.env.MODE === 'development') {
        if (action.type.startsWith('auth/')) {
            console.log('[Auth Middleware]', action.type, action.payload)
        }
    }

    // Handle logout cleanup
    if (action.type === 'auth/logout') {
        // Clear all stored data
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        // Reset all slices to initial state if needed
        // You can dispatch reset actions here
    }

    return next(action)
}