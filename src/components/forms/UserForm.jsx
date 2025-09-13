// src/components/forms/UserForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ShieldCheckIcon,
    BanknotesIcon,
    ArrowLeftIcon,
    CheckIcon,
    EyeIcon,
    EyeSlashIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Card from '@components/common/Card/Card'
import { FormField, Select, Textarea, Checkbox } from '@components/common/Form'
import Modal from '@components/common/Modal/Modal'

const USER_ROLES = [
    { value: 'tenant', label: 'Tenant' },
    { value: 'landlord', label: 'Landlord' },
    { value: 'agent', label: 'Property Agent' },
    { value: 'property_seeker', label: 'Property Seeker' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' },
]

const USER_STATUS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'pending', label: 'Pending Verification' },
]

const KYC_STATUS = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
]

const VERIFICATION_LEVELS = [
    { value: 'level_1', label: 'Level 1 - Basic' },
    { value: 'level_2', label: 'Level 2 - Intermediate' },
    { value: 'level_3', label: 'Level 3 - Advanced' },
    { value: 'level_4', label: 'Level 4 - Premium' },
    { value: 'level_5', label: 'Level 5 - Elite' },
]

const NIGERIAN_STATES = [
    'Lagos', 'Abuja (FCT)', 'Rivers', 'Ogun', 'Kano', 'Kaduna', 'Oyo', 'Delta', 'Edo', 'Anambra',
    'Imo', 'Enugu', 'Abia', 'Akwa Ibom', 'Cross River', 'Bayelsa', 'Ondo', 'Osun', 'Ekiti', 'Kwara',
    'Kogi', 'Benue', 'Plateau', 'Nasarawa', 'Taraba', 'Adamawa', 'Gombe', 'Bauchi', 'Yobe', 'Borno',
    'Jigawa', 'Katsina', 'Zamfara', 'Sokoto', 'Kebbi', 'Niger', 'Ebonyi'
].map(state => ({ value: state, label: state }))

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

const ACCOUNT_TYPES = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
    { value: 'corporate', label: 'Corporate' },
]

