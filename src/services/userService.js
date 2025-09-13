// src/services/userService.js
export const userService = {
    create: async (userData) => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        })

        if (!response.ok) {
            throw new Error('Failed to create user')
        }

        return await response.json()
    },

    update: async (id, userData) => {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        })

        if (!response.ok) {
            throw new Error('Failed to update user')
        }

        return await response.json()
    },

    updateStatus: async (id, statusData) => {
        const response = await fetch(`/api/users/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(statusData)
        })

        if (!response.ok) {
            throw new Error('Failed to update user status')
        }

        return await response.json()
    },

    bulkAction: async (actionData) => {
        const response = await fetch('/api/users/bulk-action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(actionData)
        })

        if (!response.ok) {
            throw new Error('Failed to perform bulk action')
        }

        return await response.json()
    }
}
