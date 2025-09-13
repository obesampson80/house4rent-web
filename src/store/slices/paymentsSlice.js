import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    payments: [],
    analytics: {},
    loading: false,
    error: null,
}

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setPayments: (state, action) => {
            state.payments = action.payload
        },
        setAnalytics: (state, action) => {
            state.analytics = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { setPayments, setAnalytics, setLoading } = paymentsSlice.actions
export default paymentsSlice.reducer
