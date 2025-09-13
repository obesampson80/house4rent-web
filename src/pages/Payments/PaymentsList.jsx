// src/pages/Payments/PaymentsList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    CreditCardIcon,
    BanknotesIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    ArrowPathIcon,
    DocumentArrowDownIcon,
    CalendarIcon,
    UserIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Badge from '@components/common/Badge/Badge'
import Card from '@components/common/Card/Card'
import Table from '@components/common/Table/Table'
import Modal from '@components/common/Modal/Modal'
import AdvancedFilter from '@components/common/AdvancedFilter/AdvancedFilter'
import { useAdvancedFilter } from '@hooks/useAdvancedFilter'

// Enhanced Mock Payments Data
const mockPayments = [
    {
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
            name: 'John Doe',
            email: 'john.doe@example.com',
        },
        createdAt: '2024-01-20T10:30:00Z',
        completedAt: '2024-01-20T10:32:15Z',
        reference: 'REF-001-2024',
        currency: 'NGN',
        region: 'Lagos',
        category: 'subscription',
    },
    {
        id: 'PAY-002',
        transactionId: 'TXN-20240119-045',
        type: 'commission',
        amount: 450000,
        fee: 22500,
        netAmount: 427500,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        gateway: 'flutterwave',
        property: {
            id: 'PROP-002',
            title: '2 Bedroom Duplex in Ikoyi',
            owner: 'Jane Smith',
        },
        user: {
            name: 'David Wilson',
            email: 'david.wilson@example.com',
        },
        createdAt: '2024-01-19T16:45:00Z',
        completedAt: null,
        reference: 'REF-002-2024',
        currency: 'NGN',
        region: 'Lagos',
        category: 'commission',
    },
    {
        id: 'PAY-003',
        transactionId: 'TXN-20240118-123',
        type: 'refund',
        amount: 15000,
        fee: 0,
        netAmount: 15000,
        status: 'failed',
        paymentMethod: 'card',
        gateway: 'paystack',
        property: {
            id: 'PROP-003',
            title: 'Commercial Office Space',
            owner: 'Mike Johnson',
        },
        user: {
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
        },
        createdAt: '2024-01-18T14:20:00Z',
        completedAt: null,
        reference: 'REF-003-2024',
        currency: 'NGN',
        failureReason: 'Insufficient funds',
        region: 'Abuja',
        category: 'refund',
    },
]

const mockStats = {
    totalRevenue: 15600000,
    monthlyRevenue: 2800000,
    pendingPayments: 145000,
    failedPayments: 23000,
    totalTransactions: 1245,
    completedTransactions: 1198,
    refundsProcessed: 34,
    averageTransaction: 125000,
}

// Define search fields for payments
const searchFields = [
    'transactionId',
    'reference',
    'user.name',
    'user.email',
    'property.title',
    'property.owner',
    'gateway',
    'region'
]

// Define filter options for payments
const filterOptions = [
    {
        key: 'status',
        label: 'Status',
        options: [
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
            { value: 'refunded', label: 'Refunded' },
            { value: 'cancelled', label: 'Cancelled' },
        ]
    },
    {
        key: 'type',
        label: 'Transaction Type',
        options: [
            { value: 'property_listing_fee', label: 'Listing Fee' },
            { value: 'commission', label: 'Commission' },
            { value: 'refund', label: 'Refund' },
            { value: 'penalty', label: 'Penalty' },
            { value: 'subscription', label: 'Subscription' },
        ]
    },
    {
        key: 'paymentMethod',
        label: 'Payment Method',
        options: [
            { value: 'card', label: 'Card Payment' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'wallet', label: 'Wallet' },
            { value: 'ussd', label: 'USSD' },
        ]
    },
    {
        key: 'gateway',
        label: 'Gateway',
        options: [
            { value: 'paystack', label: 'Paystack' },
            { value: 'flutterwave', label: 'Flutterwave' },
            { value: 'stripe', label: 'Stripe' },
            { value: 'interswitch', label: 'Interswitch' },
        ]
    },
    {
        key: 'region',
        label: 'Region',
        options: [
            { value: 'Lagos', label: 'Lagos' },
            { value: 'Abuja', label: 'Abuja' },
            { value: 'Port Harcourt', label: 'Port Harcourt' },
            { value: 'Kano', label: 'Kano' },
        ]
    },
    {
        key: 'category',
        label: 'Category',
        options: [
            { value: 'subscription', label: 'Subscription' },
            { value: 'commission', label: 'Commission' },
            { value: 'refund', label: 'Refund' },
            { value: 'fee', label: 'Fee' },
        ]
    }
]

