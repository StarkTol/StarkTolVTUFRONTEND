"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear access token from cookie
    document.cookie = "accessToken=; Max-Age=0; path=/"

    // Clear token and user data from localStorage (if used)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")

    // Redirect to login page after short delay
    const timer = setTimeout(() => {
      router.push("/login")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-2xl font-bold">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we securely log you out.</p>
      </div>
    </div>
  )
}
