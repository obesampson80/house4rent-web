// Export all API services
export * from './api'

// Export utilities
export * from './utils'

// Export integrations (placeholder for now)
export const integrations = {
    ninVerification: {
        verify: async (nin) => Promise.resolve({ valid: true, data: {} })
    },

    bvnVerification: {
        verify: async (bvn) => Promise.resolve({ valid: true, data: {} })
    },

    paymentGateway: {
        initializePayment: async (data) => Promise.resolve({ reference: 'test-ref' })
    },

    emailService: {
        sendEmail: async (data) => Promise.resolve({ sent: true })
    },

    smsService: {
        sendSMS: async (phone, message) => Promise.resolve({ sent: true })
    }
}