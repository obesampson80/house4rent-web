import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// For now, let's use a mock auth service until the API is ready
const mockAuthService = {
    login: async (credentials) => {
        // Mock login - in development, always succeed
        return {
            user: { id: 1, name: 'Admin User', email: credentials.email },
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token'
        }
    },

    refreshToken: async (refreshToken) => {
        return {
            user: { id: 1, name: 'Admin User', email: 'admin@example.com' },
            token: 'new-mock-jwt-token'
        }
    },

    getProfile: async () => {
        return {
            user: { id: 1, name: 'Admin User', email: 'admin@example.com' }
        }
    },

    updateProfile: async (profileData) => {
        return profileData
    },

    logout: async () => {
        return { success: true }
    }
}

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await mockAuthService.login({ email, password })
            localStorage.setItem('token', response.token)
            localStorage.setItem('refreshToken', response.refreshToken)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed')
        }
    }
)

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await mockAuthService.refreshToken(refreshToken)
            localStorage.setItem('token', response.token)
            return response
        } catch (error) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            return rejectWithValue('Token refresh failed')
        }
    }
)

export const initializeApp = createAsyncThunk(
    'auth/initializeApp',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return null

            const response = await mockAuthService.getProfile()
            return { ...response, token }
        } catch (error) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            return rejectWithValue('Failed to initialize app')
        }
    }
)

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await mockAuthService.updateProfile(profileData)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Profile update failed')
        }
    }
)

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => {
            state.user = null
            state.token = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.error = null
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        },
        clearError: state => {
            state.error = null
        },
        setCredentials: (state, action) => {
            const { user, token, refreshToken } = action.payload
            state.user = user
            state.token = token
            state.refreshToken = refreshToken
            state.isAuthenticated = true
        },
    },
    extraReducers: builder => {
        builder
            // Login
            .addCase(login.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.refreshToken = action.payload.refreshToken
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.isAuthenticated = false
            })

            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token
                state.user = action.payload.user
            })
            .addCase(refreshToken.rejected, state => {
                state.user = null
                state.token = null
                state.refreshToken = null
                state.isAuthenticated = false
            })

            // Initialize App
            .addCase(initializeApp.pending, state => {
                state.loading = true
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.loading = false
                state.isInitialized = true
                if (action.payload) {
                    state.user = action.payload.user
                    state.token = action.payload.token
                    state.isAuthenticated = true
                }
            })
            .addCase(initializeApp.rejected, state => {
                state.loading = false
                state.isInitialized = true
                state.isAuthenticated = false
            })

            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload }
            })
    },
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer