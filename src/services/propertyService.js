// src/services/propertyService.js
export const propertyService = {
    create: async (propertyData) => {
        const response = await fetch('/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(propertyData)
        })

        if (!response.ok) {
            throw new Error('Failed to create property')
        }

        return await response.json()
    },

    update: async (id, propertyData) => {
        const response = await fetch(`/api/properties/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(propertyData)
        })

        if (!response.ok) {
            throw new Error('Failed to update property')
        }

        return await response.json()
    },

    updateStatus: async (id, statusData) => {
        const response = await fetch(`/api/properties/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(statusData)
        })

        if (!response.ok) {
            throw new Error('Failed to update property status')
        }

        return await response.json()
    }
}