const UserForm = ({ mode = 'create', initialData = null }) => {
    const navigate = useNavigate()
    const { id } = useParams()

    // Form state
    const [formData, setFormData] = useState({
        // Basic Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',

        // Account Details
        role: 'tenant',
        status: 'active',
        kycStatus: 'not_started',
        verificationLevel: 'level_1',

        // Address Information
        address: {
            street: '',
            city: '',
            state: '',
            country: 'Nigeria',
            postalCode: '',
        },

        // Emergency Contact
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: '',
        },

        // Bank Details
        bankDetails: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            accountType: 'savings',
            bvn: '',
        },

        // Professional Info (for agents)
        professional: {
            companyName: '',
            licenseNumber: '',
            yearsExperience: '',
            specialization: [],
            bio: '',
        },

        // Preferences
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: false,
            newsletter: true,
        },

        // Admin fields
        adminNotes: '',
        tags: [],

        // Security
        password: '',
        confirmPassword: '',
        requirePasswordChange: false,
        twoFactorEnabled: false,
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    // Load existing data if editing
    useEffect(() => {
        if (mode === 'edit' && id) {
            setLoading(true)
            // In real app, fetch user data by ID
            setTimeout(() => {
                // Mock data for editing
                setFormData({
                    ...formData,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+234 801 234 5678',
                    role: 'agent',
                    status: 'active',
                    kycStatus: 'approved',
                    verificationLevel: 'level_3',
                    address: {
                        ...formData.address,
                        street: '123 Victoria Island',
                        city: 'Lagos',
                        state: 'Lagos',
                    },
                })
                setLoading(false)
            }, 500)
        }
    }, [mode, id])

    const handleInputChange = (name, value) => {
        if (name.includes('.')) {
            // Handle nested object updates
            const keys = name.split('.')
            setFormData(prev => {
                const newData = { ...prev }
                let current = newData
                for (let i = 0; i < keys.length - 1; i++) {
                    current[keys[i]] = { ...current[keys[i]] }
                    current = current[keys[i]]
                }
                current[keys[keys.length - 1]] = value
                return newData
            })
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const validateStep = (step) => {
        const newErrors = {}

        switch (step) {
            case 1: // Basic Information
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
                if (!formData.email.trim()) newErrors.email = 'Email is required'
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
                if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
                break

            case 2: // Account Details
                if (!formData.role) newErrors.role = 'Role is required'
                if (!formData.status) newErrors.status = 'Status is required'
                break

            case 3: // Address & Contact
                if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required'
                if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required'
                if (!formData.address.state) newErrors['address.state'] = 'State is required'
                break

            case 4: // Security (only for new users)
                if (mode === 'create') {
                    if (!formData.password) newErrors.password = 'Password is required'
                    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
                    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password'
                    else if (formData.password !== formData.confirmPassword) {
                        newErrors.confirmPassword = 'Passwords do not match'
                    }
                }
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, mode === 'create' ? 5 : 4))
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
            console.log('Submitting user:', formData)

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Success notification would go here
            navigate('/users')
        } catch (error) {
            console.error('Error saving user:', error)
            // Error notification would go here
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { id: 1, title: 'Basic Information', icon: UserIcon },
        { id: 2, title: 'Account Details', icon: ShieldCheckIcon },
        { id: 3, title: 'Address & Contact', icon: MapPinIcon },
        ...(mode === 'create' ? [{ id: 4, title: 'Security', icon: ShieldCheckIcon }] : []),
        { id: mode === 'create' ? 5 : 4, title: 'Review & Submit', icon: CheckIcon },
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
                            onClick={() => navigate('/users')}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {mode === 'create' ? 'Add New User' : 'Edit User'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                {mode === 'create'
                                    ? 'Create a new user account with access permissions'
                                    : 'Update user information and settings'
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
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="First Name"
                                    name="firstName"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    error={errors.firstName}
                                    required
                                />

                                <FormField
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    error={errors.lastName}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={errors.email}
                                    required
                                />

                                <FormField
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    placeholder="+234 801 234 5678"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    error={errors.phone}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    error={errors.dateOfBirth}
                                    helpText="Optional: Used for age verification"
                                />

                                <Select
                                    label="Gender"
                                    name="gender"
                                    options={GENDER_OPTIONS}
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    placeholder="Select gender"
                                    helpText="Optional: For statistical purposes"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Account Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Account Configuration
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="User Role"
                                    name="role"
                                    options={USER_ROLES}
                                    value={formData.role}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    error={errors.role}
                                    required
                                    helpText="Determines user permissions and access level"
                                />

                                <Select
                                    label="Account Status"
                                    name="status"
                                    options={USER_STATUS}
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    error={errors.status}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="KYC Status"
                                    name="kycStatus"
                                    options={KYC_STATUS}
                                    value={formData.kycStatus}
                                    onChange={(e) => handleInputChange('kycStatus', e.target.value)}
                                    helpText="Know Your Customer verification status"
                                />

                                <Select
                                    label="Verification Level"
                                    name="verificationLevel"
                                    options={VERIFICATION_LEVELS}
                                    value={formData.verificationLevel}
                                    onChange={(e) => handleInputChange('verificationLevel', e.target.value)}
                                    helpText="User trust and verification level"
                                />
                            </div>

                            {/* Professional Info for Agents */}
                            {formData.role === 'agent' && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                        Professional Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Company/Agency Name"
                                            name="professional.companyName"
                                            placeholder="ABC Real Estate"
                                            value={formData.professional.companyName}
                                            onChange={(e) => handleInputChange('professional.companyName', e.target.value)}
                                        />

                                        <FormField
                                            label="License Number"
                                            name="professional.licenseNumber"
                                            placeholder="REA/LAG/2019/001234"
                                            value={formData.professional.licenseNumber}
                                            onChange={(e) => handleInputChange('professional.licenseNumber', e.target.value)}
                                            helpText="Real Estate Agent License Number"
                                        />
                                    </div>

                                    <FormField
                                        label="Years of Experience"
                                        name="professional.yearsExperience"
                                        type="number"
                                        placeholder="5"
                                        value={formData.professional.yearsExperience}
                                        onChange={(e) => handleInputChange('professional.yearsExperience', e.target.value)}
                                    />

                                    <Textarea
                                        label="Professional Bio"
                                        name="professional.bio"
                                        placeholder="Brief description of experience and expertise..."
                                        value={formData.professional.bio}
                                        onChange={(e) => handleInputChange('professional.bio', e.target.value)}
                                        rows={4}
                                        helpText="This will be displayed on the agent's public profile"
                                    />
                                </div>
                            )}

                            {/* Preferences */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                    Notification Preferences
                                </h3>

                                <div className="space-y-4">
                                    <Checkbox
                                        label="Email Notifications"
                                        name="preferences.emailNotifications"
                                        checked={formData.preferences.emailNotifications}
                                        onChange={(e) => handleInputChange('preferences.emailNotifications', e.target.checked)}
                                        helpText="Receive important account and property updates via email"
                                    />

                                    <Checkbox
                                        label="SMS Notifications"
                                        name="preferences.smsNotifications"
                                        checked={formData.preferences.smsNotifications}
                                        onChange={(e) => handleInputChange('preferences.smsNotifications', e.target.checked)}
                                        helpText="Receive urgent notifications via SMS"
                                    />

                                    <Checkbox
                                        label="Marketing Emails"
                                        name="preferences.marketingEmails"
                                        checked={formData.preferences.marketingEmails}
                                        onChange={(e) => handleInputChange('preferences.marketingEmails', e.target.checked)}
                                        helpText="Receive promotional offers and marketing communications"
                                    />

                                    <Checkbox
                                        label="Newsletter Subscription"
                                        name="preferences.newsletter"
                                        checked={formData.preferences.newsletter}
                                        onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                                        helpText="Subscribe to monthly newsletter with market insights"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Address & Contact */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Address & Emergency Contact
                            </h2>

                            <div className="space-y-6">
                                <h3 className="text-md font-medium text-gray-900 dark:text-white">
                                    Residential Address
                                </h3>

                                <FormField
                                    label="Street Address"
                                    name="address.street"
                                    placeholder="123 Victoria Island Street"
                                    value={formData.address.street}
                                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                                    error={errors['address.street']}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="City"
                                        name="address.city"
                                        placeholder="Lagos"
                                        value={formData.address.city}
                                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                                        error={errors['address.city']}
                                        required
                                    />

                                    <Select
                                        label="State"
                                        name="address.state"
                                        options={NIGERIAN_STATES}
                                        value={formData.address.state}
                                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                                        error={errors['address.state']}
                                        required
                                        placeholder="Select state"
                                    />
                                </div>

                                <FormField
                                    label="Postal Code"
                                    name="address.postalCode"
                                    placeholder="101001"
                                    value={formData.address.postalCode}
                                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                                    helpText="Optional: Postal/ZIP code"
                                />
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                    Emergency Contact
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Contact Name"
                                        name="emergencyContact.name"
                                        placeholder="Jane Doe"
                                        value={formData.emergencyContact.name}
                                        onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                                        helpText="Full name of emergency contact"
                                    />

                                    <FormField
                                        label="Relationship"
                                        name="emergencyContact.relationship"
                                        placeholder="Spouse"
                                        value={formData.emergencyContact.relationship}
                                        onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                                        helpText="Relationship to the user"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Contact Phone"
                                        name="emergencyContact.phone"
                                        type="tel"
                                        placeholder="+234 802 345 6789"
                                        value={formData.emergencyContact.phone}
                                        onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                                    />

                                    <FormField
                                        label="Contact Email"
                                        name="emergencyContact.email"
                                        type="email"
                                        placeholder="jane.doe@example.com"
                                        value={formData.emergencyContact.email}
                                        onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
                                        helpText="Optional: Emergency contact email"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                                    Bank Account Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Account Name"
                                        name="bankDetails.accountName"
                                        placeholder="JOHN DOE"
                                        value={formData.bankDetails.accountName}
                                        onChange={(e) => handleInputChange('bankDetails.accountName', e.target.value)}
                                        helpText="Name as it appears on bank account"
                                    />

                                    <FormField
                                        label="Account Number"
                                        name="bankDetails.accountNumber"
                                        placeholder="0123456789"
                                        value={formData.bankDetails.accountNumber}
                                        onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Bank Name"
                                        name="bankDetails.bankName"
                                        placeholder="GTBank"
                                        value={formData.bankDetails.bankName}
                                        onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
                                    />

                                    <Select
                                        label="Account Type"
                                        name="bankDetails.accountType"
                                        options={ACCOUNT_TYPES}
                                        value={formData.bankDetails.accountType}
                                        onChange={(e) => handleInputChange('bankDetails.accountType', e.target.value)}
                                    />
                                </div>

                                <FormField
                                    label="BVN (Bank Verification Number)"
                                    name="bankDetails.bvn"
                                    placeholder="12345678901"
                                    value={formData.bankDetails.bvn}
                                    onChange={(e) => handleInputChange('bankDetails.bvn', e.target.value)}
                                    helpText="Required for payments and verification"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Security (Create mode only) */}
                    {currentStep === 4 && mode === 'create' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Security Settings
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter a secure password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    error={errors.password}
                                    required
                                    helpText="Minimum 8 characters with letters and numbers"
                                >
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter a secure password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="block w-full pr-10 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </FormField>

                                <FormField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    error={errors.confirmPassword}
                                    required
                                >
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="block w-full pr-10 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </FormField>
                            </div>

                            <div className="space-y-4">
                                <Checkbox
                                    label="Require password change on first login"
                                    name="requirePasswordChange"
                                    checked={formData.requirePasswordChange}
                                    onChange={(e) => handleInputChange('requirePasswordChange', e.target.checked)}
                                    helpText="User will be prompted to change password on their first login"
                                />

                                <Checkbox
                                    label="Enable Two-Factor Authentication"
                                    name="twoFactorEnabled"
                                    checked={formData.twoFactorEnabled}
                                    onChange={(e) => handleInputChange('twoFactorEnabled', e.target.checked)}
                                    helpText="Require SMS or app-based authentication for enhanced security"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 5/4: Review & Submit */}
                    {currentStep === (mode === 'create' ? 5 : 4) && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Review & Submit
                            </h2>

                            {/* User Summary */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">User Summary</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Personal Information</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Name:</dt>
                                                <dd className="font-medium">{formData.firstName} {formData.lastName}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Email:</dt>
                                                <dd className="font-medium">{formData.email}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Phone:</dt>
                                                <dd className="font-medium">{formData.phone}</dd>
                                            </div>
                                            {formData.dateOfBirth && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Date of Birth:</dt>
                                                    <dd className="font-medium">{formData.dateOfBirth}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Account Details</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Role:</dt>
                                                <dd className="font-medium capitalize">{USER_ROLES.find(r => r.value === formData.role)?.label}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Status:</dt>
                                                <dd className="font-medium capitalize">{formData.status}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">KYC Status:</dt>
                                                <dd className="font-medium">{KYC_STATUS.find(k => k.value === formData.kycStatus)?.label}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Verification Level:</dt>
                                                <dd className="font-medium">{VERIFICATION_LEVELS.find(v => v.value === formData.verificationLevel)?.label}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Address</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Street:</dt>
                                                <dd className="font-medium text-right">{formData.address.street}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">City:</dt>
                                                <dd className="font-medium">{formData.address.city}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">State:</dt>
                                                <dd className="font-medium">{formData.address.state}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Preferences</h4>
                                        <dl className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Email Notifications:</dt>
                                                <dd className="font-medium">{formData.preferences.emailNotifications ? 'Enabled' : 'Disabled'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">SMS Notifications:</dt>
                                                <dd className="font-medium">{formData.preferences.smsNotifications ? 'Enabled' : 'Disabled'}</dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-gray-500 dark:text-gray-400">Newsletter:</dt>
                                                <dd className="font-medium">{formData.preferences.newsletter ? 'Subscribed' : 'Not Subscribed'}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                {/* Professional Info for Agents */}
                                {formData.role === 'agent' && (formData.professional.companyName || formData.professional.licenseNumber) && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Professional Information</h4>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {formData.professional.companyName && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Company:</dt>
                                                    <dd className="font-medium">{formData.professional.companyName}</dd>
                                                </div>
                                            )}
                                            {formData.professional.licenseNumber && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">License:</dt>
                                                    <dd className="font-medium">{formData.professional.licenseNumber}</dd>
                                                </div>
                                            )}
                                            {formData.professional.yearsExperience && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Experience:</dt>
                                                    <dd className="font-medium">{formData.professional.yearsExperience} years</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                )}

                                {/* Bank Details */}
                                {(formData.bankDetails.accountName || formData.bankDetails.accountNumber) && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Details</h4>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            {formData.bankDetails.accountName && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Account Name:</dt>
                                                    <dd className="font-medium">{formData.bankDetails.accountName}</dd>
                                                </div>
                                            )}
                                            {formData.bankDetails.accountNumber && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Account Number:</dt>
                                                    <dd className="font-medium">****{formData.bankDetails.accountNumber.slice(-4)}</dd>
                                                </div>
                                            )}
                                            {formData.bankDetails.bankName && (
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-500 dark:text-gray-400">Bank:</dt>
                                                    <dd className="font-medium">{formData.bankDetails.bankName}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                )}
                            </div>

                            {/* Admin Notes */}
                            {mode === 'edit' && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Admin Notes</h3>

                                    <Textarea
                                        label="Internal Notes"
                                        name="adminNotes"
                                        placeholder="Add internal notes about this user..."
                                        value={formData.adminNotes}
                                        onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                                        rows={3}
                                        helpText="Internal notes for admin team (not visible to user)"
                                    />
                                </div>
                            )}

                            {/* Terms and Conditions for new users */}
                            {mode === 'create' && (
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <Checkbox
                                            name="agreeToTerms"
                                            required
                                        />
                                        <div className="ml-3 text-sm">
                                            <label className="font-medium text-gray-700 dark:text-gray-300">
                                                I agree to create this user account
                                            </label>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                By creating this account, you confirm that the information provided is accurate and that the user will be bound by our terms of service and privacy policy.
                                            </p>
                                        </div>
                                    </div>
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

                            {currentStep < (mode === 'create' ? 5 : 4) ? (
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
                                        mode === 'create' ? 'Create User' : 'Update User'
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
                    title="User Profile Preview"
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <UserIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formData.firstName} {formData.lastName}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {USER_ROLES.find(r => r.value === formData.role)?.label}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formData.email} • {formData.phone}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Location</h4>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {formData.address.street}<br />
                                    {formData.address.city}, {formData.address.state}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Account Status</h4>
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        <span className="text-sm capitalize">{formData.status}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {KYC_STATUS.find(k => k.value === formData.kycStatus)?.label}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formData.role === 'agent' && formData.professional.bio && (
                            <div className="pt-4">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Professional Bio</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {formData.professional.bio}
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default UserForm