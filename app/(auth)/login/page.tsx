"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import api from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const { login, user, loading } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Watch auth context to redirect
  useEffect(() => {
    if (!loading && user) {
      // Check if there's a stored redirect URL
      const redirectUrl = sessionStorage.getItem('redirectUrl')
      const destination = redirectUrl && redirectUrl !== '/login' ? redirectUrl : '/dashboard'
      
      console.log("✅ Auth state loaded, redirecting to:", destination)
      
      // Clear the stored URL
      sessionStorage.removeItem('redirectUrl')
      
      router.replace(destination)
    }
  }, [user, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      console.log("🔐 [Login] Attempting login for:", formData.email)
      
      const response = await api.post("/auth/login", {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      })

      console.log("✅ [Login] Login API response:", response?.data)

      const resData = response?.data
      if (!resData || !resData.success) {
        throw new Error(resData?.message || "Login failed. Please check your credentials.")
      }

      if (!resData.data) {
        throw new Error("Invalid response format from server")
      }

      const { user, accessToken, refreshToken, access_token, refresh_token } = resData.data
      
      // Handle different response formats
      const finalAccessToken = accessToken || access_token
      const finalRefreshToken = refreshToken || refresh_token
      
      if (!user || !finalAccessToken) {
        throw new Error("Invalid user data or access token received")
      }

      console.log("👤 [Login] User data:", {
        id: user.id, 
        email: user.email,
        hasToken: !!finalAccessToken
      })

      // Save in context with remember me flag
      await login(user, finalAccessToken, finalRefreshToken, formData.rememberMe)

      console.log("🎉 [Login] Login successful, redirecting...")
      
    } catch (err: any) {
      console.error("❌ [Login] Login error:", err)
      console.error("❌ [Login] Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      })

      let message = "Login failed. Please try again."
      
      if (err.response) {
        // Server responded with error
        const status = err.response.status
        const errorData = err.response.data
        
        if (status === 401) {
          message = "Invalid email or password. Please check your credentials."
        } else if (status === 403) {
          message = "Account access denied. Please contact support."
        } else if (status === 404) {
          message = "User not found. Please check your email address."
        } else if (status === 429) {
          message = "Too many login attempts. Please try again later."
        } else if (errorData?.message) {
          message = errorData.message
        } else if (status >= 500) {
          message = "Server error. Please try again later."
        }
      } else if (err.request) {
        message = "Network error. Please check your internet connection."
      } else if (err.message) {
        message = err.message
      }

      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen max-w-screen-xl items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="text-sm text-red-500 text-center">{errorMessage}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me for 30 days
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
