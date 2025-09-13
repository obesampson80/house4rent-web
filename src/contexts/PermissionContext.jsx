import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { PERMISSIONS, ROLES } from '@utils/constants/permissions'

const PermissionContext = createContext({})

export const usePermission = () => {
    const context = useContext(PermissionContext)
    if (!context) {
        throw new Error('usePermission must be used within a PermissionProvider')
    }
    return context
}

export const PermissionProvider = ({ children }) => {
    const { user, hasPermission, hasRole, canAccess } = useAuth()

    // Check if user can perform bulk operations
    const canBulkAction = (resource, action = 'update') => {
        return canAccess(resource, action) && hasPermission('bulk_operations')
    }

    // Check if user can export data
    const canExport = resource => {
        return canAccess(resource, 'read') && hasPermission('export_data')
    }

    // Check if user can approve/reject items
    const canApprove = resource => {
        return canAccess(resource, 'approve') || hasRole(ROLES.ADMIN)
    }

    // Check if user can manage system settings
    const canManageSettings = () => {
        return hasRole(ROLES.SUPER_ADMIN) || hasPermission(PERMISSIONS.MANAGE_SETTINGS)
    }

    // Check if user can view analytics
    const canViewAnalytics = () => {
        return hasPermission(PERMISSIONS.VIEW_ANALYTICS) || hasRole(ROLES.ADMIN)
    }

    // Check if user can manage users
    const canManageUsers = () => {
        return hasPermission(PERMISSIONS.MANAGE_USERS) || hasRole(ROLES.ADMIN)
    }

    // Check if user can manage KYC
    const canManageKYC = () => {
        return hasPermission(PERMISSIONS.MANAGE_KYC) || hasRole(ROLES.KYC_OFFICER)
    }

    // Check if user can manage properties
    const canManageProperties = () => {
        return hasPermission(PERMISSIONS.MANAGE_PROPERTIES) || hasRole(ROLES.PROPERTY_OFFICER)
    }

    // Check if user can manage payments
    const canManagePayments = () => {
        return hasPermission(PERMISSIONS.MANAGE_PAYMENTS) || hasRole(ROLES.FINANCE_OFFICER)
    }

    // Check if user can view specific user data
    const canViewUserData = userId => {
        if (hasRole(ROLES.SUPER_ADMIN) || hasRole(ROLES.ADMIN)) return true
        if (user?.id === userId) return true
        return hasPermission(PERMISSIONS.VIEW_ALL_USERS)
    }

    // Check if user can delete items
    const canDelete = resource => {
        return canAccess(resource, 'delete') &&
            (hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN))
    }

    // Check if user can access sensitive data
    const canAccessSensitiveData = () => {
        return hasPermission(PERMISSIONS.ACCESS_SENSITIVE_DATA) ||
            hasRole(ROLES.COMPLIANCE_OFFICER)
    }

    const value = {
        hasPermission,
        hasRole,
        canAccess,
        canBulkAction,
        canExport,
        canApprove,
        canManageSettings,
        canViewAnalytics,
        canManageUsers,
        canManageKYC,
        canManageProperties,
        canManagePayments,
        canViewUserData,
        canDelete,
        canAccessSensitiveData,
    }

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    )
}