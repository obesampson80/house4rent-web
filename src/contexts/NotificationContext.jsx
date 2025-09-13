import { createContext, useContext, useReducer } from 'react'
import toast from 'react-hot-toast'

const NotificationContext = createContext({})

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            }
        case 'MARK_READ':
            return {
                ...state,
                notifications: state.notifications.map(notif =>
                    notif.id === action.payload ? { ...notif, read: true } : notif
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }
        case 'MARK_ALL_READ':
            return {
                ...state,
                notifications: state.notifications.map(notif => ({
                    ...notif,
                    read: true,
                })),
                unreadCount: 0,
            }
        case 'REMOVE_NOTIFICATION':
            const notification = state.notifications.find(n => n.id === action.payload)
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
                unreadCount: notification && !notification.read
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
            }
        case 'CLEAR_ALL':
            return {
                ...state,
                notifications: [],
                unreadCount: 0,
            }
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload,
                unreadCount: action.payload.filter(n => !n.read).length,
            }
        default:
            return state
    }
}

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}

export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, {
        notifications: [],
        unreadCount: 0,
    })

    const showToast = (message, type = 'success', options = {}) => {
        const toastOptions = {
            duration: 4000,
            ...options,
        }

        switch (type) {
            case 'success':
                toast.success(message, toastOptions)
                break
            case 'error':
                toast.error(message, toastOptions)
                break
            case 'warning':
                toast(message, {
                    ...toastOptions,
                    icon: '⚠️',
                })
                break
            case 'info':
                toast(message, {
                    ...toastOptions,
                    icon: 'ℹ️',
                })
                break
            default:
                toast(message, toastOptions)
        }
    }

    const addNotification = notification => {
        const newNotification = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification,
        }
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification })
    }

    const markAsRead = id => {
        dispatch({ type: 'MARK_READ', payload: id })
    }

    const markAllAsRead = () => {
        dispatch({ type: 'MARK_ALL_READ' })
    }

    const removeNotification = id => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
    }

    const clearAll = () => {
        dispatch({ type: 'CLEAR_ALL' })
    }

    const setNotifications = notifications => {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications })
    }

    const value = {
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        showToast,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        setNotifications,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}