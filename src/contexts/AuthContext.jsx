import { createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logout, refreshToken } from '@store/slices/authSlice'
import { authService } from '@services/api/auth'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, token, isAuthenticated, loading } = useSelector(
        state => state.auth
    )

    // Auto-refresh token
    useEffect(() => {
        if (token && isAuthenticated) {
            const interval = setInterval(() => {
                dispatch(refreshToken())
            }, 15 * 60 * 1000) // Refresh every 15 minutes

            return () => clearInterval(interval)
        }
    }, [token, isAuthenticated, dispatch])

    // Handle logout
    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            dispatch(logout())
            navigate('/auth/login')
        }
    }

    // Check if user has permission
    const hasPermission = permission => {
        if (!user?.permissions) return false
        return user.permissions.includes(permission)
    }

    // Check if user has role
    const hasRole = role => {
        if (!user?.roles) return false
        return user.roles.includes(role)
    }

    // Check if user can access resource
    const canAccess = (resource, action = 'read') => {
        const permission = `${resource}:${action}`
        return hasPermission(permission) || hasRole('super_admin')
    }

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        logout: handleLogout,
        hasPermission,
        hasRole,
        canAccess,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}