import { useState } from 'react'

export const useFormModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [loading, setLoading] = useState(false)

    const openCreate = () => {
        setEditData(null)
        setIsOpen(true)
    }

    const openEdit = (data) => {
        setEditData(data)
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
        setEditData(null)
        setLoading(false)
    }

    return {
        isOpen,
        editData,
        loading,
        setLoading,
        openCreate,
        openEdit,
        close,
        mode: editData ? 'edit' : 'create'
    }
}

// Usage in your components:
const { isOpen, editData, openCreate, openEdit, close, mode } = useFormModal()
