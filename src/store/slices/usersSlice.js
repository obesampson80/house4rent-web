import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    users: [],
    loading: false,
    error: null,
    filters: {},
    pagination: { page: 1, limit: 10, total: 0 },
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setFilters: (state, action) => {
            state.filters = action.payload
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload }
        },
    },
})

export const { setUsers, setLoading, setError, setFilters, setPagination } = usersSlice.actions
export default usersSlice.reducer
