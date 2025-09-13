import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    systemSettings: {},
    userSettings: {},
    loading: false,
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSystemSettings: (state, action) => {
            state.systemSettings = action.payload
        },
        setUserSettings: (state, action) => {
            state.userSettings = action.payload
        },
    },
})

export const { setSystemSettings, setUserSettings } = settingsSlice.actions
export default settingsSlice.reducer