const getStatusBadge = (status) => {
    const statusMap = {
        completed: { variant: 'success', label: 'Completed' },
        pending: { variant: 'warning', label: 'Pending' },
        failed: { variant: 'danger', label: 'Failed' },
        refunded: { variant: 'info', label: 'Refunded' },
        cancelled: { variant: 'default', label: 'Cancelled' },
    }

    const config = statusMap[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
}

const getTypeBadge = (type) => {
    const typeMap = {
        property_listing_fee: { variant: 'primary', label: 'Listing Fee' },
        commission: { variant: 'success', label: 'Commission' },
        refund: { variant: 'warning', label: 'Refund' },
        penalty: { variant: 'danger', label: 'Penalty' },
        subscription: { variant: 'info', label: 'Subscription' },
    }

    const config = typeMap[type] || { variant: 'default', label: type }
    return <Badge variant={config.variant} size="xs">{config.label}</Badge>
}

const getPaymentMethodIcon = (method) => {
    const iconMap = {
        card: CreditCardIcon,
        bank_transfer: BanknotesIcon,
        wallet: CreditCardIcon,
        ussd: CreditCardIcon,
    }

    const Icon = iconMap[method] || CreditCardIcon
    return <Icon className="h-4 w-4" />
}

const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const PaymentsList = () => {
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [refundAmount, setRefundAmount] = useState('')
    const [refundReason, setRefundReason] = useState('')

    const { filteredData, filterState, handleFiltersChange, stats } = useAdvancedFilter(
        mockPayments,
        searchFields
    )

    // Calculate dynamic stats based on filtered data
    const dynamicStats = {
        total: stats.total,
        filtered: stats.filtered,
        totalRevenue: filteredData.reduce((sum, payment) => sum + (payment.status === 'completed' ? payment.amount : 0), 0),
        pendingPayments: filteredData.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
        failedPayments: filteredData.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0),
        completedTransactions: filteredData.filter(p => p.status === 'completed').length,
        pendingCount: filteredData.filter(p => p.status === 'pending').length,
        failedCount: filteredData.filter(p => p.status === 'failed').length,
    }

    const handleRefund = (payment) => {
        setSelectedPayment(payment)
        setRefundAmount(payment.amount.toString())
        setShowRefundModal(true)
    }

    const processRefund = () => {
        console.log('Processing refund:', {
            paymentId: selectedPayment.id,
            amount: refundAmount,
            reason: refundReason,
        })
        setShowRefundModal(false)
        setSelectedPayment(null)
        setRefundAmount('')
        setRefundReason('')
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                        Payments Management
                        {stats.hasFilters && (
                            <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                                ({stats.filtered} of {stats.total})
                            </span>
                        )}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Monitor transactions, process refunds, and manage payment flows with advanced filtering
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                    <Button variant="secondary" size="sm">
                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                        Export ({stats.filtered})
                    </Button>
                    <Link to="/payments/analytics">
                        <Button size="sm">
                            <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                            Analytics
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Dynamic Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(dynamicStats.totalRevenue).replace('NGN', '₦')}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {stats.hasFilters ? 'Filtered' : 'Total'} Revenue
                            </div>
                            {stats.hasFilters && (
                                <div className="text-xs text-gray-400">
                                    from {dynamicStats.filtered} transactions
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckCircleIcon className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.completedTransactions}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Completed
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                of {dynamicStats.filtered} transactions
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ClockIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.pendingCount}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Pending Payments
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatCurrency(dynamicStats.pendingPayments).replace('NGN', '₦')} value
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="ml-4">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {dynamicStats.failedCount}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Failed Payments
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {formatCurrency(dynamicStats.failedPayments).replace('NGN', '₦')} value
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Advanced Filter Component */}
            <AdvancedFilter
                searchFields={searchFields}
                filters={filterOptions}
                onFiltersChange={handleFiltersChange}
                placeholder="Search transactions, users, properties, references..."
                data={mockPayments}
            />

            {/* No Results State */}
            {stats.hasFilters && stats.filtered === 0 && (
                <Card className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                        <FunnelIcon className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No payments found</h3>
                        <p>Try adjusting your filters or search terms to find more payments.</p>
                    </div>
                </Card>
            )}

            {/* Payments Table */}
            {filteredData.length > 0 && (
                <Card>
                    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-gray-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style={{ minWidth: '1300px' }}>
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                                        Transaction
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[220px]">
                                        User/Property
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Method
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[160px]">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredData.map((payment, index) => (
                                    <tr
                                        key={payment.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/20'
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {payment.transactionId}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {payment.reference}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Gateway: {payment.gateway}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                                    <UserIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{payment.user.name}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="truncate">{payment.user.email}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                                    <BuildingOfficeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{payment.property.title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getTypeBadge(payment.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(payment.amount)}
                                                </div>
                                                {payment.fee > 0 && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Fee: {formatCurrency(payment.fee)}
                                                    </div>
                                                )}
                                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                    Net: {formatCurrency(payment.netAmount)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    {payment.paymentMethod.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                {getStatusBadge(payment.status)}
                                                {payment.status === 'failed' && payment.failureReason && (
                                                    <div className="text-xs text-red-600 dark:text-red-400">
                                                        {payment.failureReason}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <div className="flex items-center text-gray-900 dark:text-white">
                                                    <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                                    <span>{formatDate(payment.createdAt)}</span>
                                                </div>
                                                {payment.completedAt && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Completed: {formatDate(payment.completedAt)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Link
                                                    to={`/payments/${payment.id}`}
                                                    className="text-primary-600 hover:text-primary-500 dark:text-primary-400 p-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                                {payment.status === 'completed' && (
                                                    <button
                                                        className="text-yellow-600 hover:text-yellow-500 p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
                                                        onClick={() => handleRefund(payment)}
                                                        title="Process Refund"
                                                    >
                                                        <ArrowPathIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {payment.status === 'failed' && (
                                                    <button
                                                        className="text-blue-600 hover:text-blue-500 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                        title="Retry Payment"
                                                    >
                                                        <ArrowPathIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    className="text-gray-600 hover:text-gray-500 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                                                    title="Download Receipt"
                                                >
                                                    <DocumentArrowDownIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Enhanced Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
                                {stats.hasFilters && ` (filtered from ${stats.total} total)`}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button size="sm" variant="secondary" disabled>
                                    Previous
                                </Button>
                                <Button size="sm" variant="secondary" disabled>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Refund Modal */}
            <Modal
                isOpen={showRefundModal}
                onClose={() => setShowRefundModal(false)}
                title="Process Refund"
                size="md"
            >
                {selectedPayment && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Transaction Details
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <div>Transaction ID: {selectedPayment.transactionId}</div>
                                <div>Original Amount: {formatCurrency(selectedPayment.amount)}</div>
                                <div>User: {selectedPayment.user.name}</div>
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
                                max={selectedPayment.amount}
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
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="warning"
                        onClick={processRefund}
                        disabled={!refundAmount || !refundReason}
                    >
                        Process Refund
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PaymentsList