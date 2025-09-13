// Export HTTP client and utilities
export { default as httpClient, api } from './httpClient'

// Placeholder for other utilities
export const fileUpload = {
    uploadFile: async (file) => {
        // Placeholder implementation
        return Promise.resolve({ url: 'placeholder-url' })
    },

    uploadMultiple: async (files) => {
        // Placeholder implementation
        return Promise.resolve(files.map(() => ({ url: 'placeholder-url' })))
    }
}

export const websocket = {
    connect: () => {
        // Placeholder WebSocket implementation
        console.log('WebSocket placeholder - not connected')
    },

    disconnect: () => {
        console.log('WebSocket placeholder - disconnected')
    }
}