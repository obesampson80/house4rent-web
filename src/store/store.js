import { configureStore } from '@reduxjs/toolkit'

import authSlice from './slices/authSlice'
import usersSlice from './slices/usersSlice'
import kycSlice from './slices/kycSlice'
import propertiesSlice from './slices/propertiesSlice'
import agentsSlice from './slices/agentsSlice'
import paymentsSlice from './slices/paymentsSlice'
import analyticsSlice from './slices/analyticsSlice'
import notificationsSlice from './slices/notificationsSlice'
import settingsSlice from './slices/settingsSlice'

import { authMiddleware } from './middleware/authMiddleware'
import { errorMiddleware } from './middleware/errorMiddleware'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: usersSlice,
        kyc: kycSlice,
        properties: propertiesSlice,
        agents: agentsSlice,
        payments: paymentsSlice,
        analytics: analyticsSlice,
        notifications: notificationsSlice,
        settings: settingsSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        })
            .concat(authMiddleware)
            .concat(errorMiddleware),
    devTools: import.meta.env.MODE !== 'production',
})