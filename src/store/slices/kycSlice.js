import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    verifications: [],
    queue: [],
    loading: false,
    error: null,
}

const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        setVerifications: (state, action) => {
            state.verifications = action.payload
        },
        setQueue: (state, action) => {
            state.queue = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { setVerifications, setQueue, setLoading } = kycSlice.actions
export default kycSlice.reducer
