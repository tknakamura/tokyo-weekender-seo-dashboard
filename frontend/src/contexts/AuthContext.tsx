import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  username: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// 認証情報
const VALID_CREDENTIALS = {
  username: 'tk',
  password: 'nakamura'
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  // ページ読み込み時に認証状態をチェック
  useEffect(() => {
    const authStatus = localStorage.getItem('tokyo-weekender-auth')
    const savedUsername = localStorage.getItem('tokyo-weekender-username')
    
    if (authStatus === 'true' && savedUsername) {
      setIsAuthenticated(true)
      setUsername(savedUsername)
    }
  }, [])

  const login = (inputUsername: string, inputPassword: string): boolean => {
    if (inputUsername === VALID_CREDENTIALS.username && inputPassword === VALID_CREDENTIALS.password) {
      setIsAuthenticated(true)
      setUsername(inputUsername)
      
      // 認証情報をlocalStorageに保存（セッション管理）
      localStorage.setItem('tokyo-weekender-auth', 'true')
      localStorage.setItem('tokyo-weekender-username', inputUsername)
      
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUsername(null)
    
    // localStorageから認証情報を削除
    localStorage.removeItem('tokyo-weekender-auth')
    localStorage.removeItem('tokyo-weekender-username')
  }

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    username
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
