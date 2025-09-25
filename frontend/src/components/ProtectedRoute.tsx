import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Auth from './Auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, login } = useAuth()
  const [error, setError] = useState<string>('')

  const handleLogin = (username: string, password: string) => {
    const success = login(username, password)
    if (!success) {
      setError('Invalid username or password. Please try again.')
    } else {
      setError('')
    }
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} error={error} />
  }

  return <>{children}</>
}

export default ProtectedRoute
