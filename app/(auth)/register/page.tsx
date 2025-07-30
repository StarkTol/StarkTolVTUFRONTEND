"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import api from "@/lib/axios-instance" // Axios instance with base URL & credentials

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    agreeTerms: false,
  })
  const [emailCheckResult, setEmailCheckResult] = useState<string | null>(null)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("")
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  // Debounced email check function
  const checkEmailAvailability = useCallback(async (email: string) => {
    if (!email || email.length < 5) {
      setEmailCheckResult(null)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailCheckResult(null)
      return
    }

    setIsCheckingEmail(true)
    setEmailCheckResult(null)

    try {
      const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email.toLowerCase())}`)
      
      if (response.data.available === false) {
        setEmailCheckResult("This email is already registered. Please use a different email.")
      } else {
        setEmailCheckResult("✓ Email is available")
      }
    } catch (err: any) {
      console.error("Email check failed:", err)
      // If endpoint doesn't exist, don't block registration but clear the result
      if (err.response?.status === 404) {
        console.log("Email check endpoint not available, proceeding without validation")
      }
      setEmailCheckResult(null)
    } finally {
      setIsCheckingEmail(false)
    }
  }, [])

  // Debounce email check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email) {
        checkEmailAvailability(formData.email)
      } else {
        setEmailCheckResult(null)
      }
    }, 800) // 800ms delay

    return () => clearTimeout(timeoutId)
  }, [formData.email, checkEmailAvailability])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    // Validate form data
    if (!formData.first_name.trim()) {
      setErrorMessage("First name is required")
      setIsLoading(false)
      return
    }
    
    if (!formData.last_name.trim()) {
      setErrorMessage("Last name is required")
      setIsLoading(false)
      return
    }
    
    if (!formData.email.trim()) {
      setErrorMessage("Email is required")
      setIsLoading(false)
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address")
      setIsLoading(false)
      return
    }
    
    if (!formData.phone.trim()) {
      setErrorMessage("Phone number is required")
      setIsLoading(false)
      return
    }
    
    // Phone number validation (basic Nigerian number format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
    if (!phoneRegex.test(formData.phone.trim().replace(/\s/g, ''))) {
      setErrorMessage("Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)")
      setIsLoading(false)
      return
    }
    
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }
    
    if (!formData.confirm_password) {
      setErrorMessage("Please confirm your password")
      setIsLoading(false)
      return
    }
    
    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match")
      setIsLoading(false)
      return
    }
    
    if (!formData.agreeTerms) {
      setErrorMessage("You must agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      }

      console.log("🚀 [Register] Submitting registration:", {
        ...payload,
        password: "[HIDDEN]",
        confirm_password: "[HIDDEN]"
      })

      const response = await api.post("/auth/register", payload)

      console.log("✅ [Register] Registration response:", response.data)

      if (response.data.success) {
        console.log("🎉 [Register] Registration successful, redirecting to login")
        router.push("/login")
      } else {
        console.error("❌ [Register] Registration failed:", response.data.message)
        setErrorMessage(response.data.message || "Registration failed.")
      }
    } catch (err: any) {
      console.error("❌ [Register] Registration error:", err)
      console.error("❌ [Register] Error details:", {
        message: err.message,
        response: err.response,
        config: err.config,
        code: err.code
      })

      let errorMessage = "Something went wrong. Please try again."
      
      if (err.response) {
        // Server responded with error status
        console.log("❌ [Register] Server response data:", err.response.data)
        
        // Try to extract the error message from server response
        if (err.response.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error
        } else if (err.response.data?.errors && Array.isArray(err.response.data.errors)) {
          // Handle validation errors array
          const validationErrors = err.response.data.errors
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.map((e: any) => e.message || e).join(', ')
          }
        } else if (err.response.status === 400) {
          errorMessage = "Invalid registration data. Please check your inputs."
        } else if (err.response.status === 409) {
          errorMessage = "A user with this email already exists. Please use a different email."
        } else if (err.response.status === 422) {
          // Handle unprocessable entity with more specific messaging
          if (err.response.data?.details) {
            errorMessage = `Validation failed: ${err.response.data.details}`
          } else {
            errorMessage = "Invalid data format. Please check your inputs and try again."
          }
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later."
        } else {
          errorMessage = `Server error (${err.response.status}): ${err.response.statusText}`
        }
      } else if (err.request) {
        // Network error - request was made but no response received
        errorMessage = "Network error. Please check your internet connection and try again."
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = "Unable to connect to server. Please try again later."
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check your connection."
      } else {
        errorMessage = err.message || "An unexpected error occurred."
      }
      
      setErrorMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen max-w-screen-xl items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  data-testid="first_name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  data-testid="last_name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="email"
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {emailCheckResult && (
                <p className={`text-xs ${
                  emailCheckResult.includes('✓') 
                    ? 'text-green-600' 
                    : 'text-red-500'
                }`}>
                  {emailCheckResult}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08012345678"
                required
                value={formData.phone}
                onChange={handleChange}
                data-testid="phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  data-testid="password"
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
            
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirm_password}
                onChange={handleChange}
                data-testid="confirm_password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                required
                checked={formData.agreeTerms}
                onCheckedChange={handleCheckboxChange}
                data-testid="agree-terms"
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading} data-testid="submit-registration">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
