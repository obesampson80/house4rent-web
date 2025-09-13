// src/components/forms/QuickActionForms.jsx
import { useState } from 'react'
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline'
import Button from '@components/common/Button/Button'
import Modal from '@components/common/Modal/Modal'
import { FormField, Select, Textarea, Checkbox } from '@components/common/Form'

// Property Status Update Form
export const PropertyStatusModal = ({ isOpen, onClose, property, onStatusChange }) => {
    const [status, setStatus] = useState(property?.status || '')
    const [reason, setReason] = useState('')
    const [notifyOwner, setNotifyOwner] = useState(true)
    const [loading, setLoading] = useState(false)

    const statusOptions = [
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'listed', label: 'Listed' },
        { value: 'delisted', label: 'Delisted' },
    ]

    const handleSubmit = async () => {
        if (!status || !reason.trim()) return

        setLoading(true)
        try {
            await onStatusChange({
                propertyId: property.id,
                status,
                reason: reason.trim(),
                notifyOwner
            })
            onClose()
            setReason('')
        } catch (error) {
            console.error('Error updating status:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Property Status" size="md">
            <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">Property Details</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {property?.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Owner: {property?.owner?.name} • Current Status: {property?.status}
                    </p>
                </div>

                <Select
                    label="New Status"
                    name="status"
                    options={statusOptions}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                />

                <Textarea
                    label="Reason for Status Change"
                    name="reason"
                    placeholder="Explain why you are changing the status..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows={3}
                />

                <Checkbox
                    label="Notify property owner"
                    name="notifyOwner"
                    checked={notifyOwner}
                    onChange={(e) => setNotifyOwner(e.target.checked)}
                    helpText="Send email notification to the property owner"
                />
            </div>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !status || !reason.trim()}
                >
                    {loading ? 'Updating...' : 'Update Status'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

// User Status Update Form
export const UserStatusModal = ({ isOpen, onClose, user, onStatusChange }) => {
    const [status, setStatus] = useState(user?.status || '')
    const [reason, setReason] = useState('')
    const [suspensionDuration, setSuspensionDuration] = useState('')
    const [notifyUser, setNotifyUser] = useState(true)
    const [loading, setLoading] = useState(false)

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'pending', label: 'Pending Verification' },
    ]

    const suspensionOptions = [
        { value: '7', label: '7 days' },
        { value: '30', label: '30 days' },
        { value: '90', label: '90 days' },
        { value: 'indefinite', label: 'Indefinite' },
    ]

    const handleSubmit = async () => {
        if (!status || !reason.trim()) return

        setLoading(true)
        try {
            await onStatusChange({
                userId: user.id,
                status,
                reason: reason.trim(),
                suspensionDuration: status === 'suspended' ? suspensionDuration : null,
                notifyUser
            })
            onClose()
            setReason('')
        } catch (error) {
            console.error('Error updating status:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = () => {
        switch (status) {
            case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
            case 'suspended': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            default: return <XCircleIcon className="h-5 w-5 text-gray-500" />
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update User Status" size="md">
            <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">User Details</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {user?.name} ({user?.email})
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Role: {user?.role} • Current Status: {user?.status}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <Select
                            label="New Status"
                            name="status"
                            options={statusOptions}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        />
                    </div>
                    <div className="pt-6">
                        {getStatusIcon()}
                    </div>
                </div>

                {status === 'suspended' && (
                    <Select
                        label="Suspension Duration"
                        name="suspensionDuration"
                        options={suspensionOptions}
                        value={suspensionDuration}
                        onChange={(e) => setSuspensionDuration(e.target.value)}
                        required
                        placeholder="Select duration"
                    />
                )}

                <Textarea
                    label="Reason for Status Change"
                    name="reason"
                    placeholder="Explain why you are changing the user's status..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows={3}
                />

                <Checkbox
                    label="Notify user via email"
                    name="notifyUser"
                    checked={notifyUser}
                    onChange={(e) => setNotifyUser(e.target.checked)}
                    helpText="Send email notification to the user about status change"
                />
            </div>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !status || !reason.trim()}
                    variant={status === 'suspended' ? 'danger' : 'primary'}
                >
                    {loading ? 'Updating...' : `${status === 'suspended' ? 'Suspend' : 'Update'} User`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

// KYC Document Verification Form
export const KYCVerificationModal = ({ isOpen, onClose, document, onVerify }) => {
    const [status, setStatus] = useState('')
    const [comments, setComments] = useState('')
    const [requestedChanges, setRequestedChanges] = useState([])
    const [loading, setLoading] = useState(false)

    const verificationOptions = [
        { value: 'approved', label: 'Approve Document' },
        { value: 'rejected', label: 'Reject Document' },
        { value: 'needs_revision', label: 'Request Changes' },
    ]

    const changeOptions = [
        'Image quality is poor',
        'Document is not clearly visible',
        'Information does not match profile',
        'Document appears to be altered',
        'Expiry date has passed',
        'Wrong document type submitted',
    ]

    const handleChangeToggle = (change) => {
        const current = requestedChanges
        const updated = current.includes(change)
            ? current.filter(c => c !== change)
            : [...current, change]
        setRequestedChanges(updated)
    }

    const handleSubmit = async () => {
        if (!status || !comments.trim()) return

        setLoading(true)
        try {
            await onVerify({
                documentId: document.id,
                status,
                comments: comments.trim(),
                requestedChanges: status === 'needs_revision' ? requestedChanges : []
            })
            onClose()
            setComments('')
            setRequestedChanges([])
        } catch (error) {
            console.error('Error verifying document:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Verify KYC Document" size="lg">
            <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">Document Details</h4>
                    <div className="mt-2 space-y-1 text-sm">
                        <p><span className="text-gray-500">Type:</span> {document?.type}</p>
                        <p><span className="text-gray-500">User:</span> {document?.userName}</p>
                        <p><span className="text-gray-500">Submitted:</span> {document?.submittedAt}</p>
                    </div>
                </div>

                {/* Document Preview (placeholder) */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Document Preview</p>
                    <p className="text-xs text-gray-400">Click to view full document</p>
                </div>

                <Select
                    label="Verification Decision"
                    name="status"
                    options={verificationOptions}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                />

                {status === 'needs_revision' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Issues to Address
                        </label>
                        <div className="space-y-2">
                            {changeOptions.map((change) => (
                                <label
                                    key={change}
                                    className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={requestedChanges.includes(change)}
                                        onChange={() => handleChangeToggle(change)}
                                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {change}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <Textarea
                    label="Verification Comments"
                    name="comments"
                    placeholder="Add your review comments..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    rows={4}
                    helpText="Provide feedback for the user"
                />
            </div>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !status || !comments.trim()}
                    variant={status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'primary'}
                >
                    {loading ? 'Processing...' : `${status === 'approved' ? 'Approve' : status === 'rejected' ? 'Reject' : 'Request Changes'}`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

// Bulk Actions Form
export const BulkActionModal = ({ isOpen, onClose, selectedItems, itemType, onBulkAction }) => {
    const [action, setAction] = useState('')
    const [reason, setReason] = useState('')
    const [notifyUsers, setNotifyUsers] = useState(true)
    const [loading, setLoading] = useState(false)

    const getActionOptions = () => {
        switch (itemType) {
            case 'properties':
                return [
                    { value: 'approve', label: 'Approve Selected Properties' },
                    { value: 'reject', label: 'Reject Selected Properties' },
                    { value: 'delist', label: 'Delist Selected Properties' },
                    { value: 'change_priority', label: 'Change Priority' },
                ]
            case 'users':
                return [
                    { value: 'activate', label: 'Activate Selected Users' },
                    { value: 'suspend', label: 'Suspend Selected Users' },
                    { value: 'delete', label: 'Delete Selected Users' },
                    { value: 'export', label: 'Export User Data' },
                ]
            case 'payments':
                return [
                    { value: 'refund', label: 'Process Refunds' },
                    { value: 'mark_reviewed', label: 'Mark as Reviewed' },
                    { value: 'export', label: 'Export Payment Data' },
                ]
            default:
                return []
        }
    }

    const handleSubmit = async () => {
        if (!action) return
        if (['approve', 'reject', 'suspend', 'delete'].includes(action) && !reason.trim()) return

        setLoading(true)
        try {
            await onBulkAction({
                action,
                items: selectedItems,
                reason: reason.trim(),
                notifyUsers: ['approve', 'reject', 'suspend'].includes(action) ? notifyUsers : false
            })
            onClose()
            setAction('')
            setReason('')
        } catch (error) {
            console.error('Error performing bulk action:', error)
        } finally {
            setLoading(false)
        }
    }

    const requiresReason = ['approve', 'reject', 'suspend', 'delete'].includes(action)
    const isDestructive = ['delete', 'suspend', 'reject'].includes(action)

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Bulk Actions" size="md">
            <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Bulk Action for {selectedItems.length} {itemType}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        This action will be applied to all selected items. Please review carefully.
                    </p>
                </div>

                <Select
                    label="Action to Perform"
                    name="action"
                    options={getActionOptions()}
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    required
                    placeholder="Select an action"
                />

                {isDestructive && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-red-900 dark:text-red-100">
                                    Warning: Destructive Action
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                                    This action cannot be undone. Please ensure you want to proceed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {requiresReason && (
                    <Textarea
                        label="Reason"
                        name="reason"
                        placeholder="Explain why you are performing this action..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={3}
                    />
                )}

                {['approve', 'reject', 'suspend'].includes(action) && (
                    <Checkbox
                        label="Notify affected users"
                        name="notifyUsers"
                        checked={notifyUsers}
                        onChange={(e) => setNotifyUsers(e.target.checked)}
                        helpText="Send email notifications to all affected users"
                    />
                )}
            </div>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !action || (requiresReason && !reason.trim())}
                    variant={isDestructive ? 'danger' : 'primary'}
                >
                    {loading ? 'Processing...' : `Apply to ${selectedItems.length} items`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

// Send Notification Form
export const SendNotificationModal = ({ isOpen, onClose, recipients, onSendNotification }) => {
    const [notificationType, setNotificationType] = useState('email')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [priority, setPriority] = useState('normal')
    const [includeUnsubscribed, setIncludeUnsubscribed] = useState(false)
    const [loading, setLoading] = useState(false)

    const typeOptions = [
        { value: 'email', label: 'Email Notification' },
        { value: 'sms', label: 'SMS Notification' },
        { value: 'push', label: 'Push Notification' },
        { value: 'in_app', label: 'In-App Notification' },
    ]

    const priorityOptions = [
        { value: 'low', label: 'Low Priority' },
        { value: 'normal', label: 'Normal Priority' },
        { value: 'high', label: 'High Priority' },
        { value: 'urgent', label: 'Urgent' },
    ]

    const handleSubmit = async () => {
        if (!subject.trim() || !message.trim()) return

        setLoading(true)
        try {
            await onSendNotification({
                type: notificationType,
                subject: subject.trim(),
                message: message.trim(),
                priority,
                recipients,
                includeUnsubscribed
            })
            onClose()
            setSubject('')
            setMessage('')
        } catch (error) {
            console.error('Error sending notification:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send Notification" size="lg">
            <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                        Recipients: {recipients.length} users
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Notification will be sent to selected users
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Notification Type"
                        name="notificationType"
                        options={typeOptions}
                        value={notificationType}
                        onChange={(e) => setNotificationType(e.target.value)}
                        required
                    />

                    <Select
                        label="Priority"
                        name="priority"
                        options={priorityOptions}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    />
                </div>

                <FormField
                    label="Subject/Title"
                    name="subject"
                    placeholder="Enter notification subject..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    helpText={notificationType === 'sms' ? 'Keep it short for SMS' : ''}
                />

                <Textarea
                    label="Message"
                    name="message"
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    helpText={`${message.length}/500 characters ${notificationType === 'sms' ? '(SMS limit: 160 chars)' : ''}`}
                />

                <Checkbox
                    label="Include users who unsubscribed from notifications"
                    name="includeUnsubscribed"
                    checked={includeUnsubscribed}
                    onChange={(e) => setIncludeUnsubscribed(e.target.checked)}
                    helpText="Only use for critical system announcements"
                />

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <EnvelopeIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                                Preview
                            </h4>
                            <div className="text-sm text-yellow-800 dark:text-yellow-200 mt-2">
                                <p><strong>Subject:</strong> {subject || 'No subject'}</p>
                                <p className="mt-1"><strong>Message:</strong> {message || 'No message'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !subject.trim() || !message.trim()}
                >
                    {loading ? 'Sending...' : `Send to ${recipients.length} users`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

// Payment Refund Form
export const RefundModal = ({ isOpen, onClose, payment, onProcessRefund }) => {
    const [refundAmount, setRefundAmount] = useState(payment?.amount?.toString() || '')
    const [refundReason, setRefundReason] = useState('')
    const [refundType, setRefundType] = useState('full')
    const [notifyUser, setNotifyUser] = useState(true)
    const [loading, setLoading] = useState(false)

    const refundTypeOptions = [
        { value: 'full', label: 'Full Refund' },
        { value: 'partial', label: 'Partial Refund' },
        { value: 'processing_fee', label: 'Refund minus processing fee' },
    ]

    const commonReasons = [
        'Duplicate payment',
        'Service not delivered',
        'User requested cancellation',
        'Technical error',
        'Fraudulent transaction',
        'Property no longer available',
    ]

    const handleReasonSelect = (reason) => {
        setRefundReason(reason)
    }

    const calculateRefundAmount = () => {
        const originalAmount = payment?.amount || 0
        switch (refundType) {
            case 'full':
                return originalAmount
            case 'processing_fee':
                return originalAmount * 0.97 // Minus 3% processing fee
            default:
                return parseFloat(refundAmount) || 0
        }
    }

    const handleSubmit = async () => {
        if (!refundReason.trim() || !refundAmount) return

        setLoading(true)
        try {
            await onProcessRefund({
                paymentId: payment.id,
                amount: calculateRefundAmount(),
                reason: refundReason.trim(),
                type: refundType,
                notifyUser
            })
            onClose()
            setRefundReason('')
        } catch (error) {
            console.error('Error processing refund:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Process Refund" size="md">
            <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">Payment Details</h4>
                    <div className="mt-2 space-y-1 text-sm">
                        <p><span className="text-gray-500">Transaction ID:</span> {payment?.transactionId}</p>
                        <p><span className="text-gray-500">Original Amount:</span> ₦{payment?.amount?.toLocaleString()}</p>
                        <p><span className="text-gray-500">User:</span> {payment?.user?.name}</p>
                    </div>
                </div>

                <Select
                    label="Refund Type"
                    name="refundType"
                    options={refundTypeOptions}
                    value={refundType}
                    onChange={(e) => {
                        setRefundType(e.target.value)
                        if (e.target.value !== 'partial') {
                            setRefundAmount(payment?.amount?.toString() || '')
                        }
                    }}
                />

                {refundType === 'partial' && (
                    <FormField
                        label="Refund Amount (₦)"
                        name="refundAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        max={payment?.amount}
                        required
                    />
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-sm">
                        <span className="text-blue-700 dark:text-blue-200">Refund Amount: </span>
                        <span className="font-bold text-blue-900 dark:text-blue-100">
                            ₦{calculateRefundAmount().toLocaleString()}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quick Reason Selection
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {commonReasons.map((reason) => (
                            <button
                                key={reason}
                                type="button"
                                onClick={() => handleReasonSelect(reason)}
                                className="text-left p-2 text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {reason}
                            </button>
                        ))}
                    </div>

                    <Textarea
                        label="Refund Reason"
                        name="refundReason"
                        placeholder="Explain the reason for this refund..."
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        required
                        rows={3}
                    />
                </div>

                <Checkbox
                    label="Notify user about refund"
                    name="notifyUser"
                    checked={notifyUser}
                    onChange={(e) => setNotifyUser(e.target.checked)}
                    helpText="Send email confirmation to user"
                />
            </div>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !refundReason.trim() || !refundAmount}
                    variant="warning"
                >
                    {loading ? 'Processing...' : `Refund ₦${calculateRefundAmount().toLocaleString()}`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}