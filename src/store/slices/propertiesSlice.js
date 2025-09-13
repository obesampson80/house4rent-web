import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    properties: [],
    pendingApprovals: [],
    loading: false,
    error: null,
}

const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        setProperties: (state, action) => {
            state.properties = action.payload
        },
        setPendingApprovals: (state, action) => {
            state.pendingApprovals = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { setProperties, setPendingApprovals, setLoading } = propertiesSlice.actions
export default propertiesSlice.reducer
