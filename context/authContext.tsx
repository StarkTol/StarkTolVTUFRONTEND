"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      const storedAccessToken = localStorage.getItem("access_token")
      const storedRefreshToken = localStorage.getItem("refresh_token")

      if (storedUser && storedAccessToken) {
        setUser(JSON.parse(storedUser))
        setAccessToken(storedAccessToken)
        setRefreshToken(storedRefreshToken)
      }
    }
  }, [])

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)

    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }

    router.push("/login") // Optional: redirect on logout
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
