import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { AppRoutes } from '@/routes'
import { AuthProvider } from '@contexts/AuthContext'
import { ThemeProvider } from '@contexts/ThemeContext'
import { NotificationProvider } from '@contexts/NotificationContext'
import { PermissionProvider } from '@contexts/PermissionContext'
import { initializeApp } from '@store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { isInitialized } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(initializeApp())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <PermissionProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
            </div>
          </PermissionProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App