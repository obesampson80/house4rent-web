import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    agents: [],
    loading: false,
    error: null,
}

const agentsSlice = createSlice({
    name: 'agents',
    initialState,
    reducers: {
        setAgents: (state, action) => {
            state.agents = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { setAgents, setLoading } = agentsSlice.actions
export default agentsSlice.reducer