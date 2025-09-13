// src/components/forms/PropertyForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    BuildingOfficeIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    PhotoIcon,
    DocumentTextIcon,
    CheckIcon,
    XMarkIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Card from '@components/common/Card/Card'
import { FormField, Select, Textarea, Checkbox, FileUpload } from '@components/common/Form'
import Modal from '@components/common/Modal/Modal'

const PROPERTY_CATEGORIES = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'specialized', label: 'Specialized' },
]

const PROPERTY_TYPES = {
    residential: [
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House' },
        { value: 'duplex', label: 'Duplex' },
        { value: 'penthouse', label: 'Penthouse' },
        { value: 'studio', label: 'Studio' },
    ],
    commercial: [
        { value: 'office', label: 'Office Space' },
        { value: 'shop', label: 'Shop/Retail' },
        { value: 'warehouse', label: 'Warehouse' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'hotel', label: 'Hotel' },
    ],
    land: [
        { value: 'residential_land', label: 'Residential Land' },
        { value: 'commercial_land', label: 'Commercial Land' },
        { value: 'agricultural', label: 'Agricultural Land' },
        { value: 'industrial', label: 'Industrial Land' },
    ],
    specialized: [
        { value: 'hospital', label: 'Hospital/Clinic' },
        { value: 'school', label: 'School/Educational' },
        { value: 'religious', label: 'Religious Building' },
        { value: 'recreational', label: 'Recreational Facility' },
    ],
}

const NIGERIAN_STATES = [
    'Lagos', 'Abuja (FCT)', 'Rivers', 'Ogun', 'Kano', 'Kaduna', 'Oyo', 'Delta', 'Edo', 'Anambra',
    'Imo', 'Enugu', 'Abia', 'Akwa Ibom', 'Cross River', 'Bayelsa', 'Ondo', 'Osun', 'Ekiti', 'Kwara',
    'Kogi', 'Benue', 'Plateau', 'Nasarawa', 'Taraba', 'Adamawa', 'Gombe', 'Bauchi', 'Yobe', 'Borno',
    'Jigawa', 'Katsina', 'Zamfara', 'Sokoto', 'Kebbi', 'Niger', 'Ebonyi'
].map(state => ({ value: state, label: state }))

const FEATURES_OPTIONS = [
    'Air Conditioning', 'Security', 'Generator', 'Water Supply', 'Parking Space',
    'Swimming Pool', 'Gym', 'Elevator', 'Balcony', 'Garden', 'Furnished',
    'Semi-Furnished', 'CCTV', 'Fence', 'Gate House', 'Borehole', 'Solar Power',
    'Intercom', 'Fire Safety', 'Playground', 'Shopping Mall', 'Hospital Nearby',
    'School Nearby', 'Public Transport'
]

