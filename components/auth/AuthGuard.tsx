"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/authContext"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem('redirectUrl', pathname)
      
      console.log("🔒 [AuthGuard] User not authenticated, redirecting to login")
      router.replace("/login")
    }
  }, [loading, isAuthenticated, router, pathname])

  // Show loading state while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null
  }

  // User is authenticated, render the protected content
  console.log("✅ [AuthGuard] User authenticated:", user?.email)
  return <>{children}</>
}
