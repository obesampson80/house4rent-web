// src/hooks/useApiOperation.js
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export const useApiOperation = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const execute = async (operation, successMessage = 'Operation completed successfully') => {
        try {
            setLoading(true)
            setError(null)
            const result = await operation()
            toast.success(successMessage)
            return result
        } catch (err) {
            const errorMessage = err.message || 'An error occurred'
            setError(errorMessage)
            toast.error(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { execute, loading, error }
}

// Usage example:
const MyComponent = () => {
    const apiOperation = useApiOperation()

    const handleSave = async (data) => {
        await apiOperation.execute(
            () => userService.create(data),
            'User created successfully'
        )
    }

    return (
        <div>
            {apiOperation.loading && <p>Loading...</p>}
            {apiOperation.error && <p>Error: {apiOperation.error}</p>}
            {/* Component content */}
        </div>
    )
}
