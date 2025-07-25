"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  migrateAuthStorageKeys,
  getAccessToken,
  getRefreshToken,
  getUser,
  setAccessToken as setStoredAccessToken,
  setRefreshToken as setStoredRefreshToken,
  setUser as setStoredUser,
  clearAuthData
} from "@/utils/authStorageMigation"

interface User {
  id: string
  email: string
  name?: string
  role?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    // Run migration first to normalize any legacy keys
    migrateAuthStorageKeys()
    
    const storedUser = getUser()
    const storedAccessToken = getAccessToken()
    const storedRefreshToken = getRefreshToken()

    if (storedUser && storedAccessToken) {
      console.log("🔁 [AuthContext] Loading user from localStorage")
      setUser(storedUser)
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
    }

    // Let state update before marking loading as false
    setTimeout(() => {
      console.log("✅ [AuthContext] Finished loading auth state")
      setLoading(false)
    }, 0)
  }, [])

  const login = (user: User, accessToken: string, refreshToken: string) => {
    console.log("⚡ [AuthContext] Logging in with:", user)

    // Update React state
    setUser(user)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    // Use canonical storage helpers
    setStoredUser(user)
    setStoredAccessToken(accessToken)
    setStoredRefreshToken(refreshToken)

    console.log("✅ [AuthContext] Login complete. user:", user)
  }

  const logout = () => {
    console.log("🚻 [AuthContext] Logging out")

    // Clear React state  
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)

    // Clear localStorage using canonical helper
    clearAuthData()

    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
