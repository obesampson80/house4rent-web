import toast from 'react-hot-toast'

export const errorMiddleware = store => next => action => {
    // Handle rejected actions
    if (action.type.endsWith('/rejected')) {
        const errorMessage = action.payload || 'An error occurred'

        // Don't show toast for auth errors (handled in components)
        if (!action.type.startsWith('auth/')) {
            toast.error(errorMessage)
        }

        // Log errors in development
        if (import.meta.env.MODE === 'development') {
            console.error('[Error Middleware]', action.type, errorMessage)
        }
    }

    // Handle fulfilled actions
    if (action.type.endsWith('/fulfilled')) {
        // Log successful actions in development
        if (import.meta.env.MODE === 'development') {
            console.log('[Success Middleware]', action.type)
        }
    }

    return next(action)
}
