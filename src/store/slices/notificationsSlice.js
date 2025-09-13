import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload
        },
    },
})

export const { setNotifications, setUnreadCount } = notificationsSlice.actions
export default notificationsSlice.reducer
