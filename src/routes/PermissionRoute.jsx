import { Navigate } from 'react-router-dom'
import { usePermission } from '@contexts/PermissionContext'

export const PermissionRoute = ({
    children,
    permissions = [],
    roles = [],
    requireAll = false
}) => {
    const { hasPermission, hasRole } = usePermission()

    // Check if user has required permissions
    const hasRequiredPermissions = requireAll
        ? permissions.every(permission => hasPermission(permission))
        : permissions.some(permission => hasPermission(permission))

    // Check if user has required roles
    const hasRequiredRoles = requireAll
        ? roles.every(role => hasRole(role))
        : roles.some(role => hasRole(role))

    // User needs either permissions or roles (unless both are specified)
    const hasAccess = permissions.length > 0 && roles.length > 0
        ? hasRequiredPermissions && hasRequiredRoles
        : hasRequiredPermissions || hasRequiredRoles

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}