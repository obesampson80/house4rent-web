// src/pages/Properties/PropertiesListWithForms.jsx
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { propertyService } from '@services/propertyService'
import PropertyForm from '@components/forms/PropertyForm'
import { PropertyStatusModal, BulkActionModal } from '@components/forms/QuickActionForms'
import { useFormModal } from '@hooks/useFormModal'

const PropertiesListWithForms = () => {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProperties, setSelectedProperties] = useState([])

    // Form modals
    const propertyForm = useFormModal()
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedPropertyForStatus, setSelectedPropertyForStatus] = useState(null)
    const [showBulkModal, setShowBulkModal] = useState(false)

    // Load properties
    useEffect(() => {
        loadProperties()
    }, [])

    const loadProperties = async () => {
        try {
            setLoading(true)
            const response = await propertyService.getAll()
            setProperties(response.data)
        } catch (error) {
            toast.error('Failed to load properties')
            console.error('Error loading properties:', error)
        } finally {
            setLoading(false)
        }
    }

    // Property form handlers
    const handlePropertySave = async (propertyData) => {
        try {
            propertyForm.setLoading(true)

            if (propertyForm.mode === 'create') {
                await propertyService.create(propertyData)
                toast.success('Property created successfully')
            } else {
                await propertyService.update(propertyForm.editData.id, propertyData)
                toast.success('Property updated successfully')
            }

            propertyForm.close()
            await loadProperties() // Refresh data

        } catch (error) {
            toast.error(`Failed to ${propertyForm.mode === 'create' ? 'create' : 'update'} property`)
            console.error('Error saving property:', error)
        } finally {
            propertyForm.setLoading(false)
        }
    }

    // Status change handlers
    const handleStatusChange = (property) => {
        setSelectedPropertyForStatus(property)
        setShowStatusModal(true)
    }

    const handlePropertyStatusUpdate = async (statusData) => {
        try {
            await propertyService.updateStatus(statusData.propertyId, statusData)
            toast.success('Property status updated successfully')
            setShowStatusModal(false)
            setSelectedPropertyForStatus(null)
            await loadProperties() // Refresh data
        } catch (error) {
            toast.error('Failed to update property status')
            console.error('Error updating status:', error)
        }
    }

    // Bulk actions
    const handleBulkAction = async (actionData) => {
        try {
            await propertyService.bulkAction(actionData)
            toast.success(`Bulk action "${actionData.action}" completed successfully`)
            setShowBulkModal(false)
            setSelectedProperties([])
            await loadProperties() // Refresh data
        } catch (error) {
            toast.error('Failed to perform bulk action')
            console.error('Error performing bulk action:', error)
        }
    }

    const handleSelectProperty = (propertyId, checked) => {
        if (checked) {
            setSelectedProperties(prev => [...prev, propertyId])
        } else {
            setSelectedProperties(prev => prev.filter(id => id !== propertyId))
        }
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedProperties(properties.map(p => p.id))
        } else {
            setSelectedProperties([])
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Properties Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create, edit, and manage property listings with advanced workflows
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    {selectedProperties.length > 0 && (
                        <Button
                            variant="secondary"
                            onClick={() => setShowBulkModal(true)}
                        >
                            Bulk Actions ({selectedProperties.length})
                        </Button>
                    )}
                    <Button variant="secondary">
                        Export Data
                    </Button>
                    <Button onClick={propertyForm.openCreate}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Property
                    </Button>
                </div>
            </div>

            {/* Properties Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedProperties.length === properties.length && properties.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Property
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedProperties.includes(property.id)}
                                            onChange={(e) => handleSelectProperty(property.id, e.target.checked)}
                                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {property.title}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {property.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={property.status === 'approved' ? 'success' : 'warning'}>
                                            {property.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            ₦{property.price?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => propertyForm.openEdit(property)}
                                                className="text-primary-600 hover:text-primary-500 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                title="Edit Property"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(property)}
                                                className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                title="Change Status"
                                            >
                                                <ClockIcon className="h-4 w-4" />
                                            </button>
                                            <Link
                                                to={`/properties/${property.id}`}
                                                className="text-gray-600 hover:text-gray-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Property Form Modal */}
            {propertyForm.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={propertyForm.close} />
                    <div className="relative">
                        <PropertyForm
                            mode={propertyForm.mode}
                            initialData={propertyForm.editData}
                            onClose={propertyForm.close}
                            onSave={handlePropertySave}
                            loading={propertyForm.loading}
                        />
                    </div>
                </div>
            )}

            {/* Property Status Modal */}
            <PropertyStatusModal
                isOpen={showStatusModal}
                onClose={() => {
                    setShowStatusModal(false)
                    setSelectedPropertyForStatus(null)
                }}
                property={selectedPropertyForStatus}
                onStatusChange={handlePropertyStatusUpdate}
            />

            {/* Bulk Actions Modal */}
            <BulkActionModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                selectedItems={selectedProperties}
                itemType="properties"
                onBulkAction={handleBulkAction}
            />
        </div>
    )
}

export default PropertiesListWithForms
