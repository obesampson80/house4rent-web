import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    dashboardData: {},
    userAnalytics: {},
    propertyAnalytics: {},
    revenueAnalytics: {},
    loading: false,
}

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.dashboardData = action.payload
        },
        setUserAnalytics: (state, action) => {
            state.userAnalytics = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { setDashboardData, setUserAnalytics, setLoading } = analyticsSlice.actions
export default analyticsSlice.reducer
