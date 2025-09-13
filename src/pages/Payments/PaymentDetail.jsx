// src/pages/Payments/PaymentDetail.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeftIcon,
    CreditCardIcon,
    BanknotesIcon,
    UserIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Modal from '@components/common/Modal/Modal'

// Mock payment data
const mockPaymentData = {
    id: 'PAY-001',
    transactionId: 'TXN-20240120-001',
    type: 'property_listing_fee',
    amount: 25000,
    fee: 1250,
    netAmount: 23750,
    status: 'completed',
    paymentMethod: 'card',
    gateway: 'paystack',
    property: {
        id: 'PROP-001',
        title: '3 Bedroom Apartment in Lekki',
        owner: 'John Doe',
    },
    user: {
        id: 'USR-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+234 801 234 5678',
    },
    createdAt: '2024-01-20T10:30:00Z',
    completedAt: '2024-01-20T10:32:15Z',
    reference: 'REF-001-2024',
    currency: 'NGN',
    gatewayResponse: {
        authorizationCode: 'AUTH_123456',
        bin: '408408',
        last4: '4081',
        expMonth: '12',
        expYear: '25',
        channel: 'card',
        cardType: 'visa',
        bank: 'TEST BANK',
        countryCode: 'NG',
        brand: 'visa',
    },
    timeline: [
        {
            status: 'initiated',
            timestamp: '2024-01-20T10:30:00Z',
            description: 'Payment initiated by user'
        },
        {
            status: 'processing',
            timestamp: '2024-01-20T10:30:30Z',
            description: 'Payment being processed by gateway'
        },
        {
            status: 'completed',
            timestamp: '2024-01-20T10:32:15Z',
            description: 'Payment completed successfully'
        }
    ]
}

const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const getStatusBadge = (status) => {
    const statusMap = {
        completed: { variant: 'success', label: 'Completed', icon: CheckCircleIcon },
        pending: { variant: 'warning', label: 'Pending', icon: ClockIcon },
        failed: { variant: 'danger', label: 'Failed', icon: XCircleIcon },
        refunded: { variant: 'info', label: 'Refunded', icon: ArrowPathIcon },
        cancelled: { variant: 'default', label: 'Cancelled', icon: XCircleIcon },
    }

    const config = statusMap[status] || { variant: 'default', label: status, icon: ClockIcon }
    const Icon = config.icon

    return (
        <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <Badge variant={config.variant}>{config.label}</Badge>
        </div>
    )
}

const getPaymentMethodIcon = (method) => {
    const iconMap = {
        card: CreditCardIcon,
        bank_transfer: BanknotesIcon,
        wallet: CreditCardIcon,
    }

    const Icon = iconMap[method] || CreditCardIcon
    return <Icon className="h-6 w-6" />
}

const PaymentDetail = () => {
    const { id } = useParams()
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [refundAmount, setRefundAmount] = useState('')
    const [refundReason, setRefundReason] = useState('')

    const payment = mockPaymentData

    const handleRefund = () => {
        console.log('Processing refund:', {
            paymentId: payment.id,
            amount: refundAmount,
            reason: refundReason,
        })
        setShowRefundModal(false)
        setRefundAmount('')
        setRefundReason('')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/payments"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Payment Details
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Transaction ID: {payment.transactionId}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {payment.status === 'completed' && (
                        <Button variant="warning" onClick={() => setShowRefundModal(true)}>
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Refund
                        </Button>
                    )}
                    <Button variant="secondary">
                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                        Download Receipt
                    </Button>
                </div>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Payment Info */}
                <Card className="lg:col-span-2">
                    <Card.Header>
                        <div className="flex items-center justify-between">
                            <Card.Title>Transaction Information</Card.Title>
                            {getStatusBadge(payment.status)}
                        </div>
                    </Card.Header>
                    <Card.Content className="space-y-6">
                        {/* Amount Breakdown */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(payment.amount)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(payment.fee)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Platform Fee</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(payment.netAmount)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Net Amount</div>
                            </div>
                        </div>

                        {/* Payment Method Details */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Payment Method
                            </h4>
                            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white capitalize">
                                        {payment.paymentMethod.replace('_', ' ')}
                                    </div>
                                    {payment.gatewayResponse && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {payment.gatewayResponse.brand.toUpperCase()} •••• {payment.gatewayResponse.last4}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Gateway: {payment.gateway}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Timeline */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Transaction Timeline
                            </h4>
                            <div className="space-y-4">
                                {payment.timeline.map((event, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className={`w-3 h-3 rounded-full ${event.status === 'completed' ? 'bg-green-500' :
                                                    event.status === 'processing' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                                }`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                {event.status}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {event.description}
                                            </div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                {formatDateTime(event.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* User Information */}
                    <Card>
                        <Card.Header>
                            <Card.Title>User Information</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {payment.user.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {payment.user.email}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {payment.user.phone}
                                    </div>
                                </div>
                                <Link to={`/users/${payment.user.id}`}>
                                    <Button size="xs" variant="secondary">
                                        View Profile
                                    </Button>
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Property Information */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Related Property</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                    <BuildingOfficeIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {payment.property.title}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Owner: {payment.property.owner}
                                    </div>
                                </div>
                                <Link to={`/properties/${payment.property.id}`}>
                                    <Button size="xs" variant="secondary">
                                        View Property
                                    </Button>
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Transaction Details */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Transaction Details</Card.Title>
                        </Card.Header>
                        <Card.Content className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Reference</span>
                                <span className="font-medium">{payment.reference}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Type</span>
                                <Badge variant="primary" size="xs">
                                    {payment.type.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Currency</span>
                                <span className="font-medium">{payment.currency}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Created</span>
                                <span className="font-medium">{formatDateTime(payment.createdAt)}</span>
                            </div>
                            {payment.completedAt && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Completed</span>
                                    <span className="font-medium">{formatDateTime(payment.completedAt)}</span>
                                </div>
                            )}
                        </Card.Content>
                    </Card>
                </div>
            </div>

            {/* Refund Modal */}
            <Modal
                isOpen={showRefundModal}
                onClose={() => setShowRefundModal(false)}
                title="Process Refund"
                size="md"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Refund Warning
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    This action will initiate a refund process. Please ensure all details are correct.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Transaction Details
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <div>Transaction ID: {payment.transactionId}</div>
                            <div>Original Amount: {formatCurrency(payment.amount)}</div>
                            <div>User: {payment.user.name}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Refund Amount
                        </label>
                        <input
                            type="number"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            max={payment.amount}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Enter refund amount"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason for Refund
                        </label>
                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Explain the reason for this refund..."
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="warning"
                        onClick={handleRefund}
                        disabled={!refundAmount || !refundReason}
                    >
                        Process Refund
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PaymentDetail