const PropertyForm = ({ mode = 'create', initialData = null }) => {
    const navigate = useNavigate()
    const { id } = useParams()

    // Form state
    const [formData, setFormData] = useState({
        // Basic Information
        title: '',
        description: '',
        category: '',
        type: '',

        // Location
        address: '',
        city: '',
        state: '',
        lga: '', // Local Government Area
        coordinates: { lat: '', lng: '' },

        // Property Details
        bedrooms: '',
        bathrooms: '',
        area: '',
        yearBuilt: '',
        floors: '',
        furnished: false,

        // Pricing
        price: '',
        priceNegotiable: false,
        serviceCharge: '',
        agreementFee: '',
        cautionFee: '',

        // Features & Amenities
        features: [],

        // Media
        images: [],
        documents: [],

        // Additional Info
        availability: 'available',
        moveInDate: '',
        leaseDuration: '',
        petPolicy: '',
        smokingPolicy: 'not_allowed',

        // Owner/Agent Info (for admin use)
        ownerId: '',
        agentId: '',

        // Admin fields
        status: 'pending_approval',
        priority: 'normal',
        adminNotes: '',
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [showPreview, setShowPreview] = useState(false)
    const [availableTypes, setAvailableTypes] = useState([])

    // Load existing data if editing
    useEffect(() => {
        if (mode === 'edit' && id) {
            setLoading(true)
            // In real app, fetch property data by ID
            setTimeout(() => {
                // Mock data for editing
                setFormData({
                    ...formData,
                    title: '3 Bedroom Apartment in Lekki',
                    description: 'Modern apartment with excellent amenities',
                    category: 'residential',
                    type: 'apartment',
                    address: '15 Admiralty Way, Lekki Phase 1',
                    city: 'Lagos',
                    state: 'Lagos',
                    bedrooms: '3',
                    bathrooms: '2',
                    area: '120',
                    price: '1200000',
                    furnished: true,
                    features: ['Air Conditioning', 'Security', 'Generator'],
                    status: 'approved',
                })
                setLoading(false)
            }, 500)
        }
    }, [mode, id])

    // Update available types when category changes
    useEffect(() => {
        if (formData.category) {
            setAvailableTypes(PROPERTY_TYPES[formData.category] || [])
            if (formData.type && !PROPERTY_TYPES[formData.category]?.find(t => t.value === formData.type)) {
                setFormData(prev => ({ ...prev, type: '' }))
            }
        } else {
            setAvailableTypes([])
        }
    }, [formData.category])

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const handleFeatureToggle = (feature) => {
        const currentFeatures = formData.features
        const newFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter(f => f !== feature)
            : [...currentFeatures, feature]

        handleInputChange('features', newFeatures)
    }

    const validateStep = (step) => {
        const newErrors = {}

        switch (step) {
            case 1: // Basic Information
                if (!formData.title.trim()) newErrors.title = 'Title is required'
                if (!formData.description.trim()) newErrors.description = 'Description is required'
                if (!formData.category) newErrors.category = 'Category is required'
                if (!formData.type) newErrors.type = 'Property type is required'
                break

            case 2: // Location
                if (!formData.address.trim()) newErrors.address = 'Address is required'
                if (!formData.city.trim()) newErrors.city = 'City is required'
                if (!formData.state) newErrors.state = 'State is required'
                break

            case 3: // Property Details
                if (formData.category === 'residential' && !formData.bedrooms) {
                    newErrors.bedrooms = 'Number of bedrooms is required'
                }
                if (formData.category === 'residential' && !formData.bathrooms) {
                    newErrors.bathrooms = 'Number of bathrooms is required'
                }
                if (!formData.area) newErrors.area = 'Area is required'
                break

            case 4: // Pricing
                if (!formData.price) newErrors.price = 'Price is required'
                else if (isNaN(formData.price) || formData.price <= 0) {
                    newErrors.price = 'Please enter a valid price'
                }
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 6))
        }
    }

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return

        setLoading(true)
        try {
            // In real app, submit to API
            console.log('Submitting property:', formData)

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Success notification would go here
            navigate('/properties')
        } catch (error) {
            console.error('Error saving property:', error)
            // Error notification would go here
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { id: 1, title: 'Basic Information', icon: BuildingOfficeIcon },
        { id: 2, title: 'Location Details', icon: MapPinIcon },
        { id: 3, title: 'Property Details', icon: BuildingOfficeIcon },
        { id: 4, title: 'Pricing', icon: CurrencyDollarIcon },
        { id: 5, title: 'Media & Documents', icon: PhotoIcon },
        { id: 6, title: 'Review & Submit', icon: CheckIcon },
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            onClick={() => navigate('/properties')}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mode === 'create' ? 'Add New Property' : 'Edit Property'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                {mode === 'create'
                                    ? 'Fill in the details to list a new property'
                                    : 'Update property information'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <nav className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const Icon = step.icon
                                const isActive = currentStep === step.id
                                const isCompleted = currentStep > step.id
                                const isAccessible = currentStep >= step.id

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className="flex items-center">
                                            <div
                                                className={`
                                                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                                                    ${isCompleted
                                                        ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                                                        : isActive
                                                            ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:border-primary-400 dark:text-primary-400'
                                                            : isAccessible
                                                                ? 'bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                                                                : 'bg-gray-50 border-gray-200 text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600'
                                                    }
                                                `}
                                            >
                                                {isCompleted ? (
                                                    <CheckIcon className="h-5 w-5" />
                                                ) : (
                                                    <Icon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="ml-3 hidden sm:block">
                                                <div className={`
                                                    text-sm font-medium
                                                    ${isActive
                                                        ? 'text-primary-700 dark:text-primary-400'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                    }
                                                `}>
                                                    {step.title}
                                                </div>
                                            </div>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`
                                                w-8 h-px mx-4
                                                ${isCompleted || currentStep > step.id
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                                }
                                            `} />
                                        )}
                                    </div>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Form Content */}
                <Card className="p-6">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Basic Property Information
                            </h2>

                            <FormField
                                label="Property Title"
                                name="title"
                                placeholder="e.g., 3 Bedroom Apartment in Lekki"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                error={errors.title}
                                required
                                helpText="Enter a descriptive title for your property"
                            />

                            <Textarea
                                label="Description"
                                name="description"
                                placeholder="Describe the property, its features, and what makes it special..."
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                error={errors.description}
                                required
                                rows={5}
                                helpText="Provide detailed information about the property"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Property Category"
                                    name="category"
                                    options={PROPERTY_CATEGORIES}
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    error={errors.category}
                                    required
                                    placeholder="Select a category"
                                />

                                <Select
                                    label="Property Type"
                                    name="type"
                                    options={availableTypes}
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    error={errors.type}
                                    required
                                    placeholder="Select property type"
                                    disabled={!formData.category}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Property Location
                            </h2>

                            <FormField
                                label="Full Address"
                                name="address"
                                placeholder="Enter the complete property address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                error={errors.address}
                                required
                                helpText="Include street name, house number, and area"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="City"
                                    name="city"
                                    placeholder="e.g., Lagos"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    error={errors.city}
                                    required
                                />

                                <Select
                                    label="State"
                                    name="state"
                                    options={NIGERIAN_STATES}
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    error={errors.state}
                                    required
                                    placeholder="Select state"
                                />
                            </div>

                            <FormField
                                label="Local Government Area (LGA)"
                                name="lga"
                                placeholder="e.g., Eti-Osa"
                                value={formData.lga}
                                onChange={(e) => handleInputChange('lga', e.target.value)}
                                helpText="Optional: Specify the LGA for better location accuracy"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Latitude"
                                    name="latitude"
                                    type="number"
                                    step="any"
                                    placeholder="6.4474"
                                    value={formData.coordinates.lat}
                                    onChange={(e) => handleInputChange('coordinates', {
                                        ...formData.coordinates,
                                        lat: e.target.value
                                    })}
                                    helpText="Optional: GPS coordinates"
                                />

                                <FormField
                                    label="Longitude"
                                    name="longitude"
                                    type="number"
                                    step="any"
                                    placeholder="3.5412"
                                    value={formData.coordinates.lng}
                                    onChange={(e) => handleInputChange('coordinates', {
                                        ...formData.coordinates,
                                        lng: e.target.value
                                    })}
                                    helpText="Optional: GPS coordinates"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Property Details */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Property Specifications
                            </h2>

                            {formData.category === 'residential' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        label="Bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        placeholder="3"
                                        value={formData.bedrooms}
                                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                                        error={errors.bedrooms}
                                        required
                                    />

                                    <FormField
                                        label="Bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        placeholder="2"
                                        value={formData.bathrooms}
                                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                                        error={errors.bathrooms}
                                        required
                                    />

                                    <FormField
                                        label="Toilets"
                                        name="toilets"
                                        type="number"
                                        placeholder="3"
                                        value={formData.toilets}
                                        onChange={(e) => handleInputChange('toilets', e.target.value)}
                                        helpText="If different from bathrooms"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label={`Area (${formData.category === 'land' ? 'in plots or sqm' : 'Square Meters'})`}
                                    name="area"
                                    type="number"
                                    placeholder="120"
                                    value={formData.area}
                                    onChange={(e) => handleInputChange('area', e.target.value)}
                                    error={errors.area}
                                    required
                                />

                                <FormField
                                    label="Year Built"
                                    name="yearBuilt"
                                    type="number"
                                    placeholder="2020"
                                    value={formData.yearBuilt}
                                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                                    helpText="Optional: When was the property built"
                                />
                            </div>

                            {formData.category !== 'land' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Number of Floors"
                                        name="floors"
                                        type="number"
                                        placeholder="2"
                                        value={formData.floors}
                                        onChange={(e) => handleInputChange('floors', e.target.value)}
                                        helpText="Total floors in the building"
                                    />

                                    <div className="flex items-center space-x-6 pt-6">
                                        <Checkbox
                                            label="Furnished"
                                            name="furnished"
                                            checked={formData.furnished}
                                            onChange={(e) => handleInputChange('furnished', e.target.checked)}
                                            helpText="Property comes with furniture"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Pricing */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Pricing Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Price (₦)"
                                    name="price"
                                    type="number"
                                    placeholder="1200000"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    error={errors.price}
                                    required
                                    helpText="Enter the rent/sale price in Naira"
                                />

                                <div className="flex items-center pt-8">
                                    <Checkbox
                                        label="Price is negotiable"
                                        name="priceNegotiable"
                                        checked={formData.priceNegotiable}
                                        onChange={(e) => handleInputChange('priceNegotiable', e.target.checked)}
                                        helpText="Allow price negotiations"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    label="Service Charge (₦)"
                                    name="serviceCharge"
                                    type="number"
                                    placeholder="50000"
                                    value={formData.serviceCharge}
                                    onChange={(e) => handleInputChange('serviceCharge', e.target.value)}
                                    helpText="Annual service charge"
                                />

                                <FormField
                                    label="Agreement Fee (₦)"
                                    name="agreementFee"
                                    type="number"
                                    placeholder="100000"
                                    value={formData.agreementFee}
                                    onChange={(e) => handleInputChange('agreementFee', e.target.value)}
                                    helpText="Legal/Agreement fee"
                                />

                                <FormField
                                    label="Caution Fee (₦)"
                                    name="cautionFee"
                                    type="number"
                                    placeholder="200000"
                                    value={formData.cautionFee}
                                    onChange={(e) => handleInputChange('cautionFee', e.target.value)}
                                    helpText="Security deposit"
                                />
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Total Upfront Cost</h3>
                                <div className="text-2xl font-bold text-primary-600">
                                    ₦{(
                                        parseInt(formData.price || 0) +
                                        parseInt(formData.serviceCharge || 0) +
                                        parseInt(formData.agreementFee || 0) +
                                        parseInt(formData.cautionFee || 0)
                                    ).toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Total amount tenant needs to pay upfront
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Media & Documents */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Photos & Documents
                            </h2>

                            <FileUpload
                                label="Property Photos"
                                name="images"
                                accept="image/*"
                                multiple={true}
                                maxSize={10 * 1024 * 1024} // 10MB
                                onFileChange={(files) => handleInputChange('images', files)}
                                helpText="Upload high-quality photos of your property. First image will be the main photo."
                            />

                            <FileUpload
                                label="Property Documents"
                                name="documents"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                multiple={true}
                                maxSize={15 * 1024 * 1024} // 15MB
                                onFileChange={(files) => handleInputChange('documents', files)}
                                helpText="Upload relevant documents (C of O, Survey, Deed, etc.)"
                            />

                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900 dark:text-white">Features & Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {FEATURES_OPTIONS.map((feature) => (
                                        <label
                                            key={feature}
                                            className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.features.includes(feature)}
                                                onChange={() => handleFeatureToggle(feature)}
                                                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {feature}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Review & Submit */}
                    {currentStep === 6 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Review & Submit
                            </h2>

                            {/* Property Summary */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Property Summary</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Information</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Title:</dt>
                                                <dd className="font-medium">{formData.title}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Category:</dt>
                                                <dd className="font-medium capitalize">{formData.category}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Type:</dt>
                                                <dd className="font-medium capitalize">{formData.type}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Location</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Address:</dt>
                                                <dd className="font-medium text-right">{formData.address}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">City:</dt>
                                                <dd className="font-medium">{formData.city}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">State:</dt>
                                                <dd className="font-medium">{formData.state}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Property Details</h4>
                                        <dl className="space-y-1 text-sm">
                                            {formData.bedrooms && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Bedrooms:</dt>
                                                    <dd className="font-medium">{formData.bedrooms}</dd>
                                                </div>
                                            )}
                                            {formData.bathrooms && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Bathrooms:</dt>
                                                    <dd className="font-medium">{formData.bathrooms}</dd>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Area:</dt>
                                                <dd className="font-medium">{formData.area} sqm</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pricing</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Price:</dt>
                                                <dd className="font-medium">₦{parseInt(formData.price || 0).toLocaleString()}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Total Upfront:</dt>
                                                <dd className="font-bold text-primary-600">
                                                    ₦{(
                                                        parseInt(formData.price || 0) +
                                                        parseInt(formData.serviceCharge || 0) +
                                                        parseInt(formData.agreementFee || 0) +
                                                        parseInt(formData.cautionFee || 0)
                                                    ).toLocaleString()}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {formData.features.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Features</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.features.map((feature) => (
                                                <span
                                                    key={feature}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Admin Controls for editing mode */}
                            {mode === 'edit' && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Admin Controls</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Select
                                            label="Property Status"
                                            name="status"
                                            options={[
                                                { value: 'pending_approval', label: 'Pending Approval' },
                                                { value: 'under_review', label: 'Under Review' },
                                                { value: 'approved', label: 'Approved' },
                                                { value: 'rejected', label: 'Rejected' },
                                                { value: 'listed', label: 'Listed' },
                                                { value: 'delisted', label: 'Delisted' },
                                            ]}
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                        />

                                        <Select
                                            label="Priority"
                                            name="priority"
                                            options={[
                                                { value: 'low', label: 'Low' },
                                                { value: 'normal', label: 'Normal' },
                                                { value: 'high', label: 'High' },
                                                { value: 'urgent', label: 'Urgent' },
                                            ]}
                                            value={formData.priority}
                                            onChange={(e) => handleInputChange('priority', e.target.value)}
                                        />
                                    </div>

                                    <Textarea
                                        label="Admin Notes"
                                        name="adminNotes"
                                        placeholder="Add internal notes about this property..."
                                        value={formData.adminNotes}
                                        onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                                        rows={3}
                                        helpText="Internal notes for admin team (not visible to users)"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            {currentStep > 1 && (
                                <Button
                                    variant="secondary"
                                    onClick={handlePrevious}
                                    disabled={loading}
                                >
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button
                                variant="secondary"
                                onClick={() => setShowPreview(true)}
                            >
                                Preview
                            </Button>

                            {currentStep < 6 ? (
                                <Button onClick={handleNext} disabled={loading}>
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="min-w-[120px]"
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        mode === 'create' ? 'Submit Property' : 'Update Property'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Preview Modal */}
                <Modal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    title="Property Preview"
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-center">
                                <PhotoIcon className="h-12 w-12 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {formData.title || 'Property Title'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {formData.address}, {formData.city}, {formData.state}
                            </p>
                        </div>

                        <div className="text-2xl font-bold text-primary-600">
                            ₦{parseInt(formData.price || 0).toLocaleString()}
                            <span className="text-sm font-normal text-gray-500"> /year</span>
                        </div>

                        {formData.description && (
                            <p className="text-gray-700 dark:text-gray-300">
                                {formData.description}
                            </p>
                        )}

                        {formData.features.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default PropertyForm